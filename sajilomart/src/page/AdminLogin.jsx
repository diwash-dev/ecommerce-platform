import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { setUserLogin } from "@/Redux/ReduxSlice/authslice";
import { useToast } from "@/hooks/use-toast";

const AdminLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();

    const username = e.target.adminid.value.trim();
    const password = e.target.sekretkey.value.trim();

    if (username === "" || password === "") {
      toast({
        title: "All fields are required",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.post(
        import.meta.env.VITE_API_URL + "/adminlogin",
        { username, password },
      );

      const data = res.data;

      dispatch(setUserLogin(data));

      toast({ title: data.message });

      navigate("/dashboard");
    } catch (error) {
      const message = error?.response?.data?.message || "Admin login failed";

      toast({
        title: error.response?.data?.message || "Admin login failed",
        variant: "destructive",
      });
    }
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 py-12 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-zinc-800 rounded-2xl shadow-2xl border border-zinc-200 dark:border-zinc-700 p-8 lg:p-10 space-y-8">
          <h1 className="text-3xl lg:text-4xl font-bold text-center text-zinc-900 dark:text-white">
            🔐 Admin Login
          </h1>

          <form className="space-y-6" onSubmit={handleLogin}>
            <div className="flex flex-col gap-2">
              <Label
                htmlFor="adminid"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                👤 Admin ID
              </Label>
              <input
                id="adminid"
                name="adminid"
                type="text"
                placeholder="Enter your admin ID"
                className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
              />
            </div>

            {/*  Password---------- */}

            <div className="flex flex-col gap-2">
              <Label
                htmlFor="sekretkey"
                className="text-sm font-semibold text-zinc-700 dark:text-zinc-300"
              >
                🔑 Secret Key
              </Label>
              <input
                id="sekretkey"
                name="sekretkey"
                type="password"
                placeholder="Enter your secret key"
                className="w-full h-12 px-4 rounded-xl border-2 border-zinc-300 dark:border-zinc-600 bg-zinc-50 dark:bg-zinc-900 text-zinc-900 dark:text-white placeholder-zinc-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all duration-200"
              />
            </div>

            {/*------------------------------------ Button ---------------------*/}

            <Button
              type="submit"
              className="w-full mt-2 h-14 bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white font-bold text-lg rounded-xl shadow-lg hover:shadow-xl  transition-all duration-200"
            >
              🚀 Login
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
