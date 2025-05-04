import React, { useState, useEffect } from "react";
import { useTheme, useMediaQuery } from "@mui/material";
import { TVChartContainer } from "./common/TVChartContainer";
import Table from "./Table";
import TokenDetail from "./TokenDetail";
import "./style.css";

const MainComponent = ({ initialSelectedToken }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(true);
  const [selectedToken, setSelectedToken] = useState(null);
  const theme = useTheme();
  const isLargeScreen = useMediaQuery(theme.breakpoints.up("md"));

  // Update the local state when initialSelectedToken changes
  useEffect(() => {
    if (initialSelectedToken) {
      console.log("MainComponent received token:", initialSelectedToken);
      setSelectedToken(initialSelectedToken);
    }
  }, [initialSelectedToken]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTokenSelect = (token) => {
    console.log("Token selected in MainComponent:", token);

    // Ensure we have full token data
    if (token && (token.id || token.symbol)) {
      setSelectedToken(token);

      // Log detailed information about the token
      console.log("Token details in MainComponent:", {
        id: token.id,
        symbol: token.symbol,
        name: token.name,
        price: token.derivedUSD,
        volume24h: token.volume24HrsUSD,
        marketCap: token.tradeVolumeUSD,
        liquidity: token.totalLiquidityUSD,
      });
    } else {
      console.warn("Received invalid token data in MainComponent:", token);
    }
  };

  return (
    <div className="main-container">
      {/* Top row with chart and details */}
      <div className="top-row">
        {/* Chart section */}
        <div
          className={`chart-container ${isMenuOpen ? "with-sidebar" : "full-width"}`}
        >
          {selectedToken ? (
            <TVChartContainer selectedToken={selectedToken} />
          ) : (
            <TVChartContainer selectedToken={{ symbol: "THETA" }} />
          )}

          {/* Toggle sidebar button - only visible on large screens */}
          {isLargeScreen && (
            <button
              className="sidebar-toggle"
              onClick={toggleMenu}
              aria-label={
                isMenuOpen ? "Hide token details" : "Show token details"
              }
            >
              {isMenuOpen ? "›" : "‹"}
            </button>
          )}
        </div>

        {/* Token detail sidebar */}
        {isMenuOpen && (
          <div className="sidebar-container">
            <TokenDetail selectedToken={selectedToken} />
          </div>
        )}
      </div>

      {/* Full-width table row */}
      <div className="table-row">
        <Table
          onTokenSelect={handleTokenSelect}
          selectedToken={selectedToken}
        />
      </div>
    </div>
  );
};

export default MainComponent;
