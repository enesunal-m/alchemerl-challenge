import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import TopToken from "./TopToken";
import classNames from "classnames";

const TopTokenList = ({ tokenList, onTokenSelect }) => {
  const listRef = useRef(null);
  const [isOverflowed, setIsOverFlowed] = useState(false);

  useEffect(() => {
    const listElement = listRef.current;
    const checkOverflow = () => {
      if (listElement) {
        setIsOverFlowed(listElement.scrollWidth > listElement.clientWidth);
      }
    };

    checkOverflow();

    // Add resize listener to recheck overflow
    window.addEventListener("resize", checkOverflow);
    return () => window.removeEventListener("resize", checkOverflow);
  }, [tokenList]);

  // Handle token selection from the top token list
  const handleTokenSelect = (token) => {
    console.log("Token selected in TopTokenList:", token);
    // Pass the selection up to the parent component
    onTokenSelect && onTokenSelect(token);
  };

  return (
    <div ref={listRef} className="tokenlist-body">
      <div
        className={classNames({ tokenlist: true, overflowed: isOverflowed })}
      >
        {tokenList.map((item, index) => (
          <TopToken
            key={index}
            itemData={item}
            onTokenSelect={handleTokenSelect}
          />
        ))}
      </div>
    </div>
  );
};

export default TopTokenList;
