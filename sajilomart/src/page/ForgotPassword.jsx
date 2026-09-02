import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from "axios";
import React, { useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  // step 1=email, 2=otp, 3=new password, 4=success
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const otpRefs = useRef([]);

  // Step 1 — send OTP
  const handleSendOtp = async (e) => {
    e.preventDefault();
    if (email.trim() === "") {
      toast({ title: "Email is required", variant: "destructive" });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast({
        title: "Please enter a valid email address",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/send-otp", { email });
      toast({ title: "OTP sent to your email!" });
      setStep(2);
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Failed to send OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // OTP box handlers — auto-advance / backspace
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  // Step 2 — verify OTP only
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      toast({
        title: "Please enter the full 6-digit OTP",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/verify-otp", {
        email,
        otp: otpValue,
      });
      toast({ title: "OTP verified! Set your new password." });
      setStep(3);
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Invalid OTP",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Step 3 — reset password
  const handleReset = async (e) => {
    e.preventDefault();
    if (!newPassword || !confirmPassword) {
      toast({
        title: "Please fill in both password fields",
        variant: "destructive",
      });
      return;
    }
    if (newPassword !== confirmPassword) {
      toast({ title: "Passwords do not match", variant: "destructive" });
      return;
    }
    if (newPassword.length < 6) {
      toast({
        title: "Password must be at least 6 characters",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await axios.post(import.meta.env.VITE_API_URL + "/reset-password", {
        email,
        otp: otp.join(""),
        newPassword,
      });
      toast({ title: "Password reset successfully!" });
      setStep(4);
    } catch (error) {
      toast({
        title: error.response?.data?.message || "Failed to reset password",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7,_#fff_45%,_#e0f2fe)] dark:bg-[radial-gradient(circle_at_top,_#27272a,_#18181b_45%,_#09090b)] py-8 px-4 sm:px-6">
      <div className="mx-auto w-full max-w-5xl">
        <div className="grid overflow-hidden rounded-3xl border border-zinc-200/70 bg-white/85 shadow-[0_20px_70px_-30px_rgba(0,0,0,0.3)] backdrop-blur-sm dark:border-zinc-800 dark:bg-zinc-900/80 lg:grid-cols-[1fr_1.2fr]">
          <div className="relative hidden lg:flex flex-col justify-between p-10 bg-gradient-to-br from-amber-500 via-orange-500 to-rose-500 text-white">
            <div className="absolute -right-12 -top-12 h-48 w-48 rounded-full bg-white/15" />
            <div className="absolute -left-14 -bottom-16 h-56 w-56 rounded-full bg-black/10" />
            <div className="relative z-10 space-y-4">
              <p className="text-xs uppercase tracking-[0.24em] text-white/80">
                SajiloMart Secure Access
              </p>
              <h2 className="text-4xl font-black leading-tight">
                Reset Your Password Safely
              </h2>
              <p className="max-w-sm text-sm text-white/85">
                Verify your identity with OTP and set a fresh password in just a
                few steps.
              </p>
            </div>
            <div className="relative z-10 rounded-2xl border border-white/25 bg-white/10 p-4 text-sm">
              <p className="font-semibold">Security Tip</p>
              <p className="mt-1 text-white/85">
                Never share your OTP with anyone, even with support staff.
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 lg:p-10 space-y-8">
            {/* Step indicator */}
            {step < 4 && (
              <div className="rounded-2xl border border-zinc-200 bg-zinc-50/80 p-3 dark:border-zinc-700 dark:bg-zinc-800/70">
                <div className="flex items-center justify-center">
                  {["Email", "OTP", "Password"].map((label, i) => (
                    <React.Fragment key={label}>
                      <div className="flex flex-col items-center gap-1">
                        <div
                          className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
                            step === i + 1
                              ? "bg-orange-500 text-white shadow-md scale-110"
                              : step > i + 1
                                ? "bg-emerald-500 text-white"
                                : "bg-zinc-300 dark:bg-zinc-700 text-zinc-500"
                          }`}
                        >
                          {step > i + 1 ? "✓" : i + 1}
                        </div>
                        <span className="text-[11px] font-medium text-zinc-500 dark:text-zinc-400 hidden sm:block">
                          {label}
                        </span>
                      </div>
                      {i < 2 && (
                        <div
                          className={`mx-1 h-1 w-12 rounded-full transition-all duration-300 ${
                            step > i + 1
                              ? "bg-emerald-400"
                              : "bg-zinc-200 dark:bg-zinc-700"
                          }`}
                        />
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>
            )}

            {/* Icon */}
            <div className="flex justify-center">
              <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center shadow-lg shadow-orange-500/30 ring-4 ring-orange-100 dark:ring-zinc-700">
                <span className="text-3xl">
                  {step === 4 ? "🎉" : step === 3 ? "🔒" : "🔑"}
                </span>
              </div>
            </div>

            {step === 1 && (
              <>
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                    Forgot Password?
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Enter your registered email address.
                    <br />
                    We'll send you a 6-digit OTP.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleSendOtp}>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      📧 Email Address
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      className="w-full h-12 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:ring-orange-900/30"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-13 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-base font-bold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Sending OTP...
                      </span>
                    ) : (
                      "📨 Send OTP"
                    )}
                  </Button>

                  <div className="flex items-center justify-center gap-2">
                    <span className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
                      Remember your password?
                    </span>
                    <Link to="/Login">
                      <span className="text-sm font-bold text-orange-600 hover:underline dark:text-orange-400 transition-all duration-200">
                        Back to Login
                      </span>
                    </Link>
                  </div>
                </form>
              </>
            )}

            {/* ───── STEP 2: Enter OTP only ───── */}
            {step === 2 && (
              <>
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                    Verify OTP
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Enter the 6-digit OTP sent to{" "}
                    <span className="font-semibold text-orange-500">
                      {email}
                    </span>
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleVerifyOtp}>
                  <div className="flex flex-col gap-3">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      🔢 Enter OTP
                    </label>
                    <div className="flex justify-center gap-2 sm:gap-3">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => (otpRefs.current[i] = el)}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(e.target.value, i)}
                          onKeyDown={(e) => handleOtpKeyDown(e, i)}
                          style={{ height: "52px" }}
                          className="w-10 sm:w-11 text-center text-lg sm:text-xl font-bold rounded-xl border border-zinc-300 bg-zinc-50 text-zinc-900 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:ring-orange-900/30"
                        />
                      ))}
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setStep(1);
                        setOtp(["", "", "", "", "", ""]);
                      }}
                      className="text-xs text-orange-600 hover:underline text-center dark:text-orange-400"
                    >
                      Didn't receive OTP? Resend
                    </button>
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-13 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-base font-bold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Verifying...
                      </span>
                    ) : (
                      "✅ Verify OTP"
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* ───── STEP 3: New Password ───── */}
            {step === 3 && (
              <>
                <div className="text-center space-y-2">
                  <h1 className="text-3xl font-black tracking-tight text-zinc-900 dark:text-white">
                    Set New Password
                  </h1>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    OTP verified! Now create your new password.
                  </p>
                </div>

                <form className="space-y-6" onSubmit={handleReset}>
                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      🔒 New Password
                    </label>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      placeholder="Enter new password"
                      className="w-full h-12 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:ring-orange-900/30"
                    />
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-sm font-semibold text-zinc-700 dark:text-zinc-300">
                      🔒 Confirm Password
                    </label>
                    <input
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Re-enter new password"
                      className="w-full h-12 rounded-xl border border-zinc-300 bg-zinc-50 px-4 text-zinc-900 placeholder-zinc-400 outline-none transition-all duration-200 focus:border-orange-500 focus:ring-4 focus:ring-orange-100 dark:border-zinc-600 dark:bg-zinc-800 dark:text-white dark:focus:ring-orange-900/30"
                    />
                  </div>

                  <Button
                    type="submit"
                    disabled={loading}
                    className="h-13 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-base font-bold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl disabled:opacity-60"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8v8z"
                          />
                        </svg>
                        Saving...
                      </span>
                    ) : (
                      "💾 Save New Password"
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* ───── STEP 4: Success ───── */}
            {step === 4 && (
              <div className="space-y-6 text-center">
                <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-2xl bg-emerald-100 ring-4 ring-emerald-50 dark:bg-emerald-900/30 dark:ring-emerald-900/20">
                  <span className="text-4xl">✅</span>
                </div>
                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight text-zinc-900 dark:text-white">
                    Password Reset!
                  </h2>
                  <p className="text-sm text-zinc-500 dark:text-zinc-400">
                    Your password has been successfully updated.
                    <br />
                    You can now log in with your new password.
                  </p>
                </div>
                <Link to="/Login" className="block">
                  <Button className="h-13 w-full rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-base font-bold text-white shadow-lg transition-all duration-200 hover:from-orange-600 hover:to-orange-700 hover:shadow-xl">
                    🚀 Go to Login
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
