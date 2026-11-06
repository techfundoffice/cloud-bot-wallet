# Cloud Bot Wallet

This is how you use this browser to get paid.

Open `apps/wallet/index.html`. Click Make my wallet. It makes a Base address. That address is where your 25% of the Cloud Meter cut goes, in USDC. No Coinbase account. No paste. No seed phrase.

The meter is not live on Base yet. The address can already receive USDC. Making a wallet does not start payments.

## What the cut is

A metered call takes a cut.

- On an API call the cut is 10% on top of the provider price.
- On a computer, GPU, memory, or storage the whole charge is the cut.

That cut is split three ways:

- 25% is paid in USDC to this wallet. That is your share.
- 70% burns one CLOUDBOT per USDC from the meter's inventory. The USDC stays on the meter.
- 5% is paid in USDC to the treasury.

If this wallet is empty, the 25% goes to the treasury too.

## Make a wallet

```bash
git clone https://github.com/techfundoffice/cloud-bot-wallet.git
cd cloud-bot-wallet
open apps/wallet/index.html
```

The key is stored in this browser only. Show backup key writes it down. Anyone with that key owns the wallet.

## The fork

This repo is a fork of [coinbase/cdp-wallet-demo-apps](https://github.com/coinbase/cdp-wallet-demo-apps). Those apps still need a Coinbase Developer Platform project id. The wallet above does not.

- [Wallet](apps/wallet/index.html)
- [React Wagmi](apps/react-wagmi)
- [React Custom Auth](apps/react-custom-auth)
- [Agent Hub](apps/agent-hub)
