import React, { useEffect, useRef } from "react";

export function TVChartContainer({
  height = 60, // height in viewport-height units
  selectedToken = { symbol: "THETA" }, // default symbol
  locale = "en",
  interval = "D", // daily bars
}) {
  const containerRef = useRef();
  let symbol = selectedToken.symbol;

  useEffect(() => {
    symbol = selectedToken.symbol;
    if (selectedToken.name && selectedToken.name.includes("Wrapped")) {
      symbol = symbol.replace("W", "");
    }

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.TradingView) {
        new window.TradingView.widget({
          container_id: containerRef.current.id,
          autosize: true,
          symbol: `${symbol}USD`, // e.g. "THETAUSD"
          interval, // "D", "60", "30", etc.
          timezone: "Etc/UTC",
          theme: "dark",
          style: "1", // candles
          locale,
          toolbar_bg: "#1e1e1e",
          allow_symbol_change: true,
          details: true,
          hotlist: true,
          withdateranges: true,
        });
      }
    };

    // 3) cleanup when unmounting
    return () => {
      document.body.removeChild(script);
      // Note: the widget itself will automatically be removed when its container
      // is removed from the DOM by React.
    };
  }, [selectedToken, interval, locale]);

  return (
    <div
      id={`tv_chart_${symbol}`}
      ref={containerRef}
      style={{ width: "100%", height: `${height}vh` }}
    />
  );
}
