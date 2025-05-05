import React, { useState, useEffect } from "react";
import { formatNumber } from "../../utils/funcs";
import { svg2img } from "../../utils/randomAvatar";
import { removeW } from "../../utils/funcs";
import "./style.css";

const TokenRow = ({ data, onTokenSelect, isSelected, onHover, isHovered }) => {
  const [imageExists, setImageExists] = useState(false);

  const handleClick = () => {
    if (onTokenSelect) {
      console.log("Token row clicked:", data);
      // Log complete token details for debugging
      console.log("Token Details:", {
        id: data.id,
        symbol: data.symbol,
        name: data.name || "Unknown",
        price: data.derivedUSD || "0",
        volume24h: data.volume24HrsUSD || 0,
        marketCap: data.tradeVolumeUSD ? parseFloat(data.tradeVolumeUSD) : 0,
        liquidity: data.totalLiquidityUSD
          ? parseFloat(data.totalLiquidityUSD)
          : 0,
        changePercentage: data.tradeVolumeETH
          ? (
              ((data.volume24HrsETH * 1) / (data.tradeVolumeETH * 1)) *
              100
            ).toFixed(2)
          : 0,
      });

      onTokenSelect(data);
    }
  };

  // Calculate the percentage change
  const changePercentage =
    data.tradeVolumeETH * 1
      ? ((data.volume24HrsETH * 1) / (data.tradeVolumeETH * 1)) * 100
      : 0;

  // Determine if change is positive
  const isPositive = changePercentage >= 0;

  return (
    <tr
      onClick={handleClick}
      onMouseEnter={() => onHover && onHover(true)}
      onMouseLeave={() => onHover && onHover(false)}
      className={`token-row ${isSelected ? "selected-row" : ""} ${isHovered ? "hovered-row" : ""}`}
      data-token-id={data.id}
    >
      <td
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "flex-start",
          paddingTop: "16px",
          paddingBottom: "16px",
          borderCollapse: "collapse",
          borderColor: "black",
          paddingLeft: "80px",
          alignItems: "center",
        }}
        className="token-header"
      >
        <div className="token-icon-container">
          <img
            src={
              data.logo
                ? `https://assets.thetatoken.org/tokens/${data.logo}`
                : svg2img(data)
            }
            style={
              data.logo
                ? { width: "24px", marginRight: "12px" }
                : { width: "24px", marginRight: "12px", borderRadius: "50%" }
            }
            alt={data.symbol}
          />
          {isSelected && <div className="selected-indicator"></div>}
        </div>
        <div
          className="font-header"
          style={{ marginRight: "8px", fontSize: "16px" }}
        >
          {removeW(data.symbol)}
        </div>

        <span
          className={`font-regular change-badge ${isPositive ? "positive" : "negative"}`}
        >
          {isPositive ? "+" : ""}
          {changePercentage.toFixed(2)}%
        </span>
      </td>
      <td style={{ textAlign: "start" }} className="font-regular">
        ${data.derivedUSD}
      </td>
      <td style={{ textAlign: "start" }} className="font-regular">
        ${formatNumber(data.tradeVolumeUSD * 1)}
      </td>
      <td style={{ textAlign: "start" }} className="font-regular">
        ${formatNumber(data.totalLiquidityUSD * 1)}
      </td>
      <td style={{ textAlign: "start" }} className="font-regular">
        ${formatNumber(data.tradeVolume * 1)}
      </td>
      <td
        style={{ textAlign: "start", paddingRight: "80px" }}
        className="font-regular"
      >
        2yr 3mon
      </td>
    </tr>
  );
};

export default TokenRow;
