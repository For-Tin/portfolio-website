# Minimalist Developer Portfolio & CMS

Сучасне та високопродуктивне портфоліо розробника (Modern Developer Portfolio), виконане в мінімалістичному стилі Apple. Проєкт підтримує світлу та темну теми, містить інтерактивні анімації та має вбудовану повноцінну панель керування (CMS) для обробки вхідних повідомлень та моніторингу ботів.

> 🤖 **Важливе зауваження:** Цей проєкт (від початкової архітектури і до фінальної локалізації) був повністю створений з нуля за допомогою штучного інтелекту **Google DeepMind Antigravity (Agentic Coding)**. AI-агент виступав у ролі напарника-розробника (Pair Programmer), реалізуючи верстку, анімації, інтеграцію з GitHub API, переклад сторінки та налаштування автоматичного тестування.

---

## 🛠 Технологічний стек

* **Фреймворк:** [Next.js 16 (App Router)](https://nextjs.org/) — серверний рендеринг та роутинг.
* **UI/Стилізація:** [Tailwind CSS v4](https://tailwindcss.com/) — для швидкої адаптивної верстки.
* **Анімації:** [Framer Motion](https://www.framer.com/motion/) — плавні переходи та 3D-ефекти карток.
* **Мова програмування:** [TypeScript](https://www.typescriptlang.org/) — сувора типізація.
* **База даних та Авторизація:** [Supabase](https://supabase.com/) — PostgreSQL, Row Level Security (RLS) та Auth.
* **Середовище:** [Bun](https://bun.sh/) — надшвидкий менеджер пакетів та рантайм.
* **Тестування:** [Vitest](https://vitest.dev/) + React Testing Library — для юніт-тестів.

---

## 🌟 Основні фічі
- **Адаптивний UI:** Підтримка мобільних пристроїв та браузерів (вкл. WebView Telegram).
- **Dark/Light Mode:** Перемикач тем.
- **CMS (Адмін-панель):** Доступна за адресою `/admin`. Захищена паролем.
- **Realtime Оновлення:** Вимкнення контактної форми в адмінці миттєво оновлює кнопку у користувачів через WebSockets.
- **Моніторинг ботів:** Автоматичне відображення статусу (Online/Offline) твоїх зовнішніх ботів (Telegram, Discord).
- **Анти-спам:** Honeypot та IP Rate Limiting.

---

## 🚀 Як запустити локально

### 1. Налаштування бази даних (Supabase)
Цей проєкт вимагає Supabase для збереження повідомлень та налаштувань.
1. Створіть новий проєкт на [Supabase](https://supabase.com/).
2. Увійдіть у **SQL Editor** вашого проєкту.
3. Скопіюйте код із файлу `database/setup.sql` та виконайте його. Це створить усі потрібні таблиці та налаштує безпеку (RLS).
4. Увімкніть **Realtime** для таблиці `site_settings` (в розділі *Database -> Replication*).

### 2. Налаштування змінних середовища
Скопіюйте файл `.env.example` у `.env.local` та заповніть свої дані:
```bash
cp .env.example .env.local
```
Відкрийте `.env.local` і вставте свої ключі (Telegram токени, Supabase URL та Anon Key).

### 3. Запуск проєкту
```bash
# Встановіть залежності
bun install

# Запустіть сервер для розробки
bun run dev
```
Відкрийте у браузері [http://localhost:3000](http://localhost:3000)

---

## 🤖 Підключення статусів зовнішніх ботів
Щоб ваші боти (наприклад, на Python чи Node.js) світилися як "Online" в адмін-панелі сайту, вони повинні оновлювати свій статус у базі даних кожну хвилину.

Приклад (Node.js):
```javascript
import { createClient } from '@supabase/supabase-js'

const supabase = createClient('SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY')

setInterval(async () => {
  await supabase
    .from('bot_status')
    .update({ last_active: new Date().toISOString() })
    .eq('bot_name', 'telegram') // або 'discord'
}, 60000)
```
*Зверніть увагу, що для оновлення статусів боти повинні використовувати `SUPABASE_SERVICE_ROLE_KEY`, оскільки він обходить RLS.*

---

## 🧪 Тестування

Проєкт має налаштоване середовище для юніт-тестування React компонентів:
* Запустити тести: `bun run test`
* Запустити тести в режимі watch: `bun run test:watch`

---
*Created by For-Tin & Google DeepMind Antigravity AI*
