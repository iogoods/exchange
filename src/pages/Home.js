import React from "react";
import Hero from "../components/Hero";
import Features from "../components/Features";
import MarketData from "../components/MarketData";
import Testimonials from "../components/Testimonials";
import JoinCommunity from "../components/JoinCommunity";
import LivePrice from "../components/LivePrice";
import { coins } from "../data/coinData";

const Home = () => {
  return (
    <div>
      {/* Hero Section */}
      <Hero />

      {/* Features Section */}
      <Features />

      {/* Live Prices Section */}
      <section className="bg-gray-900 py-16">
        <div className="container mx-auto text-center">
          <h2 className="text-5xl font-bold text-neon-blue mb-12">
            Live Cryptocurrency Prices
          </h2>
          <div className="grid grid-cols-4 gap-6">
            {coins.map((coin) => (
              <LivePrice key={coin.symbol} symbol={coin.symbol} />
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Join Community Section */}
      <JoinCommunity />
    </div>
  );
};

export default Home;
