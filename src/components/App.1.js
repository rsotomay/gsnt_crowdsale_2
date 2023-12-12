import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Countdown from "react-countdown";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { ethers } from "ethers";
import crowdsale_background from "../crowdsale_background.png";
import Navigation from "./Navigation";
import Loading from "./Loading";
import Progress from "./Progress";
import Whitelist from "./Whitelist";
import Buy from "./Buy";
import Finalize from "./Finalize";
import TOKEN_ABI from "../abis/Token.json";
import GSNTCROWDSALE_ABI from "../abis/Gsntcrowdsale.json";
import config from "../config.json";

export function App() {
  const [provider, setProvider] = useState(null);
  const [token, setToken] = useState(null);
  const [gsntcrowdsale, setGsntcrowdsale] = useState(null);
  const [owner, setOwner] = useState(null);
  const [whitelisted, setWhitelisted] = useState(false);

  const [account, setAccount] = useState(null);
  const [revealTimeOpens, setRevealTimeOpens] = useState(0);
  const [revealTimeCloses, setRevealTimeCloses] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);
  const [contractBalance, setContractBalance] = useState(0);

  const [price, setPrice] = useState(0);
  const [goal, setGoal] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);
  // const [minPurchase, setMinPurchase] = useState("0");
  // const [maxPurchase, setMaxPurchase] = useState("0");
  const [isLoading, setIsLoading] = useState(true);

  const loadBlockchainData = async () => {
    //Initiate provider
    const provider = new ethers.BrowserProvider(window.ethereum);
    setProvider(provider);

    // Load network
    const network = await provider.getNetwork();

    //Initiate contracts
    const token = new ethers.Contract(
      config[network.chainId].token.address,
      TOKEN_ABI,
      provider
    );
    setToken(token);

    const gsntcrowdsale = new ethers.Contract(
      config[network.chainId].gsntcrowdsale.address,
      GSNTCROWDSALE_ABI,
      provider
    );
    setGsntcrowdsale(gsntcrowdsale);

    // Fetch current account from Metamask when changed
    window.ethereum.on("accountsChanged", async () => {
      setAccount(account);
    });

    //Fetch crowdsale contract owner
    setOwner(await gsntcrowdsale.owner());

    const contractBalance = ethers.formatUnits(
      await provider.getBalance(gsntcrowdsale.getAddress()),
      18
    );
    setContractBalance(contractBalance);
    //Fetch minimum purchase
    // const minPurchase = await gsntcrowdsale.minPurchase();
    // setMinPurchase(minPurchase);
    // Fetch maximum purchase
    // const maxPurchase = await gsntcrowdsale.maxPurchase();
    // setMaxPurchase(maxPurchase);
    //Fetch Countdown to crowdsaleOpened
    const crowdsaleOpens = await gsntcrowdsale.crowdsaleOpened();
    setRevealTimeOpens(crowdsaleOpens.toString() + "000");
    //Fetch Countdown to crowdsaleClosed
    const crowdsaleCloses = await gsntcrowdsale.crowdsaleClosed();
    setRevealTimeCloses(crowdsaleCloses.toString() + "000");
    // Fetch price
    const price = ethers.formatUnits(await gsntcrowdsale.price(), 18);
    setPrice(price);
    //Fetch goal
    const goal = ethers.formatUnits(await gsntcrowdsale.goal(), 18);
    setGoal(goal);
    // Fetch max tokens
    const maxTokens = ethers.formatUnits(await gsntcrowdsale.maxTokens(), 18);
    setMaxTokens(maxTokens);
    // Fetch tokens sold
    const tokensSold = ethers.formatUnits(await gsntcrowdsale.tokensSold(), 18);
    setTokensSold(tokensSold);

    setIsLoading(false);
  };

  useEffect(() => {
    if (isLoading) {
      loadBlockchainData();
    }
  }, [isLoading]);

  return (
    <div
      style={{
        WebkitBackgroundSize: "cover",
        minHeight: "100vh",
        backgroundPosition: "bottom",
        backgroundImage: `url(${crowdsale_background})`,
      }}
    >
      <Container style={{ color: "silver" }}>
        <Navigation
          account={account}
          setAccount={setAccount}
          token={token}
          accountBalance={accountBalance}
          setAccountBalance={setAccountBalance}
          gsntcrowdsale={gsntcrowdsale}
          setWhitelisted={setWhitelisted}
        />
        <Finalize
          provider={provider}
          account={account}
          owner={owner}
          gsntcrowdsale={gsntcrowdsale}
          contractBalance={contractBalance}
        />

        <h1 className="my-4 text-center">Introducing The GASton Token!</h1>

        {isLoading ? (
          <Loading />
        ) : (
          <>
            <Row className="justify-content-md-center">
              <Col xs={2}>
                <p className="my-1 text-center">
                  <strong>Token Sale Starts In:</strong>
                </p>
                <div className="my-1 text-center">
                  <Countdown date={parseInt(revealTimeOpens)} className="h4" />
                </div>
              </Col>
              <Col xs={2}>
                <p className="my-1 text-center">
                  <strong>Time left to buy:</strong>
                </p>
                <div className="my-1 text-center">
                  <Countdown date={parseInt(revealTimeCloses)} className="h4" />
                </div>
              </Col>
            </Row>
            <p className="my-3 text-center">
              <strong>Current Price:</strong> {price} ETH
            </p>
            <p className="my-3 text-center">
              <strong>Crowdsale Goal:</strong> {goal} Tokens
            </p>
            <Whitelist
              provider={provider}
              account={account}
              gsntcrowdsale={gsntcrowdsale}
              setIsLoading={setIsLoading}
              owner={owner}
            />
            <Buy
              provider={provider}
              price={price}
              gsntcrowdsale={gsntcrowdsale}
              setIsLoading={setIsLoading}
              account={account}
              accountBalance={accountBalance}
              whitelisted={whitelisted}
            />
            <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
          </>
        )}
      </Container>
    </div>
  );
}
