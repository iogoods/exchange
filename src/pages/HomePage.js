import React, { useState, useEffect } from 'react';

const HomePage = () => {
  const [topCryptos, setTopCryptos] = useState([]);

  useEffect(() => {
    // Abruf der Top-16-Kryptowährungen
    const fetchTopCryptos = async () => {
      try {
        const response = await fetch(
          'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=16&page=1&sparkline=false'
        );
        const data = await response.json();
        setTopCryptos(data);
      } catch (err) {
        console.error('Error fetching top cryptocurrencies:', err);
      }
    };

    fetchTopCryptos();
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-800 via-gray-900 to-black text-white text-center py-16 rounded-lg shadow-lg mb-12 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-gray-900 to-black opacity-50"></div>
        <div className="relative z-10">
          <h1 className="text-6xl font-bold animate-fadeIn mb-4">
            Welcome to <span className="text-neon-blue">CryptoExchange</span>
          </h1>
          <p className="text-xl text-gray-300 animate-fadeIn delay-200">
            Your gateway to the world of cryptocurrency trading.
          </p>
          <div className="mt-8 space-x-4">
            <a
              href="/register"
              className="bg-green-500 hover:bg-green-600 text-white py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Get Started
            </a>
            <a
              href="/spot"
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg shadow-lg transition transform hover:scale-105"
            >
              Explore Trading
            </a>
          </div>
        </div>
      </section>

      {/* Live Crypto Prices */}
      <section className="mb-16">
        <h2 className="text-4xl font-bold text-center text-white mb-12 animate-slideUp">
          Top Cryptocurrencies
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          {topCryptos.map((crypto) => (
            <div
              key={crypto.id}
              className="bg-gray-800 p-6 rounded-lg shadow-lg hover:scale-105 transform transition"
            >
              <div className="flex items-center space-x-4 mb-4">
                <img
                  src={crypto.image}
                  alt={crypto.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <h3 className="text-xl font-bold text-white">{crypto.name}</h3>
                  <p className="text-gray-400">{crypto.symbol.toUpperCase()}</p>
                </div>
              </div>
              <p className="text-2xl font-bold text-green-400">${crypto.current_price.toFixed(2)}</p>
              <p
                className={`mt-2 text-sm ${
                  crypto.price_change_percentage_24h >= 0
                    ? 'text-green-500'
                    : 'text-red-500'
                }`}
              >
                {crypto.price_change_percentage_24h.toFixed(2)}% (24h)
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="text-center mb-16">
        <h2 className="text-4xl font-bold text-white mb-8">Why Wait? Join Us Today!</h2>
        <p className="text-xl text-gray-300 mb-8">
          Create an account now and start trading the top cryptocurrencies instantly.
        </p>
        <a
          href="/register"
          className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-8 rounded-lg shadow-lg transition transform hover:scale-105"
        >
          Register Now
        </a>
      </section>

      {/* Footer Section */}
      <footer className="text-center text-gray-400 py-6 border-t border-gray-700">
        <p>© 2024 CryptoExchange. All Rights Reserved.</p>
      </footer>
    </div>
  );
};

export default HomePage;
