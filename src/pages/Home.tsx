import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const services = [
  {
    title: "HR Audit",
    description:
      "Systematically reviewing all aspects of human resources to ensure legal compliance and identify areas for improvement.",
  },
  {
    title: "Strategic Plans",
    description:
      "Formulating and developing a monitoring and evaluation framework to align business strategy and execution of strategic plans.",
  },
  {
    title: "Payroll Outsourcing",
    description:
      "Managing your organization's personnel data administration, compensation and benefits, and payroll.",
  },
  {
    title: "Recruitment",
    description:
      "Sourcing and identifying potential candidates based on the requirements of the clients, with a focus on talent management.",
  },
  {
    title: "Corporate Training",
    description:
      "Undertaking a training needs analysis to identify needs for improvement and enhancement of the HR function.",
  },
  {
    title: "Manpower Outsourcing",
    description:
      "Contracting out and managing professionals, skilled, technical and unskilled personnel at all levels.",
  },
];

const testimonials = [
  {
    quote:
      "Prestige Strategies transformed our HR processes. Their team is professional, knowledgeable, and dedicated.",
    author: "John Doe",
    company: "ABC Corporation",
  },
  {
    quote:
      "The strategic planning services we received were top-notch. We now have a clear roadmap for the future.",
    author: "Jane Smith",
    company: "XYZ Inc.",
  },
  {
    quote:
      "Outsourcing our payroll to Prestige Strategies was the best decision we made. It saved us time and resources.",
    author: "Peter Jones",
    company: "123 Enterprises",
  },
];

export function HomePage() {
  return (
    <div className="container mx-auto py-8">
      {/* Hero Section */}
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold">Prestige Strategies</h1>
        <p className="text-xl text-muted-foreground mt-4">
          Your Partner in Human Resources and Business Strategy
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Button asChild size="lg">
            <Link to="/services">Our Services</Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/contact">Contact Us</Link>
          </Button>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center">Our Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
          {services.map((service) => (
            <Card key={service.title}>
              <CardHeader>
                <CardTitle>{service.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p>{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      {/* Featured Training Section */}
      <section className="py-20 bg-muted rounded-lg">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="px-8">
            <h2 className="text-3xl font-bold">Featured Training</h2>
            <p className="mt-4 text-muted-foreground">
              Join our featured facilitator in a transformative learning
              experience. This session on Personal Mastery for young
              professionals and managers will equip you with the skills for the
              modern workplace.
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
      </section>

      {/* Testimonials Preview */}
      <section className="py-20">
        <h2 className="text-3xl font-bold text-center">What Our Clients Say</h2>
        <Carousel className="mt-8">
          <CarouselContent>
            {testimonials.map((testimonial, index) => (
              <CarouselItem key={index}>
                <Card>
                  <CardContent className="pt-6">
                    <p className="text-lg">"{testimonial.quote}"</p>
                    <p className="text-right mt-4 font-semibold">
                      {testimonial.author}
                    </p>
                    <p className="text-right text-sm text-muted-foreground">
                      {testimonial.company}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </div>
  );
}
