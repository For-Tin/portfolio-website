import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { MessageActions } from "./MessageActions";
import { SettingsToggle } from "./SettingsToggle";
import { BotStatuses } from "./BotStatuses";
import { MessagesList } from "./MessagesList";
import { ScrollReveal } from "@/components/shared/scroll-reveal";

export default async function AdminDashboard() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    redirect("/admin/login");
  }
  
  // 1. Fetch messages
  const { data: messages, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("id", { ascending: false });

  // 2. Fetch site settings
  const { data: settingsData } = await supabase.from("site_settings").select("*");
  const formsEnabledSetting = settingsData?.find((s: any) => s.key === "forms_enabled");
  const formsEnabled = formsEnabledSetting ? formsEnabledSetting.value === "true" : true;

  // 3. Fetch bot statuses
  const { data: botsData } = await supabase.from("bot_status").select("*");

  if (error) {
    return (
      <div className="p-8 text-center text-destructive">
        Помилка завантаження повідомлень: {error.message}
      </div>
    );
  }


  return (
    <div className="relative min-h-screen overflow-x-hidden">
      {/* Background ambient blurs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 right-1/4 w-96 h-96 bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        
        {/* Функціональні блоки */}
        <ScrollReveal>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {/* Блок 1: Статуси ботів */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6">Статуси ботів</h2>
                <BotStatuses initialBotsData={botsData || []} />
              </div>
              <div className="relative z-10">
                <p className="text-xs text-muted-foreground/70 mt-8 border-t border-border/40 pt-4">
                  * Інформація оновлюється автоматично
                </p>
              </div>
            </div>

            {/* Блок 2: Налаштування форм */}
            <div className="p-6 rounded-2xl bg-card border border-border/50 shadow-sm flex flex-col justify-between relative overflow-hidden group">
              <div className="relative z-10">
                <h2 className="text-xl font-semibold tracking-tight text-foreground mb-6">Налаштування</h2>
                <div className="flex items-center justify-between p-4 rounded-xl border border-border/50 bg-background/50 gap-4">
                  <div className="pr-2">
                    <h3 className="font-medium text-foreground">Прийом анкет</h3>
                    <p className="text-sm text-muted-foreground mt-0.5">Дозволити користувачам надсилати анкети</p>
                  </div>
                  <div className="shrink-0">
                    <SettingsToggle isEnabled={formsEnabled} />
                  </div>
                </div>
              </div>
              <div className="relative z-10">
                <p className="text-xs text-muted-foreground/70 mt-8 border-t border-border/40 pt-4">
                  * Зміни застосовуються миттєво
                </p>
              </div>
            </div>
            
          </div>
        </ScrollReveal>

      <ScrollReveal delay={0.1}>
        <h1 className="text-2xl font-bold mb-6 tracking-tight text-foreground">Вхідні повідомлення</h1>
      </ScrollReveal>
      
      <MessagesList initialMessages={messages || []} />
    </div>
    </div>
  );
}
