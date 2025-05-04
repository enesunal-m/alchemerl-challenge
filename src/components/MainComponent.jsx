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
      setSelectedToken(initialSelectedToken);
      console.log("MainComponent received token:", initialSelectedToken);
    }
  }, [initialSelectedToken]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleTokenSelect = (token) => {
    console.log("Token selected in MainComponent:", token);
    setSelectedToken(token);
  };

  return (
    <div className="main-container">
      {/* Top row with chart and details */}
      <div className="top-row">
        {/* Chart section */}
        <div
          className={`chart-container ${isMenuOpen ? "with-sidebar" : "full-width"}`}
        >
          {selectedToken != null ? (
            <TVChartContainer selectedToken={selectedToken} />
          ) : (
            <TVChartContainer selectedToken={"TFUEL"} />
          )}

          {/* Toggle sidebar button - only visible on large screens */}
          {isLargeScreen && (
            <button className="sidebar-toggle" onClick={toggleMenu}>
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
        <Table onTokenSelect={handleTokenSelect} />
      </div>
    </div>
  );
};

export default MainComponent;
