"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Logo } from "./logo";
import { ThemeToggle } from "./theme-toggle";
import { usePathname } from "next/navigation";
import { logoutAdmin } from "@/app/admin/actions";
import { LogOut } from "lucide-react";

export function AdminNavbar() {
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isLoginPage = pathname === "/admin/login";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled && !isLoginPage
          ? "border-b border-border/30 bg-background/80 backdrop-blur-xl pb-4 pt-4 shadow-sm"
          : "bg-transparent pb-6 pt-6"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center hover:opacity-80 transition-opacity duration-300 text-foreground">
            <Logo className="h-6 w-auto" aria-label="FT Logo" />
          </Link>
          <span className="text-sm font-medium text-muted-foreground border-l border-border pl-4 hidden sm:block">
            Панель керування
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {!isLoginPage && (
            <form action={logoutAdmin}>
              <button 
                type="submit"
                className="text-sm font-medium flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 relative py-1 group cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Вийти</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
              </button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
}
