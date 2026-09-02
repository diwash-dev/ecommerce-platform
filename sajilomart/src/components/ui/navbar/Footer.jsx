import React from "react";
import { FacebookIcon, Twitter, Youtube } from "lucide-react";
import { Linkedin } from "lucide-react";
import { Github } from "lucide-react";
const Footer = () => {
  return (
    <footer className="bg-customGray dark:bg-zinc-900 py-10 sm:py-14">
      <div className="container mx-auto px-4">
        {/* Middle Section: Stay Connected + Customer Care */}
        <div className="flex flex-col  gap-10 sm:gap-14 md:flex-row md:justify-center md:space-x-40">
          {/* Stay Connected */}
          <div className="flex flex-col items-center">
            <h5 className="text-xl font-bold mb-6 dark:text-white">
              Follow Us
            </h5>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Github size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Twitter size={20} />
              </a>
              <a
                href="#"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-white dark:bg-zinc-800 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition"
              >
                <Linkedin size={20} />
              </a>
            </div>
          </div>

          {/* Customer Care
          <div className="flex flex-col items-center">
            <h5 className="text-xl font-bold mb-6 dark:text-white">Customer Care</h5>
            <ul className="list-none text-center">
              {["Support", "Help Center", "Contact Us", "How to Buy"].map((item) => (
                <li key={item} className="mb-2">
                  <a
                    href="#"
                    className="border-b border-transparent hover:border-gray-400 hover:text-gray-700 dark:hover:text-gray-300 transition"
                  >
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div> */}
        </div>

        {/* Footer Bottom */}
        <div className="mt-10 pt-6 border-t border-gray-300 dark:border-gray-600 text-center">
          <p className="text-sm dark:text-gray-300">
            <em>© 2026 SAJILOMART. All Rights Reserved.</em>
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
