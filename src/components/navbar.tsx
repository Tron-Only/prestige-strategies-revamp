import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MountainIcon, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetHeader } from "@/components/ui/sheet";
import { SheetTitle } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useStudentAuth } from "@/contexts/StudentAuthContext";

const navLinks = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About us" },
  { to: "/resources", label: "Resources" },
  { to: "/events", label: "Events" },
  { to: "/courses", label: "Courses" },
  { to: "/jobs", label: "Jobs" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useStudentAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 4);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 transition-shadow ${scrolled ? "shadow-md" : "shadow-none"}`}
    >
      <div className="container flex h-14 items-center">
        <Link to="/" className="flex items-center gap-2">
          <MountainIcon className="h-8 w-8 text-primary" />
          <span className="text-lg font-bold">Prestige Strategies</span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-4 ml-auto">
          <NavigationMenu>
            <NavigationMenuList className="gap-2">
              {navLinks.map((link) => (
                <NavigationMenuItem key={link.to}>
                  <Button
                    asChild
                    variant="ghost"
                    className="text-sm font-medium"
                  >
                    <Link to={link.to}>{link.label}</Link>
                  </Button>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
          {isAuthenticated ? (
            <Button asChild variant="outline" className="text-sm font-medium">
              <Link to="/dashboard">
                <User className="mr-2 h-4 w-4" />
                My Dashboard
              </Link>
            </Button>
          ) : null}
          <Button asChild variant="default" className="text-sm font-medium">
            <Link to="/contact">Contact us</Link>
          </Button>
        </div>

        {/* Mobile Navigation */}
        <div className="md:hidden ml-auto">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-full">
              <SheetHeader>
                <SheetTitle>
                  <Link to="/" className="flex items-center gap-2">
                    <MountainIcon className="h-8 w-8 text-primary" />
                    <span className="text-lg font-bold">
                      Prestige Strategies
                    </span>
                  </Link>
                </SheetTitle>
              </SheetHeader>
              <nav className="flex flex-col gap-4 py-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    className="text-lg font-medium hover:text-primary"
                  >
                    {link.label}
                  </Link>
                ))}
                <Button asChild size="lg" variant="default" className="mt-4">
                  <Link to="/contact">Contact us</Link>
                </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
