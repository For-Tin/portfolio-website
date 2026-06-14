import { sendTelegramMessage } from "./src/app/actions";

async function test() {
  console.log("Відправляємо тестовий запит...");
  const result = await sendTelegramMessage({
    name: "AI Test Assistant",
    email: "test@ai-assistant.com",
    message: "Це тестове повідомлення для перевірки безпеки бази даних та роботи Telegram бота після впровадження нових правил RLS.",
    startTime: Date.now() - 5000 // Імітація того, що користувач заповнював форму більше 3 секунд
  });
  console.log("Результат:", result);
}

test();
