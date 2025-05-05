import React, { useState, useEffect } from "react";
import MainComponent from "./MainComponent";
import { Header } from "./Header";
import { TokenList } from "./TokenList";
import Footer from "./Footer";
import { useSelector } from "react-redux";
import "./style.css";

const MainPage = () => {
  // State to store the selected token
  const [selectedToken, setSelectedToken] = useState(null);

  // Get the token list from Redux store
  const tokenList = useSelector((state) => state.tokenReducer.tokenList || []);
  const loading = useSelector((state) => state.tokenReducer.loading);

  // Try to set a default token when the component loads
  useEffect(() => {
    if (!selectedToken && !loading && tokenList && tokenList.length > 0) {
      // Find THETA token as default or use the first token with highest volume
      const thetaToken = tokenList.find(
        (token) => token.symbol === "THETA" || token.symbol === "WTHETA",
      );

      const defaultToken = thetaToken || tokenList[0];

      if (defaultToken) {
        console.log("MainPage: Setting default token:", defaultToken.symbol);
        setSelectedToken(defaultToken);
      }
    }
  }, [tokenList, loading, selectedToken]);

  // Handler for token selection
  const handleTokenSelect = (token) => {
    console.log("Token selected in MainPage:", token);

    // Validate the token data before setting it
    if (token && (token.id || token.symbol)) {
      // Set the selected token in state
      setSelectedToken(token);

      // Log additional details for debugging
      console.log("Token details in MainPage:", {
        id: token.id,
        symbol: token.symbol,
        name: token.name || "Unknown",
        price: token.derivedUSD || "0",
        volume24h: token.volume24HrsUSD || 0,
        marketCap: token.tradeVolumeUSD ? token.tradeVolumeUSD * 1 : 0,
        liquidity: token.totalLiquidityUSD ? token.totalLiquidityUSD * 1 : 0,
      });
    } else {
      console.warn("Received invalid token data:", token);
    }
  };

  return (
    <div className="app-container">
      <Header />
      <TokenList
        onTokenSelect={handleTokenSelect}
        initialSelectedToken={selectedToken}
      />
      <MainComponent initialSelectedToken={selectedToken} />
      <Footer />
    </div>
  );
};

export default MainPage;
