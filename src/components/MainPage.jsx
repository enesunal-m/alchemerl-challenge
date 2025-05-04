import React, { useState } from "react";
import MainComponent from "./MainComponent";
import { Header } from "./Header";
import { TokenList } from "./TokenList";
import Footer from "./Footer";

const MainPage = () => {
  const [selectedToken, setSelectedToken] = useState(null);

  const handleTokenSelect = (token) => {
    console.log("Token selected in MainPage:", token);
    setSelectedToken(token);
  };

  return (
    <div>
      <Header />
      <TokenList onTokenSelect={handleTokenSelect} />
      <MainComponent initialSelectedToken={selectedToken} />
      <Footer />
    </div>
  );
};

export default MainPage;
