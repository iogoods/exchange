import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TradingChart from '../components/TradingChart';
import { coins } from '../data/coinData';

const FuturesTradingPage = ({ user, updateUser }) => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [selectedSymbol, setSelectedSymbol] = useState(symbol || 'BTCUSDT');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [orderType, setOrderType] = useState('limit');
  const [leverage, setLeverage] = useState(10);
  const [openPositions, setOpenPositions] = useState([]);
  const [tradeHistory, setTradeHistory] = useState([]);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    if (symbol) setSelectedSymbol(symbol.toUpperCase());
  }, [symbol]);

  useEffect(() => {
    const priceWs = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedSymbol.toLowerCase()}@ticker`
    );
    const orderBookWs = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedSymbol.toLowerCase()}@depth10`
    );

    priceWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setCurrentPrice(parseFloat(message.c));
    };

    orderBookWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setOrderBook({
        bids: message.bids || [],
        asks: message.asks || [],
      });
    };

    return () => {
      priceWs.close();
      orderBookWs.close();
    };
  }, [selectedSymbol]);

  // Liquidation Checker
  useEffect(() => {
    const interval = setInterval(() => {
      openPositions.forEach((position) => {
        const isLong = position.type === 'buy';
        if (
          (isLong && currentPrice <= position.liquidationPrice) ||
          (!isLong && currentPrice >= position.liquidationPrice)
        ) {
          handleClosePosition(position.id, true);
          alert(`Position ${position.id} has been liquidated!`);
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [openPositions, currentPrice]);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCoinSelection = (newSymbol) => {
    navigate(`/futures/${newSymbol}`);
  };

  const handleTrade = (type, amount, price, stopLoss, takeProfit) => {
    if (!user || !user.balance) {
      alert('You must be logged in and have sufficient balance to trade.');
      return;
    }

    const tradePrice =
      orderType === 'market'
        ? parseFloat(orderBook.bids[0]?.[0] || currentPrice)
        : parseFloat(price);

    const positionSize = parseFloat(amount) * tradePrice;
    const requiredMargin = positionSize / leverage;

    if (user.balance < requiredMargin) {
      alert('Insufficient balance to open this position.');
      return;
    }

    const liquidationPrice =
      type === 'buy'
        ? tradePrice - tradePrice / leverage
        : tradePrice + tradePrice / leverage;

    const newPosition = {
      id: Math.random().toString(36).substr(2, 9),
      symbol: selectedSymbol,
      type: type.toUpperCase(),
      amount: parseFloat(amount),
      entryPrice: tradePrice,
      leverage,
      liquidationPrice: liquidationPrice.toFixed(2),
      stopLoss: stopLoss ? parseFloat(stopLoss) : 'N/A',
      takeProfit: takeProfit ? parseFloat(takeProfit) : 'N/A',
      status: 'Open',
      timestamp: new Date().toLocaleString(),
    };

    // Deduct margin from user balance
    updateUser({ ...user, balance: user.balance - requiredMargin });

    setOpenPositions([...openPositions, newPosition]);
    setTradeHistory([...tradeHistory, { ...newPosition, status: 'Executed' }]);

    alert(`${type.toUpperCase()} ${amount} ${selectedSymbol} at ${tradePrice} (Leverage x${leverage})`);
  };

  const handleClosePosition = (id, isLiquidation = false) => {
    const positionToClose = openPositions.find((position) => position.id === id);

    if (!positionToClose) return;

    const pnl =
      (currentPrice - positionToClose.entryPrice) *
      positionToClose.amount *
      (positionToClose.type === 'buy' ? 1 : -1);

    const refundMargin = isLiquidation ? 0 : positionToClose.amount * positionToClose.entryPrice / leverage;
    updateUser({ ...user, balance: user.balance + refundMargin + pnl });

    setOpenPositions(openPositions.filter((position) => position.id !== id));
    setTradeHistory([
      ...tradeHistory,
      { ...positionToClose, status: isLiquidation ? 'Liquidated' : 'Closed', closeTime: new Date().toLocaleString() },
    ]);
  };

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-5xl font-bold text-neon-blue text-center mb-8">
        Futures Trading ({selectedSymbol})
      </h1>

      <div className="grid grid-cols-4 gap-6">
        {/* Coin-Auswahl */}
        <div className="bg-gray-800 p-6 rounded shadow-lg col-span-1">
          <h2 className="text-xl font-bold text-neon-blue">Select a Coin</h2>
          <input
            type="text"
            placeholder="Search for a coin..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full mt-4 p-2 rounded bg-gray-700 text-white focus:ring focus:ring-neon-blue"
          />
          <ul className="mt-4 max-h-[400px] overflow-y-auto space-y-2">
            {filteredCoins.map((coin) => (
              <li
                key={coin.symbol}
                className="flex justify-between items-center bg-gray-900 p-2 rounded hover:bg-gray-700 transition"
              >
                <span className="text-white">{coin.name}</span>
                <button
                  onClick={() => handleCoinSelection(coin.symbol)}
                  className="bg-neon-blue px-4 py-1 rounded text-white hover:bg-blue-600 transition"
                >
                  Trade
                </button>
              </li>
            ))}
          </ul>
        </div>

        {/* Chart */}
        <div className="col-span-2 bg-gray-800 p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold text-white mb-4">Market Chart</h2>
          <TradingChart symbol={selectedSymbol} interval="5" theme="dark" />
        </div>

        {/* Order Book */}
        <div className="bg-gray-800 p-6 rounded shadow-lg">
          <h2 className="text-xl font-bold text-white">Order Book</h2>
          <div className="grid grid-cols-1">
            <div className="border-b border-gray-600 pb-2 mb-2">
              <h3 className="text-red-400 font-bold text-center">Asks (Sell Orders)</h3>
              <ul className="mt-2 max-h-[200px] overflow-y-auto flex flex-col-reverse">
                {orderBook.asks.map(([price, qty], index) => (
                  <li key={index} className="flex justify-between text-red-400">
                    <span>${price}</span>
                    <span>{qty}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-green-400 font-bold text-center">Bids (Buy Orders)</h3>
              <ul className="mt-2 max-h-[200px] overflow-y-auto">
                {orderBook.bids.map(([price, qty], index) => (
                  <li key={index} className="flex justify-between text-green-400">
                    <span>${price}</span>
                    <span>{qty}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Place a Trade */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
        <h2 className="text-2xl font-bold text-neon-blue mb-4 text-center">Place a Trade</h2>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            const amount = e.target.amount.value;
            const price = orderType === 'market' ? null : e.target.price?.value;
            const stopLoss = e.target.stopLoss?.value || null;
            const takeProfit = e.target.takeProfit?.value || null;
            handleTrade('buy', amount, price, stopLoss, takeProfit);
          }}
        >
          <label className="block text-white mb-2 text-lg">Leverage: x{leverage}</label>
          <input
            type="range"
            min="1"
            max="125"
            value={leverage}
            onChange={(e) => setLeverage(e.target.value)}
            className="w-full mb-6"
          />
          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-white mb-2">Order Type:</label>
              <select
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                value={orderType}
                onChange={(e) => setOrderType(e.target.value)}
              >
                <option value="limit">Limit Order</option>
                <option value="market">Market Order</option>
              </select>
              <input
                type="number"
                name="amount"
                placeholder="Amount"
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                required
              />
              {orderType === 'limit' && (
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                />
              )}
              <input
                type="number"
                name="stopLoss"
                placeholder="Stop Loss (optional)"
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
              />
              <input
                type="number"
                name="takeProfit"
                placeholder="Take Profit (optional)"
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
              />
            </div>
            <div className="flex flex-col justify-center space-y-4">
              <button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white py-4 rounded-lg text-lg"
              >
                Buy
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  const amount = e.target.form.amount.value;
                  const price = orderType === 'market' ? null : e.target.form.price?.value;
                  const stopLoss = e.target.form.stopLoss?.value || null;
                  const takeProfit = e.target.form.takeProfit?.value || null;
                  handleTrade('sell', amount, price, stopLoss, takeProfit);
                }}
                className="bg-red-500 hover:bg-red-600 text-white py-4 rounded-lg text-lg"
              >
                Sell
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Open Positions */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
        <h2 className="text-xl font-bold text-neon-blue mb-4">Open Positions</h2>
        {openPositions.length > 0 ? (
          <ul className="space-y-4">
            {openPositions.map((position) => (
              <li
                key={position.id}
                className="flex justify-between bg-gray-900 p-4 rounded text-white"
              >
                <div>
                  <p>
                    <strong>{position.type}</strong> {position.amount} {position.symbol}
                  </p>
                  <p>Entry Price: ${position.entryPrice.toFixed(2)}</p>
                  <p>Leverage: x{position.leverage}</p>
                  <p>Liquidation Price: ${position.liquidationPrice}</p>
                </div>
                <button
                  onClick={() => handleClosePosition(position.id)}
                  className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded"
                >
                  Close
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No open positions.</p>
        )}
      </div>

      {/* Trade History */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
        <h2 className="text-xl font-bold text-neon-blue mb-4">Trade History</h2>
        {tradeHistory.length > 0 ? (
          <ul className="space-y-4">
            {tradeHistory.map((trade, index) => (
              <li key={index} className="bg-gray-900 p-4 rounded text-white">
                <p>
                  <strong>{trade.type}</strong> {trade.amount} {trade.symbol}
                </p>
                <p>Price: ${trade.entryPrice}</p>
                <p>Status: {trade.status}</p>
                <p>Time: {trade.timestamp}</p>
                {trade.status === 'Closed' && <p>Close Time: {trade.closeTime}</p>}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-400">No trade history available.</p>
        )}
      </div>
    </div>
  );
};

export default FuturesTradingPage;
