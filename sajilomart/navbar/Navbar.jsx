import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Toggle } from "./Toggle"; // use named export if Toggle.jsx uses export const Toggle
import Cartdrawer from "@/components/ui/navbar/Cartdrawer";
import { Scale, User } from "lucide-react";
import { useSelector } from "react-redux";
import LogoutToggle from "@/components/ui/navbar/LogoutToggle";

const Navbar = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

  return (
    <nav className="flex items-center px-8  py-4 border-b dark:bg-slate-800">
      {/* Left side: Logo */}
      <Link to={"/"} className="text-2xl font-bold">
        SAJILOMART
      </Link>

      {/* Right side: Links + Toggle */}
      <div className="flex items-center gap-4  justify-center ml-auto">
        {" "}
        {/* ml-auto pushes this div to right*/}
        <ul className="hidden sm:flex gap-2 text-2xl">
          <li>
            <Link to={"/"}>About</Link>
          </li>
          <li>
            <Link to={"/"}>Portfolio</Link>
          </li>
        </ul>
        {isAuthenticated ? (
          <LogoutToggle user={user} />
        ) : (
          <Link to="/Login">
            <User
              size={30}
              strokewidth={1.4}
              className="text-gray-900 dark:text-white hover:scale-125 transition-all ease-in-out cursor-pointer  "
            />
          </Link>
        )}
        <Cartdrawer />
        <Toggle /> {/* Dark Mode / theme toggle */}
      </div>
    </nav>
  );
};

export default Navbar;
