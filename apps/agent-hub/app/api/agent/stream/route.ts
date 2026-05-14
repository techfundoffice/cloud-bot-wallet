import { NextRequest } from "next/server";
import { cdp, isCdpApiError, isFatalDelegationError, NO_DELEGATION_ERROR, buildHeartbeatMessage } from "@/lib/cdp";
import { AGENT_EVENTS } from "@/lib/agentEvents";

export const dynamic = "force-dynamic";

const SIGN_INTERVAL_MS = 5_000;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  const address = searchParams.get("address");

  if (!userId || !address) {
    return new Response("Missing userId or address", { status: 400 });
  }

  const encoder = new TextEncoder();

  const stream = new ReadableStream({
    async start(controller) {
      let closed = false;

      const close = () => {
        if (!closed) {
          closed = true;
          try {
            controller.close();
          } catch {
            // already closed
          }
        }
      };

      const send = (event: string, data: unknown) => {
        if (closed) return;
        try {
          controller.enqueue(
            encoder.encode(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`)
          );
        } catch {
          close();
        }
      };

      /**
       * Sign a heartbeat and push the result down the stream.
       * Returns false if the stream should stop (fatal auth error).
       */
      const sign = async (): Promise<boolean> => {
        if (closed) return false;

        const signedAt = new Date().toISOString();
        const message = buildHeartbeatMessage(userId, address, signedAt);

        try {
          const result = await cdp.endUser.signEvmMessage({ userId, address, message });
          send(AGENT_EVENTS.SIGNATURE, { signedAt, message, signature: result.signature });
          return true;
        } catch (err) {
          if (isCdpApiError(err)) {
            const fatal = isFatalDelegationError(err);
            send(AGENT_EVENTS.SERVER_ERROR, {
              error: fatal ? NO_DELEGATION_ERROR : err.errorMessage,
              fatal,
            });
            if (fatal) {
              close();
              return false;
            }
          } else {
            send(AGENT_EVENTS.SERVER_ERROR, {
              error: err instanceof Error ? err.message : "Unknown error",
              fatal: false,
            });
          }
          return true;
        }
      };

      const ok = await sign();
      if (!ok) return;

      const timer = setInterval(async () => {
        const stillOk = await sign();
        if (!stillOk || closed) clearInterval(timer);
      }, SIGN_INTERVAL_MS);

      // Single cleanup handler registered after the timer exists
      request.signal.addEventListener("abort", () => {
        clearInterval(timer);
        close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache, no-transform",
      Connection: "keep-alive",
      // Prevent Nginx/proxies from buffering SSE
      "X-Accel-Buffering": "no",
    },
  });
}
