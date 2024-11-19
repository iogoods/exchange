import React, { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [newCoin, setNewCoin] = useState('BTC');
  const [loading, setLoading] = useState(true);

  // Wallets abrufen
  const fetchWallets = async () => {
    try {
      const response = await fetch('http://202.61.243.84:5000/api/wallets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setWallets(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching wallets:', err);
      setLoading(false);
    }
  };

  // Wallet erstellen
  const createWallet = async () => {
    try {
      const response = await fetch('http://202.61.243.84:5000/api/wallets/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ coin: newCoin }),
      });

      if (response.ok) {
        const data = await response.json();
        alert(`Wallet for ${data.coin} created successfully: ${data.address}`);
        fetchWallets(); // Wallets neu laden
      } else {
        const error = await response.json();
        console.error('Error creating wallet:', error);
        alert(error.error || 'Failed to create wallet');
      }
    } catch (err) {
      console.error('Error creating wallet:', err);
    }
  };

  useEffect(() => {
    fetchWallets();
  }, []);

  if (loading) {
    return <div className="text-white text-center mt-8">Loading wallets...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center text-neon-blue mb-8">Your Wallet Dashboard</h1>
      
      {/* Wallet erstellen */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mb-8">
        <h2 className="text-xl font-bold text-white mb-4">Create a Wallet</h2>
        <div className="flex space-x-4">
          <select
            value={newCoin}
            onChange={(e) => setNewCoin(e.target.value)}
            className="p-2 rounded bg-gray-700 text-white"
          >
            <option value="BTC">Bitcoin (BTC)</option>
            <option value="ETH">Ethereum (ETH)</option>
            <option value="SOL">Solana (SOL)</option>
          </select>
          <button onClick={createWallet} className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded">
            Create Wallet
          </button>
        </div>
      </div>

      {/* Wallet-Übersicht */}
      <div className="bg-gray-800 p-6 rounded shadow-lg">
        <h2 className="text-xl font-bold text-white mb-4">Your Wallets</h2>
        <table className="w-full text-left text-white">
          <thead>
            <tr>
              <th className="p-2">Coin</th>
              <th className="p-2">Address</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((wallet) => (
              <tr key={wallet.address} className="border-t border-gray-700">
                <td className="p-2">{wallet.coin}</td>
                <td className="p-2">{wallet.address}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UserDashboard;
