import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function FeaturedTraining() {
  return (
    <section className="py-16 sm:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="animate-slide-in-left">
            <img
              src="https://picsum.photos/seed/training-modern/800/600"
              alt="Featured Training"
              className="rounded-lg shadow-lg"
            />
          </div>
          <div className="bg-secondary p-8 rounded-lg animate-slide-in-right">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Featured Training: Personal Mastery
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Join our featured facilitator in a transformative learning
              experience. This session for young professionals and managers will
              equip you with the skills for the modern workplace.
            </p>
            <div className="mt-6">
              <Button asChild size="lg">
                <Link to="/e-learning">Learn More & Register</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
