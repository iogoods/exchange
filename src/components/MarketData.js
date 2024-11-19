import React from "react";
import { motion } from "framer-motion";

const MarketData = () => {
  const data = [
    { name: "Bitcoin", price: "$60,000", change: "+2.5%" },
    { name: "Ethereum", price: "$4,000", change: "+3.8%" },
    { name: "Cardano", price: "$1.30", change: "-0.8%" },
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto">
        <motion.h2
          className="text-4xl font-bold mb-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Live Market Data
        </motion.h2>
        <div className="grid grid-cols-3 gap-6">
          {data.map((coin, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-800 rounded shadow-lg hover:shadow-xl transition"
              whileHover={{ scale: 1.05, rotate: 1 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <h3 className="text-2xl font-bold">{coin.name}</h3>
              <p className="text-gray-400 mt-2">Price: {coin.price}</p>
              <p
                className={`mt-1 ${
                  coin.change.startsWith("+")
                    ? "text-green-400"
                    : "text-red-400"
                }`}
              >
                Change: {coin.change}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default MarketData;
