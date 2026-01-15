import { MountainIcon } from "lucide-react";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background border-t">
      <div className="w-full py-12 px-4 md:px-8 text-center">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="flex flex-col gap-4">
            <Link to="/" className="flex items-center justify-center gap-2">
              <MountainIcon className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold">Prestige Strategies</span>
            </Link>
            <p className="text-muted-foreground">
              Trusted HR, payroll, and talent solutions that help Kenyan
              organisations scale with confidence.
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-primary"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/services"
                  className="text-muted-foreground hover:text-primary"
                >
                  Services
                </Link>
              </li>
              <li>
                <Link
                  to="/jobs"
                  className="text-muted-foreground hover:text-primary"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-muted-foreground hover:text-primary"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <address className="mt-4 space-y-2 not-italic text-muted-foreground">
              <p>123 Prestige Plaza, Nairobi, Kenya</p>
              <p>
                <a
                  href="mailto:contact@prestigestrategies.com"
                  className="hover:text-primary"
                >
                  contact@prestigestrategies.com
                </a>
              </p>
              <p>
                <a href="tel:+254700000000" className="hover:text-primary">
                  +254 700 000 000
                </a>
              </p>
            </address>
          </div>
          <div>
            <h3 className="text-lg font-semibold">Follow Us</h3>
            <div className="flex mt-4 space-x-4 justify-center">
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <TwitterIcon className="h-6 w-6" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <LinkedinIcon className="h-6 w-6" />
              </Link>
              <Link to="#" className="text-muted-foreground hover:text-primary">
                <FacebookIcon className="h-6 w-6" />
              </Link>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8 text-center text-muted-foreground">
          <p>
            &copy; {new Date().getFullYear()} Prestige Strategies. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M22 4s-.7 2.1-2 3.4c1.6 1.4 3.3 4.4 3.3 4.4s-1.4 1.4-3.3 1.4H6.7c-1.4 0-1.4-1.4-1.4-1.4s.7-1.4 1.4-1.4H18c1.4 0 1.4-1.4 1.4-1.4s-1.4-1.4-2.8-1.4H8.8c-1.4 0-1.4-1.4-1.4-1.4s.7-1.4 1.4-1.4H22z" />
    </svg>
  );
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}
