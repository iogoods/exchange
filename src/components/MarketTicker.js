import React, { useEffect, useState } from "react";

const MarketTicker = () => {
  const [marketData, setMarketData] = useState({});

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setMarketData(data);
    };

    ws.onclose = () => {
      console.log("WebSocket closed");
    };

    return () => ws.close();
  }, []);

  return (
    <div className="p-6 bg-gray-800 text-white">
      <h1 className="text-2xl font-bold">Market Ticker</h1>
      <div className="mt-4">
        <p>BTC/USDT: {marketData.BTC_USDT || "Loading..."}</p>
        <p>ETH/USDT: {marketData.ETH_USDT || "Loading..."}</p>
      </div>
    </div>
  );
};

export default MarketTicker;
