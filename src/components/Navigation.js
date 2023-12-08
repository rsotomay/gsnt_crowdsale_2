import Navbar from "react-bootstrap/Navbar";
import { ethers } from "ethers";
import Button from "react-bootstrap/Button";

import logo from "../logo_GSNT.png";

const Navigation = ({
  account,
  setAccount,
  token,
  setAccountBalance,
  gsntcrowdsale,
  setWhitelisted,
}) => {
  const connectHandler = async () => {
    // Fetch accounts
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    // Add account to state
    const account = ethers.getAddress(accounts[0]);
    setAccount(account);

    //Fetch whietlisted accounts
    setWhitelisted(await gsntcrowdsale.whitelisted(account));

    //Fetch account balance
    const accountBalance = ethers.formatUnits(
      await token.balanceOf(account),
      18
    );
    setAccountBalance(accountBalance);
  };
  return (
    <Navbar>
      <img
        alt="logo_GSNT"
        src={logo}
        width="80"
        height="80"
        className="d-inline-block align-top mx-2"
      />
      <Navbar.Brand style={{ color: "silver", fontSize: 30 }}>
        GSNT ICO
      </Navbar.Brand>
      <Navbar.Collapse className="d-flex justify-content-end">
        {account ? (
          <Navbar.Text
            className="d-inline-block align-top mx-5"
            style={{ color: "silver", fontSize: 20 }}
          >
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
          </Navbar.Text>
        ) : (
          <Button
            variant="dark"
            style={{ fontSize: 20, width: "20%", margin: "3px" }}
            className="d-inline-block align-top mx-5"
            onClick={connectHandler}
          >
            Connect Wallet
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
