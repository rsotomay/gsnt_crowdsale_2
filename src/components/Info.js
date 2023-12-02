const Info = ({ accountBalance }) => {
  return (
    <div className="my-1" style={{ color: "silver" }}>
      <p>
        <strong>Tokens Owned:</strong> {accountBalance}
      </p>
    </div>
  );
};

export default Info;
