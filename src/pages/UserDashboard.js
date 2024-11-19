import React, { useEffect, useState } from 'react';

const UserDashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [depositAddress, setDepositAddress] = useState('');
  const [withdrawal, setWithdrawal] = useState({ coin: '', amount: 0, address: '' });

  // Wallets abrufen
  const fetchWallets = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/wallets', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setWallets(data);

      // Portfolio-Wert berechnen
      const totalValue = data.reduce(
        (acc, wallet) => acc + wallet.balance * wallet.coinPrice,
        0
      );
      setPortfolioValue(totalValue);
    } catch (err) {
      console.error('Error fetching wallets:', err);
    }
  };

  // Transaktionen abrufen
  const fetchTransactions = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/transactions', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const data = await response.json();
      setTransactions(data);
    } catch (err) {
      console.error('Error fetching transactions:', err);
    }
  };

  // Einzahlung anzeigen
  const handleDeposit = (coin) => {
    const wallet = wallets.find((w) => w.coin === coin);
    if (wallet) {
      setDepositAddress(wallet.depositAddress);
    }
  };

  // Auszahlung verarbeiten
  const handleWithdrawal = async () => {
    const { coin, amount, address } = withdrawal;

    try {
      const response = await fetch('http://localhost:5000/api/wallets/withdraw', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify({ coin, amount, address }),
      });

      if (response.ok) {
        alert('Withdrawal successful');
        fetchWallets();
        fetchTransactions();
      } else {
        const error = await response.json();
        alert(error.error || 'Failed to process withdrawal');
      }
    } catch (err) {
      console.error('Error processing withdrawal:', err);
    }
  };

  useEffect(() => {
    fetchWallets();
    fetchTransactions();
  }, []);

  return (
    <div className="container mx-auto px-6 py-8 text-white">
      <h1 className="text-4xl font-bold text-center text-neon-blue mb-8">User Dashboard</h1>

      {/* Portfolio-Wert */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg mb-10 text-center">
        <h2 className="text-2xl font-bold">Portfolio Value</h2>
        <p className="text-4xl font-bold mt-4">${portfolioValue.toFixed(2)}</p>
      </div>

      {/* Wallet Balances */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Wallet Balances</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {wallets.map((wallet) => (
            <div
              key={wallet.coin}
              className="bg-gray-800 p-6 rounded-lg shadow-lg flex flex-col items-center"
            >
              <h3 className="text-xl font-bold text-center">{wallet.coin}</h3>
              <p className="text-2xl font-bold mt-2">{wallet.balance.toFixed(8)}</p>
              <p className="text-gray-400 mt-2">≈ ${(wallet.balance * wallet.coinPrice).toFixed(2)}</p>
              <p className="text-gray-400">Deposit Address:</p>
              <p className="text-sm break-all">{wallet.depositAddress}</p>
              <button
                onClick={() => handleDeposit(wallet.coin)}
                className="mt-4 px-4 py-2 bg-neon-blue text-white rounded-lg hover:bg-blue-600"
              >
                Deposit
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Deposit Form */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Deposit Funds</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          {depositAddress ? (
            <div>
              <p className="text-lg font-bold">Your Deposit Address:</p>
              <p className="mt-2 text-center break-all text-lg text-green-400">
                {depositAddress}
              </p>
              <p className="mt-4 text-gray-400 text-center">
                Please send your funds to this address. Deposits will be credited after blockchain confirmations.
              </p>
            </div>
          ) : (
            <p className="text-center text-gray-400">
              Select a wallet to view the deposit address.
            </p>
          )}
        </div>
      </div>

      {/* Withdrawal Form */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Withdraw Funds</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <select
              onChange={(e) => setWithdrawal({ ...withdrawal, coin: e.target.value })}
              className="p-2 rounded bg-gray-700 text-white"
            >
              <option value="">Select Coin</option>
              {wallets.map((wallet) => (
                <option key={wallet.coin} value={wallet.coin}>
                  {wallet.coin}
                </option>
              ))}
            </select>
            <input
              type="number"
              placeholder="Amount"
              onChange={(e) => setWithdrawal({ ...withdrawal, amount: e.target.value })}
              className="p-2 rounded bg-gray-700 text-white"
            />
            <input
              type="text"
              placeholder="Recipient Address"
              onChange={(e) => setWithdrawal({ ...withdrawal, address: e.target.value })}
              className="p-2 rounded bg-gray-700 text-white"
            />
          </div>
          <button
            onClick={handleWithdrawal}
            className="mt-4 px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg"
          >
            Withdraw
          </button>
        </div>
      </div>

      {/* Transactions */}
      <div className="mb-10">
        <h2 className="text-2xl font-bold mb-4">Recent Transactions</h2>
        <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
          {transactions.length > 0 ? (
            <table className="table-auto w-full text-left text-gray-400">
              <thead>
                <tr>
                  <th className="px-4 py-2">Date</th>
                  <th className="px-4 py-2">Type</th>
                  <th className="px-4 py-2">Coin</th>
                  <th className="px-4 py-2">Amount</th>
                  <th className="px-4 py-2">Address</th>
                  <th className="px-4 py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.map((tx) => (
                  <tr key={tx._id}>
                    <td className="px-4 py-2">{new Date(tx.timestamp).toLocaleString()}</td>
                    <td className="px-4 py-2">{tx.type.toUpperCase()}</td>
                    <td className="px-4 py-2">{tx.coin}</td>
                    <td className="px-4 py-2">{tx.amount}</td>
                    <td className="px-4 py-2 break-all">{tx.address}</td>
                    <td className="px-4 py-2">{tx.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
