import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MountainIcon, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SheetHeader } from "@/components/ui/sheet";
import { SheetTitle } from "@/components/ui/sheet";
import React from "react";
import { Link } from "react-router-dom";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const navLinks = [
  { to: "/about", label: "About us" },
  { to: "/services", label: "Services" },
  { to: "/resources", label: "Resources" },
  { to: "/events", label: "Events" },
  { to: "/e-learning", label: "E-learning" },
  { to: "/upload-cv", label: "Upload CVs" },
  { to: "/testimonials", label: "Testimonials" },
];

export function Navbar() {
  return (
    <header className="flex items-center justify-between px-4 md:px-8 py-4 border-b">
      <Link to="/" className="flex items-center gap-2">
        <MountainIcon className="h-8 w-8 text-primary" />
        <span className="text-lg font-bold">Prestige Strategies</span>
      </Link>

      {/* Desktop Navigation */}
      <div className="hidden md:flex items-center gap-4">
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Button asChild variant="ghost" className="text-sm font-medium">
                <Link to="/about">About us</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild variant="ghost" className="text-sm font-medium">
                <Link to="/services">Services</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild variant="ghost" className="text-sm font-medium">
                <Link to="/resources">Resources</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild variant="ghost" className="text-sm font-medium">
                <Link to="/events">Events</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild variant="ghost" className="text-sm font-medium">
                <Link to="/e-learning">E-learning</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
        <NavigationMenu>
          <NavigationMenuList className="gap-2">
            <NavigationMenuItem>
              <Button asChild variant="ghost" className="text-sm font-medium">
                <Link to="/upload-cv">Upload CVs</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button asChild variant="ghost" className="text-sm font-medium">
                <Link to="/testimonials">Testimonials</Link>
              </Button>
            </NavigationMenuItem>
            <NavigationMenuItem>
              <Button
                asChild
                variant="default"
                className="text-sm font-medium bg-primary text-white hover:brightness-90"
              >
                <Link to="/contact">Contact us</Link>
              </Button>
            </NavigationMenuItem>
          </NavigationMenuList>
        </NavigationMenu>
      </div>

      {/* Mobile Navigation */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-full sm:max-w-xs">
            <SheetHeader className="p-6">
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <nav className="flex flex-col gap-4 py-8 px-6">
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
    </header>
  );
}
