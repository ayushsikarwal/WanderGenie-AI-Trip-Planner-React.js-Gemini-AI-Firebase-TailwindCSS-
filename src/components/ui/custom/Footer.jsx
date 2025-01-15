import React from "react";
import { FaInstagram } from "react-icons/fa";
import { FaLinkedin } from "react-icons/fa";
function Footer() {
    return (
      <footer className="fixed bottom-0 w-full bg-gradient-to-r from-[#f56551] to-[#ff7b6a] shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-[30px] sm:h-[35px]">
            <p className="text-xs sm:text-sm font-semibold text-white">
              © 2025{" "}
              <span className="font-bold hover:text-gray-100 transition-colors">
                AYUSH SIKARWAL
              </span>
              . All rights reserved
            </p>
            
            <div className="flex items-center space-x-4 text-xs sm:text-sm">
              <a href="/privacy" className="text-white hover:text-gray-200 transition-colors">
                Privacy
              </a>
              <a href="/terms" className="text-white hover:text-gray-200 transition-colors">
                Terms
              </a>
            </div>
          </div>
        </div>
      </footer>
    );
  }
export default Footer;
