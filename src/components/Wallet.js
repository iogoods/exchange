import React, { useEffect, useState } from "react";

const Wallet = ({ userId }) => {
  const [wallet, setWallet] = useState(null);

  useEffect(() => {
    const fetchWallet = async () => {
      const response = await fetch(`http://localhost:5000/api/wallet/${userId}`);
      const data = await response.json();
      setWallet(data);
    };
    fetchWallet();
  }, [userId]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">My Wallet</h1>
      {wallet ? (
        <div className="mt-4">
          <p>BTC: {wallet.balance.BTC}</p>
          <p>ETH: {wallet.balance.ETH}</p>
          <p>USDT: {wallet.balance.USDT}</p>
        </div>
      ) : (
        <p>Loading wallet...</p>
      )}
    </div>
  );
};

export default Wallet;
