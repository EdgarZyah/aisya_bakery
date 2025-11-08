import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-[var(--color-text)] shadow-inner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm font-semibold text-purewhite">
            &copy; {new Date().getFullYear()} Aisya Bakery. All rights reserved.
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
