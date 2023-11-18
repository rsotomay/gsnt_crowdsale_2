import Button from "react-bootstrap/Button";

const Finalize = ({
  provider,
  owner,
  account,
  gsntcrowdsale,
  contractBalance,
}) => {
  const finalizeHandler = async (e) => {
    e.preventDefault();

    try {
      const signer = await provider.getSigner();
      const transaction = await gsntcrowdsale.connect(signer).finalize();
      await transaction.wait();
    } catch {
      window.alert("Crowdsale is not over yet");
    }
  };

  return (
    <div className="d-flex justify-content-end mx-5">
      {account === owner ? (
        <>
          <div>
            <Button variant="success" type="submit" onClick={finalizeHandler}>
              <p>Finalize Crowdsale</p>
              {`Contract Balance: ${contractBalance} Eth`}
            </Button>
          </div>
        </>
      ) : (
        <></>
      )}
    </div>
  );
};

export default Finalize;
