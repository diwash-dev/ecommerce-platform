import { createSelector } from "@reduxjs/toolkit";

// Base selectors - these are raw selectors
export const selectProducts = (state) => state.Product?.products || [];
export const selectFilters = (state) => state.Product?.filters || {};
export const selectLoading = (state) => state.Product?.loading || false;
export const selectError = (state) => state.Product?.error || null;

// Memoized selector - only recomputes when products actually change
export const selectFilteredProducts = createSelector(
  [selectProducts, selectFilters],
  (products, filters) => {
    let filtered = [...products];

    if (filters.category && filters.category !== "All") {
      filtered = filtered.filter((p) => p.category === filters.category);
    }
    if (filters.price) {
      filtered = filtered.filter((p) => p.price <= parseInt(filters.price));
    }
    if (filters.search) {
      const search = filters.search.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(search) ||
          p.description?.toLowerCase().includes(search),
      );
    }
    return filtered;
  },
);

// Memoized selector for product count
export const selectProductCount = createSelector(
  [selectProducts],
  (products) => products.length,
);

// Memoized selector for products by category
export const selectProductsByCategory = createSelector(
  [selectProducts],
  (products) => {
    const grouped = {};
    products.forEach((product) => {
      const category = product.category || "Other";
      if (!grouped[category]) {
        grouped[category] = [];
      }
      grouped[category].push(product);
    });
    return grouped;
  },
);

// Memoized selector for price range
export const selectPriceRange = createSelector([selectProducts], (products) => {
  if (!products.length) return { min: 0, max: 100000 };

  const prices = products
    .map((p) => p.price)
    .filter((p) => typeof p === "number");
  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
  };
});

// Memoized selector for unique categories
export const selectUniqueCategories = createSelector(
  [selectProducts],
  (products) => {
    const categories = new Set(products.map((p) => p.category).filter(Boolean));
    return Array.from(categories).sort();
  },
);
