import React, { useEffect, useRef } from "react";
import { removeW } from "../../utils/funcs";

export function TVChartContainer({
  height = 60, // height in viewport-height units
  selectedToken = { symbol: "THETA" }, // default symbol
  locale = "en",
  interval = "D", // daily bars
}) {
  const containerRef = useRef();
  const widgetRef = useRef(null);
  const containerId = `tv_chart_container_${selectedToken?.symbol || "default"}`;

  useEffect(() => {
    // Clean up any previous instance
    if (widgetRef.current) {
      try {
        widgetRef.current.remove();
        widgetRef.current = null;
      } catch (error) {
        console.error("Error removing previous chart instance:", error);
      }
    }

    // Prepare symbol from token data
    let symbol = selectedToken?.symbol || "THETA";

    // Remove the 'W' prefix for wrapped tokens
    if (selectedToken?.name && selectedToken.name.includes("Wrapped")) {
      symbol = removeW(symbol);
    }

    console.log("TVChartContainer: Rendering chart for token:", {
      symbol: symbol,
      tokenId: selectedToken?.id,
      originalSymbol: selectedToken?.symbol,
    });

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.TradingView && containerRef.current) {
        console.log(
          `TVChartContainer: Creating widget for ${symbol}USD in container with id: ${containerId}`,
        );

        widgetRef.current = new window.TradingView.widget({
          container_id: containerId,
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
      } else {
        console.error(
          "TVChartContainer: TradingView not available or container not found",
        );
      }
    };

    // Cleanup when unmounting
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
      if (widgetRef.current) {
        try {
          widgetRef.current.remove();
          widgetRef.current = null;
        } catch (error) {
          console.error("Error cleaning up chart instance:", error);
        }
      }
    };
  }, [selectedToken, interval, locale, containerId]); // Re-create chart when token changes

  return (
    <div
      id={containerId}
      ref={containerRef}
      style={{ width: "100%", height: `${height}vh` }}
    />
  );
}
