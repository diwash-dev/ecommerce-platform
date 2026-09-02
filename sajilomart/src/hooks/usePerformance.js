/**
 * Performance Monitoring Utilities
 * Use these to measure and debug performance improvements
 */

// ============== FRONTEND PERFORMANCE HOOKS ==============

/**
 * Hook to measure component render time
 * Usage: usePerformance('ComponentName');
 */
import { useEffect, useRef } from "react";

export const usePerformance = (label) => {
  const startRef = useRef(performance.now());

  useEffect(() => {
    const duration = performance.now() - startRef.current;
    // Only log if taking longer than 16ms (one frame)
    if (duration > 16) {
      console.log(`[Performance] ${label}: ${duration.toFixed(2)}ms`);
    }
    return () => {
      const cleanupDuration = performance.now() - startRef.current;
      if (cleanupDuration > 16) {
        console.log(
          `[Performance] ${label} cleanup: ${cleanupDuration.toFixed(2)}ms`,
        );
      }
    };
  }, [label]);
};

/**
 * Hook to track re-renders
 * Usage: useRenderTracker('ComponentName');
 */
import { useRef } from "react";

export const useRenderTracker = (label) => {
  const renderCount = useRef(0);
  renderCount.current += 1;

  useEffect(() => {
    console.log(
      `[Render] ${label} mounted/rendered: ${renderCount.current} times`,
    );
  });
};

// ============== BACKEND PERFORMANCE MIDDLEWARE ==============

/**
 * Express middleware for API timing
 * Usage: app.use(performanceMiddleware);
 */
const performanceMiddleware = (req, res, next) => {
  const start = Date.now();
  const requestId = Math.random().toString(36).substr(2, 9);

  res.on("finish", () => {
    const duration = Date.now() - start;
    const logData = {
      method: req.method,
      path: req.path,
      status: res.statusCode,
      duration: `${duration}ms`,
      requestId,
    };

    if (duration > 1000) {
      // Slow request warning
      console.warn(`[SLOW API]`, logData);
    } else {
      console.log(`[API]`, logData);
    }
  });

  next();
};

module.exports = { performanceMiddleware, usePerformance, useRenderTracker };

// ============== USAGE EXAMPLES ==============

/*
// In React components:
import { usePerformance, useRenderTracker } from '@/hooks/usePerformance';

const ProductList = () => {
  usePerformance('ProductList');
  useRenderTracker('ProductList');
  
  // ... component code
};

// In Express server (index.js):
const { performanceMiddleware } = require('./middleware/performance');
app.use(performanceMiddleware);
*/

// ============== QUICK PERFORMANCE CHECK ==============

/**
 * Run this in browser console to check current performance
 */
const quickPerformanceCheck = () => {
  console.group("📊 Performance Report");

  // Navigation timing
  const nav = performance.getEntriesByType("navigation")[0];
  if (nav) {
    console.log("Page Load:", {
      DNS: `${nav.domainLookupEnd - nav.domainLookupStart}ms`,
      TCP: `${nav.connectEnd - nav.connectStart}ms`,
      TTFB: `${nav.responseStart - nav.requestStart}ms`,
      Download: `${nav.responseEnd - nav.responseStart}ms`,
      Total: `${nav.loadEventEnd - nav.navigationStart}ms`,
    });
  }

  // Resource timing
  const resources = performance.getEntriesByType("resource");
  const images = resources.filter((r) =>
    r.name.match(/\.(jpg|png|webp|avif)/i),
  );
  const totalImageSize = images.reduce((acc, r) => acc + r.transferSize, 0);

  console.log("Images:", {
    count: images.length,
    totalSize: `${(totalImageSize / 1024).toFixed(2)}KB`,
  });

  console.log(
    "Memory:",
    window.performance?.memory
      ? {
          used: `${(window.performance.memory.usedJSHeapSize / 1048576).toFixed(2)}MB`,
          total: `${(window.performance.memory.totalJSHeapSize / 1048576).toFixed(2)}MB`,
        }
      : "Not available",
  );

  console.groupEnd();
};

// Auto-run on console
if (typeof window !== "undefined") {
  window.perfCheck = quickPerformanceCheck;
  console.log(
    "%c Run window.perfCheck() for performance report ",
    "background: #22c55e; color: white; padding: 4px 8px; border-radius: 4px;",
  );
}
