import React from "react";

const WalletPage = () => {
  return (
    <div>
      <h1 className="text-4xl font-bold mb-8">My Wallet</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-neon-blue">Bitcoin (BTC)</h2>
          <p className="text-2xl font-bold mt-4">1.2345 BTC</p>
          <p className="text-gray-400 mt-1">~ $61,200</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-neon-green">Ethereum (ETH)</h2>
          <p className="text-2xl font-bold mt-4">10.5678 ETH</p>
          <p className="text-gray-400 mt-1">~ $30,400</p>
        </div>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-yellow-400">USDT</h2>
          <p className="text-2xl font-bold mt-4">5000 USDT</p>
          <p className="text-gray-400 mt-1">~ $5000</p>
        </div>
      </div>
    </div>
  );
};

export default WalletPage;
