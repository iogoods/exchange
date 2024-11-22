import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [wallets, setWallets] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState('');
  const [depositAddress, setDepositAddress] = useState('');
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [withdrawalDestination, setWithdrawalDestination] = useState('');
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Der Benutzer muss eingeloggt sein, daher wird der Token hier abgerufen
  const token = localStorage.getItem('authToken');

  // Initial Wallets laden und Portfolio-Wert berechnen
  useEffect(() => {
    const fetchWallets = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://202.61.243.84/api/wallets', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setWallets(response.data);
        calculatePortfolioValue(response.data);
        setError(null);
      } catch (err) {
        setError('Failed to load wallets. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchWallets();
  }, [token]);

  // Berechnung des Portfolio-Werts
  const calculatePortfolioValue = async (wallets) => {
    try {
      const prices = await axios.get('https://api.coingecko.com/api/v3/simple/price', {
        params: {
          ids: wallets.map((wallet) => wallet.currency.toLowerCase()).join(','),
          vs_currencies: 'usd',
        },
      });
      let total = 0;
      wallets.forEach((wallet) => {
        total += wallet.balance * (prices.data[wallet.currency.toLowerCase()]?.usd || 0);
      });
      setPortfolioValue(total);
    } catch (err) {
      console.error('Failed to calculate portfolio value:', err);
    }
  };

  // Deposit-Adresse abrufen
  const handleDeposit = async (currency) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://202.61.243.84/api/deposit/${currency}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedCurrency(currency);
      setDepositAddress(response.data.depositAddress);
      setError(null);
    } catch (err) {
      setError('Failed to fetch deposit address. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Withdrawal durchführen
  const handleWithdraw = async () => {
    if (!withdrawalAmount || !withdrawalDestination) {
      alert('Please fill in all fields for withdrawal.');
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        'http://202.61.243.84/api/withdraw',
        {
          currency: selectedCurrency,
          amount: parseFloat(withdrawalAmount),
          destination: withdrawalDestination,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert('Withdrawal request sent!');
      setWithdrawalAmount('');
      setWithdrawalDestination('');

      // Wallets erneut abrufen, um die aktualisierten Werte zu synchronisieren
      const response = await axios.get('http://202.61.243.84/api/wallets', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setWallets(response.data);
      calculatePortfolioValue(response.data);

      setError(null);
    } catch (err) {
      setError('Failed to process withdrawal. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-neon-blue mb-6">Dashboard</h1>

      {/* Portfolio Value */}
      <div className="text-center bg-gray-800 p-6 rounded shadow-lg mb-8">
        <h2 className="text-2xl font-bold text-white">Portfolio Value</h2>
        {loading ? (
          <p className="text-gray-400">Loading...</p>
        ) : (
          <p className="text-green-400 text-3xl">${portfolioValue.toFixed(2)}</p>
        )}
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-600 text-white p-4 rounded mb-4">
          <p>{error}</p>
        </div>
      )}

      {/* Wallets */}
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

      {/* Deposit Address */}
      {depositAddress && (
        <div className="bg-gray-800 p-6 rounded shadow-lg mt-8">
          <h3 className="text-xl font-bold text-white">
            Deposit Address for {selectedCurrency.toUpperCase()}
          </h3>
          <p className="text-gray-400">{depositAddress}</p>
        </div>
      )}

      {/* Withdrawal */}
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
