# Solana AMM (Automated Market Maker)

A decentralized Automated Market Maker (AMM) built on Solana blockchain using the Anchor framework. This AMM implements constant product market maker formula (x * y = k) for token swaps.

## Features

- Token pool initialization
- Token pair deposits
- Constant product AMM swaps
- Configurable fee mechanism
- On-chain price calculation
- Secure token transfers

## Prerequisites

- Rust 1.70.0 or later
- Solana CLI tools
- Node.js 14.0 or later
- Anchor 0.29.0 or later
- Yarn or npm

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/solana-amm.git
cd solana-amm
```

2. Install dependencies:
```bash
yarn install
```

3. Build the program:
```bash
anchor build
```

## Usage

1. Start a local Solana validator:
```bash
solana-test-validator
```

2. Deploy the program:
```bash
anchor deploy
```

3. Run tests:
```bash
anchor test
```

## Smart Contract Structure

- `lib.rs`: Main program logic
  - Pool initialization
  - Deposit functionality
  - Swap implementation
  - Fee calculation

## Security

This project is provided as-is. While we strive to make it secure, please use it at your own risk. Before deploying to mainnet:
- Conduct thorough testing
- Complete security audits
- Review all dependencies
- Implement additional security measures

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request