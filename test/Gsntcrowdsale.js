const { expect } = require("chai");
const { ethers } = require("hardhat");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

const tokens = (n) => {
  return ethers.parseUnits(n.toString(), "ether");
};

const ether = tokens;

describe("Gsntcrowdsale", () => {
  let gsntcrowdsale, token;
  let accounts, deployer, user1, user2;
  let transaction, result;

  beforeEach(async () => {
    // configures accounts
    accounts = await ethers.getSigners();
    deployer = accounts[0];
    user1 = accounts[1];
    user2 = accounts[2];
    //Configures time
    let now = await time.latest();
    let crowdsaleOpened = now + 300;
    let crowdsaleClosed = now + 1000;

    // Load contracts
    const Gsntcrowdsale = await ethers.getContractFactory("Gsntcrowdsale");
    const Token = await ethers.getContractFactory("Token");

    // Deploys Token contract
    token = await Token.deploy("GASton", "GSNT", "1000000");

    // Deploys Crowdsale contract
    gsntcrowdsale = await Gsntcrowdsale.deploy(
      token.getAddress(),
      ether(1),
      "1000000",
      tokens(10),
      tokens(2000),
      crowdsaleOpened,
      crowdsaleClosed
    );

    // Adds address to whitelist
    transaction = await gsntcrowdsale
      .connect(deployer)
      .addToWhitelist(user1.getAddress());
    result = await transaction.wait();

    // Sends tokens to crowdsale
    transaction = await token
      .connect(deployer)
      .transfer(gsntcrowdsale.getAddress(), tokens(1000000));
    result = await transaction.wait();
  });

  describe("Deployment", () => {
    it("sends tokens to the crowdsale contract", async () => {
      expect(await token.balanceOf(gsntcrowdsale.getAddress())).to.equal(
        tokens(1000000)
      );
    });

    it("returns the price", async () => {
      expect(await gsntcrowdsale.price()).to.equal(ether(1));
    });

    it("returns token address", async () => {
      expect(await gsntcrowdsale.token()).to.equal(await token.getAddress());
    });

    it("returns max tokens", async () => {
      expect(await gsntcrowdsale.maxTokens()).to.equal("1000000");
    });

    it("returns the contract's owner", async () => {
      expect(await gsntcrowdsale.owner()).to.equal(await deployer.getAddress());
    });
  });

  describe("Adds to whitelist", () => {
    describe("Success", () => {
      it("updates whitelist", async () => {
        expect(await gsntcrowdsale.whitelist(user1)).to.equal(true);
      });
    });

    describe("Failure", () => {
      it("rejects non-owner from adding to whitelist", async () => {
        await expect(gsntcrowdsale.connect(user1).addToWhitelist(user1)).to.be
          .reverted;
      });
    });
  });

  describe("Buying Tokes", () => {
    let transaction, result;
    let amount = tokens(10);

    describe("Success", () => {
      beforeEach(async () => {
        let now = await time.latest();
        let crowdsaleOpened = now + 300;
        await time.increaseTo(crowdsaleOpened + 1);

        transaction = await gsntcrowdsale
          .connect(user1)
          .buyTokens(amount, { value: ether(10) });
        result = await transaction.wait();
      });
      it("Confirms advance timestamp to open crowdsale ", async () => {
        expect(
          await ethers.provider.getBalance(gsntcrowdsale.getAddress())
        ).to.equal(ether(10));
      });

      it("transfers tokens", async () => {
        expect(
          await token.balanceOf(await gsntcrowdsale.getAddress())
        ).to.equal(tokens(999990));
        expect(await token.balanceOf(await user1.getAddress())).to.equal(
          amount
        );
      });

      it("allows purchase above minimum purchase ", async () => {
        expect(
          await gsntcrowdsale
            .connect(user1)
            .buyTokens(amount, { value: ether(10) })
        );
      });

      it("update contract's ether balance", async () => {
        expect(
          await ethers.provider.getBalance(gsntcrowdsale.getAddress())
        ).to.equal(amount);
      });

      it("updates tokens sold", async () => {
        expect(await gsntcrowdsale.tokensSold()).to.equal(amount);
      });

      it("emits a buy event", async () => {
        await expect(transaction)
          .to.emit(gsntcrowdsale, "Buy")
          .withArgs(amount, await user1.getAddress());
      });
    });

    describe("Failure", async () => {
      it("rejects insufficient ETH", async () => {
        await expect(
          gsntcrowdsale.connect(user1).buyTokens(tokens(10), { value: 0 })
        ).to.be.reverted;
      });

      it("reject non-whiteListed from buyig tokens", async () => {
        await expect(
          gsntcrowdsale.connect(user2).buyTokens(amount, { value: ether(10) })
        ).to.be.reverted;
      });

      it("rejects purchase of less than 10 tokens", async () => {
        const purchaseAmount = 9;
        await expect(
          gsntcrowdsale
            .connect(user1)
            .buyTokens(purchaseAmount, { value: ether(9) })
        ).to.be.reverted;
      });

      it("rejects purchase of more than 2000 tokens", async () => {
        const purchaseAmount = 2001;
        await expect(
          gsntcrowdsale
            .connect(user1)
            .buyTokens(purchaseAmount, { value: ether(2001) })
        ).to.be.reverted;
      });
      it("rejects purchase if crowdsale has closed", async () => {
        let now = await time.latest();
        let crowdsaleClosed = now + 1000;
        await time.increaseTo(crowdsaleClosed + 1);

        await expect(
          gsntcrowdsale.connect(user1).buyTokens(amount, { value: ether(10) })
        ).to.be.reverted;
      });
    });
  });

  describe("Sending ETH", () => {
    let transaction, result;
    let amount = ether(10);

    describe("Success", () => {
      beforeEach(async () => {
        let now = await time.latest();
        let crowdsaleOpened = now + 300;
        await time.increaseTo(crowdsaleOpened + 1);
        transaction = await user1.sendTransaction({
          to: gsntcrowdsale.getAddress(),
          value: amount,
        });
        result = await transaction.wait();
      });

      it("Updates contracts ether balance", async () => {
        expect(
          await ethers.provider.getBalance(gsntcrowdsale.getAddress())
        ).to.equal(amount);
      });

      it("updates user token balance", async () => {
        expect(await token.balanceOf(user1.getAddress())).to.equal(amount);
      });
    });
  });

  describe("Updating Price", () => {
    let transaction, result;
    let price = ether(2);

    describe("Success", () => {
      beforeEach(async () => {
        transaction = await gsntcrowdsale.connect(deployer).setPrice(price);
        result = await transaction.wait();
      });
      it("updates the price", async () => {
        expect(await gsntcrowdsale.price()).to.equal(price);
      });
    });

    describe("Failure", () => {
      it("prevents non-owner from updating price", async () => {
        await expect(gsntcrowdsale.connect(user1).setPrice(price)).to.be
          .reverted;
      });
    });
  });

  describe("Finalizing Sale", () => {
    let transaction, result;
    let amount = tokens(10);
    let value = ether(10);

    describe("Success", () => {
      beforeEach(async () => {
        let now = await time.latest();
        let crowdsaleOpened = now + 300;
        await time.increaseTo(crowdsaleOpened + 1);
        transaction = await gsntcrowdsale
          .connect(user1)
          .buyTokens(amount, { value: value });
        result = await transaction.wait();

        transaction = await gsntcrowdsale.connect(deployer).finalize();
        result = await transaction.wait();
      });

      it("transfers remaining tokens to owner", async () => {
        // let now = await time.latest();
        // let crowdsaleClosed = now + 1000;
        // await time.increaseTo(crowdsaleClosed + 1);
        expect(await token.balanceOf(gsntcrowdsale.getAddress())).to.equal(0);
        expect(await token.balanceOf(deployer.getAddress())).to.equal(
          tokens(999990)
        );
      });
      it("transfers ETH balance to owner", async () => {
        expect(
          await ethers.provider.getBalance(gsntcrowdsale.getAddress())
        ).to.equal(0);
      });

      it("emits a fanilize event", async () => {
        await expect(transaction)
          .to.emit(gsntcrowdsale, "Finalize")
          .withArgs(amount, value);
      });
    });

    describe("Failure", () => {
      it("prevents non-owner from finalizing", async () => {
        await expect(gsntcrowdsale.connect(user1).finalize()).to.be.reverted;
      });

      it("reject finalizing if crowdsale is open", async () => {
        let now = await time.latest();
        let crowdsaleClosed = now + 1000;
        await time.increaseTo(crowdsaleClosed - 1);
        await expect(gsntcrowdsale.connect(deployer).finalize()).to.be.reverted;
      });
    });
  });
});
