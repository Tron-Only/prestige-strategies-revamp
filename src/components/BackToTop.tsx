import { useEffect, useMemo, useState } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

type BackToTopProps = {
  /**
   * Scroll distance (in px) before the button becomes visible
   */
  threshold?: number;
  /**
   * Whether to use smooth scroll when returning to the top
   */
  smooth?: boolean;
  /**
   * Optional className for the floating container
   */
  className?: string;
  /**
   * The bottom/right spacing of the button container
   */
  offsetClassName?: string;
};

/**
 * A floating "Back to Top" button with a subtle progress ring
 * that indicates how far down the page you've scrolled.
 *
 * - Appears after you scroll past `threshold`
 * - Smoothly scrolls to top on click
 * - Progress ring uses a conic-gradient based on scroll progress
 * - Respects reduced motion preferences
 */
export function BackToTop({
  threshold = 240,
  smooth = true,
  className = "",
  offsetClassName = "bottom-6 right-6 md:bottom-8 md:right-8",
}: BackToTopProps) {
  const [visible, setVisible] = useState(false);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(media.matches);

    const onChange = () => setReducedMotion(media.matches);
    if (media.addEventListener) {
      media.addEventListener("change", onChange);
    } else {
      // Safari < 14
      media.addListener(onChange);
    }

    return () => {
      if (media.removeEventListener) {
        media.removeEventListener("change", onChange);
      } else {
        media.removeListener(onChange);
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined")
      return;

    let ticking = false;

    const handleScroll = () => {
      if (ticking) return;
      ticking = true;

      window.requestAnimationFrame(() => {
        const { scrollTop, scrollHeight } = document.documentElement;
        const vh = window.innerHeight;
        const total = Math.max(1, scrollHeight - vh);
        const p = Math.min(1, Math.max(0, scrollTop / total));

        setProgress(p);
        setVisible(scrollTop > threshold);
        ticking = false;
      });
    };

    handleScroll(); // initialize on mount
    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
    };
  }, [threshold]);

  const degree = useMemo(() => Math.round(progress * 360), [progress]);

  const handleClick = () => {
    if (typeof window === "undefined") return;
    try {
      window.scrollTo({
        top: 0,
        behavior:
          smooth && !reducedMotion ? ("smooth" as ScrollBehavior) : "auto",
      });
    } catch {
      // Fallback for older browsers
      window.scrollTo(0, 0);
    }
  };

  return (
    <div
      className={[
        "fixed z-50",
        offsetClassName,
        "transition-all",
        reducedMotion ? "" : "duration-300",
        visible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-3 pointer-events-none",
        className,
      ].join(" ")}
      aria-hidden={!visible}
    >
      {/* Progress ring container */}
      <div
        className="p-[2px] rounded"
        style={{
          background: `conic-gradient(var(--color-primary, var(--primary)) ${degree}deg, var(--border) 0)`,
        }}
      >
        <Button
          size="icon"
          variant="default"
          onClick={handleClick}
          aria-label="Back to top"
          title="Back to top"
          className={[
            "relative rounded",
            "shadow-lg",
            "border",
            "bg-background/85 dark:bg-background/75",
            "backdrop-blur supports-[backdrop-filter]:backdrop-blur",
            "hover:bg-background",
            "focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[var(--ring)]",
            reducedMotion ? "" : "transition-transform duration-200",
            "active:scale-95",
          ].join(" ")}
        >
          <ChevronUp className="h-5 w-5 text-foreground" />
          <span className="sr-only">Back to top</span>
        </Button>
      </div>
      {/* Small helper text for very small screens (hidden by default) */}
      <div className="sr-only" aria-live="polite">
        {Math.round(progress * 100)}% scrolled
      </div>
    </div>
  );
}

export default BackToTop;
