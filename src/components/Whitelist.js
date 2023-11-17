import { useState } from "react";
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import Spinner from "react-bootstrap/Spinner";

const Whitelist = ({
  provider,
  account,
  gsntcrowdsale,
  setIsLoading,
  owner,
}) => {
  const [isWaiting, setIsWaiting] = useState(false);
  const [addressToAdd, setAddressToAdd] = useState("");

  const addToWhitelistHandler = async (e) => {
    e.preventDefault();

    if (!addressToAdd) {
      window.alert("Add the address you wish to add to whitelist");
      return;
    }
    setIsWaiting(true);

    try {
      const signer = await provider.getSigner();
      const transaction = await gsntcrowdsale
        .connect(signer)
        .addToWhitelist(addressToAdd);
      await transaction.wait();
      window.alert("Address has been added to whitlist");
      window.location.reload();
    } catch {
      window.alert("User rejected or transaction reverted");
    }

    setIsLoading(true);
  };
  return (
    <Form
      onSubmit={addToWhitelistHandler}
      style={{ maxWidth: "800px", margin: "50px auto" }}
    >
      {isWaiting ? (
        <>
          <Spinner
            animation="border"
            style={{ display: "block", margin: "0 auto" }}
          />
        </>
      ) : account === owner ? (
        <Form.Group className="text-center" as={Row}>
          <Col>
            <Form.Control
              type="text"
              placeholder="Enter Address"
              onChange={(e) => setAddressToAdd(e.target.value)}
            />
          </Col>
          <Col className="text-center">
            <Button variant="primary" type="submit" style={{ width: "100%" }}>
              Add to Whitelist
            </Button>
          </Col>
        </Form.Group>
      ) : (
        <></>
      )}
    </Form>
  );
};

export default Whitelist;
