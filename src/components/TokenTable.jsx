import React, { useEffect, useState } from "react";
import TokenRow from "./common/TokenRow";
import "./style.css";

const TokenTable = ({ tokenData, onTokenSelect, selectedToken }) => {
  const [sortedData, setSortedData] = useState([]);
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  const [hoveredRow, setHoveredRow] = useState(null);

  const sortData = (key) => {
    let direction = "asc";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "asc"
    ) {
      direction = "desc";
    }

    // Make a copy of tokenData for sorting
    const sorted = [...tokenData].sort((a, b) => {
      // Ensure we're comparing numbers, not strings
      const aValue = a[key] ? parseFloat(a[key]) : 0;
      const bValue = b[key] ? parseFloat(b[key]) : 0;

      if (aValue < bValue) {
        return direction === "asc" ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === "asc" ? 1 : -1;
      }
      return 0;
    });

    setSortedData(sorted);
    setSortConfig({ key, direction });

    console.log(`TokenTable: Sorted by ${key} in ${direction} order`);
  };

  const renderSortIcon = (columnName) => {
    if (sortConfig && sortConfig.key === columnName) {
      return sortConfig.direction === "asc" ? "▲" : "▼";
    }
    return null;
  };

  const tableStyle = {
    backgroundColor: "#191919",
    overflowY: "auto",
    maxHeight: "70vh",
    width: "100%",
    cursor: "pointer",
  };

  // Handle token selection
  const handleTokenSelect = (token) => {
    console.log("TokenTable: Token selected:", token);
    // Log detailed info
    console.log("Selected token details:", {
      id: token.id,
      symbol: token.symbol,
      name: token.name || "Unknown",
      price: token.derivedUSD || "0",
      volume24h: token.volume24HrsUSD || 0,
    });

    // Pass token data up to parent component
    onTokenSelect && onTokenSelect(token);
  };

  useEffect(() => {
    if (tokenData && tokenData.length > 0) {
      // Initially sort by volume24HrsUSD in descending order if no sort is set
      if (!sortConfig.key) {
        const initialSorted = [...tokenData].sort((a, b) => {
          const aValue = a.volume24HrsUSD ? parseFloat(a.volume24HrsUSD) : 0;
          const bValue = b.volume24HrsUSD ? parseFloat(b.volume24HrsUSD) : 0;
          return bValue - aValue; // Descending order
        });
        setSortedData(initialSorted);
        setSortConfig({ key: "volume24HrsUSD", direction: "desc" });
      } else {
        setSortedData([...tokenData]);
      }
    } else {
      setSortedData([]);
    }
  }, [tokenData]);

  return (
    <div className="table-container font-header" style={tableStyle}>
      <table
        className="custom-table"
        style={{
          width: "100%",
          marginTop: "15px",
          marginBottom: "20px",
          fontSize: "medium",
        }}
      >
        <thead className="font-header">
          <tr>
            <th
              onClick={() => sortData("symbol")}
              style={{ textAlign: "start", cursor: "pointer" }}
            >
              TOKEN {renderSortIcon("symbol")}
            </th>
            <th
              onClick={() => sortData("derivedUSD")}
              style={{ textAlign: "start", cursor: "pointer" }}
            >
              PRICE {renderSortIcon("derivedUSD")}
            </th>
            <th
              onClick={() => sortData("tradeVolumeUSD")}
              style={{ textAlign: "start", cursor: "pointer" }}
            >
              MARKETCAP {renderSortIcon("tradeVolumeUSD")}
            </th>
            <th
              onClick={() => sortData("totalLiquidityUSD")}
              style={{ textAlign: "start", cursor: "pointer" }}
            >
              LIQUIDITY {renderSortIcon("totalLiquidityUSD")}
            </th>
            <th
              onClick={() => sortData("tradeVolume")}
              style={{ textAlign: "start", cursor: "pointer" }}
            >
              VOLUME {renderSortIcon("tradeVolume")}
            </th>
            <th style={{ textAlign: "start", paddingRight: "80px" }}>
              TOKEN AGE
            </th>
          </tr>
        </thead>
        <tbody style={{ backgroundColor: "black" }}>
          {sortedData.length === 0 ? (
            <tr>
              <td colSpan="6" style={{ textAlign: "center", padding: "20px" }}>
                {tokenData.length === 0
                  ? "No tokens available"
                  : "Loading tokens..."}
              </td>
            </tr>
          ) : (
            sortedData.map((rowData, index) => {
              // Check if this row is for the selected token
              const isSelected =
                selectedToken && selectedToken.id === rowData.id;

              return (
                <TokenRow
                  data={rowData}
                  key={rowData.id || index}
                  onTokenSelect={handleTokenSelect}
                  isSelected={isSelected}
                  onHover={(hovered) => setHoveredRow(hovered ? index : null)}
                  isHovered={hoveredRow === index}
                />
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};

export default TokenTable;
