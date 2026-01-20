import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * ScrollToTop
 *
 * Simple component that scrolls the window to the top whenever the route changes.
 * Respects the user's reduced-motion preference and falls back gracefully for older browsers.
 *
 * Usage:
 * - Mount this once (e.g. in `App.tsx`) so route transitions will scroll to top automatically:
 *     <ScrollToTop />
 *
 * Notes:
 * - This component is intentionally minimal and returns `null` (no UI).
 * - It uses `useLocation` from react-router to observe changes to `pathname`.
 */
export default function ScrollToTop(): null {
  const { pathname } = useLocation();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const prefersReduced =
      typeof window.matchMedia === "function" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    try {
      window.scrollTo({
        top: 0,
        behavior: prefersReduced ? "auto" : "smooth",
      });
    } catch {
      // Older browsers may throw for the options object — fallback to immediate scroll
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}
