import React, { useEffect } from "react";

const TradingChart = ({ symbol = "BTCUSDT", interval = "1", theme = "dark" }) => {
  useEffect(() => {
    // Dynamisches Laden des TradingView-Skripts
    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/tv.js";
    script.async = true;
    script.onload = () => {
      // TradingView Widget initialisieren
      new window.TradingView.widget({
        container_id: "tradingview_chart",
        width: "100%",
        height: "400",
        symbol: symbol,
        interval: interval,
        timezone: "Etc/UTC",
        theme: theme,
        style: "1",
        locale: "en",
        toolbar_bg: "#f1f3f6",
        enable_publishing: false,
        allow_symbol_change: true,
      });
    };
    document.body.appendChild(script);

    return () => {
      // Script beim Entfernen der Komponente löschen
      document.body.removeChild(script);
    };
  }, [symbol, interval, theme]);

  return <div id="tradingview_chart"></div>;
};

export default TradingChart;
