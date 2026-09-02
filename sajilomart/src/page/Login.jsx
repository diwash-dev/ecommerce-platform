import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Label } from "@radix-ui/react-dropdown-menu";
import React from "react";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserLogin } from "@/Redux/ReduxSlice/authslice";

const Login = () => {
  const { toast } = useToast();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = e.target.elements;
    if (email.value.trim() === "" || password.value.trim() === "") {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.post(import.meta.env.VITE_API_URL + "/login", {
        email: email.value,
        password: password.value,
      });

      const data = await res.data;

      dispatch(setUserLogin(data));

      toast({
        title: data.message,
      });
      navigate("/");
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Login failed",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white/95 dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-8 lg:p-10 space-y-8 backdrop-blur-sm">
          <h1 className="text-3xl lg:text-4xl font-extrabold text-center text-zinc-900 dark:text-white tracking-tight">
            👋 Sign in to your account
          </h1>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="Email"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                📧 Email Address
              </Label>
              <input
                id="email"
                type="email"
                placeholder="user@example.com"
                className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
              />
            </div>

            {/*  Password---------- */}

            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
                >
                  🔒 Password
                </Label>
                <Link to="/forgot-password">
                  <span className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline transition-all duration-200">
                    Forgot password?
                  </span>
                </Link>
              </div>
              <input
                id="password"
                type="password"
                placeholder="Enter your password"
                className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
              />
            </div>

            {/*------------------------------------ Button ---------------------*/}
            <Button className="w-full mt-2 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-200">
              🚀 Login
            </Button>

            <div className="flex items-center justify-center gap-2 pt-2">
              <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                Don't have an account?
              </span>
              {/* ------------------------Login Link ---------------------------------*/}
              <Link to="/Signup">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 hover:underline transition-all duration-200">
                  Sign up
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
