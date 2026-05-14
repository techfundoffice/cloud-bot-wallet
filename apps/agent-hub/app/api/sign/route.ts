import { NextRequest, NextResponse } from "next/server";
import { cdp, isCdpApiError, isFatalDelegationError, NO_DELEGATION_ERROR, buildHeartbeatMessage } from "@/lib/cdp";

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  if (
    typeof body !== "object" ||
    body === null ||
    typeof (body as Record<string, unknown>).userId !== "string" ||
    typeof (body as Record<string, unknown>).address !== "string"
  ) {
    return NextResponse.json(
      { error: "Body must include { userId: string, address: string }" },
      { status: 400 }
    );
  }

  const { userId, address } = body as { userId: string; address: string };
  const signedAt = new Date().toISOString();
  const message = buildHeartbeatMessage(userId, address, signedAt);

  try {
    const result = await cdp.endUser.signEvmMessage({ userId, address, message });
    return NextResponse.json({ message, signature: result.signature, signedAt });
  } catch (err) {
    if (isCdpApiError(err)) {
      if (isFatalDelegationError(err)) {
        return NextResponse.json({ error: NO_DELEGATION_ERROR }, { status: 403 });
      }
      console.error("CDP API error:", err);
      return NextResponse.json({ error: err.errorMessage }, { status: err.statusCode });
    }
    const errMessage = err instanceof Error ? err.message : "Unknown error";
    console.error("CDP SDK error:", err);
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
