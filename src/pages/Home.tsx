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
import {
  Briefcase,
  Building,
  Calculator,
  FileCheck,
  Lightbulb,
  Users,
} from "lucide-react";
import React from "react";
import Autoplay from "embla-carousel-autoplay";

const services = [
  {
    title: "HR Audit",
    description:
      "Systematically reviewing all aspects of human resources to ensure legal compliance and identify areas for improvement.",
    icon: <FileCheck className="w-10 h-10 text-primary" />,
  },
  {
    title: "Strategic Plans",
    description:
      "Formulating and developing a monitoring and evaluation framework to align business strategy and execution of strategic plans.",
    icon: <Lightbulb className="w-10 h-10 text-primary" />,
  },
  {
    title: "Payroll Outsourcing",
    description:
      "Managing your organization's personnel data administration, compensation and benefits, and payroll.",
    icon: <Calculator className="w-10 h-10 text-primary" />,
  },
  {
    title: "Recruitment",
    description:
      "Sourcing and identifying potential candidates based on the requirements of the clients, with a focus on talent management.",
    icon: <Users className="w-10 h-10 text-primary" />,
  },
  {
    title: "Corporate Training",
    description:
      "Undertaking a training needs analysis to identify needs for improvement and enhancement of the HR function.",
    icon: <Building className="w-10 h-10 text-primary" />,
  },
  {
    title: "Manpower Outsourcing",
    description:
      "Contracting out and managing professionals, skilled, technical and unskilled personnel at all levels.",
    icon: <Briefcase className="w-10 h-10 text-primary" />,
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
  {
    quote:
      "The recruitment process was seamless and efficient. We found the perfect candidate in record time.",
    author: "Sarah Lee",
    company: "Innovate Ltd.",
  },
  {
    quote:
      "Corporate training has never been more engaging. Our employees are motivated and skilled up.",
    author: "Mike Chen",
    company: "Solutions Co.",
  },
  {
    quote:
      "Manpower outsourcing helped us scale our operations quickly without the overhead. Highly recommended.",
    author: "Emily White",
    company: "Growth Partners",
  },
];

export function HomePage() {
  const plugin = React.useRef(
    Autoplay({ delay: 5000, stopOnInteraction: true }),
  );

  return (
    <div>
      {/* Hero Section */}
      <section className="text-center py-12 md:py-20 bg-gradient-to-b from-white to-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold">
            Prestige Strategies
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mt-4">
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
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center">Our Services</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
            {services.map((service) => (
              <Card
                key={service.title}
                className="hover:shadow-lg transition-shadow duration-300"
              >
                <CardHeader className="flex flex-row items-center gap-4">
                  {service.icon}
                  <CardTitle>{service.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{service.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Training Section */}
      <section className="bg-muted">
        <div className="container mx-auto py-12 md:py-20 px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src="https://picsum.photos/seed/galaxy/800/600"
                alt="Facilitator"
                className="rounded-2xl shadow-2xl"
              />
            </div>
            <div className="order-1 md:order-2">
              <h2 className="text-3xl font-bold">Featured Training</h2>
              <p className="mt-4 text-muted-foreground">
                Join our featured facilitator in a transformative learning
                experience. This session on Personal Mastery for young
                professionals and managers will equip you with the skills for
                the modern workplace.
              </p>
              <Button asChild size="lg" className="mt-6">
                <Link to="/e-learning">Learn More</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Preview */}
      <section className="py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center">
            What Our Clients Say
          </h2>
          <Carousel
            className="mt-8 w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto"
            plugins={[plugin.current]}
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="p-1">
                    <Card className="h-full">
                      <CardContent className="pt-6 flex flex-col items-center text-center h-full">
                        <p className="text-lg flex-grow">
                          "{testimonial.quote}"
                        </p>
                        <div className="mt-4">
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.company}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        </div>
      </section>
    </div>
  );
}
