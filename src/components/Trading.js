import React, { useState } from "react";

const Trading = ({ userId }) => {
  const [type, setType] = useState("buy");
  const [pair, setPair] = useState("BTC/USDT");
  const [price, setPrice] = useState("");
  const [amount, setAmount] = useState("");

  const handleOrder = async () => {
    const response = await fetch("http://localhost:5000/api/trading/order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, type, pair, price, amount }),
    });
    const data = await response.json();
    console.log(data);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Place Order</h1>
      <select value={type} onChange={(e) => setType(e.target.value)}>
        <option value="buy">Buy</option>
        <option value="sell">Sell</option>
      </select>
      <input
        type="text"
        placeholder="Pair (e.g., BTC/USDT)"
        value={pair}
        onChange={(e) => setPair(e.target.value)}
      />
      <input
        type="number"
        placeholder="Price"
        value={price}
        onChange={(e) => setPrice(e.target.value)}
      />
      <input
        type="number"
        placeholder="Amount"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
      <button onClick={handleOrder}>Submit Order</button>
    </div>
  );
};

export default Trading;
