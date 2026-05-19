import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Compass, Users, BarChart3, Wallet, Moon, Sun, Menu, X, Play, LogIn, LogOut } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { useAuth } from "@/hooks/useAuth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const navLinks = [
  { href: "/jelajah", label: "Jelajah", icon: Compass },
  { href: "/komunitas", label: "Komunitas", icon: Users },
  { href: "/dampak", label: "Dampak", icon: BarChart3 },
  { href: "/stream", label: "Stream", icon: Play },
  { href: "/profil", label: "Profil Saya", icon: Wallet },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [location, setLocation] = useLocation();
  const { theme, toggleTheme } = useTheme();
  const { user, isLoading, logout, logoutPending } = useAuth();
  const isHome = location === "/";

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const goToLogin = () => {
    setLocation("/login");
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navBg = scrolled || !isHome
    ? "bg-background/95 backdrop-blur-md border-b border-border"
    : "bg-transparent";

  const textColor = scrolled || !isHome ? "text-foreground" : "text-white";

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 h-20 transition-all duration-300 ${navBg}`}
        data-testid="navbar"
      >
        <div className="max-w-7xl mx-auto h-full px-4 md:px-6 flex items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <span className={`font-display font-bold text-xl ${textColor}`}>
              seapark.id
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`text-base font-medium transition-colors hover-elevate px-3 py-2 rounded-md ${
                    location === link.href
                      ? "text-primary"
                      : textColor + " hover:text-primary"
                  }`}
                  data-testid={`link-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Button
              size="icon"
              variant="ghost"
              onClick={toggleTheme}
              className={textColor}
              data-testid="button-theme-toggle"
            >
              {theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </Button>

            {!isLoading && (
              user ? (
                <div className="hidden md:flex items-center gap-3">
                  <Avatar className="h-9 w-9">
                    <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                    <AvatarFallback>
                      {(user.firstName?.[0] || "U") + (user.lastName?.[0] || "")}
                    </AvatarFallback>
                  </Avatar>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleLogout}
                    disabled={logoutPending}
                    className={textColor}
                    data-testid="button-logout-desktop"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </Button>
                </div>
              ) : (
                <Button
                  className="hidden md:flex rounded-full px-6"
                  onClick={goToLogin}
                  data-testid="button-login-desktop"
                >
                  <LogIn className="w-4 h-4 mr-2" />
                  Masuk
                </Button>
              )
            )}

            <Button
              size="icon"
              variant="ghost"
              className={`md:hidden ${textColor}`}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </Button>
          </div>
        </div>
      </header>

      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-20 md:hidden" data-testid="mobile-menu">
          <nav className="flex flex-col p-4 gap-2">
            {navLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <span
                  className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg font-medium ${
                    location === link.href
                      ? "bg-primary text-primary-foreground"
                      : "hover-elevate"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                  data-testid={`mobile-link-${link.label.toLowerCase().replace(" ", "-")}`}
                >
                  <link.icon className="w-5 h-5" />
                  {link.label}
                </span>
              </Link>
            ))}
            
            <div className="border-t border-border mt-4 pt-4">
              {!isLoading && (
                user ? (
                  <div className="flex items-center gap-3 px-4 py-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profileImageUrl || undefined} alt={user.firstName || "User"} />
                      <AvatarFallback>
                        {(user.firstName?.[0] || "U") + (user.lastName?.[0] || "")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-medium">{user.firstName} {user.lastName}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                      disabled={logoutPending}
                      data-testid="button-logout-mobile"
                    >
                      <LogOut className="w-5 h-5" />
                    </Button>
                  </div>
                ) : (
                  <Button
                    className="w-full"
                    onClick={goToLogin}
                    data-testid="button-login-mobile"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Masuk / Daftar
                  </Button>
                )
              )}
            </div>
          </nav>
        </div>
      )}
    </>
  );
}
