import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { MountainIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetHeader } from "@/components/ui/sheet";
import { SheetTitle } from "@/components/ui/sheet";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { to: "/services", label: "Services" },
  { to: "/about", label: "About us" },
  { to: "/resources", label: "Resources" },
  { to: "/events", label: "Events" },
  { to: "/e-learning", label: "E-learning" },
  { to: "/jobs", label: "Jobs" },
];

export function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
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
