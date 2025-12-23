import { Link, Outlet } from "react-router-dom";
import { Music, Moon, Sun, Menu, X } from "lucide-react";
import { Button } from "./ui/button";
import { useThemeStore } from "../stores/theme-store";
import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";

export const Layout = () => {
  const { theme, toggleTheme } = useThemeStore();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mobileMenuRef.current) {
      if (isMobileMenuOpen) {
        gsap.fromTo(
          mobileMenuRef.current,
          { height: 0, opacity: 0 },
          { height: "auto", opacity: 1, duration: 0.3, ease: "power2.out" }
        );
        gsap.from(mobileMenuRef.current.querySelectorAll("a"), {
          opacity: 0,
          x: -20,
          duration: 0.3,
          stagger: 0.1,
          ease: "power2.out",
        });
      } else {
        gsap.to(mobileMenuRef.current, {
          height: 0,
          opacity: 0,
          duration: 0.2,
          ease: "power2.in",
        });
      }
    }
  }, [isMobileMenuOpen]);

  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link
            to="/"
            className="flex items-center space-x-2"
            onClick={closeMobileMenu}
          >
            <Music className="h-6 w-6" />
            <span className="text-xl font-bold">Fyndam</span>
          </Link>


          <nav className="hidden md:flex items-center space-x-4">
            <Link to="/">
              <Button variant="ghost">Home</Button>
            </Link>
            <Link to="/listen">
              <Button variant="ghost">Live Listen</Button>
            </Link>
            <Link to="/upload">
              <Button variant="ghost">Upload</Button>
            </Link>
            <Link to="/history">
              <Button variant="ghost">History</Button>
            </Link>

            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </nav>

          <div className="flex items-center space-x-2 md:hidden">
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>

        {isMobileMenuOpen && (
          <nav
            ref={mobileMenuRef}
            className="md:hidden border-t overflow-hidden"
          >
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-2">
              <Link to="/" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start">
                  Home
                </Button>
              </Link>
              <Link to="/listen" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start">
                  Live Listen
                </Button>
              </Link>
              <Link to="/upload" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start">
                  Upload
                </Button>
              </Link>
              <Link to="/history" onClick={closeMobileMenu}>
                <Button variant="ghost" className="w-full justify-start">
                  History
                </Button>
              </Link>
            </div>
          </nav>
        )}
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Outlet />
      </main>

      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>Fyndam - Music Recognition powered by audd.io</p>
      </footer>
    </div>
  );
};
