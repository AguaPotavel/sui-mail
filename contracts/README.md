# SuiMail: Chat on the Blockchain

## Project Idealization

SuiMail aims to be a decentralized chat application leveraging the Sui blockchain for core functionalities, while utilizing a traditional backend for message registration and potentially other off-chain operations. The primary goal is to demonstrate a hybrid approach to dApp development, combining the transparency and immutability of blockchain with the efficiency and scalability of conventional backend systems.

### Core Concepts

*   **Blockchain-based Chat:** Messages and chat room data will be managed by a smart contract written in Sui Move, ensuring censorship resistance and verifiable message history.
*   **Hybrid Architecture:** A backend service will interact with the Sui blockchain to register messages, handle user authentication (if not fully on-chain), and potentially manage user profiles or other metadata that doesn't require on-chain immutability.
*   **Sui Move Contract:** The core logic for creating chat rooms, sending messages, and managing participants will reside in a Sui Move smart contract.

## Project Structure

*   `sources/`: Contains the Sui Move smart contracts.
    *   `chat.move`: Smart contract for chat functionalities.
    *   `email.move`: Smart contract for email functionalities.
    *   `config.move`: Smart contract for mailbox configuration and taxes.
    *   `chat_config.move`: Smart contract for chat configuration and taxes.
    *   `events.move`: Defines events emitted by the contracts.
*   `tests/`: Contains unit tests for the Sui Move contracts.
    *   `bubble_tests.move`: Tests for the `bubble.move` contract (will be updated to reflect new modules).
*   `build/`: Compiled artifacts of the Sui Move contracts.
*   `sdk/`: TypeScript SDK for interacting with the Sui Move contracts.
*   `backend/` (Planned): Directory for the backend service (e.g., Node.js, Python).
*   `frontend/` (Planned): Directory for the frontend application (e.g., React, Vue).

## Technologies

*   **Blockchain:** Sui Network
*   **Smart Contract Language:** Sui Move
*   **Backend:** (To be determined - e.g., Node.js, Python, Go)
*   **Frontend:** (To be determined - e.g., React, Vue, Angular)

## Setup and Development

### Prerequisites

*   [Sui CLI](https://docs.sui.io/guides/developer/getting-started/sui-install) installed.
*   Node.js/npm (for frontend/backend development, if applicable).

### Building the Sui Move Contract

To build the Sui Move contract, navigate to the project root and run:

```bash
sui move build
```

### Running Tests

To run the Sui Move contract tests:

```bash
sui move test
```

### SDK Usage

To use the TypeScript SDK, navigate to the `sdk/` directory and install dependencies:

```bash
cd sdk
npm install
```

Then, you can import and use the `SuiMailSDK` in your TypeScript project:

```typescript
import { SuiMailSDK } from './sdk/src'; // Adjust path as needed

const packageId = "0x..."; // Replace with your deployed package ID
const privateKey = "..."; // Replace with your private key
const suiRpcUrl = "https://fullnode.devnet.sui.io/"; // Or your preferred RPC URL

const sdk = new SuiMailSDK(privateKey, suiRpcUrl, packageId);

// Example usage:
// const txDigest = await sdk.createChatRoom("0x...", "0x...");
// console.log("Transaction Digest:", txDigest);
```

### Deployment

Deployment instructions will be added here once the contract is ready for deployment to a Sui network (devnet, testnet, or mainnet).

## Contributing

Contributions are welcome! Please feel to open issues or submit pull requests.

## License

(To be determined - e.g., MIT, Apache 2.0)