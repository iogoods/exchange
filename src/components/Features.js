import React from "react";
import { motion } from "framer-motion";
import { FaShieldAlt, FaWallet, FaChartLine } from "react-icons/fa";

const Features = () => {
  const features = [
    {
      icon: <FaShieldAlt className="text-neon-blue text-6xl mx-auto mb-4" />,
      title: "Top-Notch Security",
      description: "Your assets are protected with industry-leading security measures.",
    },
    {
      icon: <FaWallet className="text-neon-green text-6xl mx-auto mb-4" />,
      title: "Smart Wallets",
      description: "Store, send, and receive crypto with ease.",
    },
    {
      icon: <FaChartLine className="text-yellow-400 text-6xl mx-auto mb-4" />,
      title: "Advanced Trading Tools",
      description: "Powerful charts and indicators to help you trade like a pro.",
    },
  ];

  return (
    <section className="py-16 bg-gray-900 text-white">
      <div className="container mx-auto text-center">
        <motion.h2
          className="text-4xl font-bold mb-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          Why Choose Us?
        </motion.h2>
        <div className="grid grid-cols-3 gap-12">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-800 rounded shadow-lg hover:shadow-xl transition"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              {feature.icon}
              <h3 className="text-2xl font-bold">{feature.title}</h3>
              <p className="text-gray-400 mt-2">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
