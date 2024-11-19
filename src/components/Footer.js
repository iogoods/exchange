import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-400 py-8">
      <div className="container mx-auto text-center">
        <p>© 2024 Crypto Exchange. All rights reserved.</p>
        <div className="mt-4">
          <a href="#" className="hover:text-neon-blue mx-2">Privacy Policy</a>
          <a href="#" className="hover:text-neon-blue mx-2">Terms of Service</a>
          <a href="#" className="hover:text-neon-blue mx-2">Support</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
