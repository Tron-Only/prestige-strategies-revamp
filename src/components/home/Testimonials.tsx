import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    quote:
      "Prestige Strategies transformed our HR processes. Their team is professional, knowledgeable, and dedicated.",
    author: "John Doe",
    company: "ABC Corporation",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "The strategic planning services we received were top-notch. We now have a clear roadmap for the future.",
    author: "Jane Smith",
    company: "XYZ Inc.",
    image: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "Outsourcing our payroll to Prestige Strategies was the best decision we made. It saved us time and resources.",
    author: "Peter Jones",
    company: "123 Enterprises",
    image: "https://randomuser.me/api/portraits/men/34.jpg",
  },
];

export function Testimonials() {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "#F8F6F0" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          <h2 
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
            style={{ color: "#00CED1" }}
          >
            What Our Clients Say
          </h2>
          <p className="mt-4 text-lg" style={{ color: "#6B7280" }}>
            We are proud to have earned the trust of our clients.
          </p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-1 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ delay: index * 0.08, duration: 0.4 }}
            >
              <Card className="border-0 shadow-sm h-full">
                <CardContent className="pt-6">
                  <Quote 
                    className="w-8 h-8 mb-4" 
                    style={{ color: "#D4AF37" }} 
                  />
                  <p 
                    className="text-lg leading-relaxed"
                    style={{ color: "#1A1A1A" }}
                  >
                    "{testimonial.quote}"
                  </p>
                  <div className="mt-6 flex items-center">
                    <img
                      src={testimonial.image}
                      alt={testimonial.author}
                      className="w-12 h-12 rounded-full"
                      style={{ border: "2px solid #D4AF37" }}
                    />
                    <div className="ml-4">
                      <p 
                        className="font-semibold"
                        style={{ color: "#00CED1" }}
                      >
                        {testimonial.author}
                      </p>
                      <p className="text-sm" style={{ color: "#6B7280" }}>
                        {testimonial.company}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Testimonials;
