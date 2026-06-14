import { Navbar } from "@/components/shared/navbar";
import { HeroSection } from "@/components/sections/hero-section";
import { ProjectsSection } from "@/components/sections/projects-section";
import { SkillsSection } from "@/components/sections/skills-section";
import { ContactSection } from "@/components/sections/contact-section";

import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();
  const { data: settingsData, error } = await supabase.from("site_settings").select("*");
  const formsEnabledSetting = settingsData?.find((s: any) => s.key === "forms_enabled");
  
  // Якщо помилка (немає доступу до БД або RLS блокує), примусово вимикаємо форми
  const formsEnabled = error ? false : (formsEnabledSetting ? formsEnabledSetting.value === "true" : true);

  return (
    <>
      <Navbar />

      <main className="flex-1 w-full flex flex-col items-center">
        <HeroSection />
        <ProjectsSection />
        <SkillsSection />
        <ContactSection formsEnabled={formsEnabled} />
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
