import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.section
      className="bg-gradient-to-r from-gray-800 to-gray-900 h-[90vh] flex items-center relative overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <div className="container mx-auto text-center text-white z-10 relative">
        <motion.h1
          className="text-6xl font-extrabold drop-shadow-lg text-neon-blue"
          initial={{ y: -50 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          Welcome to the Future of Crypto Trading
        </motion.h1>
        <motion.p
          className="text-2xl mt-6 text-gray-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
        >
          Trade Bitcoin, Ethereum, and other top cryptocurrencies in one place.
        </motion.p>
        <motion.div
          className="mt-8 flex justify-center space-x-4"
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.8, delay: 1 }}
        >
          <button className="bg-neon-blue px-10 py-4 rounded shadow-lg hover:bg-blue-600 btn-glow">
            Start Trading
          </button>
          <button className="bg-gray-700 px-10 py-4 rounded shadow-lg hover:bg-gray-600 transition">
            Learn More
          </button>
        </motion.div>
      </div>
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black via-transparent to-black opacity-50"></div>
    </motion.section>
  );
};

export default Hero;
