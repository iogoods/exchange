import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import TradingChart from '../components/TradingChart';
import { coins } from '../data/coinData';

const FuturesTradingPage = () => {
  const { symbol } = useParams();
  const navigate = useNavigate();
  const [selectedSymbol, setSelectedSymbol] = useState(symbol || 'BTCUSDT');
  const [searchTerm, setSearchTerm] = useState('');
  const [orderBook, setOrderBook] = useState({ bids: [], asks: [] });
  const [orderType, setOrderType] = useState('limit');
  const [leverage, setLeverage] = useState(10);
  const [openPosition, setOpenPosition] = useState(null);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    if (symbol) {
      setSelectedSymbol(symbol.toUpperCase());
    }
  }, [symbol]);

  // WebSocket für Live-Preis
  useEffect(() => {
    const ws = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedSymbol.toLowerCase()}@ticker`
    );
    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setCurrentPrice(parseFloat(message.c));
    };

    return () => ws.close();
  }, [selectedSymbol]);

  // WebSocket für Orderbook
  useEffect(() => {
    const orderBookWs = new WebSocket(
      `wss://stream.binance.com:9443/ws/${selectedSymbol.toLowerCase()}@depth10`
    );
    orderBookWs.onmessage = (event) => {
      const message = JSON.parse(event.data);
      setOrderBook({
        bids: message.bids || [],
        asks: message.asks || [],
      });
    };

    return () => orderBookWs.close();
  }, [selectedSymbol]);

  // Berechnung für PnL und Liquidation
  useEffect(() => {
    const interval = setInterval(() => {
      if (openPosition && currentPrice) {
        const entryPrice = openPosition.entryPrice;
        const isLong = openPosition.type === 'buy';

        // Liquidationspreis-Berechnung
        const liquidationPrice = isLong
          ? entryPrice - entryPrice / leverage
          : entryPrice + entryPrice / leverage;

        // PnL-Berechnung
        const pnl =
          (currentPrice - entryPrice) * openPosition.amount * (isLong ? 1 : -1);

        // Größe in USD
        const positionSizeUSD = openPosition.amount * currentPrice;

        // Live-Update des Positionszustands
        setOpenPosition((prev) => ({
          ...prev,
          liquidationPrice,
          pnl,
          positionSizeUSD,
        }));

        // Liquidation prüfen
        if (
          (isLong && currentPrice <= liquidationPrice) ||
          (!isLong && currentPrice >= liquidationPrice)
        ) {
          setOpenPosition(null);
          alert('Position liquidated!');
        }
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [openPosition, currentPrice, leverage]);

  const filteredCoins = coins.filter((coin) =>
    coin.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCoinSelection = (newSymbol) => {
    navigate(`/futures/${newSymbol}`);
  };

  const handleTrade = (type, amount, price = currentPrice) => {
    const leveragedAmount = (amount * leverage).toFixed(2);

    setOpenPosition({
      symbol: selectedSymbol,
      entryPrice: parseFloat(price),
      amount: parseFloat(amount),
      type,
      liquidationPrice: 0,
      pnl: 0,
      positionSizeUSD: 0,
    });

    alert(
      `${type.toUpperCase()} ${leveragedAmount} ${selectedSymbol} at $${price} (Leverage x${leverage})`
    );
  };

  const handleClosePosition = () => {
    setOpenPosition(null);
    alert('Position geschlossen!');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold text-neon-blue text-center mb-8">
        Futures Trading ({selectedSymbol})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
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

      {/* Open Position */}
      {openPosition && (
        <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
          <h2 className="text-xl font-bold text-neon-blue mb-4 text-center">
            Open Position
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-white">
                <strong>Entry Price:</strong> ${openPosition.entryPrice.toFixed(2)}
              </p>
              <p className="text-white">
                <strong>Amount (BTC):</strong> {openPosition.amount}
              </p>
              <p className="text-white">
                <strong>Position Size (USD):</strong> $
                {openPosition.positionSizeUSD?.toFixed(2)}
              </p>
            </div>
            <div>
              <p className="text-white">
                <strong>Liquidation Price:</strong> $
                {openPosition.liquidationPrice.toFixed(2)}
              </p>
              <p
                className={`text-white ${
                  openPosition.pnl >= 0 ? 'text-green-400' : 'text-red-400'
                }`}
              >
                <strong>PnL:</strong> ${openPosition.pnl.toFixed(2)}
              </p>
            </div>
          </div>
          <button
            onClick={handleClosePosition}
            className="mt-4 w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
          >
            Close Position
          </button>
        </div>
      )}

      {/* Leverage Control */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
        <h2 className="text-xl font-bold text-neon-blue mb-4 text-center">
          Leverage Control
        </h2>
        <div className="flex items-center space-x-4">
          <label className="text-white text-lg">Leverage: x{leverage}</label>
          <input
            type="range"
            min="1"
            max="150"
            value={leverage}
            onChange={(e) => setLeverage(parseInt(e.target.value, 10))}
            className="w-full"
          />
        </div>
      </div>

      {/* Kaufen-/Verkaufen-Feld */}
      <div className="bg-gray-800 p-6 rounded shadow-lg mt-6">
        <h2 className="text-2xl font-bold text-neon-blue mb-4 text-center">
          Place a Trade
        </h2>
        <div className="grid grid-cols-2 gap-8">
          <div className="bg-gray-900 p-6 rounded">
            <h3 className="text-xl font-bold text-green-400 mb-4 text-center">Buy</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amount = e.target.amount.value;
                handleTrade('buy', amount);
              }}
            >
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
              >
                Buy
              </button>
            </form>
          </div>
          <div className="bg-gray-900 p-6 rounded">
            <h3 className="text-xl font-bold text-red-400 mb-4 text-center">Sell</h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amount = e.target.amount.value;
                handleTrade('sell', amount);
              }}
            >
              <input
                type="number"
                name="amount"
                placeholder="Enter amount"
                className="w-full p-2 rounded bg-gray-700 text-white mb-4"
                required
              />
              <button
                type="submit"
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded"
              >
                Sell
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuturesTradingPage;
