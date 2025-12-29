import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

export function AboutPage() {
  return (
    <div>
      <section className="text-center py-12 md:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">
            About Prestige Strategies
          </h1>
          <p className="text-base md:text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Prestige Strategies is a leading provider of Human Resources and
            business strategy solutions. Our mission is to empower organizations
            to achieve their full potential by providing expert guidance and
            support. We are committed to delivering excellence and driving
            growth for our clients.
          </p>
        </div>
      </section>

      <section className="py-12 md:py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div>
              <h2 className="text-3xl font-bold">Our Expertise</h2>
              <p className="mt-4 text-muted-foreground">
                Our team is led by seasoned professionals with deep expertise in
                corporate training and human resources. This session on Personal
                Mastery for young professionals and managers will equip you with
                the skills for the modern workplace.
              </p>
              <Button asChild className="mt-4">
                <Link to="/e-learning">Learn More</Link>
              </Button>
            </div>
            <div>
              <img
                src="https://picsum.photos/seed/galaxy/800/600"
                alt="Facilitator"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 md:py-20 text-center">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold">Meet the Team</h2>
          <p className="text-lg text-muted-foreground mt-4 max-w-3xl mx-auto">
            Our team of experienced consultants is dedicated to helping you
            succeed. We bring a diverse range of skills and a shared commitment
            to our clients' success.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-slate-200 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold">John Doe</h3>
              <p className="text-muted-foreground">Lead HR Consultant</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-slate-200 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold">Jane Smith</h3>
              <p className="text-muted-foreground">Strategy Expert</p>
            </div>
            <div className="text-center">
              <div className="w-32 h-32 rounded-full bg-slate-200 mx-auto mb-4"></div>
              <h3 className="text-xl font-bold">Peter Jones</h3>
              <p className="text-muted-foreground">Payroll Specialist</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
