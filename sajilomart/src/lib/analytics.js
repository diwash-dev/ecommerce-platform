// Lightweight client-side analytics stored in localStorage.
const STORAGE_KEY = "sajilo_analytics";

function _load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
  } catch (e) {
    return {};
  }
}

function _save(obj) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(obj));
  } catch (e) {
    // ignore
  }
}

export function trackPage(path) {
  const state = _load();
  state.pages = state.pages || {};
  const now = Date.now();
  state.pages[path] = state.pages[path] || { count: 0, last: null };
  state.pages[path].count += 1;
  state.pages[path].last = now;
  state.totalPageViews = (state.totalPageViews || 0) + 1;
  state.lastPageView = now;
  _save(state);
}

export function trackEvent(name, payload = {}) {
  const state = _load();
  state.events = state.events || {};
  state.events[name] = state.events[name] || { count: 0, samples: [] };
  state.events[name].count += 1;
  // keep lightweight sample
  state.events[name].samples.unshift({ time: Date.now(), payload });
  if (state.events[name].samples.length > 10) state.events[name].samples.pop();
  state.totalEvents = (state.totalEvents || 0) + 1;
  _save(state);
}

export function getStats() {
  const state = _load();
  // normalize shape
  return {
    totalPageViews: state.totalPageViews || 0,
    pages: state.pages || {},
    totalEvents: state.totalEvents || 0,
    events: state.events || {},
    lastPageView: state.lastPageView || null,
  };
}

export function clearAnalytics() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (_e) {
    // ignore localStorage errors
  }
}

export default { trackPage, trackEvent, getStats, clearAnalytics };
