import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-background text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-extrabold leading-tight">
            Welcome to Prestige Strategies
          </h1>
          <p className="mt-6 text-lg md:text-2xl max-w-2xl mx-auto text-muted-foreground">
            Trusted HR, payroll, and talent solutions that help Kenyan
            organisations scale with confidence.
          </p>

          <div className="mt-8 flex items-center justify-center gap-4">
            <Button asChild size="lg">
              <Link to="/services">Explore Services</Link>
            </Button>
            <Button asChild size="lg" variant="outline">
              <Link to="/contact">Book a Consultation</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
