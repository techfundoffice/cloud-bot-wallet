# Cloud Bot Wallet

This is the wallet you use to get paid.

Fork of [coinbase/cdp-wallet-demo-apps](https://github.com/coinbase/cdp-wallet-demo-apps). You sign in with email. It makes a Base address. That address is where your 25% of the Cloud Meter cut goes, in USDC. No paste. No seed phrase.

It is not live yet. It needs a free Coinbase Developer Platform project id. Saving an address does not start payments.

## What the cut is

A metered call takes a cut.

- On an API call the cut is 10% on top of the provider price.
- On a computer, GPU, memory, or storage the whole charge is the cut.

That cut is split three ways:

- 25% is paid in USDC to this wallet. That is your share.
- 70% burns one CLOUDBOT per USDC from the meter's inventory. The USDC stays on the meter.
- 5% is paid in USDC to the treasury.

If this wallet is empty, the 25% goes to the treasury too.

## Get started

```bash
git clone https://github.com/techfundoffice/cloud-bot-wallet.git
cd cloud-bot-wallet
pnpm install
```

Put a CDP project id in the app `.env`, then run the React app in `apps/react-wagmi` or `apps/react-custom-auth`.

## Apps in the fork

- [React Wagmi](apps/react-wagmi)
- [React Custom Auth](apps/react-custom-auth)
- [Agent Hub](apps/agent-hub)
- [React Native Expo](apps/react-native-expo)
- [React Native Bare](apps/react-native-bare)
- [React Native Expo Wagmi](apps/react-native-expo-wagmi)
- [Solana Standard Wallet - With CDP Hooks](apps/solana-standard-wallet-with-cdp-hooks)
- [Solana Standard Wallet - Standalone](apps/solana-standard-wallet-standalone)
