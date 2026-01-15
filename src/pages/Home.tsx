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
import TrustLogos from "@/components/TrustLogos";

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
    <>
      {/* Hero Section */}
      <section className="relative h-[600px] flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://picsum.photos/seed/business/1600/900)",
            filter: "brightness(0.4)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Empowering Your Business with Strategic HR Solutions
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            Trusted HR, payroll, and talent solutions that help Kenyan
            organisations scale with confidence.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="hero-cta">
              <Link to="/services">Explore Services</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link to="/contact">Book a Consultation</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              Our Comprehensive Services
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We offer a wide range of services to meet your HR needs.
            </p>
          </div>
          <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <Card key={service.title} className="text-center">
                <CardHeader>
                  <div className="flex justify-center items-center h-16 w-16 mx-auto bg-primary/10 rounded-full">
                    {service.icon}
                  </div>
                </CardHeader>
                <CardContent>
                  <CardTitle className="text-xl font-semibold">
                    {service.title}
                  </CardTitle>
                  <p className="mt-2 text-muted-foreground">
                    {service.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Training Section */}
      <section className="bg-muted py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://picsum.photos/seed/training/800/600"
                alt="Featured Training"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                Featured Training: Personal Mastery
              </h2>
              <p className="mt-4 text-lg text-muted-foreground">
                Join our featured facilitator in a transformative learning
                experience. This session for young professionals and managers
                will equip you with the skills for the modern workplace.
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

      <TrustLogos />

      {/* Testimonials Section */}
      <section className="py-16 sm:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
              What Our Clients Say
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We are proud to have earned the trust of our clients.
            </p>
          </div>
          <Carousel
            className="mt-12 w-full max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-4xl mx-auto"
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
                        <p className="text-lg flex-grow leading-relaxed">
                          "{testimonial.quote}"
                        </p>
                        <figcaption className="mt-4">
                          <p className="font-semibold">{testimonial.author}</p>
                          <p className="text-sm text-muted-foreground">
                            {testimonial.company}
                          </p>
                        </figcaption>
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
    </>
  );
}
