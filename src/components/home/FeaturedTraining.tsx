import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function FeaturedTraining() {
  return (
    <section className="py-16 sm:py-24" style={{ backgroundColor: "#F8F6F0" }}>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            className="rounded border p-2 shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E5E5" }}
            initial={{ opacity: 0, x: -12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
          >
            <img
              src="https://picsum.photos/seed/training-modern/800/600"
              alt="Featured Training"
              className="rounded"
              style={{ boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" }}
            />
          </motion.div>
          <motion.div
            className="p-8 rounded border shadow-sm"
            style={{ backgroundColor: "#FFFFFF", borderColor: "#E5E5E5" }}
            initial={{ opacity: 0, x: 12 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.45 }}
          >
            <span 
              className="inline-block px-3 py-1 rounded-full text-xs font-medium mb-4"
              style={{ backgroundColor: "#F4E4C1", color: "#1A1A1A" }}
            >
              Featured
            </span>
            <h2 
              className="text-3xl font-extrabold tracking-tight sm:text-4xl"
              style={{ color: "#00CED1" }}
            >
              Personal Mastery
            </h2>
            <p className="mt-4 text-lg" style={{ color: "#6B7280" }}>
              Join our featured facilitator in a transformative learning
              experience. This session for young professionals and managers will
              equip you with the skills for the modern workplace.
            </p>
            <div className="mt-6">
              <Button 
                asChild 
                size="lg"
                style={{ backgroundColor: "#00CED1" }}
              >
                <Link to="/e-learning">Learn More & Register</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default FeaturedTraining;
