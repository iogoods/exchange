import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserDashboard = () => {
  const [portfolio, setPortfolio] = useState([]);
  const [totalValue, setTotalValue] = useState(0);
  const [currentPrices, setCurrentPrices] = useState({});
  const [modalType, setModalType] = useState(null);
  const [selectedCrypto, setSelectedCrypto] = useState(null);

  useEffect(() => {
    const fetchPortfolio = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get('/api/portfolio', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPortfolio(res.data);
      } catch (err) {
        alert('Error fetching portfolio');
      }
    };

    const fetchPrices = async () => {
      try {
        const res = await axios.get('/api/prices'); // Eine API für aktuelle Preise
        setCurrentPrices(res.data);
      } catch (err) {
        alert('Error fetching prices');
      }
    };

    fetchPortfolio();
    fetchPrices();
  }, []);

  useEffect(() => {
    const calculateTotalValue = () => {
      const total = portfolio.reduce((sum, crypto) => {
        const price = currentPrices[crypto.symbol] || 0;
        return sum + crypto.amount * price;
      }, 0);
      setTotalValue(total);
    };

    calculateTotalValue();
  }, [portfolio, currentPrices]);

  const handleModalOpen = (type, crypto) => {
    setModalType(type);
    setSelectedCrypto(crypto);
  };

  const handleModalClose = () => {
    setModalType(null);
    setSelectedCrypto(null);
  };

  const handleTransaction = async (amount, address = null) => {
    const token = localStorage.getItem('token');
    try {
      const body = {
        symbol: selectedCrypto.symbol,
        amount: modalType === 'deposit' ? parseFloat(amount) : -parseFloat(amount),
      };
      if (address) body.address = address;

      await axios.post('/api/portfolio/update', body, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert(`${modalType} successful!`);
      handleModalClose();
      window.location.reload(); // Aktualisiere das Dashboard
    } catch (err) {
      alert(err.response?.data?.error || 'Transaction failed');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-center text-neon-blue mb-6">User Dashboard</h1>

      {/* Portfolio Value */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mb-6">
        <h2 className="text-2xl font-bold text-white">Portfolio Value</h2>
        <p className="text-4xl font-bold text-green-400 mt-2">${totalValue.toFixed(2)}</p>
      </div>

      {/* Portfolio Table */}
      <div className="bg-gray-800 p-6 rounded shadow-lg">
        <h2 className="text-2xl font-bold text-white mb-4">Your Portfolio</h2>
        <table className="table-auto w-full text-white">
          <thead>
            <tr className="text-left border-b border-gray-600">
              <th className="py-2">Symbol</th>
              <th className="py-2">Amount</th>
              <th className="py-2">Value (USD)</th>
              <th className="py-2 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {portfolio.map((crypto, index) => (
              <tr key={index} className="border-b border-gray-700">
                <td className="py-2">{crypto.symbol}</td>
                <td className="py-2">{crypto.amount}</td>
                <td className="py-2">
                  ${(crypto.amount * (currentPrices[crypto.symbol] || 0)).toFixed(2)}
                </td>
                <td className="py-2 text-center space-x-2">
                  <button
                    className="bg-green-500 hover:bg-green-600 text-white py-1 px-3 rounded"
                    onClick={() => handleModalOpen('deposit', crypto)}
                  >
                    Deposit
                  </button>
                  <button
                    className="bg-red-500 hover:bg-red-600 text-white py-1 px-3 rounded"
                    onClick={() => handleModalOpen('withdraw', crypto)}
                  >
                    Withdraw
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {modalType && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-gray-800 p-6 rounded shadow-lg w-96">
            <h2 className="text-2xl font-bold text-white mb-4">
              {modalType === 'deposit' ? 'Deposit' : 'Withdraw'} {selectedCrypto.symbol}
            </h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amount = e.target.amount.value;
                const address = e.target.address?.value;
                handleTransaction(amount, address);
              }}
            >
              <label className="block text-white mb-2">Amount</label>
              <input
                type="number"
                name="amount"
                step="0.0001"
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                required
              />
              {modalType === 'withdraw' && (
                <>
                  <label className="block text-white mb-2">Wallet Address</label>
                  <input
                    type="text"
                    name="address"
                    className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                    required
                  />
                </>
              )}
              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  onClick={handleModalClose}
                  className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className={`py-2 px-4 rounded ${
                    modalType === 'deposit' ? 'bg-green-500 hover:bg-green-600' : 'bg-red-500 hover:bg-red-600'
                  } text-white`}
                >
                  {modalType === 'deposit' ? 'Deposit' : 'Withdraw'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
