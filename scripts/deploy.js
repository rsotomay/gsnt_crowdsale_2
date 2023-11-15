// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

async function main() {
  const NAME = "GASton Token";
  const SYMBOL = "GSNT";
  const MAX_SUPPLY = "1000000";
  const PRICE = ethers.parseUnits("0.025", "ether");
  const MIN_PURCHASE = ethers.parseUnits("10", "ether");
  const MAX_PURCHASE = ethers.parseUnits("20000", "ether");
  const CROWD_SALE_OPENED = (Date.now() + 180000).toString().slice(0, 10);
  const CROWD_SALE_CLOSED = (Date.now() + 1800000).toString().slice(0, 10);

  // Deploy Token Contract
  const Token = await hre.ethers.deployContract("Token", [
    NAME,
    SYMBOL,
    MAX_SUPPLY,
  ]);
  await Token.waitForDeployment();
  console.log(`Token Deployed to: ${Token.target}\n`);

  // Deploy Gsntcrowdsale Contract
  const Gsntcrowdsale = await hre.ethers.deployContract("Gsntcrowdsale", [
    Token.target,
    PRICE,
    ethers.parseUnits(MAX_SUPPLY, "ether"),
    MIN_PURCHASE,
    MAX_PURCHASE,
    CROWD_SALE_OPENED,
    CROWD_SALE_CLOSED,
  ]);
  await Gsntcrowdsale.waitForDeployment();
  console.log(`Gsntcrowdsale deployed to: ${Gsntcrowdsale.target}\n`);

  //sends all tokens to Gsntcrowdsale
  const transaction = await Token.transfer(
    Gsntcrowdsale.target,
    ethers.parseUnits(MAX_SUPPLY, "ether")
  );
  await transaction.wait();

  console.log(`Tokens transferred to Gsntcrowdsale`);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
