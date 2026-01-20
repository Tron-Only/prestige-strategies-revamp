import type { ReactNode, CSSProperties } from "react";

type Variant = "subtle" | "primary" | "muted" | "soft";
type Align = "center" | "left" | "right";
type Spacing = "none" | "sm" | "md" | "lg";

export type SectionDividerProps = {
  className?: string;
  /**
   * Visual style for the gradient line
   * - subtle: uses the theme border color
   * - primary: uses the theme primary color
   * - muted: uses a softer muted-foreground
   * - soft: uses a very soft foreground hint
   */
  variant?: Variant;
  /**
   * Where the optional label should be placed relative to the line(s)
   */
  align?: Align;
  /**
   * Optional label content rendered inline with the divider
   */
  label?: ReactNode;
  /**
   * Optional icon rendered before the label
   */
  icon?: ReactNode;
  /**
   * Class name for the label chip
   */
  labelClassName?: string;
  /**
   * Height of the line in pixels (defaults to 1)
   */
  thickness?: number;
  /**
   * Vertical spacing (margin-y) around the divider
   */
  spacing?: Spacing;
  /**
   * Round the gradient edges
   */
  rounded?: boolean;
  /**
   * Accessible label for screen readers
   */
  ariaLabel?: string;
};

/**
 * SectionDivider
 * A subtle, theme-aware gradient separator with an optional centered label.
 * - Uses Tailwind gradients and theme CSS variables
 * - Minimal height by default; can be thickened via `thickness`
 * - Label chip uses the page background to appear "cut out" of the line
 */
export function SectionDivider({
  className = "",
  variant = "subtle",
  align = "center",
  label,
  icon,
  labelClassName = "",
  thickness = 1,
  spacing = "md",
  rounded = true,
  ariaLabel,
}: SectionDividerProps) {
  const lineStyle: CSSProperties = {
    height: Math.max(1, Math.floor(thickness)),
  };

  const gradient = getGradientClasses(variant);
  const radius = rounded ? "rounded-full" : "";

  const spacingY =
    spacing === "none"
      ? "my-0"
      : spacing === "sm"
        ? "my-6"
        : spacing === "lg"
          ? "my-16"
          : "my-10";

  const wrapperClasses = [
    "w-full",
    spacingY,
    className || "",
  ]
    .filter(Boolean)
    .join(" ");

  const lineClasses = [
    "bg-gradient-to-r",
    gradient,
    radius,
    "shrink",
    "opacity-90 dark:opacity-100",
  ]
    .filter(Boolean)
    .join(" ");

  const chipClasses = [
    "inline-flex items-center gap-2",
    "px-3 py-1",
    "text-sm font-medium",
    "border rounded-full",
    "bg-background text-muted-foreground",
    "shadow-sm",
    labelClassName || "",
  ]
    .filter(Boolean)
    .join(" ");

  // Build content based on alignment
  const labelNode =
    label != null ? (
      <span className={chipClasses}>
        {icon ? <span className="text-primary">{icon}</span> : null}
        <span className="whitespace-pre-wrap">{label}</span>
      </span>
    ) : null;

  const leftLine = <div className={`${lineClasses} grow`} style={lineStyle} />;
  const rightLine = <div className={`${lineClasses} grow`} style={lineStyle} />;

  let content: ReactNode = null;
  if (!labelNode) {
    // Simple single line (no label)
    content = <div className={`${lineClasses} w-full`} style={lineStyle} />;
  } else {
    // Label with line(s) according to alignment
    if (align === "left") {
      content = (
        <div className="flex items-center gap-4">
          {labelNode}
          {rightLine}
        </div>
      );
    } else if (align === "right") {
      content = (
        <div className="flex items-center gap-4">
          {leftLine}
          {labelNode}
        </div>
      );
    } else {
      // center (default)
      content = (
        <div className="flex items-center gap-4">
          {leftLine}
          {labelNode}
          {rightLine}
        </div>
      );
    }
  }

  return (
    <div
      role="separator"
      aria-label={ariaLabel}
      aria-orientation="horizontal"
      className={wrapperClasses}
    >
      {content}
    </div>
  );
}

function getGradientClasses(variant: Variant): string {
  switch (variant) {
    case "primary":
      // Subtle primary glow through the center
      return "from-transparent via-primary/40 to-transparent";
    case "muted":
      return "from-transparent via-muted-foreground/30 to-transparent";
    case "soft":
      return "from-transparent via-foreground/10 to-transparent";
    case "subtle":
    default:
      // Uses theme border color in the center for a "hairline" look
      return "from-transparent via-border to-transparent";
  }
}

export default SectionDivider;
