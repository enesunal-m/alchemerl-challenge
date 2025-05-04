import React, { useState, useEffect, useRef } from "react";
import { checkImg } from "../../utils/funcs";
import { svg2img } from "../../utils/randomAvatar";
import { removeW } from "../../utils/funcs";
import { useSelector } from "react-redux";

const TopToken = ({ itemData, onTokenSelect }) => {
  const [imageExists, setImageExists] = useState(false);
  const tokenRef = useRef(null);
  const tokenList = useSelector((state) => state.tokenReducer.tokenList || []);

  useEffect(() => {
    const isOverflowed =
      tokenRef.current.scrollWidth > tokenRef.current.clientWidth;
    if (isOverflowed) {
      tokenRef.current.classList.add("overflowed");
    } else {
      tokenRef.current.classList.remove("overflowed");
    }
  }, [itemData.symbol]);

  const handleClick = () => {
    // Find the complete token data from the tokenList
    if (itemData.symbol) {
      // Use symbol to find the full token data
      const fullTokenData = tokenList.find(
        (token) => token.symbol === itemData.symbol,
      );

      if (fullTokenData) {
        console.log("TopToken selected with complete data:", fullTokenData);
        // Pass the complete token data to the parent component
        onTokenSelect && onTokenSelect(fullTokenData);
      } else {
        console.log("Token selected, but full data not found:", itemData);
        // Pass what we have if full data isn't available
        onTokenSelect && onTokenSelect(itemData);
      }
    }
  };

  return (
    <div
      ref={tokenRef}
      className="token-item font-header top-token"
      onClick={handleClick}
      style={{ cursor: itemData.symbol ? "pointer" : "default" }}
    >
      <div className="token-element">{itemData.num}</div>
      <img
        className="token-element"
        src={
          itemData.logo
            ? `https://assets.thetatoken.org/tokens/${itemData.logo}`
            : svg2img(itemData)
        }
        alt={itemData.symbol}
        style={
          imageExists
            ? { width: ".9rem" }
            : { width: ".9rem", borderRadius: "50%" }
        }
      />
      <div className="token-element">{removeW(itemData.symbol)}</div>
      <div className="token-element-rate" style={{ color: "#449782" }}>
        {"+" + itemData.riserate + "%"}
      </div>
    </div>
  );
};

export default TopToken;
