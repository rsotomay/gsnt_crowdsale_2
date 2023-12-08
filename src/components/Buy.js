import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";
import { ethers } from "ethers";

import Info from "./Info";

const Buy = ({
  provider,
  price,
  gsntcrowdsale,
  setIsLoading,
  account,
  accountBalance,
  whitelisted,
}) => {
  const [amount, setAmount] = useState("0");
  const [isWaiting, setIsWaiting] = useState(false);
  // const [whitelisted, setWhitelisted] = useState(false);

  const buyHandler = async (e) => {
    e.preventDefault();

    if (!account) {
      window.alert("Please connect your waller");
      return;
    }

    if (!amount) {
      window.alert("Please enter purchase amount");
      return;
    }

    if (whitelisted === false) {
      window.alert("You need to be on the whitelist to buy tokens");
      return;
    }

    setIsWaiting(true);

    try {
      const signer = await provider.getSigner();
      // We need to calculate the required ETH in order to buy the tokens...
      const value = ethers.parseUnits((amount * price).toString(), "ether");
      const formattedAmount = ethers.parseUnits(amount.toString(), "ether");

      const transaction = await gsntcrowdsale
        .connect(signer)
        .buyTokens(formattedAmount, { value: value });
      await transaction.wait();

      window.location.reload();
    } catch {
      window.alert("Crowdsale has not started yet");
      window.location.reload();
    }

    setIsLoading(true);
  };
  console.log(whitelisted);

  return (
    <Form
      onSubmit={buyHandler}
      style={{ maxWidth: "800px", margin: "50px auto" }}
    >
      <Form.Group as={Row}>
        <Col>
          <Form.Control
            type="number"
            placeholder="Enter amount"
            onChange={(e) => setAmount(e.target.value)}
          />
          {account && <Info accountBalance={accountBalance} />}
        </Col>
        <Col className="text-center">
          {isWaiting ? (
            <Spinner animation="border" />
          ) : (
            <Button variant="primary" type="submit" style={{ width: "100%" }}>
              Buy Tokens
            </Button>
          )}
        </Col>
      </Form.Group>
    </Form>
  );
};

export default Buy;
