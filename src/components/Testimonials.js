import React from "react";
import { motion } from "framer-motion";

const testimonials = [
  {
    quote: "This platform is fantastic! The tools and insights are unmatched.",
    name: "John Doe",
    position: "Crypto Trader",
  },
  {
    quote: "I’ve never felt safer trading my assets. Highly recommended.",
    name: "Jane Smith",
    position: "Blockchain Enthusiast",
  },
  {
    quote: "The real-time data and charts are game changers for traders.",
    name: "Sam Wilson",
    position: "Professional Trader",
  },
];

const Testimonials = () => {
  return (
    <section className="py-16 bg-gray-800 text-white">
      <div className="container mx-auto text-center">
        <motion.h2
          className="text-5xl font-bold mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
        >
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-3 gap-12">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="p-6 bg-gray-900 rounded shadow-lg hover:shadow-xl transition"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
            >
              <p className="text-gray-400 italic">"{testimonial.quote}"</p>
              <h3 className="text-xl font-bold mt-4">{testimonial.name}</h3>
              <p className="text-gray-500">{testimonial.position}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
