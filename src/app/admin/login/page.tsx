"use client";

import { useActionState, useEffect, useState } from "react";
import { loginAdmin } from "../actions";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Lock, Unlock, Mail, AlertCircle, X } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminLogin() {
  const router = useRouter();
  const [state, formAction, isPending] = useActionState(loginAdmin, null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (state?.error) {
      setErrorMessage(state.error);
      const timer = setTimeout(() => {
        setErrorMessage(null);
      }, 4000);
      return () => clearTimeout(timer);
    }
    
    if (state?.success) {
      setIsSuccess(true);
      const timer = setTimeout(() => {
        router.push('/admin');
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [state, router]);

  return (
    <>
      <div className="min-h-[calc(100vh-6rem)] flex items-center justify-center bg-background p-4 relative overflow-hidden -mt-24 pt-24">
        {/* Background ambient blurs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-md relative z-10"
        >
          <div className="backdrop-blur-2xl bg-card/70 border border-border/50 p-8 rounded-[32px] shadow-2xl shadow-black/5 dark:shadow-black/50">
            
            <div className="text-center mb-8">
              <motion.div 
                layoutId="header-icon"
                className={`w-16 h-16 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-inner border transition-colors duration-500 ${
                  isSuccess 
                    ? "bg-primary/20 border-primary/50" 
                    : "bg-muted border-border/50"
                }`}
              >
                <AnimatePresence mode="popLayout">
                  {isSuccess ? (
                    <motion.div
                      key="unlock"
                      initial={{ scale: 0.5, opacity: 0, rotate: -15 }}
                      animate={{ scale: 1, opacity: 1, rotate: 0 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                      transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    >
                      <Unlock className="w-8 h-8 text-primary" />
                    </motion.div>
                  ) : (
                    <motion.div
                      key="lock"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.5, opacity: 0 }}
                    >
                      <Lock className="w-7 h-7 text-foreground" />
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              <h1 className="text-3xl font-semibold tracking-tight text-foreground">
                {isSuccess ? "Успішний вхід" : "З поверненням"}
              </h1>
              <p className="text-muted-foreground mt-2 text-sm">
                Увійдіть до панелі керування
              </p>
            </div>
            
            <form action={formAction} className="space-y-4" noValidate>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="email"
                  name="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Електронна пошта"
                  required
                  autoComplete="email"
                  spellCheck="false"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-input/50 text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
                />
              </div>
              
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-foreground group-focus-within:text-primary transition-colors" />
                <input
                  type="password"
                  name="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Пароль"
                  required
                  autoComplete="current-password"
                  className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-border bg-input/50 text-foreground focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all placeholder:text-muted-foreground"
                />
              </div>

              <div className="group w-full pt-2">
                <button
                  type="submit"
                  disabled={isPending}
                  className={`w-full inline-flex items-center justify-center rounded-2xl px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-lg transition-all duration-300 active:scale-95 cursor-pointer ${
                    isPending
                      ? "bg-primary/70 shadow-primary/10 cursor-not-allowed"
                      : "bg-primary shadow-primary/20 group-hover:bg-primary/95 group-hover:shadow-primary/35 group-hover:-translate-y-1"
                  }`}
                >
                  {isPending ? (
                    <div className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
                  ) : (
                    <>
                      Увійти
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {errorMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className="fixed bottom-10 right-6 z-50 flex items-center gap-3 bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-2xl shadow-lg backdrop-blur-md"
          >
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span className="text-sm font-medium">{errorMessage}</span>
            <button 
              onClick={() => setErrorMessage(null)}
              className="ml-2 text-destructive/70 hover:text-destructive transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
