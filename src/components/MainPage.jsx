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
    // Set the selected token in state
    setSelectedToken(token);
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
