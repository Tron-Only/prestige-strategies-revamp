import React, { useRef, useEffect, useState } from "react";

type Logo = {
  name: string;
  href?: string;
  src: string;
  alt?: string;
};

type TrustLogosProps = {
  logos?: Logo[];
  title?: string;
  subtitle?: string;
  className?: string;
  showHeading?: boolean;
};

/**
 * TrustLogos
 *
 * A small, accessible "Trusted by" logo grid used on home / landing pages.
 * - Accepts a custom `logos` array; otherwise uses a sensible default derived
 *   from the reference sites you provided.
 * - Logos are lazy-loaded and have an `onError` fallback to a simple placeholder.
 * - Links open in a new tab with `rel="noopener noreferrer"` for safety.
 *
 * Example usage:
 * <TrustLogos />
 * <TrustLogos logos={[{ name: 'Acme', src: 'https://logo.clearbit.com/acme.com' }]} />
 */
export function TrustLogos({
  logos,
  title = "Trusted by organizations across sectors",
  subtitle = "We work with clients of all sizes — from startups to enterprise.",
  className = "",
  showHeading = true,
}: TrustLogosProps) {
  const defaultLogos: Logo[] = [
    {
      name: "Safaricom",
      href: "https://www.safaricom.co.ke/",
      src: "https://www.safaricom.co.ke/images/main.png",
      alt: "Safaricom",
    },
    {
      name: "Britam",
      href: "https://www.britam.com/",
      src: "https://www.britam.com/templates/britammaintemplate/images/logo.png",
      alt: "Britam",
    },
    {
      name: "Google",
      href: "https://www.google.com/",
      src: "https://www.gstatic.com/marketing-cms/assets/images/c5/3a/200414104c669203c62270f7884f/google-wordmarks-2x.webp=n-w300-h96-fcrop64=1,00000000ffffffff-rw",
      alt: "Google",
    },
    {
      name: "Coca-Cola",
      href: "https://www.coca-cola.com/",
      src: "https://upload.wikimedia.org/wikipedia/commons/c/ce/Coca-Cola_logo.svg",
      alt: "Coca-Cola",
    },
    {
      name: "Microsoft",
      href: "https://www.microsoft.com/",
      src: "https://uhf.microsoft.com/images/microsoft/RE1Mu3b.png",
      alt: "Microsoft",
    },
    {
      name: "Kenya Power",
      href: "https://www.kenyapower.com/",
      src: "https://www.kplc.co.ke/images/logo.png",
      alt: "Kenya Power",
    },
  ];

  const items = logos && logos.length > 0 ? logos : defaultLogos;

  // onError handler that replaces the broken image with a simple placeholder
  const handleImgError =
    (fallbackText: string) => (e: React.SyntheticEvent<HTMLImageElement>) => {
      const img = e.currentTarget;
      // Avoid infinite loop if placeholder also fails
      if (img.dataset.fallback === "1") return;
      img.dataset.fallback = "1";
      const encoded = encodeURIComponent(fallbackText || "Logo");
      img.src = `https://via.placeholder.com/180x60?text=${encoded}&bg=eef7ff&fg=06426b`;
      img.style.objectFit = "contain";
    };

  // Carousel logic (SMOOTH INFINITE SCROLL)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Determine how many logos fit in the viewport
  const [visibleCount, setVisibleCount] = useState(5);

  useEffect(() => {
    function updateVisibleCount() {
      if (!containerRef.current) return;
      const width = window.innerWidth;
      if (width < 640) setVisibleCount(2);
      else if (width < 768) setVisibleCount(3);
      else if (width < 1024) setVisibleCount(4);
      else setVisibleCount(5);
    }
    updateVisibleCount();
    window.addEventListener("resize", updateVisibleCount);
    return () => window.removeEventListener("resize", updateVisibleCount);
  }, []);

  // SMOOTH infinite scroll state
  const [offset, setOffset] = useState(0);
  const animationRef = useRef<number | null>(null);
  const lastTimestampRef = useRef<number>(0);

  // The width of each logo + gap (in px)
  const LOGO_WIDTH = 180;
  const LOGO_GAP = 32; // 2rem gap
  const LOGO_TOTAL = LOGO_WIDTH + LOGO_GAP;

  // Animation speed in px/sec
  const SPEED = 80; // adjust for desired smoothness

  // Duplicate the items to allow seamless looping
  const logosToShow = [...items, ...items];

  // Animation loop
  useEffect(() => {
    if (hoveredIndex !== null) {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      return;
    }

    let running = true;
    function step(timestamp: number) {
      if (!running) return;
      if (!lastTimestampRef.current) lastTimestampRef.current = timestamp;
      const delta = timestamp - lastTimestampRef.current;
      lastTimestampRef.current = timestamp;
      setOffset((prev) => {
        let next = prev + (SPEED * delta) / 1000;
        // Reset offset when we've scrolled a full set of logos
        const maxOffset = items.length * LOGO_TOTAL;
        if (next >= maxOffset) {
          next -= maxOffset;
        }
        return next;
      });
      animationRef.current = requestAnimationFrame(step);
    }
    animationRef.current = requestAnimationFrame(step);

    return () => {
      running = false;
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
      lastTimestampRef.current = 0;
    };
    // eslint-disable-next-line
  }, [items.length, hoveredIndex, visibleCount]);

  // Calculate the visible logos for the carousel (for accessibility, not for rendering)
  function getVisibleLogos() {
    const result: Logo[] = [];
    for (let i = 0; i < visibleCount; i++) {
      result.push(items[(Math.floor(offset / LOGO_TOTAL) + i) % items.length]);
    }
    return result;
  }

  // Removed unused variable 'visibleLogos'

  return (
    <section
      aria-labelledby="trusted-by-heading"
      className={`flex flex-col items-center justify-center bg-background ${className}`}
    >
      <div className="w-full max-w-4xl px-4 sm:px-6 lg:px-8" ref={containerRef}>
        {showHeading && (
          <div className="mb-8 text-center">
            <h3
              id="trusted-by-heading"
              className="text-xl md:text-2xl font-semibold"
            >
              {title}
            </h3>
            {subtitle && (
              <p className="mt-2 text-sm md:text-base text-muted-foreground max-w-2xl mx-auto">
                {subtitle}
              </p>
            )}
          </div>
        )}

        <div
          className="relative w-full overflow-hidden"
          style={{
            height: "96px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            className="flex transition-transform"
            style={{
              width: "100%",
              justifyContent: "flex-start",
              alignItems: "center",
              gap: "2rem",
              transform: `translateX(-${offset}px)`,
              transition:
                hoveredIndex !== null
                  ? "transform 0.3s cubic-bezier(.4,1.2,.6,1)"
                  : "none",
              willChange: "transform",
            }}
          >
            {logosToShow.map((logo, idx) => {
              // The index in the items array
              const logoIndex = idx % items.length;
              // Animation: hop if just became active
              const isActive =
                hoveredIndex === null || hoveredIndex === logoIndex;
              const isHovered = hoveredIndex === logoIndex;
              return (
                <figure
                  key={`${logo.name}-${idx}`}
                  className={`flex items-center justify-center p-3 rounded-md bg-card transition-all duration-300
                    ${isHovered ? "scale-110 shadow-lg z-10" : "scale-100"}
                  `}
                  style={{
                    minWidth: "180px",
                    maxWidth: "220px",
                    height: "72px",
                    cursor: "pointer",
                    transition:
                      "transform 0.25s cubic-bezier(.4,1.2,.6,1), box-shadow 0.25s",
                  }}
                  onMouseEnter={() => setHoveredIndex(logoIndex)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  tabIndex={-1}
                  aria-hidden={
                    idx >= items.length &&
                    idx < logosToShow.length - visibleCount
                      ? "true"
                      : undefined
                  }
                >
                  {logo.href ? (
                    <a
                      href={logo.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${logo.name}`}
                      className="flex items-center justify-center w-full h-full"
                      tabIndex={0}
                    >
                      <img
                        src={logo.src}
                        alt={logo.alt ?? logo.name}
                        loading="lazy"
                        className={`max-h-12 opacity-90 transition-all duration-300 transform
                          ${
                            isHovered
                              ? "grayscale-0 opacity-100 -translate-y-2"
                              : isActive
                                ? "grayscale-0 opacity-100 -translate-y-1"
                                : "grayscale opacity-90"
                          }
                        `}
                        style={{
                          objectFit: "contain",
                          filter:
                            isHovered || isActive ? "none" : "grayscale(1)",
                          transition:
                            "filter 0.3s, opacity 0.3s, transform 0.3s cubic-bezier(.4,1.2,.6,1)",
                        }}
                        onError={handleImgError(logo.name)}
                      />
                    </a>
                  ) : (
                    <img
                      src={logo.src}
                      alt={logo.alt ?? logo.name}
                      loading="lazy"
                      className={`max-h-12 opacity-90 transition-all duration-300 transform
                        ${
                          isHovered
                            ? "grayscale-0 opacity-100 -translate-y-2"
                            : isActive
                              ? "grayscale-0 opacity-100 -translate-y-1"
                              : "grayscale opacity-90"
                        }
                      `}
                      style={{
                        objectFit: "contain",
                        filter: isHovered || isActive ? "none" : "grayscale(1)",
                        transition:
                          "filter 0.3s, opacity 0.3s, transform 0.3s cubic-bezier(.4,1.2,.6,1)",
                      }}
                      onError={handleImgError(logo.name)}
                    />
                  )}
                </figure>
              );
            })}
          </div>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-muted-foreground">
            Want your logo here?{" "}
            <a
              href="/contact"
              className="font-medium text-primary hover:underline"
            >
              Get in touch
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}

export default TrustLogos;
