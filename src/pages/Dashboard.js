import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalDestination, setWithdrawalDestination] = useState('');
  const [portfolioValue, setPortfolioValue] = useState(0);

  useEffect(() => {
    const fetchWallets = async () => {
      const response = await axios.get('/api/wallets');
      setWallets(response.data);
      calculatePortfolioValue(response.data);
    };

    fetchWallets();
  }, []);

  const calculatePortfolioValue = (wallets) => {
    let total = 0;
    wallets.forEach((wallet) => {
      total += wallet.balance;
    });
    setPortfolioValue(total);
  };

  const handleDeposit = async (currency) => {
    const response = await axios.get(`/api/deposit/${currency}`);
    setSelectedCurrency(currency);
    setDepositAddress(response.data.depositAddress);
  };

  const handleWithdraw = async () => {
    await axios.post('/api/withdraw', {
      currency: selectedCurrency,
      amount: withdrawalAmount,
      destination: withdrawalDestination,
    });
    alert('Withdrawal request sent!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-neon-blue mb-6">Dashboard</h1>
      <div className="text-center bg-gray-800 p-6 rounded shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-white">Portfolio Value</h2>
        <p className="text-green-400 text-3xl">${portfolioValue.toFixed(2)}</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {wallets.map((wallet) => (
          <div key={wallet.currency} className="bg-gray-800 p-6 rounded shadow-lg">
            <h3 className="text-xl font-bold text-white">{wallet.currency.toUpperCase()}</h3>
            <p className="text-gray-400">Balance: {wallet.balance}</p>
            <button
              onClick={() => handleDeposit(wallet.currency)}
              className="bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded mt-4"
            >
              Deposit
            </button>
          </div>
        ))}
      </div>
      {depositAddress && (
        <div className="bg-gray-800 p-6 rounded shadow-lg mt-8">
          <h3 className="text-xl font-bold text-white">Deposit Address for {selectedCurrency.toUpperCase()}</h3>
          <p className="text-gray-400">{depositAddress}</p>
        </div>
      )}
      <div className="bg-gray-800 p-6 rounded shadow-lg mt-8">
        <h3 className="text-xl font-bold text-white">Withdraw {selectedCurrency.toUpperCase()}</h3>
        <input
          type="text"
          placeholder="Amount"
          value={withdrawalAmount}
          onChange={(e) => setWithdrawalAmount(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
        />
        <input
          type="text"
          placeholder="Destination Address"
          value={withdrawalDestination}
          onChange={(e) => setWithdrawalDestination(e.target.value)}
          className="w-full p-2 rounded bg-gray-700 text-white mb-4"
        />
        <button
          onClick={handleWithdraw}
          className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded"
        >
          Withdraw
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
