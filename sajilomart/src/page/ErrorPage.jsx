import React from "react";
import { Link } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

const ErrorPage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-violet-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex flex-col justify-center items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        {/* my code - Card wrapper with styling */}
        <Card className="border-0 p-0 rounded-xl overflow-hidden bg-white dark:bg-zinc-800 shadow-sm hover:shadow-xl transition-all duration-300">
          {/* my code - Header section with error info */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 dark:from-zinc-700 dark:to-zinc-700/50 px-6 py-6 border-b border-white/20 dark:border-zinc-700">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              {/* my code - Error icon and message */}
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <div className="p-3 bg-white/20 dark:bg-white/10 rounded-full">
                    <AlertCircle
                      size={32}
                      className="text-white dark:text-white"
                      strokeWidth={1.5}
                    />
                  </div>
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-base text-white dark:text-white line-clamp-2">
                    Page Not Found
                  </h3>
                  <p className="text-xs text-blue-100 dark:text-zinc-400 mt-1">
                    Error: <span className="font-semibold">404</span>
                  </p>
                </div>
              </div>

              {/* my code - Error code display */}
              <div className="flex flex-col sm:items-end gap-1">
                <p className="text-3xl font-bold text-white dark:text-white">
                  404
                </p>
                <span className="inline-flex items-center px-3 py-1 bg-white/20 dark:bg-blue-900/30 text-white dark:text-blue-300 rounded-full text-xs font-semibold w-fit border border-white/30 dark:border-blue-700">
                  Not Found
                </span>
              </div>
            </div>
          </div>

          {/* my code - Details section with error info */}
          <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-700">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {/* my code - Error status */}
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg border border-zinc-200 dark:border-zinc-600">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <AlertCircle
                    size={18}
                    className="text-blue-600 dark:text-blue-400"
                  />
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    Status
                  </p>
                  <p className="font-bold text-sm text-blue-700 dark:text-blue-400">
                    Error
                  </p>
                </div>
              </div>

              {/* my code - Error cause */}
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg border border-zinc-200 dark:border-zinc-600">
                <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">
                    !
                  </span>
                </div>
                <div>
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    Issue
                  </p>
                  <p className="font-bold text-sm text-zinc-900 dark:text-white">
                    Missing
                  </p>
                </div>
              </div>

              {/* my code - Resolution action */}
              <div className="flex items-center gap-3 p-3 bg-zinc-50 dark:bg-zinc-700/50 rounded-lg border border-zinc-200 dark:border-zinc-600">
                <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">
                    →
                  </span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                    Action
                  </p>
                  <p className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                    Go Home
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* my code - Footer with amount and button */}
          <div className="px-6 py-5 flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-zinc-800 dark:to-zinc-800 border-t border-blue-200 dark:border-zinc-700 rounded-b-xl">
            <div>
              <p className="text-xs text-zinc-600 dark:text-zinc-400 font-medium">
                Next Step
              </p>
              <p className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mt-1">
                Return Home
              </p>
            </div>
            <Link
              to="/"
              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium text-sm transition-all duration-200 shadow-md hover:shadow-lg hover:scale-105 active:scale-95"
            >
              Go Home
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default ErrorPage;
