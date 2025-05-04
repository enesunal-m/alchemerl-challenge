import React, { useState } from "react";
import MainComponent from "./MainComponent";
import { Header } from "./Header";
import { TokenList } from "./TokenList";
import Footer from "./Footer";
import "./style.css";

const MainPage = () => {
  // State to store the selected token
  const [selectedToken, setSelectedToken] = useState(null);

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
        name: token.name,
        price: token.derivedUSD,
        volume24h: token.volume24HrsUSD,
        marketCap: token.tradeVolumeUSD,
        liquidity: token.totalLiquidityUSD,
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
