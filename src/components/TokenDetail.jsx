import React, { useEffect } from "react";
import { formatNumber, removeW } from "../utils/funcs";
import { svg2img } from "../utils/randomAvatar";

const TokenDetail = ({ selectedToken }) => {
  // Log token details when a token is selected
  useEffect(() => {
    if (selectedToken) {
      console.log("TokenDetail received token:", selectedToken);
      console.log("TokenDetail rendering with data:", {
        id: selectedToken.id,
        symbol: selectedToken.symbol,
        name: selectedToken.name || "Unknown",
        price: selectedToken.derivedUSD || "0",
        volume24h: selectedToken.volume24HrsUSD || 0,
        marketCap: selectedToken.tradeVolumeUSD
          ? selectedToken.tradeVolumeUSD * 1
          : 0,
        liquidity: selectedToken.totalLiquidityUSD
          ? selectedToken.totalLiquidityUSD * 1
          : 0,
        logo: selectedToken.logo || "Using generated avatar",
      });
    }
  }, [selectedToken]);

  if (!selectedToken) {
    return (
      <div className="token-detail-placeholder">
        <h3>Select a token to view details</h3>
        <p>Click on any token from the list to see detailed information.</p>
      </div>
    );
  }

  // Safely calculate 24h change percentage with fallbacks for missing data
  const vol24hrs = selectedToken.volume24HrsETH
    ? parseFloat(selectedToken.volume24HrsETH)
    : 0;
  const totalVol = selectedToken.tradeVolumeETH
    ? parseFloat(selectedToken.tradeVolumeETH)
    : 1; // Avoid division by zero
  const changePercentage = ((vol24hrs / totalVol) * 100).toFixed(2);

  // Determine if positive or negative for styling
  const isPositive = parseFloat(changePercentage) >= 0;

  // Safely access all values with fallbacks
  const price = selectedToken.derivedUSD || "0";
  const volume24h = selectedToken.volume24HrsUSD || 0;
  const marketCap = selectedToken.tradeVolumeUSD
    ? selectedToken.tradeVolumeUSD * 1
    : 0;
  const liquidity = selectedToken.totalLiquidityUSD
    ? selectedToken.totalLiquidityUSD * 1
    : 0;

  return (
    <div className="token-detail-container">
      <div className="token-detail-header">
        <div className="token-detail-logo">
          <img
            src={
              selectedToken.logo
                ? `https://assets.thetatoken.org/tokens/${selectedToken.logo}`
                : svg2img(selectedToken)
            }
            alt={selectedToken.symbol || "Token"}
            style={{
              width: "60px",
              height: "60px",
              borderRadius: selectedToken.logo ? "0" : "50%",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
              border: "2px solid #333",
            }}
          />
        </div>
        <div className="token-detail-title">
          <h2>{removeW(selectedToken.symbol || "Unknown")}</h2>
          <p>{selectedToken.name || "Unknown Token"}</p>
        </div>
      </div>

      <div className="token-detail-stats">
        <div className="token-stat-item">
          <span className="token-stat-label">Price (USD)</span>
          <span className="token-stat-value">${price}</span>
        </div>
        <div className="token-stat-item">
          <span className="token-stat-label">24h Volume</span>
          <span className="token-stat-value">${formatNumber(volume24h)}</span>
        </div>
        <div className="token-stat-item">
          <span className="token-stat-label">Market Cap</span>
          <span className="token-stat-value">${formatNumber(marketCap)}</span>
        </div>
        <div className="token-stat-item">
          <span className="token-stat-label">Liquidity</span>
          <span className="token-stat-value">${formatNumber(liquidity)}</span>
        </div>
      </div>

      <div className="token-stat-change">
        <span className="token-stat-label">24h Change</span>
        <div className="token-change-display">
          <span
            className={`token-stat-value-change ${isPositive ? "positive" : "negative"}`}
          >
            {isPositive ? "+" : ""}
            {changePercentage}%
          </span>
          <span
            className={`change-indicator ${isPositive ? "positive" : "negative"}`}
          >
            <i className={`fa fa-arrow-${isPositive ? "up" : "down"}`}></i>
          </span>
        </div>
      </div>

      <div className="token-detail-id">
        <span className="token-id-label">Contract Address</span>
        <span className="token-id-value">{selectedToken.id || "Unknown"}</span>
        <button
          className="copy-button"
          onClick={(e) => {
            e.stopPropagation();
            if (selectedToken.id) {
              navigator.clipboard.writeText(selectedToken.id);
              console.log("Contract address copied:", selectedToken.id);
              alert("Contract address copied to clipboard");
            }
          }}
          title="Copy to clipboard"
        >
          <i className="fa fa-copy"></i>
        </button>
      </div>

      <div className="token-detail-actions">
        {selectedToken.id && (
          <>
            <a
              className="token-action-button trade"
              href={`https://swap.thetatoken.org/swap?outputCurrency=${selectedToken.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-exchange-alt"></i> Trade on ThetaSwap
            </a>
            <a
              className="token-action-button view"
              href={`https://explorer.thetatoken.org/tokens/${selectedToken.id}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <i className="fa fa-external-link-alt"></i> View on Explorer
            </a>
          </>
        )}
      </div>
    </div>
  );
};

export default TokenDetail;
