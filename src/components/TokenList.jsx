import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTokenListRequest } from "../redux/actions/tokenAction";
import TokenListLogo from "../assets/img/Tokenbar-Logo.png";
import TopTokenList from "./common/TopTokenList";
import TokenTable from "./TokenTable";
import { createTheme, useMediaQuery } from "@mui/material";
import { removeW } from "../utils/funcs";
import { svg2img } from "../utils/randomAvatar";
import "./style.css";

const TokenList = ({ onTokenSelect, initialSelectedToken }) => {
  const theme = createTheme({
    breakpoints: {
      values: {
        xs: 0,
        sm: 600,
        md: 960,
        lg: 1160,
        xl: 1560,
      },
    },
  });

  const isLargeScreen = useMediaQuery(theme.breakpoints.up("lg"));
  const MediumScreen = useMediaQuery(theme.breakpoints.down("lg"));
  const [isMediumScreen, setIsMediumScreen] = useState(MediumScreen);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchTokenListRequest());
  }, [dispatch]);

  const tokenList = useSelector((state) => state.tokenReducer.tokenList);
  const loading = useSelector((state) => state.tokenReducer.loading);
  const error = useSelector((state) => state.tokenReducer.error);

  const [filteredTokenList, setFilteredTokenList] = useState([]);
  const [selectedToken, setSelectedToken] = useState(initialSelectedToken);
  const [isEditing, setIsEditing] = useState(false);
  const [searchText, setSearchText] = useState("");

  // Create sorted and limited token list for the top tokens display
  const sortedTokenList = tokenList
    ? [...tokenList].sort(
        (a, b) =>
          (b.volume24HrsETH * 1) / (b.tradeVolumeETH * 1) -
          (a.volume24HrsETH * 1) / (a.tradeVolumeETH * 1),
      )
    : [];

  const limitedTokenList = sortedTokenList.slice(0, 10).map((item, index) => {
    return {
      num: "#" + (index + 1),
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      logo: item.logo,
      riserate: (
        ((item.volume24HrsETH * 1) / (item.tradeVolumeETH * 1)) *
        100
      ).toFixed(2),
    };
  });

  useEffect(() => {
    if (loading) {
      console.log("TokenList: Loading token data...");
    } else if (error) {
      console.error("TokenList: Error loading tokens:", error);
    } else if (tokenList && tokenList.length > 0) {
      console.log(`TokenList: Loaded ${tokenList.length} tokens successfully`);
      setFilteredTokenList(tokenList);
    }
  }, [tokenList, loading, error]);

  useEffect(() => {
    if (initialSelectedToken) {
      console.log(
        "TokenList: Received initialSelectedToken:",
        initialSelectedToken,
      );
      setSelectedToken(initialSelectedToken);
    }
  }, [initialSelectedToken]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const inputValue = e.target.value;
    setSearchText(inputValue);

    if (!tokenList) return;

    // Filter tokens by search text
    const filtered = [...tokenList].filter((obj) => {
      return (
        // Case-insensitive search
        obj.symbol.toLowerCase().includes(inputValue.toLowerCase()) ||
        obj.id.toLowerCase().includes(inputValue.toLowerCase()) ||
        (obj.name && obj.name.toLowerCase().includes(inputValue.toLowerCase()))
      );
    });

    console.log(
      `TokenList: Filtered to ${filtered.length} tokens matching "${inputValue}"`,
    );
    setFilteredTokenList(filtered);
  };

  const divRef = useRef(null);

  const handleClickOutside = (event) => {
    if (divRef.current && !divRef.current.contains(event.target)) {
      handleSaveClick();
    }
  };

  const handleTokenSelection = (token) => {
    // Important: Make sure to pass the complete token object
    // Find the full token data from tokenList if we don't have all fields
    let fullTokenData = token;

    if (!token.derivedUSD && tokenList && tokenList.length > 0) {
      const matchedToken = tokenList.find(
        (t) => t.id === token.id || t.symbol === token.symbol,
      );

      if (matchedToken) {
        fullTokenData = matchedToken;
      }
    }

    console.log("Token selected in TokenList component:", fullTokenData);
    console.log("Token details:", {
      id: fullTokenData.id,
      symbol: fullTokenData.symbol,
      name: fullTokenData.name || "Unknown",
      price: fullTokenData.derivedUSD || "0",
      volume24h: fullTokenData.volume24HrsUSD || 0,
      marketCap: fullTokenData.tradeVolumeUSD
        ? fullTokenData.tradeVolumeUSD * 1
        : 0,
      liquidity: fullTokenData.totalLiquidityUSD
        ? fullTokenData.totalLiquidityUSD * 1
        : 0,
    });

    // Update local state
    setSelectedToken(fullTokenData);
    handleSaveClick();

    // Pass the token data up to the parent component
    if (onTokenSelect) {
      console.log("Propagating token selection to parent:", fullTokenData);
      onTokenSelect(fullTokenData);
    }
  };

  const handleSaveClick = () => {
    setIsEditing(false);
    setFilteredTokenList(tokenList || []);
    setSearchText("");
  };

  useEffect(() => {
    // Add click outside handler
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Handle selection from the top token list
  const handleTopTokenSelection = (token) => {
    console.log("Token selected from top tokens:", token);
    handleTokenSelection(token);
  };

  // Prepare the display for the selected token dropdown button
  const getTokenDisplayText = () => {
    if (!selectedToken) {
      return "Select Token/Contract Address ⌄";
    }

    return (
      <div className="selected-token-display">
        {selectedToken.logo ? (
          <img
            src={`https://assets.thetatoken.org/tokens/${selectedToken.logo}`}
            alt={selectedToken.symbol}
            className="selected-token-icon"
          />
        ) : (
          <img
            src={svg2img(selectedToken)}
            alt={selectedToken.symbol}
            className="selected-token-icon"
            style={{ borderRadius: "50%" }}
          />
        )}
        <span className="selected-token-symbol">
          {removeW(selectedToken.symbol)}
        </span>
        <span className="dropdown-arrow">⌄</span>
      </div>
    );
  };

  return (
    <div className="tokenlist-background font-header">
      <img
        src={TokenListLogo}
        alt="Token List Logo"
        className="token-list-logo"
      />
      <TopTokenList
        tokenList={limitedTokenList}
        onTokenSelect={handleTopTokenSelection}
        selectedToken={selectedToken}
      />
      <div
        className="dropdown-container font-header"
        style={{ position: "relative" }}
      >
        {isEditing ? (
          <input
            type="text"
            value={searchText}
            placeholder="Search by token name or address..."
            className="dropdown-button dropdown-search"
            onChange={handleInputChange}
            style={{ fontFamily: "altivo" }}
            autoFocus
          />
        ) : (
          <button
            onClick={handleEditClick}
            className="dropdown-button"
            style={{ overflow: "hidden", fontFamily: "altivo" }}
          >
            {getTokenDisplayText()}
          </button>
        )}
        {isEditing && (
          <div
            ref={divRef}
            className="dropdown-content"
            style={{
              position: "absolute",
              top: "calc(45px)",
              transform: "translateX(-50%)",
              width: isLargeScreen ? "60vw" : "100vw",
              backgroundColor: "#191919",
              padding: "10px",
              borderRadius: "0",
              zIndex: "50",
              color: "white",
              border: `1px solid #333`,
              left: isLargeScreen ? "-13vw" : "-37vw",
            }}
          >
            <TokenTable
              tokenData={filteredTokenList}
              onTokenSelect={handleTokenSelection}
              selectedToken={selectedToken}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export { TokenList };
