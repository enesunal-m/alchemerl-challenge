import React, { useEffect, useRef, useState } from "react";
import "./style.css";
import TopToken from "./TopToken";
import classNames from "classnames";

const TopTokenList = ({ tokenList, onTokenSelect }) => {
  const listRef = useRef(null);
  const [isOverflowed, setIsOverFlowed] = useState(false);

  useEffect(() => {
    const listElement = listRef.current;
    setIsOverFlowed(listElement.scrollWidth > listElement.clientWidth);
  }, [tokenList, isOverflowed]);

  return (
    <div ref={listRef} className="tokenlist-body">
      <div className={classNames({ tokenlist: 1, overflowed: isOverflowed })}>
        {tokenList.map((item, index) => (
          <TopToken key={index} itemData={item} onTokenSelect={onTokenSelect} />
        ))}
      </div>
    </div>
  );
};

export default TopTokenList;
