import Navbar from "react-bootstrap/Navbar";
import { ethers } from "ethers";
import Button from "react-bootstrap/Button";

import logo from "../logo_GSNT.png";

const Navigation = ({
  account,
  setAccount,
  gsntcrowdsale,
  accountBalance,
  setAccountBalance,
}) => {
  const connectHandler = async () => {};
  return (
    <Navbar>
      <img
        alt="logo_GSNT"
        src={logo}
        width="80"
        height="80"
        className="d-inline-block align-top mx-2"
      />
      <Navbar.Brand href="#">GASton Token ICO</Navbar.Brand>
      <Navbar.Collapse className="d-flex justify-content-end">
        {account ? (
          <Navbar.Text
            className="d-inline-block align-top mx-5"
            style={{ color: "black", fontSize: 20 }}
          >
            {account.slice(0, 5) + "..." + account.slice(38, 42)}
            <p className="my-1">
              <strong className="mx-1">You Own:</strong>
              {accountBalance.toString()} Tokens
            </p>
          </Navbar.Text>
        ) : (
          <Button
            variant="secondary"
            style={{ fontSize: 20, width: "30%", margin: "3px" }}
            className="d-inline-block align-top mx-5"
            onClick={connectHandler}
          >
            Connect Your Wallet
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
};

export default Navigation;
