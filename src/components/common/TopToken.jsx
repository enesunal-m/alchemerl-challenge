import React, { useState, useEffect, useRef } from "react";
import { checkImg } from "../../utils/funcs";
import { svg2img } from "../../utils/randomAvatar";
import { removeW } from "../../utils/funcs";

const TopToken = ({ itemData, onTokenSelect }) => {
  const [imageExists, setImageExists] = useState(false);
  const tokenRef = useRef(null);

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
    if (onTokenSelect && itemData.id) {
      // Log the token data to console
      console.log("Token selected:", itemData);
      console.log("Token ID:", itemData.id);
      console.log("Token Symbol:", itemData.symbol);

      // Pass the token data to the parent component
      onTokenSelect(itemData);
    }
  };

  return (
    <div
      ref={tokenRef}
      className="token-item font-header top-token"
      onClick={handleClick}
      style={{ cursor: itemData.id ? "pointer" : "default" }}
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
