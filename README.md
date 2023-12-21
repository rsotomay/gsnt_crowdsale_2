# GASton Token ICO

Welcome to the GASton Token ICO, an example of a decentralized application that allows users to participate in the initial coin offering to acquire GASton tokens for the first time.

## Features

- Two smart contracts are deployed. A token contract and a crowdsale contract.

- Users that wish to participate need to be added to the ICO’s whitelist and only the owner of the ICO can add users’ addresses to the whitelist.

- There is a minimum and a maximum purchase requirement.

- The ICO has a time countdown for the ICO to start and to end.

- Only the owner can finalize the sale, only if the sale time has run out. By clicking the finalize button, If the ICO’s funding goal has been reached, the ETH is automatically transfer from the ICO smart contract to the owner's address as well as any remaining tokens. If the ICO’s funding goal has not been reached, all participants are automatically refunded.

## Technology Stack & Tools

The GASton Token ICO leverages a variety of technologies to achieve its functionality:

- Solidity: The smart contracts responsible for handling token minting, ownership and the ICO are written in Solidity, a language for Ethereum smart contracts.

- JavaScript: JavaScript is used for various components of the DApp, including testing, front-end interactions and connecting with the Ethereum blockchain.

- [Hardhat](https://hardhat.org/): Hardhat is used for testing and deploying smart contracts to the Ethereum network.

- [Ethers.js](https://docs.ethers.io/v5/): Ethers.js is used for interacting with Ethereum smart contracts and the blockchain.

- [React.js](https://reactjs.org/): The front-end of the DApp is built using React.js, providing a user-friendly interface for users to interact with.

- [Node.js](https://nodejs.org/en/): Node.js is used for the initial setup of the project and managing dependencies.

## Getting Started

To set up the GASton Token ICO locally, follow these steps:

- Install Node.js

Open terminal and enter the following commands:

### Clone or download the repository to your local machine:

`$ git clone https://github.com/rsotomay/gsnt_crowdsale_2.git`

### Navigate to the project directory:

`$ cd gsnt_crowdsale_2`

### Install the project dependencies using Node.js:

`$ npm install`

### Run tests using Hardhat:

`$ npx hardhat test`

### Start a Hardhat node for local development:

Open a separate terminal window and run:

`$ npx hardhat node`

### Deploy the smart contract to your local Hardhat node:

`$npx hardhat run scripts/deploy.js --network localhost`

### Run the front-end application:

Open a separate terminal window and run:

`$ npm run start`

Now you can use MetaMask and the test addresses provided by the Hardhat node to simulate different users, add addresses to the whitelist and purchase tokens with the added addresses.
