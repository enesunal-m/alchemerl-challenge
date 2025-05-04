import React from "react";
import { formatNumber, removeW } from "../utils/funcs";
import { svg2img } from "../utils/randomAvatar";

const TokenDetail = ({ selectedToken }) => {
  if (!selectedToken) {
    return (
      <div className="token-detail-placeholder">
        <h3>Select a token to view details</h3>
        <p>Click on any token from the list to see detailed information.</p>
      </div>
    );
  }

  console.log("Selected token details:", selectedToken);

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
            alt={selectedToken.symbol}
            style={{
              width: "50px",
              height: "50px",
              borderRadius: selectedToken.logo ? "0" : "50%",
            }}
          />
        </div>
        <div className="token-detail-title">
          <h2>{removeW(selectedToken.symbol)}</h2>
          <p>{selectedToken.name}</p>
        </div>
      </div>

      <div className="token-detail-stats">
        <div className="token-stat-item">
          <span className="token-stat-label">Price (USD)</span>
          <span className="token-stat-value">${selectedToken.derivedUSD}</span>
        </div>
        <div className="token-stat-item">
          <span className="token-stat-label">24h Volume</span>
          <span className="token-stat-value">
            ${formatNumber(selectedToken.volume24HrsUSD)}
          </span>
        </div>
        <div className="token-stat-item">
          <span className="token-stat-label">Market Cap</span>
          <span className="token-stat-value">
            ${formatNumber(selectedToken.tradeVolumeUSD * 1)}
          </span>
        </div>
        <div className="token-stat-item">
          <span className="token-stat-label">Liquidity</span>
          <span className="token-stat-value">
            ${formatNumber(selectedToken.totalLiquidityUSD * 1)}
          </span>
        </div>
        <div className="token-stat-item">
          <span className="token-stat-label">24h Change</span>
          <span
            className="token-stat-value"
            style={{
              color:
                ((selectedToken.volume24HrsETH * 1) /
                  (selectedToken.tradeVolumeETH * 1)) *
                  100 >
                0
                  ? "#449782"
                  : "#cb4348",
            }}
          >
            {(
              ((selectedToken.volume24HrsETH * 1) /
                (selectedToken.tradeVolumeETH * 1)) *
              100
            ).toFixed(2)}
            %
          </span>
        </div>
      </div>

      <div className="token-detail-id">
        <span className="token-id-label">Token ID:</span>
        <span className="token-id-value">{selectedToken.id}</span>
      </div>

      <div className="token-detail-actions">
        <a
          className="token-action-button"
          href={`https://swap.thetatoken.org/swap?outputCurrency=${selectedToken.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          Trade on ThetaSwap
        </a>
        <a
          className="token-action-button"
          href={`https://explorer.thetatoken.org/tokens/${selectedToken.id}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          View on Explorer
        </a>
      </div>
    </div>
  );
};

export default TokenDetail;
