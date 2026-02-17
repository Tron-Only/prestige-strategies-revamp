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
      style={{ backgroundColor: "#FFFFFF" }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div 
          className="relative overflow-hidden rounded-2xl border"
          style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E5E5" }}
        >
          {/* Soft gradient wash */}
          <div 
            className="pointer-events-none absolute inset-0"
            style={{ background: "linear-gradient(135deg, rgba(13,59,102,0.05) 0%, rgba(212,175,55,0.05) 100%)" }}
          />

          <div className="relative px-6 py-12 sm:px-10 sm:py-14 md:px-16 md:py-16">
            {/* Eyebrow */}
            <div className="mx-auto max-w-3xl text-center">
              <span 
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-medium"
                style={{ backgroundColor: "#F4E4C1", borderColor: "#D4AF37", color: "#1A1A1A" }}
              >
                <Sparkles className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
                Tailored HR and People Ops
              </span>
            </div>

            {/* Heading */}
            <div className="mx-auto mt-5 max-w-3xl text-center">
              <h2
                id="bottom-cta-heading"
                className="text-balance text-3xl font-extrabold tracking-tight sm:text-4xl"
                style={{ color: "#0D3B66" }}
              >
                {title}
              </h2>
              <p className="mt-4 text-lg" style={{ color: "#6B7280" }}>
                {subtitle}
              </p>
            </div>

            {/* Quick value bullets */}
            <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center">
              <div 
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E5E5" }}
              >
                <ShieldCheck className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Compliance-first
              </div>
              <div 
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-sm"
                style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E5E5" }}
              >
                <Users className="h-4 w-4" style={{ color: "#D4AF37" }} />
                Local expertise
              </div>
            </div>

            {/* Actions */}
            <div className="mx-auto mt-8 flex max-w-md flex-col items-center justify-center gap-3 sm:flex-row">
              <Button 
                asChild 
                size="lg" 
                className="w-full sm:w-auto"
                style={{ backgroundColor: "#0D3B66" }}
              >
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
              <p className="text-sm" style={{ color: "#6B7280" }}>
                Prefer email? Reach us at{" "}
                <a
                  href="mailto:contact@prestigestrategies.com"
                  className="font-medium hover:underline"
                  style={{ color: "#0D3B66" }}
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
