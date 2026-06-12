import { CardTilt } from "@/components/shared/card-tilt";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Github } from "lucide-react";

async function getGithubProjects() {
  try {
    const username = "For-Tin";
    const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`, {
      next: { revalidate: 3600 }, // Cache for 1 hour
    });
    
    if (!res.ok) return [];

    const data = await res.json();
    if (Array.isArray(data)) {
      return data.map((repo: any) => ({
        id: repo.id,
        title: repo.name,
        description: repo.description || "Немає опису",
        category: repo.language || "Open Source",
        tags: repo.topics || [],
        github: repo.html_url,
        updatedAt: repo.pushed_at || repo.updated_at,
      }));
    }
    return [];
  } catch (e) {
    console.error("Failed to fetch Github projects:", e);
    return [];
  }
}

export async function ProjectsSection() {
  const projects = await getGithubProjects();

  return (
    <section id="projects" className="w-full max-w-6xl px-6 py-24 border-t border-border/20">
      <div className="mb-16 text-center md:text-left">
        <ScrollReveal>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
            Власні проєкти
          </h2>
        </ScrollReveal>
        <ScrollReveal delay={0.1}>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Галерея робіт, виконаних за весь час мого шляху.
          </p>
        </ScrollReveal>
      </div>

      <div className="flex md:grid md:grid-rows-2 md:grid-flow-col md:auto-cols-[520px] overflow-x-auto snap-x snap-mandatory gap-6 px-6 -mx-6 md:px-12 md:-mx-12 py-12 -my-12 scroll-smooth scroll-pl-6 md:scroll-pl-12 relative z-10 mobile-hide-scrollbar">
        {projects.map((project: any, idx: number) => (
          <ScrollReveal key={project.id} delay={idx % 2 * 0.1} duration={0.8} className="snap-start shrink-0 w-[85vw] md:w-auto h-full">
            <CardTilt className="flex flex-col justify-between h-full min-h-[350px]">
              <div className="flex-1">
                <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block">
                  {project.category}
                </span>
                <h3 className="text-2xl font-bold text-foreground mb-3 truncate" title={project.title}>
                  {project.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed mb-6 line-clamp-5">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mb-8">
                  {project.tags && project.tags.slice(0, 4).map((tag: string) => (
                    <span
                      key={tag}
                      className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/80 border border-border/30 text-muted-foreground transition-colors duration-300 hover:bg-primary hover:text-white cursor-default truncate max-w-full"
                    >
                      {tag}
                    </span>
                  ))}
                  {project.tags && project.tags.length > 4 && (
                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/80 border border-border/30 text-muted-foreground">
                      +{project.tags.length - 4}
                    </span>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between w-full mt-auto">
                <a
                  href={project.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  <Github className="mr-1.5 h-4 w-4 shrink-0" />
                  Код
                </a>
                {project.updatedAt && (
                  <span className="text-xs text-muted-foreground/60 font-medium whitespace-nowrap">
                    Оновлено {new Intl.DateTimeFormat('uk-UA', { day: 'numeric', month: 'short' }).format(new Date(project.updatedAt))}
                  </span>
                )}
              </div>
            </CardTilt>
          </ScrollReveal>
        ))}
        <div className="shrink-0 w-2 md:hidden" aria-hidden="true" />
      </div>
    </section>
  );
}
