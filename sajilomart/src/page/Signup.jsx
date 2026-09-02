import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from "react-router-dom";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";

const Signup = () => {
  const [enabled, setEnable] = useState(false);

  const { toast } = useToast();

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { name, email, phone, password } = e.target.elements;
    if (
      name.value.trim() === "" ||
      email.value.trim() === "" ||
      phone.value.trim() === "" ||
      password.value.trim() === ""
    ) {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return; // Stop execution here
    }

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/signup", {
        name: name.value,
        email: email.value,
        phone: phone.value,
        password: password.value,
      });

      const data = await res.data;

      toast({
        title: data.message,
      });

      navigate("/login");
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Signup failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-8 lg:p-10 space-y-6">
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-zinc-900 dark:text-white">
            ✨ Create Your Account
          </h1>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* full name */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="name"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                👤 Full Name
              </Label>
              <input
                id="name"
                type="text"
                name="name"
                placeholder="Enter your full name"
                className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
              />
            </div>

            {/* email */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="email"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                📧 Email Address
              </Label>
              <input
                id="email"
                type="email"
                name="email"
                placeholder="user@example.com"
                className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
              />
            </div>

            {/* phone */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="phone"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                📱 Phone Number
              </Label>
              <input
                id="phone"
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
              />
            </div>

            {/* password */}
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="password"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                🔒 Password
              </Label>
              <input
                id="password"
                type="password"
                name="password"
                placeholder="Enter your password"
                className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
              />
            </div>

            {/* Terms */}
            <div className="flex items-center gap-3 p-4 bg-blue-50 dark:bg-zinc-700/50 rounded-xl border border-blue-200 dark:border-zinc-600">
              <Checkbox id="terms" onCheckedChange={(e) => setEnable(e)} />
              <label
                htmlFor="terms"
                className="text-sm font-medium text-zinc-700 dark:text-zinc-300 cursor-pointer"
              >
                I agree to the{" "}
                <span className="font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline transition-colors duration-200">
                  Terms & Conditions
                </span>
              </label>
            </div>

            {/*------------------------------------ Button ---------------------*/}

            <Button
              disabled={!enabled}
              className={`w-full h-14 font-bold text-lg rounded-xl transition-all duration-200 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white shadow-lg hover:shadow-xl ${enabled ? "hover:scale-105 active:scale-95" : "cursor-not-allowed opacity-50"}`}
            >
              🚀 Register
            </Button>

            {/* Login */}
            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Already have an account?
              </span>
              {/* ------------------------Login Link ---------------------------------*/}
              <Link to="/Login">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all duration-200">
                  Login
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Signup;
