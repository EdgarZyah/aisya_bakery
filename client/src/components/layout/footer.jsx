import React from "react";

const Footer = () => {
  return (
    <footer className="bg-primary text-[var(--color-text)] shadow-inner mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
          <div className="text-sm font-semibold text-purewhite">
            &copy; {new Date().getFullYear()} BrandName. All rights reserved.
          </div>
          <div className="flex space-x-6">
            <a
              href="#"
              className="text-purewhite hover:text-text transition"
              aria-label="Instagram"
            >
              Instagram
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
