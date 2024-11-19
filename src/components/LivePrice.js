import React, { useEffect, useState } from "react";

const LivePrice = ({ symbol }) => {
  const [price, setPrice] = useState(null);
  const [prevPrice, setPrevPrice] = useState(null);

  useEffect(() => {
    const ws = new WebSocket(`wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`);

    ws.onmessage = (event) => {
      const trade = JSON.parse(event.data);
      const currentPrice = parseFloat(trade.p).toFixed(2);

      setPrevPrice(price);
      setPrice(currentPrice);
    };

    return () => ws.close();
  }, [symbol, price]);

  const priceChange = price > prevPrice ? "text-green-400" : "text-red-400";

  return (
    <div className="bg-gray-800 p-4 rounded shadow-lg text-center">
      <h3 className="text-2xl font-bold text-neon-blue">{symbol.toUpperCase()}</h3>
      <p className={`text-4xl font-extrabold mt-2 transition ${priceChange}`}>
        ${price || "Loading..."}
      </p>
    </div>
  );
};

export default LivePrice;
