import { useTheme } from "@/components/provider/theme-provider";

export function Toggle() {
  const { theme, setTheme } = useTheme();

  const isDark = theme === "dark";

  const handleToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

  return (
    <>
      <style jsx>{`
        .theme-switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 26px;
        }

        .theme-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%);
          transition: all 0.3s ease;
          border-radius: 50px;
          box-shadow: 0 2px 10px rgba(251, 191, 36, 0.3);
        }

        .slider:hover {
          box-shadow: 0 4px 16px rgba(251, 191, 36, 0.4);
          transform: scale(1.02);
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 20px;
          width: 20px;
          border-radius: 50%;
          left: 3px;
          bottom: 3px;
          z-index: 2;
          background: linear-gradient(135deg, #ffffff 0%, #f8fafc 100%);
          transition: all 0.3s ease;
          box-shadow:
            0 2px 8px rgba(0, 0, 0, 0.15),
            inset 0 -2px 4px rgba(0, 0, 0, 0.05);
        }

        .sun-icon svg {
          position: absolute;
          top: 5px;
          left: 27px;
          z-index: 1;
          width: 14px;
          height: 14px;
          transition: all 0.3s ease;
        }

        .moon-icon svg {
          fill: #1e293b;
          position: absolute;
          top: 6px;
          left: 5px;
          z-index: 1;
          width: 14px;
          height: 14px;
          transition: all 0.3s ease;
        }

        .theme-switch:hover .sun-icon svg {
          animation: rotate 8s linear infinite;
          filter: drop-shadow(0 0 3px #ffd43b);
        }

        @keyframes rotate {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }

        .theme-switch:hover .moon-icon svg {
          animation: tilt 4s ease-in-out infinite;
          filter: drop-shadow(0 0 3px white);
        }

        @keyframes tilt {
          0% {
            transform: rotate(0deg);
          }
          25% {
            transform: rotate(-12deg);
          }
          75% {
            transform: rotate(12deg);
          }
          100% {
            transform: rotate(0deg);
          }
        }

        .theme-input:checked + .slider {
          background: linear-gradient(135deg, #6366f1 0%, #4f46e5 100%);
          box-shadow: 0 2px 10px rgba(99, 102, 241, 0.4);
        }

        .theme-input:checked + .slider:hover {
          box-shadow: 0 4px 16px rgba(99, 102, 241, 0.5);
        }

        .theme-input:focus + .slider {
          box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.3);
        }

        .theme-input:checked + .slider:before {
          transform: translateX(22px);
        }

        .theme-input:checked ~ .sun-icon svg {
          opacity: 1;
          transform: scale(1);
        }

        .theme-input:checked ~ .moon-icon svg {
          opacity: 0;
          transform: scale(0.5);
        }

        .theme-input:not(:checked) ~ .sun-icon svg {
          opacity: 0;
          transform: scale(0.5);
        }

        .theme-input:not(:checked) ~ .moon-icon svg {
          opacity: 1;
          transform: scale(1);
        }
      `}</style>

      <label className="theme-switch">
        <input
          type="checkbox"
          className="theme-input"
          checked={isDark}
          onChange={handleToggle}
        />
        <span className="slider"></span>
        <span className="moon-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512">
            <path d="m223.5 32c-123.5 0-223.5 100.3-223.5 224s100 224 223.5 224c60.6 0 115.5-24.2 155.8-63.4 5-4.9 6.3-12.5 3.1-18.7s-10.1-9.7-17-8.5c-9.8 1.7-19.8 2.6-30.1 2.6-96.9 0-175.5-78.8-175.5-176 0-65.8 36-123.1 89.3-153.3 6.1-3.5 9.2-10.5 7.7-17.3s-7.3-11.9-14.3-12.5c-6.3-.5-12.6-.8-19-.8z"></path>
          </svg>
        </span>
        <span className="sun-icon">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
            <g fill="#ffd43b">
              <circle r="5" cy="12" cx="12"></circle>
              <path d="m21 13h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm-17 0h-1a1 1 0 0 1 0-2h1a1 1 0 0 1 0 2zm13.66-5.66a1 1 0 0 1 -.66-.29 1 1 0 0 1 0-1.41l.71-.71a1 1 0 1 1 1.41 1.41l-.71.71a1 1 0 0 1 -.75.29zm-12.02 12.02a1 1 0 0 1 -.71-.29 1 1 0 0 1 0-1.41l.71-.66a1 1 0 0 1 1.41 1.41l-.71.71a1 1 0 0 1 -.7.24zm6.36-14.36a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm0 17a1 1 0 0 1 -1-1v-1a1 1 0 0 1 2 0v1a1 1 0 0 1 -1 1zm-5.66-14.66a1 1 0 0 1 -.7-.29l-.71-.71a1 1 0 0 1 1.41-1.41l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.29zm12.02 12.02a1 1 0 0 1 -.7-.29l-.66-.71a1 1 0 0 1 1.36-1.36l.71.71a1 1 0 0 1 0 1.41 1 1 0 0 1 -.71.24z"></path>
            </g>
          </svg>
        </span>
      </label>
    </>
  );
}
