const Info = ({ accountBalance }) => {
  return (
    <div className="my-3">
      <p>
        <strong>Tokens Owned:</strong> {accountBalance}
      </p>
    </div>
  );
};

export default Info;
