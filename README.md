# Streamroom

**Одна ведуча, нуль глядачів і README, що не прикрашає.**

Навчальний проєкт: кімната з чатом і камерою, бекенд на NestJS і шлях до
справжньої трансляції. Розбираємо, як влаштовані стрімінгові платформи —
від простого чату до відео, яке доходить до глядача.

## Що всередині

- **Відеокімната** — браузерне демо: локальний чат, опційне прев’ю камери
  на твоєму пристрої, п’ять етапів практикуму.
- **`learning/nest-api`** — окремий навчальний NestJS API з unit- та HTTP-тестами:
  `GET /rooms`, `GET /rooms/:id/messages`, `POST /rooms/:id/messages`.
- **`roadmap.md`** — що вже зроблено й що досі чекає на свій етап.

## Запуск

Проєкт керується через Bun (в репозиторії лежить `bun.lock`). `npm i` на цьому
проєкті падає з `Cannot read properties of null (reading 'edgesOut')` — тож
Bun не «альтернатива», а єдиний робочий шлях:

```sh
curl -fsSL https://bun.sh/install | bash   # встановлення Bun, якщо його ще немає
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

bun install
bun run dev
```

Щоб не повторювати `export` у кожному новому терміналі:

```sh
printf '\nexport BUN_INSTALL="$HOME/.bun"\nexport PATH="$BUN_INSTALL/bin:$PATH"\n' >> ~/.zshrc
```

`npm i` тут не працює (див. вище), тому всі команди — через `bun`.

Окремий API — у своїй папці, зі своїми залежностями:

```sh
cd learning/nest-api
npm ci
npm test
npm start
```

## Деплой на Vercel

Код живе в приватному репозиторії GitHub, Vercel бере його звідти і перевипускає
проєкт при кожному `git push`.

1. **Підключити GitHub** — у Lovable: Project settings → Git → Connect GitHub.
   З’явиться новий приватний репозиторій (ім’я `streamroom`).
2. **Імпортувати в Vercel** — vercel.com → Add New → Project → обрати цей
   репозиторій → Import.
3. **Налаштування збірки** (Vercel зазвичай визначає їх сам):

   | Поле | Значення |
   | --- | --- |
   | Project Name | `streamroom` |
   | Framework Preset | Vercel визначає автоматично |
   | Install Command | `bun install` |
   | Build Command | `bun run build` |
   | Output Directory | лишити порожнім |
   | Environment Variables | жодних не потрібно |

4. **Deploy.** Збірка робить статичні файли плюс одну серверну функцію на Node 22;
   локально це перевірено (`bun install` і `bun run build` у чистій копії
   репозиторія).

## Що це і чим не є

- Це **не** багатокористувацький стрімінг. Камера і чат живуть у твоєму браузері;
  сусідня вкладка тебе не бачить. Справжній streaming — на наступних етапах.
- Повідомлення чату зникають після оновлення сторінки.
- API слухає лише `127.0.0.1:3001`, дані тримає в пам’яті, `demo-host` — фіксована
  навчальна особа. Це тренувальний майданчик, а не автентифікація й не production.
- Code written with AI assistance; власний внесок і пояснення рішень — за тобою.

## Стек

TanStack Start · React · TypeScript · Tailwind CSS · NestJS (окремий навчальний проєкт)
