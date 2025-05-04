import React, { useState, useEffect } from "react";
import {
  Grid,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import { KeyboardArrowLeft, KeyboardArrowRight } from "@mui/icons-material";
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
    <Grid
      container
      spacing={2}
      sx={{
        backgroundColor: "#191919",
        paddingRight: "7vw",
      }}
    >
      {/* Main content */}
      <Grid
        item
        xs={isMenuOpen ? 9 : 12}
        sx={{ transition: "width 0.5s", position: "relative" }}
      >
        {selectedToken != null ? (
          <TVChartContainer
            height={isMenuOpen ? 70 : 70}
            symbol={selectedToken}
          />
        ) : (
          <TVChartContainer height={isMenuOpen ? 70 : 70} symbol={"TFUEL"} />
        )}
        <Table
          height={isMenuOpen ? 70 : 90}
          onTokenSelect={handleTokenSelect}
        />
        {/* Collapse button */}
        {isLargeScreen && (
          <button className="menubutton" onClick={toggleMenu}>
            <div style={{ marginTop: "-35%" }}>{isMenuOpen ? "›" : "‹"}</div>
          </button>
        )}
      </Grid>

      {/* Token detail panel */}
      {isMenuOpen && (
        <Grid item xs={3} className="font-header">
          <TokenDetail selectedToken={selectedToken} />
        </Grid>
      )}
    </Grid>
  );
};

export default MainComponent;
