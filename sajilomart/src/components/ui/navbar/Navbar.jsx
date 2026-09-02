import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Toggle } from "./Toggle"; // use named export if Toggle.jsx uses export const Toggle
import Cartdrawer from "@/components/ui/navbar/Cartdrawer";
import { Scale, User, Menu, X } from "lucide-react";
import LogoutToggle from "./LogoutToggle";
import { useSelector } from "react-redux";

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.User);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-slate-200/50 dark:border-slate-800/50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl shadow-lg shadow-slate-900/5 dark:shadow-slate-950/20">
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo Section */}
          <Link
            to={"/"}
            className="group flex items-center gap-1.5 sm:gap-2.5 relative flex-shrink-0"
          >
            {/* Animated gradient background on hover */}
            <div className="absolute -inset-2 sm:-inset-4 rounded-2xl bg-gradient-to-r from-indigo-500/0 via-purple-500/0 to-pink-500/0 group-hover:from-indigo-500/10 group-hover:via-purple-500/10 group-hover:to-pink-500/10 blur-xl transition-all duration-500"></div>

            {/* Logo Icon */}
            <div className="relative">
              <div className="w-9 sm:w-11 h-9 sm:h-11 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 p-[2px] group-hover:scale-110 transition-transform duration-300">
                <div className="w-full h-full rounded-2xl bg-white dark:bg-slate-950 flex items-center justify-center">
                  <Scale
                    className="w-4 sm:w-6 h-4 sm:h-6 text-indigo-600 dark:text-indigo-400"
                    strokeWidth={2.5}
                  />
                </div>
              </div>
            </div>

            {/* Logo Text */}
            <span className="relative text-base sm:text-lg lg:text-2xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors duration-300 whitespace-nowrap">
              SajiloMart
            </span>
          </Link>

          {/* Navigation & Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Desktop Nav Links */}
            <ul className="hidden md:flex items-center gap-1">
              <li>
                <Link
                  to={"/"}
                  className="group relative px-2 lg:px-4 py-2 text-sm lg:text-lg font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  <span className="relative z-10">Home</span>
                  <div className="absolute inset-0 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </Link>
              </li>
              <li>
                <Link
                  to={"/About"}
                  className="group relative px-2 lg:px-4 py-2 text-sm lg:text-lg font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors duration-200"
                >
                  <span className="relative z-10">About</span>
                  <div className="absolute inset-0 rounded-lg bg-indigo-50 dark:bg-indigo-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </Link>
              </li>
              <li>
                <Link
                  to={"/Services"}
                  className="group relative px-2 lg:px-4 py-2 text-sm lg:text-lg font-semibold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200"
                >
                  <span className="relative z-10">Services</span>
                  <div className="absolute inset-0 rounded-lg bg-purple-50 dark:bg-purple-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                </Link>
              </li>
            </ul>

            {/* Mobile Menu Button */}
            <button
              onClick={toggleMobileMenu}
              className="md:hidden p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0"
            >
              {mobileMenuOpen ? (
                <X size={20} className="text-slate-600 dark:text-slate-400" />
              ) : (
                <Menu
                  size={20}
                  className="text-slate-600 dark:text-slate-400"
                />
              )}
            </button>

            {/* Action Buttons */}
            <div className="flex items-center gap-1.5 sm:gap-2">
              {isAuthenticated ? (
                <LogoutToggle user={user} />
              ) : (
                <Link
                  to="/Login"
                  className="p-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-shrink-0 flex items-center justify-center"
                >
                  <User
                    size={20}
                    strokeWidth={2}
                    className="text-slate-600 dark:text-slate-400"
                  />
                </Link>
              )}

              <Cartdrawer />

              <Toggle />
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-3 border-t border-slate-200 dark:border-slate-800">
            <ul className="flex flex-col gap-1 pt-3">
              <li>
                <Link
                  to={"/"}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-all duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to={"/About"}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-all duration-200"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  to={"/Services"}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 rounded-lg transition-all duration-200"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to={"/products"}
                  onClick={closeMobileMenu}
                  className="block px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/30 rounded-lg transition-all duration-200"
                >
                  Products
                </Link>
              </li>
            </ul>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
