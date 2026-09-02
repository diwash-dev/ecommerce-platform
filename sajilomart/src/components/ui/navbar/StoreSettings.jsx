import React, { useState } from "react";
import axios from "axios";
import { Input } from "../input";
import { Button } from "../button";
import { useToast } from "@/hooks/use-toast";
import Error from "@/hooks/Error";

const StoreSettings = () => {
  const { toast } = useToast();

  const { handleErrorLogout } = Error();

  // Change username function
  const changeUsername = async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const newusername = formData.get("newusername");

    if (!newusername) {
      toast({
        title: "Change username is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const res = await axios.put(
        import.meta.env.VITE_API_URL + "/change-username",
        {
          newUsername: newusername,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = res.data;
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      e.target.reset();
      return toast({
        title: "Username changed successfully!",
        description: data.message,
      });
    } catch (error) {
      return handleErrorLogout(error);
    }
  };

  // Change password function
  const changePassword = async (e) => {
    e.preventDefault();

    if (!newpassword || !oldpassword) {
      toast({
        title: "Change password is required",
        variant: "destructive",
      });
      return;
    }

    try {
      const userStr = localStorage.getItem("user");
      if (!userStr || userStr === "undefined") {
        toast({
          title: "Please login again",
          variant: "destructive",
        });
        return;
      }

      const userData = JSON.parse(userStr);

      const res = await axios.put(
        import.meta.env.VITE_API_URL + "/change-password",
        {
          username: userData.username,
          newPassword: newpassword,
          previousPassword: oldpassword,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        },
      );
      const data = res.data;
      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }
      setNewPassword("");
      setOldPassword("");
      return toast({
        title: "Password changed successfully!",
        description: data.message,
      });
    } catch (error) {
      return handleErrorLogout(error);
    }
  };

  // Password state variables
  const [newpassword, setNewPassword] = useState("");
  const [oldpassword, setOldPassword] = useState("");

  return (
    <div className="  grid grid-cols-1 rounded-2xl justify-center items-start gap-6 sm:gap-8 w-full min-h-screen p-4 sm:p-6 lg:p-8 bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 dark:from-zinc-900 dark:via-zinc-800 dark:to-zinc-900 max-w-4xl mx-auto">
      <div className=" mb-4 sm:mb-6 text-center">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl xl:text-5xl font-bold bg-gradient-to-r from-orange-500 to-orange-600 bg-clip-text text-transparent mb-2 sm:mb-3">
          ⚙️ Account Settings
        </h1>
        <p className="text-sm sm:text-base text-zinc-600 dark:text-zinc-400">
          Update your username and password
        </p>
      </div>
      {/* Username Section */}
      <div className="flex-1 bg-white dark:bg-zinc-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl border-2 border-zinc-200 dark:border-zinc-700 hover:shadow-2xl transition-all duration-300">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
          👤 Change Username
        </h3>
        <form onSubmit={changeUsername} className="grid gap-4 sm:gap-5">
          <Input
            type="text"
            placeholder="✨ Enter new username"
            name="newusername"
            className="h-11 sm:h-12 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl px-4 py-2 bg-zinc-50 dark:bg-zinc-900 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/30 transition-all"
          />
          <Button
            type="submit"
            className="w-full h-12 sm:h-14 flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-xl
                    bg-gradient-to-r from-orange-500 to-orange-600
                   hover:from-orange-600 hover:to-orange-700
                   shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
                        transition-all duration-200"
          >
            💾 Update Username
          </Button>
        </form>
      </div>

      {/* Password Section */}
      <div className="flex-1 bg-white dark:bg-zinc-800 rounded-2xl p-5 sm:p-6 lg:p-8 shadow-xl border-2 border-zinc-200 dark:border-zinc-700 hover:shadow-2xl  transition-all duration-300">
        <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-5 bg-gradient-to-r from-blue-500 to-blue-600 bg-clip-text text-transparent flex items-center gap-2">
          🔒 Change Password
        </h3>

        {/*onSubmit added to form */}
        <form onSubmit={changePassword} className="grid gap-4 sm:gap-5">
          <Input
            type="password"
            placeholder="🆕 Enter new password"
            name="newpassword"
            value={newpassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="h-11 sm:h-12 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl px-4 py-2 bg-zinc-50 dark:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 transition-all"
          />

          <Input
            type="password"
            placeholder="🔑 Enter old password"
            name="oldpassword"
            value={oldpassword}
            onChange={(e) => setOldPassword(e.target.value)}
            className="h-11 sm:h-12 border-2 border-zinc-300 dark:border-zinc-600 rounded-xl px-4 py-2 bg-zinc-50 dark:bg-zinc-900 focus:border-orange-500 dark:focus:border-orange-400 focus:ring-4 focus:ring-orange-100 dark:focus:ring-orange-900/30 transition-all"
          />

          <Button
            type="submit"
            className="w-full h-12 sm:h-14 flex items-center justify-center gap-2 px-6 py-3 font-semibold text-white rounded-xl
                    bg-gradient-to-r from-orange-500 to-orange-600
                   hover:from-orange-600 hover:to-orange-700
                   shadow-lg hover:shadow-xl hover:scale-105 active:scale-95
                        transition-all duration-200"
          >
            💾 Update Password
          </Button>
        </form>
      </div>
    </div>
  );
};

export default StoreSettings;
