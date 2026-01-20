import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, Users, Sparkles } from "lucide-react";

type BottomCtaProps = {
  className?: string;
  title?: string;
  subtitle?: string;
  primaryHref?: string;
  secondaryHref?: string;
  primaryText?: string;
  secondaryText?: string;
};

export function BottomCta({
  className = "",
  title = "Ready to grow your team with confidence?",
  subtitle = "Speak to our specialists about recruitment, payroll, and training solutions tailored to your organisation.",
  primaryHref = "/contact",
  secondaryHref = "/services",
  primaryText = "Talk to our team",
  secondaryText = "Explore services",
}: BottomCtaProps) {
  return (
    <section
      aria-labelledby="bottom-cta-heading"
      className={`py-16 sm:py-24 ${className}`}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-2xl border bg-card">
          {/* Soft gradient wash */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent" />

          {/* Decorative glow blobs */}
          <div className="pointer-events-none absolute -top-16 -left-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -right-10 h-72 w-72 rounded-full bg-sky-400/20 blur-3xl" />

          {/* Subtle grid overlay */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 opacity-[0.06]"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(2,8,23,0.35) 1px, transparent 1px), linear-gradient(to bottom, rgba(2,8,23,0.35) 1px, transparent 1px)",
              backgroundSize: "22px 22px",
            }}
          />

          <div className="relative px-6 py-12 sm:px-10 sm:py-14 md:px-16 md:py-16">
            {/* Eyebrow */}
            <div className="mx-auto max-w-3xl text-center">
              <span className="inline-flex items-center gap-2 rounded-full border bg-background px-3 py-1 text-xs font-medium text-muted-foreground">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                Tailored HR and People Ops
              </span>
            </div>

            {/* Heading */}
            <div className="mx-auto mt-5 max-w-3xl text-center">
              <h2
                id="bottom-cta-heading"
                className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl"
              >
                {title}
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">{subtitle}</p>
            </div>

            {/* Quick value bullets */}
            <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-sm">
                <ShieldCheck className="h-4 w-4 text-primary" />
                Compliance-first
              </div>
              <div className="inline-flex items-center gap-2 rounded-full border bg-background/60 px-3 py-1 text-sm">
                <Users className="h-4 w-4 text-primary" />
                Local expertise
              </div>
            </div>

            {/* Actions */}
            <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to={primaryHref}>
                  {primaryText}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="w-full sm:w-auto"
              >
                <Link to={secondaryHref}>{secondaryText}</Link>
              </Button>
            </div>

            {/* Microcopy */}
            <div className="mx-auto mt-5 max-w-3xl text-center">
              <p className="text-sm text-muted-foreground">
                Prefer email? Reach us at{" "}
                <a
                  href="mailto:contact@prestigestrategies.com"
                  className="font-medium text-primary hover:underline"
                >
                  contact@prestigestrategies.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default BottomCta;
