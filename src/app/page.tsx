import { Navbar } from "@/components/shared/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ContactSection } from "@/components/sections/contact-section";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center">
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection />
      </main>

      <footer className="w-full border-t border-border/20 py-8 bg-card/25 backdrop-blur-xs flex flex-col items-center">
        <div className="max-w-6xl w-full px-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} For Tin`s website. Всі права захищені.</p>
          <div className="flex items-center space-x-6">
            <a href="https://github.com/For-Tin" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors duration-300">
              GitHub
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
