import { MountainIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer style={{ backgroundColor: "#FFFFFF", borderTop: "1px solid #E5E5E5" }}>
      <div className="w-full py-12 px-4 md:px-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center justify-center gap-2">
              <MountainIcon className="h-8 w-8" style={{ color: "#00CED1" }} />
              <span className="text-lg font-bold" style={{ color: "#00CED1" }}>
                Prestige Strategies
              </span>
            </Link>
            <p style={{ color: "#6B7280" }}>
              Trusted HR, payroll, and talent solutions that help Kenyan
              organisations scale with confidence.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "#00CED1" }}>
              Quick Links
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/about"
                  style={{ color: "#6B7280" }}
                  className="hover:underline"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  style={{ color: "#6B7280" }}
                  className="hover:underline"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  style={{ color: "#6B7280" }}
                  className="hover:underline"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  style={{ color: "#6B7280" }}
                  className="hover:underline"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold" style={{ color: "#00CED1" }}>
              Contact Us
            </h3>
            <address className="mt-4 space-y-2 not-italic" style={{ color: "#6B7280" }}>
              <p>123 Prestige Plaza, Nairobi, Kenya</p>
              <p>
                <a
                  href="mailto:info@prestigestrategies.com"
                  style={{ color: "#00CED1" }}
                  className="hover:underline"
                >
                  info@prestigestrategies.com
                </a>
              </p>
              <p>
                <a 
                  href="tel:+254722799202" 
                  style={{ color: "#00CED1" }}
                  className="hover:underline"
                >
                  +254 722 799 202
                </a>
              </p>
            </address>
          </div>
        </div>
        <div 
          className="mt-8 border-t pt-8 text-center"
          style={{ borderColor: "#E5E5E5", color: "#6B7280" }}
        >
          <p>
            &copy; {new Date().getFullYear()} Prestige Strategies. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
