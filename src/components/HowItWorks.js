import React from "react";
import { motion } from "framer-motion";
import { FaUserCheck, FaWallet, FaChartLine } from "react-icons/fa";

const steps = [
  {
    icon: <FaUserCheck className="text-neon-blue text-6xl mx-auto mb-4" />,
    title: "Create Your Account",
    description: "Sign up in just a few minutes and start exploring.",
  },
  {
    icon: <FaWallet className="text-neon-green text-6xl mx-auto mb-4" />,
    title: "Deposit Funds",
    description: "Securely deposit funds and prepare for trading.",
  },
  {
    icon: <FaChartLine className="text-yellow-400 text-6xl mx-auto mb-4" />,
    title: "Start Trading",
    description: "Trade cryptocurrencies with advanced tools and insights.",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto text-center">
        <motion.h2
          className="text-5xl font-bold mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          How It Works
        </motion.h2>
        <div className="grid grid-cols-3 gap-12">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="p-8 bg-gray-800 rounded shadow-lg hover:shadow-xl transition"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {step.icon}
              <h3 className="text-2xl font-bold">{step.title}</h3>
              <p className="text-gray-400 mt-2">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
