import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Countdown from "react-countdown";
import { ethers } from "ethers";

//components
import Navigation from "./Navigation";
import Loading from "./Loading";
import Progress from "./Progress";
import Whitelist from "./Whitelist";
import Buy from "./Buy";

//Abis
import TOKEN_ABI from "../abis/Token.json";
import GSNTCROWDSALE_ABI from "../abis/Gsntcrowdsale.json";

//config
import config from "../config.json";

function App() {
  const [provider, setProvider] = useState(null);
  const [token, setToken] = useState(null);
  const [gsntcrowdsale, setGsntcrowdsale] = useState(null);

  const [account, setAccount] = useState(null);
  const [revealTimeOpens, setRevealTimeOpens] = useState(0);
  const [revealTimeCloses, setRevealTimeCloses] = useState(0);
  const [accountBalance, setAccountBalance] = useState(0);

  const [price, setPrice] = useState(0);
  const [maxTokens, setMaxTokens] = useState(0);
  const [tokensSold, setTokensSold] = useState(0);

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

    //Fetch Countdown to crowdsaleOpened
    const crowdsaleOpens = await gsntcrowdsale.crowdsaleOpened();
    setRevealTimeOpens(crowdsaleOpens.toString() + "000");

    //Fetch Countdown to crowdsaleClosed
    const crowdsaleCloses = await gsntcrowdsale.crowdsaleClosed();
    setRevealTimeCloses(crowdsaleCloses.toString() + "000");

    // Fetch price
    const price = ethers.formatUnits(await gsntcrowdsale.price(), 18);
    setPrice(price);
    // fetch max tokens
    const maxTokens = ethers.formatUnits(await gsntcrowdsale.maxTokens(), 18);
    setMaxTokens(maxTokens);
    // fetch tokens sold
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
    <Container>
      <Navigation
        account={account}
        setAccount={setAccount}
        token={token}
        gsntcrowdsale={gsntcrowdsale}
        accountBalance={accountBalance}
        setAccountBalance={setAccountBalance}
      />

      <h1 className="my-4 text-center">Introducing The GASton Token!</h1>

      {isLoading ? (
        <Loading />
      ) : (
        <>
          <p className="my-1 text-center">
            <strong>Token Sale Starts In:</strong>
          </p>
          <div className="my-1 text-center">
            <Countdown date={parseInt(revealTimeOpens)} className="h4" />
          </div>
          <p className="my-1 text-center">
            <strong>Time left to buy:</strong>
          </p>
          <div className="my-1 text-center">
            <Countdown date={parseInt(revealTimeCloses)} className="h4" />
          </div>
          <p className="my-3 text-center">
            <strong>Current Price:</strong> {price} ETH
          </p>
          <Whitelist
            provider={provider}
            gsntcrowdsale={gsntcrowdsale}
            setIsLoading={setIsLoading}
          />
          <Buy
            provider={provider}
            price={price}
            gsntcrowdsale={gsntcrowdsale}
            setIsLoading={setIsLoading}
          />
          <Progress maxTokens={maxTokens} tokensSold={tokensSold} />
        </>
      )}
    </Container>
  );
}
export default App;
