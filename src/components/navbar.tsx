import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import { MountainIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";

export function Navbar() {
  return (
    <header className="flex items-center justify-between px-8 py-4 border-b">
      <NavigationMenu>
        <NavigationMenuList>
          <NavigationMenuItem>
            <Link to="/" className="flex items-center gap-2">
              <MountainIcon className="h-8 w-8 text-primary" />
              <span className="text-lg font-bold">Prestige Strategies</span>
            </Link>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>

      <NavigationMenu>
        <NavigationMenuList className="gap-4">
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
        <NavigationMenuList className="gap-4">
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
    </header>
  );
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className,
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  );
});
ListItem.displayName = "ListItem";
