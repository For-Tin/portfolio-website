"use client";

import { useState, useEffect } from "react";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X } from "lucide-react";

const navLinks = [
  { name: "Головна", href: "#hero" },
  { name: "Проєкти", href: "#projects" },
  { name: "Навички", href: "#skills" },
  { name: "Контакти", href: "#contact" },
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "border-b border-border/30 bg-background/60 backdrop-blur-lg py-4 shadow-sm"
          : "bg-transparent py-6"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
        {/* Logo */}
        <a href="#hero" className="flex items-center hover:opacity-80 transition-opacity duration-300 text-foreground">
          <Logo className="h-6 w-auto" aria-label="FT Logo" />
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 relative py-1 group"
            >
              {link.name}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
        </div>

        {/* Mobile Actions */}
        <div className="flex items-center space-x-4 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-foreground p-1 cursor-pointer"
            aria-label="Відкрити меню"
          >
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute top-full left-0 right-0 bg-background/90 backdrop-blur-xl border-b border-border/50 px-6 py-6 md:hidden flex flex-col space-y-4 overflow-hidden shadow-lg"
          >
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors duration-300 py-2 border-b border-border/20 last:border-0"
              >
                {link.name}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
