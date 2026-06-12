-- 1. Створюємо таблицю для налаштувань сайту
CREATE TABLE IF NOT EXISTS site_settings (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  key text UNIQUE NOT NULL,
  value text NOT NULL
);

-- Додаємо початкове значення для анкет (увімкнено)
INSERT INTO site_settings (key, value)
VALUES ('forms_enabled', 'true')
ON CONFLICT (key) DO NOTHING;

-- 2. Створюємо таблицю для статусу ботів
CREATE TABLE IF NOT EXISTS bot_status (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  bot_name text UNIQUE NOT NULL,
  last_active timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Додаємо початкові записи для двох ботів (офлайн за замовчуванням)
INSERT INTO bot_status (bot_name, last_active)
VALUES 
  ('telegram', timezone('utc'::text, now() - interval '1 hour')),
  ('discord', timezone('utc'::text, now() - interval '1 hour'))
ON CONFLICT (bot_name) DO NOTHING;

-- 3. Налаштування безпеки (Row Level Security)
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE bot_status ENABLE ROW LEVEL SECURITY;

-- Дозволяємо читати налаштування всім (для головної сторінки)
CREATE POLICY "Allow public read access to settings" 
ON site_settings FOR SELECT 
USING (true);

-- Дозволяємо змінювати налаштування тільки авторизованим користувачам (адміну)
CREATE POLICY "Allow authenticated update to settings" 
ON site_settings FOR UPDATE 
USING (auth.role() = 'authenticated');

-- Дозволяємо читати статуси ботів тільки авторизованому адміну
CREATE POLICY "Allow authenticated read to bot status" 
ON bot_status FOR SELECT 
USING (auth.role() = 'authenticated');

-- Примітка: Боти повинні оновлювати статус використовуючи ключ SUPABASE_SERVICE_ROLE_KEY,
-- який автоматично обходить усі RLS обмеження, тому для них політика UPDATE не потрібна.

-- 4. Створюємо таблицю для вхідних повідомлень (анкет)
CREATE TABLE IF NOT EXISTS contact_messages (
  id bigint PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
  name text NOT NULL,
  gmail text NOT NULL,
  message text NOT NULL,
  saw boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Налаштування безпеки для повідомлень
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Дозволяємо будь-кому (anon) відправляти нові повідомлення
CREATE POLICY "Allow anonymous inserts to messages" 
ON contact_messages FOR INSERT 
WITH CHECK (true);

-- Дозволяємо читати, оновлювати та видаляти повідомлення тільки адміну
CREATE POLICY "Allow authenticated full access to messages" 
ON contact_messages FOR ALL 
USING (auth.role() = 'authenticated');
