import { Link, useLocation } from "wouter";
import { Compass, Users, BarChart3, Wallet, Ticket, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

const navItems = [
  { href: "/jelajah", label: "Jelajah", icon: Compass },
  { href: "/komunitas", label: "Komunitas", icon: Users },
  { href: "/dampak", label: "Dampak", icon: BarChart3 },
  { href: "/stream", label: "Stream", icon: Play },
  { href: "/profil", label: "Profil", icon: Wallet },
];

export default function MobileNav() {
  const [location, setLocation] = useLocation();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-border md:hidden pb-safe"
      data-testid="mobile-nav"
    >
      <div className="flex items-center justify-around h-16 relative">
        {navItems.slice(0, 2).map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={`flex flex-col items-center gap-1 p-2 ${
                location === item.href ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </span>
          </Link>
        ))}

        <div className="relative -top-4">
          <Button
            size="lg"
            className="w-14 h-14 rounded-full shadow-lg"
            onClick={() => setLocation("/profil?tab=tickets")}
            data-testid="button-buy-ticket-mobile"
          >
            <Ticket className="w-6 h-6" />
          </Button>
        </div>

        {navItems.slice(2).map((item) => (
          <Link key={item.href} href={item.href}>
            <span
              className={`flex flex-col items-center gap-1 p-2 ${
                location === item.href ? "text-primary" : "text-muted-foreground"
              }`}
              data-testid={`mobile-nav-${item.label.toLowerCase()}`}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-xs font-medium">{item.label}</span>
            </span>
          </Link>
        ))}
      </div>
    </nav>
  );
}
