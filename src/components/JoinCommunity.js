import React from "react";
import { motion } from "framer-motion";

const JoinCommunity = () => {
  return (
    <motion.section
      className="py-16 bg-gradient-to-r from-gray-800 to-gray-900 text-white text-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <h2 className="text-5xl font-bold mb-6">Join Our Community</h2>
      <p className="text-xl text-gray-300 mb-8">
        Become part of the most innovative crypto trading platform.
      </p>
      <motion.button
        className="bg-neon-blue px-12 py-4 text-lg rounded shadow-lg hover:bg-blue-600 transition"
        whileHover={{ scale: 1.1 }}
      >
        Sign Up Now
      </motion.button>
    </motion.section>
  );
};

export default JoinCommunity;
