import { useState, useCallback } from "react";

/**
 * Optimized Image Component
 * - Lazy loading support
 * - Cloudinary URL optimization (f_auto, q_auto)
 * - Responsive srcSet generation
 * - Placeholder/skeleton while loading
 * - Error fallback handling
 */
const OptimizedImage = ({
  src,
  alt,
  className = "",
  width,
  height,
  aspectRatio = "4/3",
  placeholder = "/placeholder.jpg",
  cloudName = null, // Set your Cloudinary cloud name
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);

  // Generate optimized Cloudinary URL with transformations
  const getOptimizedUrl = useCallback(
    (url, targetWidth = 800) => {
      if (!url) return placeholder;

      // Check if Cloudinary URL
      if (url.includes("cloudinary.com") && cloudName) {
        // Add Cloudinary transformations
        return url.replace(
          "/upload/",
          `/upload/w_${targetWidth},f_auto,q_auto,c_fill/`,
        );
      }

      // For other URLs, just return as-is (they should be optimized externally)
      return url;
    },
    [cloudName, placeholder],
  );

  // Generate srcSet for responsive images
  const getSrcSet = useCallback(
    (url) => {
      if (!url || !cloudName) return "";

      const widths = [400, 800, 1200, 1600];
      return widths.map((w) => `${getOptimizedUrl(url, w)} ${w}w`).join(", ");
    },
    [cloudName, getOptimizedUrl],
  );

  const handleLoad = () => setIsLoaded(true);
  const handleError = () => setHasError(true);

  const displaySrc = hasError
    ? placeholder
    : getOptimizedUrl(src, width || 800);

  return (
    <div
      className="relative overflow-hidden bg-gray-100"
      style={{ aspectRatio }}
    >
      {/* Skeleton placeholder - shown while loading */}
      {!isLoaded && !hasError && (
        <div
          className="absolute inset-0 bg-gray-200 animate-pulse"
          style={{
            backgroundImage: `linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)`,
            backgroundSize: "200% 100%",
            animation: "shimmer 1.5s infinite",
          }}
        />
      )}

      <img
        src={displaySrc}
        alt={alt}
        className={`${className} ${isLoaded ? "opacity-100" : "opacity-0"} transition-opacity duration-300`}
        loading="lazy"
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        width={width}
        height={height}
        srcSet={cloudName ? getSrcSet(src) : undefined}
        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
      />
    </div>
  );
};

// Add simple CSS for shimmer animation if not already present
const shimmerStyle = `
  @keyframes shimmer {
    0% { background-position: -200% 0; }
    100% { background-position: 200% 0; }
  }
`;

export default OptimizedImage;

// Helper hook for Cloudinary URL generation
export const useCloudinaryUrl = (publicId, options = {}) => {
  const { width = 800, quality = "auto" } = options;

  if (!publicId) return "";

  const transformations = `w_${width},f_${quality},q_${quality},c_fill`;
  return `https://res.cloudinary.com/${process.env.VITE_CLOUDINARY_CLOUD_NAME || "demo"}/image/upload/${transformations}/${publicId}`;
};
