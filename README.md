# Base Legacy Vault

A non-custodial inheritance solution built on Base. This protocol ensures that your digital assets are safely transferred to your loved ones if you lose access to your wallet.

## Features
- **On-chain Inactivity Tracking**: Uses `block.timestamp` to monitor owner activity.
- **Autonomous Recovery**: Heirs can claim assets without third-party intervention after the timeout.
- **Low-Cost Maintenance**: Optimized for Base L2 to ensure "heartbeat" transactions cost less than $0.01.
- **Web3-Native Onboarding**: Integrated with **Reown AppKit** for multi-wallet and social login support.

## Project Setup

### 1. Installation
```bash
npm install @reown/appkit @reown/appkit-adapter-ethers ethers
