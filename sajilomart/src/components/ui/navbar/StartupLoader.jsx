import React from "react";

const StartupLoader = () => {
  const shellBg = {
    background:
      "radial-gradient(circle at 20% 20%, #f4fbff 0%, #eaf4ff 36%, #dbe8ff 68%, #cbd5ff 100%)",
  };

  const hazeLayer = {
    background:
      "linear-gradient(120deg, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.06) 45%, rgba(255,255,255,0.32) 100%)",
  };

  return (
    <div className="fixed inset-0 z-[9999] overflow-hidden" style={shellBg}>
      <style>
        {`
          @keyframes loaderMorph {
            0% {
              transform: translate(0px, 0px) scale(1) rotate(0deg);
              border-radius: 42% 58% 48% 52% / 58% 36% 64% 42%;
            }
            33% {
              transform: translate(28px, -24px) scale(1.14) rotate(70deg);
              border-radius: 58% 42% 62% 38% / 40% 58% 42% 60%;
            }
            66% {
              transform: translate(-22px, 14px) scale(0.9) rotate(140deg);
              border-radius: 34% 66% 36% 64% / 52% 44% 56% 48%;
            }
            100% {
              transform: translate(0px, 0px) scale(1) rotate(200deg);
              border-radius: 42% 58% 48% 52% / 58% 36% 64% 42%;
            }
          }

          @keyframes cardFloat {
            0%,
            100% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-7px);
            }
          }

          @keyframes barSlide {
            0% {
              transform: translateX(-92%);
            }
            100% {
              transform: translateX(230%);
            }
          }

          @keyframes softPulse {
            0%,
            100% {
              opacity: 0.5;
            }
            50% {
              opacity: 1;
            }
          }

          @media (prefers-reduced-motion: reduce) {
            .loader-morph,
            .loader-card,
            .loader-bar,
            .loader-pulse {
              animation: none !important;
            }
          }
        `}
      </style>

      <div className="absolute inset-0" style={hazeLayer} />

      <div
        className="loader-morph absolute -left-24 top-8 h-72 w-72 bg-cyan-300/45 blur-3xl"
        style={{ animation: "loaderMorph 12s ease-in-out infinite" }}
      />
      <div
        className="loader-morph absolute -right-20 bottom-6 h-80 w-80 bg-indigo-300/38 blur-3xl"
        style={{ animation: "loaderMorph 11s ease-in-out infinite reverse" }}
      />
      <div
        className="loader-morph absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 bg-sky-200/42 blur-3xl"
        style={{ animation: "loaderMorph 14s ease-in-out infinite" }}
      />

      <div className="relative flex h-full items-center justify-center px-4">
        <section
          className="loader-card w-full max-w-md rounded-[2rem] border border-white/70 bg-white/40 p-6 text-center shadow-[0_22px_65px_rgba(15,23,42,0.22)] backdrop-blur-2xl sm:p-8"
          style={{ animation: "cardFloat 4.8s ease-in-out infinite" }}
        >
          <div className="mx-auto h-14 w-14 rounded-2xl border border-white/70 bg-white/50 p-1 shadow-[0_8px_28px_rgba(14,116,144,0.24)]">
            <div className="flex h-full w-full items-center justify-center rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 text-sm font-bold tracking-[0.15em] text-white">
              SM
            </div>
          </div>

          <h1
            className="mt-5 text-3xl font-semibold tracking-tight text-slate-900"
            style={{ fontFamily: '"Avenir Next", "Segoe UI", sans-serif' }}
          >
            SajiloMart
          </h1>
          <p className="mt-2 text-sm text-slate-700/90">
            Curating fresh picks and securing your checkout journey
          </p>

          <div className="mt-6 overflow-hidden rounded-full border border-white/70 bg-white/60">
            <div
              className="loader-bar h-2 w-1/3 rounded-full bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600"
              style={{ animation: "barSlide 2.1s linear infinite" }}
            />
          </div>

          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-medium uppercase tracking-[0.2em] text-slate-600">
            <span>Loading</span>
            <span
              className="loader-pulse h-1.5 w-1.5 rounded-full bg-cyan-600"
              style={{ animation: "softPulse 1.1s ease-in-out infinite" }}
            />
            <span
              className="loader-pulse h-1.5 w-1.5 rounded-full bg-cyan-600"
              style={{
                animation: "softPulse 1.1s ease-in-out infinite",
                animationDelay: "0.16s",
              }}
            />
            <span
              className="loader-pulse h-1.5 w-1.5 rounded-full bg-cyan-600"
              style={{
                animation: "softPulse 1.1s ease-in-out infinite",
                animationDelay: "0.32s",
              }}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default StartupLoader;
