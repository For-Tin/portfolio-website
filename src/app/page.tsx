"use client";

import { motion, AnimatePresence, useInView } from "framer-motion";
import { Navbar } from "@/components/shared/navbar";
import { CardTilt } from "@/components/shared/card-tilt";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { 
  Github, 
  Mail, 
  Send, 
  ArrowRight,
  Monitor,
  Database,
  Cpu,
  Sparkles,
  Bot,
  Zap,
  Server,
  Shield,
  Code
} from "lucide-react";
import React, { useState, useEffect } from "react";



// Навыки, разбитые по категориям
const skillCategories = [
  {
    title: "Розробка Ботів",
    icon: <Database className="h-5 w-5 text-primary" />,
    skills: ["Python", "disnake", "REST APIs", "supabase"],
  },
  {
    title: "Веб-технології",
    icon: <Monitor className="h-5 w-5 text-primary" />,
    skills: ["React", "Next.js", "TypeScript", "Tailwind CSS", "HTML/CSS"],
  },
  {
    title: "Інструменти / Інше",
    icon: <Cpu className="h-5 w-5 text-primary" />,
    skills: ["Git", "GitHub", "Bun", "Автоматизація", "Алгоритми"],
  },
];

const heroTags = [
  { text: "Створюю преміальних ботів", icon: Bot },
  { text: "Створюю швидкі веб-додатки", icon: Zap },
  { text: "Пишу надійний бекенд", icon: Server },
  { text: "Створюю захищені сайти", icon: Shield },
  { text: "Автоматизую рутину", icon: Code },
];

const namesList = ["Олексій Навальний", "Володимир Зеленський", "Джо Байден", "Петро Порошенко", "Юлія Тимошенко"];
const domainsList = ["example.com", "gmail.com", "outlook.com", "yahoo.com", "proton.me", "icloud.com"];

// Хук для эффекта печатной машинки
function useTypewriter(words: string[], baseString: string = "", typeSpeed = 100, deleteSpeed = 50, delayDuration = 2500) {
  const [text, setText] = useState(baseString + words[0]);

  useEffect(() => {
    let isMounted = true;
    let charIndex = words[0].length;
    let wordIndex = 0;
    let isDeleting = true;
    let timer: ReturnType<typeof setTimeout>;

    const type = () => {
      if (!isMounted) return;
      const currentWord = words[wordIndex % words.length];

      if (isDeleting) {
        charIndex--;
      } else {
        charIndex++;
      }

      setText(baseString + currentWord.substring(0, charIndex));

      let speed = isDeleting ? deleteSpeed : typeSpeed;

      if (!isDeleting && charIndex === currentWord.length) {
        speed = delayDuration;
        isDeleting = true;
      } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        wordIndex++;
        speed = 500;
      }

      timer = setTimeout(type, speed);
    };

    timer = setTimeout(type, delayDuration);

    return () => {
      isMounted = false;
      clearTimeout(timer);
    };
  }, [words, baseString, typeSpeed, deleteSpeed, delayDuration]);

  return text;
}

const bioParagraphs = [
  "Я спеціалізуюся на розробці потужних і надійних Telegram та Discord ботів на Python, автоматизуючи рутину і створюючи зручні інструменти для користувачів.",
  "Крім ботів, я захоплююся веб-розробкою. Я створюю швидкі, інтерактивні та мінімалістичні інтерфейси за допомогою React, TypeScript та Tailwind CSS.",
  "Мій підхід — це чистий код, увага до деталей та бажання постійно розвиватися у вирішенні складних інженерних завдань. Завжди відкритий для нових проєктів!"
];

function BioTypewriter() {
  const [charIndex, setCharIndex] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (!isInView) return;
    const totalChars = bioParagraphs.join("").length;
    if (charIndex >= totalChars) return;

    const timer = setInterval(() => {
      setCharIndex((prev) => prev + 2);
    }, 15);

    return () => clearInterval(timer);
  }, [isInView, charIndex]);

  let remaining = charIndex;
  const totalChars = bioParagraphs.join("").length;

  return (
    <div ref={ref} className="space-y-6 text-muted-foreground text-md sm:text-lg leading-relaxed">
      {bioParagraphs.map((p, i) => {
        const pLen = p.length;
        const take = Math.min(remaining, pLen);
        remaining = Math.max(0, remaining - pLen);
        const textToDisplay = p.slice(0, take);
        
        const isCurrentlyTyping = take > 0 && take < pLen;
        const isWaitingToStart = take === 0 && charIndex < totalChars && i === 0;
        const isFullyDone = charIndex >= totalChars;
        const isLastParagraph = i === bioParagraphs.length - 1;
        
        const showCursor = isCurrentlyTyping || isWaitingToStart || (isFullyDone && isLastParagraph);

        return (
          <p key={i}>
            <span>{textToDisplay}</span>
            <span className="relative">
              {showCursor && (
                <motion.span
                  animate={{ opacity: [1, 0] }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
                  className="absolute text-primary"
                >
                  |
                </motion.span>
              )}
            </span>
            <span className="opacity-0">{p.slice(take)}</span>
          </p>
        );
      })}
    </div>
  );
}

export default function Home() {
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [dots, setDots] = useState("");
  const [githubProjects, setGithubProjects] = useState<any[]>([]);
  const [currentTagIndex, setCurrentTagIndex] = useState(0);

  useEffect(() => {
    const tagInterval = setInterval(() => {
      setCurrentTagIndex((prev) => prev + 1);
    }, 3000);
    return () => clearInterval(tagInterval);
  }, []);

  useEffect(() => {
    const fetchGitHub = async () => {
      try {
        const username = "For-Tin";
        const res = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const formatted = data.map(repo => ({
            id: repo.id,
            title: repo.name,
            description: repo.description || "Немає опису",
            category: repo.language || "Open Source",
            tags: repo.topics || [],
            github: repo.html_url,
          }));
          setGithubProjects(formatted);
        }
      } catch (e) {}
    };
    fetchGitHub();

    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? "" : prev + ".");
    }, 400);
    return () => clearInterval(interval);
  }, []);

  // Анимированные плейсхолдеры
  const namePlaceholder = useTypewriter(namesList);
  const emailPlaceholder = useTypewriter(domainsList, "name@");
  const messagePlaceholder = `Ваше повідомлення${dots}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formState.name && formState.email && formState.message) {
      setIsSubmitted(true);
      setTimeout(() => {
        setIsSubmitted(false);
        setFormState({ name: "", email: "", message: "" });
      }, 3000);
    }
  };

  return (
    <>
      <Navbar />

      {/* Main Container */}
      <main className="flex-1 w-full flex flex-col items-center">
        
        {/* HERO SECTION */}
        <section id="hero" className="w-full min-h-screen flex items-center justify-center relative px-6 pt-24 overflow-hidden">
          {/* Subtle background glow */}
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] pointer-events-none" />
          
          <div className="max-w-6xl w-full text-center z-10 flex flex-col items-center">
            
            {/* Tagline */}
            <div className="relative w-full max-w-2xl h-12 mb-6 flex items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_15%,black_85%,transparent)]">
              <AnimatePresence>
                {[-1, 0, 1].map((offset) => {
                  const absoluteIndex = currentTagIndex + offset;
                  const wrappedIndex = ((absoluteIndex % heroTags.length) + heroTags.length) % heroTags.length;
                  const item = heroTags[wrappedIndex];
                  const Icon = item.icon;

                  return (
                    <motion.div
                      key={absoluteIndex}
                      initial={{ opacity: 0, x: (offset + 1) * 280, scale: 0.7 }}
                      animate={{ 
                        opacity: offset === 0 ? 1 : 0.4, 
                        x: offset * 280, 
                        scale: offset === 0 ? 1 : 0.85,
                        zIndex: offset === 0 ? 10 : 5
                      }}
                      exit={{ opacity: 0, x: (offset - 1) * 280, scale: 0.7 }}
                      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute left-1/2 top-1/2 w-0 h-0 flex items-center justify-center"
                    >
                      <div className="inline-flex items-center space-x-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs sm:text-sm font-medium text-primary whitespace-nowrap shadow-sm bg-background/50 backdrop-blur-md">
                        <Icon className="h-4 w-4 shrink-0" />
                        <span>{item.text}</span>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>

            {/* Title */}
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="text-[clamp(1.25rem,3.5vw,4rem)] font-extrabold tracking-tight leading-none mb-6 relative w-full"
            >
              Маленький крок для людини.<br />
              <motion.span 
                animate={{ backgroundPosition: ["0% 50%", "200% 50%"] }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-primary via-purple-500 to-primary bg-[length:200%_auto]"
              >
                Великий крок для людства.
              </motion.span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-2xl text-lg sm:text-xl text-muted-foreground mb-10 leading-relaxed"
            >
              Привіт, мене звати Артур. Я розробник-початківець, що спеціалізується на створенні Discord / Telegram ботів та швидких і інтерактивних додатків.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
            >
              <a
                href="#projects"
                className="group w-full sm:w-auto inline-flex items-center justify-center rounded-2xl bg-primary px-8 py-4 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:bg-primary/95 hover:shadow-primary/35 hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                Мої проєкти
                <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
              </a>
              <a
                href="#contact"
                className="group w-full sm:w-auto inline-flex items-center justify-center rounded-2xl border border-border bg-card/50 px-8 py-4 text-sm font-semibold text-foreground transition-all duration-300 hover:bg-secondary/50 hover:-translate-y-1 active:scale-95 cursor-pointer"
              >
                <Mail className="mr-2 h-4 w-4 transition-all duration-300 group-hover:-translate-y-1 group-hover:rotate-12 group-hover:text-primary" />
                Зв'язатися
              </a>
            </motion.div>
          </div>
        </section>

        {/* PROJECTS SECTION */}
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

          {/* Projects Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {githubProjects.map((project, idx) => (
              <ScrollReveal key={project.id} delay={idx % 2 * 0.1} duration={0.8}>
                <CardTilt className="flex flex-col justify-between min-h-[350px]">
                  <div className="flex-1">
                    {/* Project Category */}
                    <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-3 block">
                      {project.category}
                    </span>
                    {/* Title */}
                    <h3 className="text-2xl font-bold text-foreground mb-3">
                      {project.title}
                    </h3>
                    {/* Description */}
                    <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                      {project.description}
                    </p>
                    {/* Tags */}
                    <div className="flex flex-wrap gap-2 mb-8">
                      {project.tags && project.tags.map((tag: string) => (
                        <span
                          key={tag}
                          className="px-3 py-1 rounded-full text-xs font-medium bg-secondary/80 border border-border/30 text-muted-foreground transition-colors duration-300 hover:bg-primary hover:text-white cursor-default"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center space-x-4">
                    <a
                      href={project.github}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                    >
                      <Github className="mr-1.5 h-4 w-4" />
                      Дивитися код
                    </a>
                  </div>
                </CardTilt>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* ABOUT & SKILLS SECTION */}
        <section id="skills" className="w-full max-w-6xl px-6 py-24 border-t border-border/20">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
            
            {/* Left Column - Biography */}
            <div className="lg:col-span-5">
              <ScrollReveal>
                <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-6">
                  Про мене
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={0.1}>
                <BioTypewriter />
              </ScrollReveal>
            </div>

            {/* Right Column - Skills list */}
            <div className="lg:col-span-7 space-y-8">
              {skillCategories.map((category, catIdx) => (
                <ScrollReveal key={category.title} delay={catIdx * 0.1}>
                  <div className="rounded-[1.5rem] border border-border/60 bg-card/40 p-6 backdrop-blur-xs">
                    <div className="flex items-center space-x-3 mb-4">
                      {category.icon}
                      <h3 className="font-bold text-lg text-foreground">{category.title}</h3>
                    </div>
                    <div className="flex flex-wrap gap-2.5">
                      {category.skills.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-1.5 rounded-2xl text-sm font-medium bg-background border border-border/40 text-foreground transition-all duration-200 ease-out hover:scale-105 hover:border-primary/50 hover:bg-primary hover:text-white cursor-default"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </ScrollReveal>
              ))}
            </div>

          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="w-full max-w-4xl px-6 py-24 border-t border-border/20 flex flex-col items-center">
          <div className="text-center mb-12">
            <ScrollReveal>
              <h2 className="text-3xl sm:text-5xl font-bold tracking-tight mb-4">
                Зв'язатися зі мною
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={0.1}>
              <p className="text-lg text-muted-foreground max-w-xl">
                Бажаєте обговорити проєкт або поставити запитання? Надішліть повідомлення, і я відповім вам найближчим часом.
              </p>
            </ScrollReveal>
          </div>

          {/* Form */}
          <ScrollReveal delay={0.2} className="w-full max-w-lg">
            <form onSubmit={handleSubmit} className="space-y-6 rounded-[2rem] border border-border/60 bg-card/30 p-8 backdrop-blur-sm shadow-sm">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                  Ім'я
                </label>
                <input
                  type="text"
                  id="name"
                  required
                  value={formState.name}
                  onChange={(e) => setFormState({ ...formState, name: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground transition-all duration-300 placeholder-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={namePlaceholder}
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                  Електронна пошта
                </label>
                <input
                  type="email"
                  id="email"
                  required
                  value={formState.email}
                  onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground transition-all duration-300 placeholder-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={emailPlaceholder}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-foreground mb-2">
                  Повідомлення
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formState.message}
                  onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                  className="w-full rounded-2xl border border-border bg-background/50 px-4 py-3 text-sm text-foreground transition-all duration-300 placeholder-muted-foreground focus:outline-hidden focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={messagePlaceholder}
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitted}
                className={`group w-full inline-flex items-center justify-center rounded-2xl px-6 py-4 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 active:scale-95 cursor-pointer ${
                  isSubmitted 
                    ? "bg-emerald-600 shadow-emerald-600/20" 
                    : "bg-primary shadow-primary/20 hover:bg-primary/95 hover:shadow-primary/35 hover:-translate-y-1"
                }`}
              >
                {isSubmitted ? (
                  "Повідомлення надіслано!"
                ) : (
                  <>
                    <span className="transition-transform duration-300 group-hover:-translate-x-1">
                      Надіслати повідомлення
                    </span>
                    <Send className="ml-2 h-4 w-4 animate-fly" />
                  </>
                )}
              </button>
            </form>
          </ScrollReveal>
        </section>

      </main>

      {/* FOOTER */}
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
