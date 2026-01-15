import { Card, CardContent } from "@/components/ui/card";
import { Star } from "lucide-react";

const testimonials = [
  {
    quote:
      "Prestige Strategies transformed our HR processes. Their team is professional, knowledgeable, and dedicated.",
    author: "John Doe",
    company: "ABC Corporation",
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
  },
  {
    quote:
      "The strategic planning services we received were top-notch. We now have a clear roadmap for the future.",
    author: "Jane Smith",
    company: "XYZ Inc.",
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
  },
  {
    quote:
      "Outsourcing our payroll to Prestige Strategies was the best decision we made. It saved us time and resources.",
    author: "Peter Jones",
    company: "123 Enterprises",
    avatar: "https://randomuser.me/api/portraits/men/11.jpg",
  },
  {
    quote:
      "The recruitment process was seamless and efficient. We found the perfect candidate in record time.",
    author: "Sarah Lee",
    company: "Innovate Ltd.",
    avatar: "https://randomuser.me/api/portraits/women/65.jpg",
  },
  {
    quote:
      "Corporate training has never been more engaging. Our employees are motivated and skilled up.",
    author: "Mike Chen",
    company: "Solutions Co.",
    avatar: "https://randomuser.me/api/portraits/men/88.jpg",
  },
  {
    quote:
      "Manpower outsourcing helped us scale our operations quickly without the overhead. Highly recommended.",
    author: "Emily White",
    company: "Growth Partners",
    avatar: "https://randomuser.me/api/portraits/women/21.jpg",
  },
];

export function TestimonialsPage() {
  return (
    <>
      <section className="relative h-[400px] flex items-center justify-center text-center text-white">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage:
              "url(https://picsum.photos/seed/testimonials/1600/900)",
            filter: "brightness(0.4)",
          }}
        />
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            Client Testimonials
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto">
            See what our clients have to say about working with us.
          </p>
        </div>
      </section>

      <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} className="flex flex-col">
              <CardContent className="flex-grow p-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5" />
                    ))}
                  </div>
                </div>
                <blockquote className="text-lg italic mb-4">
                  "{testimonial.quote}"
                </blockquote>
                <div className="flex items-center">
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.author}
                    className="h-12 w-12 rounded-full mr-4"
                  />
                  <div>
                    <p className="font-semibold">{testimonial.author}</p>
                    <p className="text-sm text-muted-foreground">
                      {testimonial.company}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </>
  );
}

export default TestimonialsPage;
