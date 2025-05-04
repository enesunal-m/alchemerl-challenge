import React, { useEffect, useState } from "react";
import { fetchSwapTransactionListRequest } from "../redux/actions/fetchSwapTrasactionAction";
import { useDispatch, useSelector } from "react-redux";
import {
  formatTimeDifference,
  formatNumber,
  checkTokenSymbol,
  removeW,
} from "../utils/funcs";
import "./style.css";

const Table = ({ onTokenSelect }) => {
  const dispatch = useDispatch();
  const [hoveredRow, setHoveredRow] = useState(null);

  useEffect(() => {
    dispatch(fetchSwapTransactionListRequest());
  }, [dispatch]);

  const swapTransactionList = useSelector(
    (state) => state.swapTransactionReducer.swapTransactionList || [],
  );

  const tokens = useSelector((state) => state.tokenReducer.tokenList || []);

  const filteredTransactions = swapTransactionList
    .filter((item) => item.type === "Swap")
    .slice(0, 100); // Limit to 100 transactions for performance

  const handleRowClick = (rowData) => {
    if (!tokens || tokens.length === 0) return;

    const token0 = tokens.find(
      (token) =>
        token.symbol.toLowerCase() === rowData.symbol0.toLowerCase() ||
        (token.symbol &&
          removeW(token.symbol).toLowerCase() ===
            rowData.symbol0.toLowerCase()),
    );

    const token1 = tokens.find(
      (token) =>
        token.symbol.toLowerCase() === rowData.symbol1.toLowerCase() ||
        (token.symbol &&
          removeW(token.symbol).toLowerCase() ===
            rowData.symbol1.toLowerCase()),
    );

    if (rowData.amount0In * 1) {
      // Buy transaction - show token1
      if (token1 && onTokenSelect) {
        console.log("Selected token from transaction:", token1);
        onTokenSelect(token1);
      }
    } else {
      // Sell transaction - show token0
      if (token0 && onTokenSelect) {
        console.log("Selected token from transaction:", token0);
        onTokenSelect(token0);
      }
    }
  };

  return (
    <div className="transactions-table-container">
      <div className="table-header">
        <h2 className="table-title font-header">Recent Transactions</h2>
      </div>

      <div className="transaction-list">
        <table className="transactions-table">
          <thead>
            <tr>
              <th className="time-col">TIME</th>
              <th className="txn-col">TXN</th>
              <th className="type-col">TYPE</th>
              <th className="swap-col">SWAP</th>
              <th className="amount-col">TOKEN AMOUNT</th>
              <th className="amount-col">TOKEN AMOUNT</th>
              <th className="value-col">USD VALUE</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr className="empty-row">
                <td colSpan="7">Loading transactions...</td>
              </tr>
            ) : (
              filteredTransactions.map((rowData, index) => {
                const isBuy = rowData.amount0In * 1;
                return (
                  <tr
                    key={index}
                    className={`transaction-row ${isBuy ? "buy-row" : "sell-row"} ${hoveredRow === index ? "hovered" : ""}`}
                    onClick={() => handleRowClick(rowData)}
                    onMouseEnter={() => setHoveredRow(index)}
                    onMouseLeave={() => setHoveredRow(null)}
                  >
                    <td className="time-col">
                      {formatTimeDifference(rowData.timestamp * 1)}
                    </td>
                    <td className="txn-col">
                      <a
                        href={`https://explorer.thetatoken.org/txs/${rowData.id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="txn-link"
                        title="View on Explorer"
                      >
                        <i className="fa fa-external-link-alt"></i>
                      </a>
                    </td>
                    <td className="type-col">
                      {isBuy ? (
                        <span className="type-badge buy">BUY</span>
                      ) : (
                        <span className="type-badge sell">SELL</span>
                      )}
                    </td>
                    <td className="swap-col">
                      {`${checkTokenSymbol(rowData.symbol0)} → ${checkTokenSymbol(rowData.symbol1)}`}
                    </td>
                    <td className="amount-col">
                      {formatNumber(
                        rowData.amount0 * 1
                          ? rowData.amount0 * 1
                          : rowData.amount0In * 1 + rowData.amount0Out * 1,
                      )}
                    </td>
                    <td className="amount-col">
                      {formatNumber(
                        rowData.amount1 * 1
                          ? rowData.amount1 * 1
                          : rowData.amount1In * 1 + rowData.amount1Out * 1,
                      )}
                    </td>
                    <td className="value-col">
                      ${formatNumber(rowData.amountUSD * 1)}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
