import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, BookOpen, Check, ChevronRight, Code2, Expand, Github, MessageSquare, Mic, MicOff, Radio, Send, Signal, Users, Video, VideoOff, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import hostPhoto from "@/assets/studio-host.jpg";
import { createMessage, lessons, type ChatMessage } from "@/lib/stream-demo";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [
    { title: "Streamroom — кімната трансляції та практикум" },
    { name: "description", content: "Браузерне демо відеокімнати з локальним чатом і покроковою підготовкою до React, NestJS та WebRTC." },
    { property: "og:title", content: "Streamroom — кімната трансляції та практикум" },
    { property: "og:description", content: "Навчальна відеокімната: локальна камера, чат і практикум потокового відео." },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ] }),
  component: Index,
});

const initialMessages: ChatMessage[] = [
  { id: 1, author: "Олена", text: "Привіт усім! 👋", time: "14:02" },
  { id: 2, author: "Андрій", text: "Сьогодні розбираємо WebRTC?", time: "14:03" },
  { id: 3, author: "Марія", text: "Так! Цікаво, як відео потрапляє до глядачів.", time: "14:03" },
];

function Index() {
  const [view, setView] = useState<"room" | "learn">("room");
  const [messages, setMessages] = useState(initialMessages);
  const [draft, setDraft] = useState("");
  const [lessonIndex, setLessonIndex] = useState(0);
  const [completed, setCompleted] = useState<number[]>([]);
  const [camera, setCamera] = useState(false);
  const [muted, setMuted] = useState(true);
  const [notice, setNotice] = useState("");
  const [github, setGithub] = useState(false);
  const [cameraBusy, setCameraBusy] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chatRef = useRef<HTMLDivElement>(null);
  const lesson = lessons[lessonIndex];

  useEffect(() => () => { streamRef.current?.getTracks().forEach(track => track.stop()); }, []);
  useEffect(() => {
    if (camera && videoRef.current) videoRef.current.srcObject = streamRef.current;
  }, [camera, view]);
  useEffect(() => { chatRef.current?.scrollTo({ top: chatRef.current.scrollHeight }); }, [messages]);

  async function toggleCamera() {
    if (camera) {
      streamRef.current?.getTracks().forEach(track => track.stop());
      streamRef.current = null;
      setCamera(false);
      setMuted(true);
      return;
    }
    setCameraBusy(true);
    setNotice("");
    try {
      if (!navigator.mediaDevices?.getUserMedia) throw new Error("unavailable");
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: false });
      streamRef.current = stream;
      setCamera(true);
    } catch {
      setNotice("Камера недоступна або дозвіл не надано. Демо залишається доступним.");
    } finally { setCameraBusy(false); }
  }

  async function toggleMic() {
    if (!camera) { setNotice("Спершу увімкни локальну камеру. Звук не передаватиметься іншим учасникам."); return; }
    if (!muted) {
      streamRef.current?.getAudioTracks().forEach(track => { track.stop(); streamRef.current?.removeTrack(track); });
      setMuted(true);
      return;
    }
    try {
      const audio = await navigator.mediaDevices.getUserMedia({ audio: true });
      audio.getAudioTracks().forEach(track => streamRef.current?.addTrack(track));
      setMuted(false);
    } catch { setNotice("Дозвіл на мікрофон не надано."); }
  }

  async function expand() {
    try {
      if (document.fullscreenElement) await document.exitFullscreen();
      else await stageRef.current?.requestFullscreen();
    } catch { setNotice("Повноекранний перегляд недоступний у цьому вікні."); }
  }

  function send() {
    const message = createMessage(draft, Date.now(), new Date().toLocaleTimeString("uk-UA", { hour: "2-digit", minute: "2-digit" }));
    if (!message) return;
    setMessages(previous => [...previous, message]);
    setDraft("");
  }

  function openLearn() { setView("learn"); setGithub(false); }

  if (!lesson) return null;

  return (
    <div className="min-h-screen bg-background">
      <header className="topbar">
        <a href="/" className="wordmark">streamroom<span className="text-primary">.</span></a>
        <nav className="flex items-center gap-1" aria-label="Основна навігація">
          <Button variant="ghost" onClick={() => setView("room")} className={view === "room" ? "nav-active" : "text-muted-foreground"}><Radio />Кімната</Button>
          <Button variant="ghost" onClick={openLearn} className={view === "learn" ? "nav-active" : "text-muted-foreground"}><BookOpen />Практикум</Button>
        </nav>
        <div className="flex items-center gap-3"><span className="hidden md:inline text-xs text-muted-foreground">Навчальний проєкт</span><Button variant="outline" size="icon" title="Підготовка до GitHub" aria-label="Підготовка до GitHub" onClick={() => setGithub(true)}><Github /></Button><span className="user-avatar">ТТ</span></div>
      </header>

      <main className="mx-auto max-w-[1440px] px-5 py-8 md:px-10 md:py-10">
        <div className="mb-7 flex flex-wrap items-start justify-between gap-4">
          <div><div className="mb-3 flex items-center gap-2 text-xs text-muted-foreground"><span>Робочий простір</span><ChevronRight size={12} /><span>{view === "room" ? "Відеокімната" : "Практикум"}</span></div><h1 className="text-3xl font-semibold">{view === "room" ? "Поговоримо про технології" : "Від демо до справжньої трансляції"}</h1><p className="mt-2 text-sm text-muted-foreground">{view === "room" ? "Кімната №001 · Відкрита зустріч" : "Твій навчальний проєкт · 5 послідовних етапів"}</p></div>
          <span className="demo-badge"><span className="size-1.5 rounded-full bg-primary" />Браузерне демо</span>
        </div>

        {view === "room" ? <>
          <div className="room-layout">
            <section className="min-w-0" aria-label="Відеокімната">
              <div ref={stageRef} className="video-stage">
                {camera ? <video ref={videoRef} autoPlay playsInline muted className="h-full w-full object-cover" aria-label="Локальне прев’ю камери" /> : <img src={hostPhoto} width={1536} height={1024} alt="Згенероване фото ведучої у студії — ілюстрація, не відеотрансляція" className="h-full w-full object-cover" />}
                <div className="stage-top"><span className="stage-label"><span className="size-1.5 rounded-full bg-primary" />{camera ? "ЛОКАЛЬНА КАМЕРА" : "ПРЕВ’Ю КІМНАТИ"}</span><span className="stage-label"><Signal size={13} />{camera ? "Лише на твоєму пристрої" : "Ілюстрація"}</span></div>
                <div className="stage-bottom"><div><p className="text-sm font-semibold">{camera ? "Ти" : "Ведуча"}</p><p className="mt-1 text-xs text-stage-foreground/80">{camera ? "Локальне прев’ю · без передачі відео" : "Технології, ідеї та живі розмови"}</p></div><span className="stage-label"><MicOff size={14} /></span></div>
              </div>
              <div className="control-bar"><div className="flex items-center gap-2"><span className="status-dot" /><span className="text-xs text-muted-foreground">{camera ? "Камера на пристрої" : "Не підключено"}</span></div><div className="flex items-center gap-2"><Button variant={muted ? "secondary" : "default"} size="icon" onClick={toggleMic} title={muted ? "Увімкнути локальний мікрофон" : "Вимкнути мікрофон"} aria-label={muted ? "Увімкнути локальний мікрофон" : "Вимкнути мікрофон"}>{muted ? <MicOff /> : <Mic />}</Button><Button variant={camera ? "default" : "secondary"} size="icon" disabled={cameraBusy} onClick={toggleCamera} title={camera ? "Вимкнути камеру" : "Увімкнути локальну камеру"} aria-label={camera ? "Вимкнути камеру" : "Увімкнути локальну камеру"}>{camera ? <Video /> : <VideoOff />}</Button><span className="mx-1 h-6 border-l" /><Button variant="ghost" size="icon" onClick={expand} title="На весь екран" aria-label="На весь екран"><Expand /></Button></div><span className="hidden sm:flex items-center gap-1 text-xs text-muted-foreground"><Users size={14} />1 на пристрої</span></div>
              {notice && <div role="status" className="mt-3 rounded-md border px-4 py-3 text-sm">{notice}</div>}
              <div className="mt-7 flex items-start gap-3"><div className="host-avatar">В</div><div><h2 className="font-semibold">Відкрита розмова про веброзробку</h2><p className="mt-1 text-sm text-muted-foreground">React, TypeScript та наступний крок — потокове відео.</p><div className="mt-3 flex gap-2"><span className="topic-tag">Технології</span><span className="topic-tag">Спільнота</span></div></div></div>
            </section>
            <aside className="chat-panel" aria-label="Локальний чат">
              <div className="flex items-center justify-between border-b px-5 py-5"><h2 className="flex items-center gap-2 font-semibold"><MessageSquare size={17} />Чат кімнати</h2><span className="text-xs text-muted-foreground">Локальний</span></div>
              <div className="px-5 pt-4 text-xs text-muted-foreground">Приклади повідомлень · не реальні учасники</div>
              <div ref={chatRef} className="chat-messages" role="log" aria-live="polite">{messages.map((message, index) => <div key={message.id} className="flex items-start gap-3"><span className={`chat-avatar avatar-${index % 3}`}>{message.author.charAt(0)}</span><div className="min-w-0 flex-1"><div className="flex items-center gap-2"><span className="text-xs font-semibold">{message.author}</span><time className="text-[10px] text-muted-foreground">{message.time}</time></div><p className="mt-1.5 break-words text-sm leading-relaxed">{message.text}</p></div></div>)}</div>
              <form className="border-t p-4" onSubmit={event => { event.preventDefault(); send(); }}><div className="flex items-center gap-2 rounded-md border bg-background p-1.5"><input value={draft} onChange={event => setDraft(event.target.value)} aria-label="Повідомлення" placeholder="Напиши повідомлення…" className="min-w-0 flex-1 bg-transparent px-2 py-2 text-sm outline-none" /><Button type="submit" size="icon" disabled={!draft.trim()} title="Надіслати" aria-label="Надіслати"><Send /></Button></div><p className="mt-3 text-[11px] text-muted-foreground">Повідомлення зникають після оновлення сторінки.</p></form>
            </aside>
          </div>
          <section className="learning-band"><div className="flex items-center gap-4"><span className="lesson-icon"><Code2 /></span><div><p className="mb-1 text-xs font-medium text-primary">НАСТУПНИЙ КРОК</p><h2 className="text-lg font-semibold">Що відбувається за кадром?</h2><p className="mt-1 text-sm text-muted-foreground">React → NestJS → LiveKit → перевірка у двох браузерах</p></div></div><Button variant="outline" onClick={openLearn}>До практикуму<ArrowRight /></Button></section>
        </> : <div className="lesson-layout"><aside className="space-y-2"><p className="mb-4 text-xs text-muted-foreground">МАРШРУТ НАВЧАННЯ</p>{lessons.map((item, index) => <Button key={item.title} variant="ghost" onClick={() => setLessonIndex(index)} className={`lesson-nav ${index === lessonIndex ? "nav-active" : ""}`}><span className="lesson-number">{completed.includes(index) ? <Check size={14} /> : `0${index + 1}`}</span><span className="min-w-0 whitespace-normal text-left">{item.title}</span></Button>)}<p className="pt-4 text-xs text-muted-foreground">Опрацьовано {completed.length} із 5 · прогрес локальний</p></aside><section className="min-w-0 md:border-l md:pl-10"><span className="topic-tag">{lesson.tag}</span><h2 className="mt-5 text-2xl font-semibold">{lesson.title}</h2><p className="mt-4 max-w-3xl text-sm leading-7 text-muted-foreground">{lesson.body}</p><pre className="code-block"><code>{lesson.code}</code></pre><div className="mt-7"><h3 className="flex items-center gap-2 font-semibold"><Code2 size={18} />Твоє завдання</h3><p className="mt-3 text-sm leading-7">{lesson.task}</p></div><div className="mt-8 flex flex-wrap gap-3"><Button onClick={() => setCompleted(previous => previous.includes(lessonIndex) ? previous.filter(index => index !== lessonIndex) : [...previous, lessonIndex])}><Check />{completed.includes(lessonIndex) ? "Позначено як опрацьоване" : "Позначити опрацьованим"}</Button><Button variant="outline" disabled={lessonIndex === 4} onClick={() => setLessonIndex(previous => previous + 1)}>Далі<ArrowRight /></Button><Button variant="ghost" onClick={() => setView("room")}><ArrowLeft />До кімнати</Button></div></section></div>}
        <footer className="mt-9 flex flex-wrap justify-between gap-3 border-t pt-5 text-xs text-muted-foreground"><span>streamroom · AI-assisted навчальний проєкт</span><span>React + TypeScript · сервіс трансляцій ще не підключено</span></footer>
      </main>

      {github && <div className="modal-backdrop" onClick={() => setGithub(false)}><section role="dialog" aria-modal="true" aria-labelledby="github-title" className="github-dialog" onClick={event => event.stopPropagation()}><div className="flex items-center justify-between"><Github size={24} /><Button variant="ghost" size="icon" autoFocus onClick={() => setGithub(false)} title="Закрити" aria-label="Закрити"><X /></Button></div><h2 id="github-title" className="mt-5 text-xl font-semibold">Окремий проєкт для GitHub</h2><p className="mt-3 text-sm leading-6 text-muted-foreground">Це демо ще не завантажене до GitHub. Підключити новий репозиторій можна в налаштуваннях проєкту → Git. Для NestJS створимо окремий навчальний проєкт на твоєму комп’ютері.</p><ul className="mt-5 space-y-3 text-sm"><li className="flex gap-2"><Check size={17} className="text-primary" />README: запуск, рішення, тести й обмеження</li><li className="flex gap-2"><Check size={17} className="text-primary" />AI-assisted: чесно описати власний внесок</li><li className="flex gap-2"><Check size={17} className="text-primary" />Без секретів і комерційного коду IT-Zone.dev</li></ul><Button className="mt-7 w-full" onClick={() => { setLessonIndex(4); openLearn(); }}><BookOpen />Відкрити завдання для GitHub<ArrowDown /></Button></section></div>}
    </div>
  );
}
