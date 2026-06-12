"use client";

import React, { useState, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import { ScrollReveal } from "@/components/shared/scroll-reveal";
import { Database, Monitor, Cpu } from "lucide-react";

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
    }, 40);

    return () => clearInterval(timer);
  }, [isInView, charIndex]);

  const totalChars = bioParagraphs.join("").length;

  return (
    <div ref={ref} className="space-y-6 text-muted-foreground text-md sm:text-lg leading-relaxed">
      {bioParagraphs.map((p, i) => {
        const previousChars = bioParagraphs.slice(0, i).join("").length;
        const pLen = p.length;
        const remainingForThis = Math.max(0, charIndex - previousChars);
        const take = Math.min(remainingForThis, pLen);
        
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

export function SkillsSection() {
  return (
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
                      className="px-4 py-1.5 rounded-2xl text-sm font-medium bg-background border border-border/40 text-foreground transition-all duration-200 ease-out hover:scale-105 hover:border-primary/50 hover:bg-primary hover:text-white cursor-default group relative"
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
  );
}
