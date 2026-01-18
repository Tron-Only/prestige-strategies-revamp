import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="bg-linear-to-r from-primary to-secondary text-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="text-center md:text-left animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
              Empowering Your Business with Strategic HR Solutions
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-3xl">
              Trusted HR, payroll, and talent solutions that help Kenyan
              organisations scale with confidence.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row justify-center md:justify-start gap-4">
              <Button asChild size="lg">
                <Link to="/services">Explore Services</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/contact">Book a Consultation</Link>
              </Button>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src="https://picsum.photos/seed/business-modern/800/600"
              alt="Modern Business"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
