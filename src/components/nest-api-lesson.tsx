import { Download, FlaskConical } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function NestApiLesson() {
  return <div className="mt-8 space-y-8 border-t pt-7">
    <section>
      <h3 className="font-semibold">Етап 1 · API на твоєму комп’ютері</h3>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">Окремий NestJS проєкт із двома навчальними кімнатами та повідомленнями в пам’яті. Чат цієї сторінки до нього не підключений. Логіну, PostgreSQL і передачі відео ще немає; користувач demo-host фіксований, це не автентифікація. Сервер доступний лише на 127.0.0.1:3001 — не публікуй його в інтернеті.</p>
      <Button asChild className="mt-4"><a href="/learning/nest-api.zip" download><Download />Завантажити NestJS API</a></Button>
      <p className="mt-2 text-xs text-muted-foreground">Вихідний код, 18 тестів і README українською · без залежностей і секретів</p>
    </section>
    <section>
      <h3 className="font-semibold">1. Запусти й перевір</h3>
      <p className="mt-3 text-sm leading-7">Потрібен Node.js 22+. Розпакуй архів, відкрий термінал у папці nest-api й виконай:</p>
      <pre className="code-block"><code>{'npm ci\nnpm test\nnpm start'}</code></pre>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">Тести спочатку компілюють API. Очікуваний підсумок: 18 пройшли, 0 помилок. Після змін повторюй npm test, тоді npm start. Запити виконуй у другому терміналі; у PowerShell використовуй curl.exe або Postman.</p>
      <pre className="code-block"><code>{`curl -i http://127.0.0.1:3001/rooms
curl -i -X POST http://127.0.0.1:3001/rooms/room-001/messages \\
  -H 'Content-Type: application/json' -d '{"text":"  Привіт API  "}'
curl -i http://127.0.0.1:3001/rooms/room-001/messages`}</code></pre>
      <p className="mt-3 text-sm leading-7">Очікуй 200 → 201 → 200. У відповіді на читання знайди той самий id і текст без пробілів по краях.</p>
    </section>
    <section>
      <h3 className="font-semibold">2. Розбери рішення</h3>
      <dl className="mt-4 space-y-4 text-sm leading-7">
        <div><dt className="font-medium">Controller → DTO → Service</dt><dd className="text-muted-foreground">Controller приймає HTTP запит. DTO з ValidationPipe перевіряє JSON і обрізає пробіли; TypeScript не перевіряє дані під час виконання. Service перевіряє кімнату й членство, потім записує повідомлення.</dd></div>
        <div><dt className="font-medium">Доступ і особа — різні перевірки</dt><dd className="text-muted-foreground">Перевірка членства демонструє авторизацію щодо demo-host. Справжня автентифікація має підтвердити особу. authorId з JSON заборонений; фіксована константа також не замінює логін.</dd></div>
        <div><dt className="font-medium">Навіщо два види тестів?</dt><dd className="text-muted-foreground">Unit тести перевіряють service окремо. HTTP тести проходять через справжній Nest застосунок, маршрути й валідацію: порожній текст — 400, чужа кімната — 403, невідома — 404. Обраний для вправи ліміт — 500 символів.</dd></div>
        <div><dt className="font-medium">Чому поки без PostgreSQL?</dt><dd className="text-muted-foreground">Спочатку відокремимо HTTP, перевірки та логіку. Пам’ять навмисно тимчасова: після перезапуску все зникає. Базу даних додамо після твоєї практики.</dd></div>
      </dl>
    </section>
    <section className="border-t pt-6">
      <h3 className="flex items-center gap-2 font-semibold"><FlaskConical size={18} />3. Твоя практика перед наступним кроком</h3>
      <ol className="mt-4 list-decimal space-y-3 pl-5 text-sm leading-7">
        <li>Запусти тести й створи повідомлення. Перевір порожній текст, room-002 та missing: які статуси отримала?</li>
        <li>Додай HTTP тест для {'{ "text": true }'} у test/rooms.http.test.ts. Очікування — 400. Переконайся, що з помилковим очікуванням 201 він падає, а з 400 проходить.</li>
        <li>Поясни, чому тип string не перевіряє JSON, чому клієнт не задає authorId та що станеться після перезапуску.</li>
      </ol>
      <p className="mt-4 font-medium text-sm leading-7">Надішли в чат результат тестів, свій новий тест і відповіді — розберемо їх перед переходом до PostgreSQL.</p>
    </section>
  </div>;
}
