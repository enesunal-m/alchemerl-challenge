import React, { useState } from "react";
import MainComponent from "./MainComponent";
import { Header } from "./Header";
import { TokenList } from "./TokenList";
import Footer from "./Footer";
import "./style.css";

const MainPage = () => {
  const [selectedToken, setSelectedToken] = useState(null);

  const handleTokenSelect = (token) => {
    console.log("Token selected in MainPage:", token);
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
