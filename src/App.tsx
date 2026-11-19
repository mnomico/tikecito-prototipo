import { FormEvent, useEffect, useState } from "react";

type IconProps = { className?: string };
type Screen =
  | "desktop"
  | "chat"
  | "documenting"
  | "recording"
  | "recordingChat"
  | "processing"
  | "done"
  | "howTo"
  | "typing"
  | "searching"
  | "answer"
  | "mood"
  | "vacationTyping"
  | "vacationMode"
  | "returned"
  | "vacationReport";

function FolderIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path
        d="M5.5 13.5a4 4 0 0 1 4-4h10l4.5 5h14.5a4 4 0 0 1 4 4v18a4 4 0 0 1-4 4h-29a4 4 0 0 1-4-4v-23Z"
        fill="currentColor"
      />
      <path
        d="M5.5 18.5h37v18a4 4 0 0 1-4 4h-29a4 4 0 0 1-4-4v-18Z"
        fill="currentColor"
        opacity=".76"
      />
    </svg>
  );
}

function FileIcon({ className = "" }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 48 48" fill="none" aria-hidden="true">
      <path d="M11 5.5h17l9 9v28H11v-37Z" fill="white" />
      <path d="M28 5.5v9h9" fill="#d8e1e8" />
      <path
        d="M28 5.5v9h9M17 24h14M17 30h14M17 36h9"
        stroke="#8fa1ae"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function GridIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function SearchIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4 4" strokeLinecap="round" />
    </svg>
  );
}

function SendIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      <path d="m5 12 14-7-4.5 14-3-6-6.5-1Z" strokeLinejoin="round" />
      <path d="m11.5 13 3.5-3.5" strokeLinecap="round" />
    </svg>
  );
}

function DocumentIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M7 3.5h7l4 4v13H7v-17Z" strokeLinejoin="round" />
      <path d="M14 3.5v4h4M10 12h5M10 15.5h5" strokeLinecap="round" />
    </svg>
  );
}

function TrophyIcon({ className = "" }: IconProps) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M8 4h8v4.5a4 4 0 0 1-8 0V4Z" strokeLinejoin="round" />
      <path
        d="M8 6H4.5v1.5A3.5 3.5 0 0 0 8 11M16 6h3.5v1.5A3.5 3.5 0 0 1 16 11M12 12.5V17M8.5 20h7M10 17h4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TikecitoAvatar({
  size = "large",
  className = "",
  variant = "default",
}: {
  size?: "small" | "large";
  className?: string;
  variant?: "default" | "sad";
}) {
  const dimension = size === "large" ? "h-20 w-20" : "h-10 w-10";

  return (
    <div className={`tikecito-avatar ${dimension} ${className}`} aria-label="Tikecito avatar">
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
          d="M16 20.5h.01M32 20.5h.01"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {variant === "sad" ? (
          <>
            <path
              d="M15.5 34c2.3-3.2 5.1-4.7 8.5-4.7s6.2 1.5 8.5 4.7"
              stroke="currentColor"
              strokeWidth="2.7"
              strokeLinecap="round"
            />
            <path
              d="M34 23.5c0 2-1.4 3.4-1.4 4.5a1.4 1.4 0 0 0 2.8 0c0-1.1-1.4-2.5-1.4-4.5Z"
              fill="currentColor"
              opacity=".85"
            />
          </>
        ) : (
          <path
            d="M15.5 29c2.3 3.2 5.1 4.7 8.5 4.7s6.2-1.5 8.5-4.7"
            stroke="currentColor"
            strokeWidth="2.7"
            strokeLinecap="round"
          />
        )}
      </svg>
    </div>
  );
}

function formatTime(seconds: number) {
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

function TikecitoRecording({ elapsed, onClick }: { elapsed: number; onClick: () => void }) {
  return (
    <button
      className="recording-widget group"
      onClick={onClick}
      type="button"
      aria-label="Abrir chat con Tikecito mientras graba"
    >
      <span className="relative">
        <TikecitoAvatar className="!h-14 !w-14" />
        <span className="camera-badge" aria-hidden="true">
          <svg viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.7">
            <rect x="2.5" y="5.5" width="10" height="9" rx="2" />
            <path d="m12.5 8.5 5-2.5v8l-5-2.5v-3Z" strokeLinejoin="round" />
          </svg>
        </span>
      </span>
      <span className="rec-label">
        <span className="rec-dot" />
        REC {formatTime(elapsed)}
      </span>
    </button>
  );
}

const desktopItems = [
  { label: "Tickets", type: "folder" },
  { label: "Documentación", type: "folder" },
  { label: "Recursos", type: "folder" },
  { label: "Pendientes", type: "file" },
];

function Taskbar() {
  return (
    <div className="absolute inset-x-0 bottom-0 z-20 flex h-[58px] items-center border-t border-white/70 bg-white/76 px-5 shadow-[0_-8px_30px_rgba(38,62,71,0.06)] backdrop-blur-xl">
      <div className="flex flex-1 items-center gap-2">
        <button className="taskbar-button" type="button" aria-label="Aplicaciones">
          <GridIcon className="h-5 w-5" />
        </button>
        <button className="taskbar-search" type="button" aria-label="Buscar">
          <SearchIcon className="h-4 w-4 text-slate-500" />
          <span>Buscar</span>
        </button>
        <div className="taskbar-button">
          <FolderIcon className="h-6 w-6 text-[#6e9fa0]" />
        </div>
        <div className="taskbar-button">
          <span className="h-5 w-5 rounded-md bg-[#607d8b]" />
        </div>
      </div>
      <div className="flex items-center gap-3 text-slate-600">
        <svg
          className="h-4 w-4"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          aria-hidden="true"
        >
          <path
            d="M5 17.5a10 10 0 0 1 14 0M8 14a6 6 0 0 1 8 0M11 10.8a2 2 0 0 1 2 0"
            strokeLinecap="round"
          />
        </svg>
        <div className="text-right text-[11px] font-medium leading-[1.25]">
          <div>10:24</div>
          <div>18/06/2025</div>
        </div>
      </div>
    </div>
  );
}

function DesktopBackground() {
  return (
    <>
      <div className="wallpaper-shape wallpaper-shape-one" />
      <div className="wallpaper-shape wallpaper-shape-two" />
      <div className="absolute left-7 top-7 grid grid-cols-1 gap-5">
        {desktopItems.map((item) => (
          <button
            className="group flex w-[92px] flex-col items-center gap-1.5 rounded-xl px-2 py-2 text-center text-[13px] font-medium text-slate-700 transition hover:bg-white/55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600"
            key={item.label}
            type="button"
          >
            {item.type === "folder" ? (
              <FolderIcon className="h-12 w-12 text-[#6e9fa0] drop-shadow-sm transition group-hover:-translate-y-0.5" />
            ) : (
              <FileIcon className="h-12 w-12 drop-shadow-sm transition group-hover:-translate-y-0.5" />
            )}
            <span className="rounded-md px-1.5 py-0.5 group-hover:bg-white/75">{item.label}</span>
          </button>
        ))}
      </div>
      <Taskbar />
    </>
  );
}

const tableRows = [
  ["Lucía Fernández", "Soporte", "Activo"],
  ["Marcos Díaz", "Infraestructura", "Activo"],
  ["Sofía Rojas", "Desarrollo", "Pendiente"],
  ["Tomás Acosta", "Soporte", "Activo"],
];

function TaskApplication() {
  return (
    <div className="task-application screen-enter" aria-label="PLACEHOLDER – grabación de la tarea">
      <aside className="task-sidebar">
        <div className="flex items-center gap-2 px-5 py-6 text-[15px] font-bold text-white">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15">G</span>
          Gestión interna
        </div>
        <nav className="space-y-1 px-3 text-sm">
          <div className="task-nav-item">Resumen</div>
          <div className="task-nav-item task-nav-active">Usuarios</div>
          <div className="task-nav-item">Equipos</div>
          <div className="task-nav-item">Solicitudes</div>
          <div className="task-nav-item">Configuración</div>
        </nav>
      </aside>
      <section className="task-content">
        <div className="placeholder-label">PLACEHOLDER – grabación de la tarea</div>
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-8 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-400">
              Administración
            </p>
            <h1 className="mt-1 text-2xl font-semibold tracking-[-0.03em] text-slate-800">
              Gestión de usuarios
            </h1>
          </div>
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-600">
            LT
          </div>
        </header>
        <div className="p-8">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="font-semibold text-slate-800">Crear usuario</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Completá los datos para dar de alta un acceso.
                </p>
              </div>
              <button
                className="rounded-xl bg-[#167d7d] px-5 py-2.5 text-sm font-semibold text-white"
                type="button"
              >
                Guardar usuario
              </button>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <label className="task-field">
                <span>Nombre y apellido</span>
                <input defaultValue="Valentina Torres" readOnly />
              </label>
              <label className="task-field">
                <span>Correo electrónico</span>
                <input defaultValue="vtorres@empresa.com" readOnly />
              </label>
              <label className="task-field">
                <span>Área</span>
                <input defaultValue="Operaciones" readOnly />
              </label>
            </div>
          </div>
          <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-200 px-6 py-4">
              <h2 className="font-semibold text-slate-800">Usuarios recientes</h2>
              <div className="rounded-lg border border-slate-200 px-3 py-2 text-xs text-slate-400">
                Buscar usuario
              </div>
            </div>
            <table className="w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-6 py-3">Usuario</th>
                  <th className="px-6 py-3">Área</th>
                  <th className="px-6 py-3">Estado</th>
                </tr>
              </thead>
              <tbody>
                {tableRows.map((row) => (
                  <tr className="border-t border-slate-100 text-slate-600" key={row[0]}>
                    <td className="px-6 py-3.5 font-medium text-slate-700">{row[0]}</td>
                    <td className="px-6 py-3.5">{row[1]}</td>
                    <td className="px-6 py-3.5">
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                        {row[2]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
}

const quickReplies = [
  "Registrar un ticket",
  "Documentar una tarea",
  "¿Cómo se hace…?",
  "¿Cómo estás, Tikecito?",
  "Ver mi ranking",
];

function AssistantMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-2.5">
      <TikecitoAvatar size="small" className="mb-0.5 !h-8 !w-8 shrink-0" />
      <div className="max-w-[286px] rounded-[18px] rounded-bl-[5px] bg-slate-100 px-4 py-3 text-sm leading-[1.5] text-slate-700">
        {children}
      </div>
    </div>
  );
}

function UserMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[275px] rounded-[18px] rounded-br-[5px] bg-[#167d7d] px-4 py-3 text-sm leading-[1.45] text-white">
        {children}
      </div>
    </div>
  );
}

function MoodAnswer() {
  return (
    <div className="mood-answer">
      <strong>Estoy triste 😢</strong>
      <ul>
        <li>
          <span>🎫</span>
          <p>Hay 37 tickets abiertos para resolver.</p>
        </li>
        <li className="mood-emergency">
          <span>🚨</span>
          <div>
            <p>En el mes se utilizaron 4/5 de los cupos de urgencias.</p>
            <div className="mood-progress" aria-label="Cuatro de cinco cupos utilizados">
              <span />
            </div>
          </div>
        </li>
        <li>
          <span>✅</span>
          <p>Se cerraron 12 tickets en la semana.</p>
        </li>
      </ul>
    </div>
  );
}

function QuickReplies({ onSelect }: { onSelect: (reply: string) => void }) {
  return (
    <div className="ml-[42px] mt-3 flex max-w-[292px] flex-wrap gap-2">
      {quickReplies.map((reply) => (
        <button className="quick-reply" key={reply} onClick={() => onSelect(reply)} type="button">
          {reply}
        </button>
      ))}
    </div>
  );
}

function ChatWindow({
  screen,
  onClose,
  onDocument,
  onHowTo,
  onStartTyping,
  onSearch,
  onVacationType,
  onVacationSend,
  onReturn,
  onRanking,
  onMood,
  onStop,
}: {
  screen: Exclude<Screen, "desktop" | "recording">;
  onClose: () => void;
  onDocument: () => void;
  onHowTo: () => void;
  onStartTyping: () => void;
  onSearch: () => void;
  onVacationType: () => void;
  onVacationSend: () => void;
  onReturn: () => void;
  onRanking: () => void;
  onMood: () => void;
  onStop: () => void;
}) {
  const [message, setMessage] = useState("");
  const [sentMessages, setSentMessages] = useState<string[]>([]);
  const question = "Necesito saber cómo puedo resolver el ticket X";
  const vacationMessage = "Me voy de vacaciones";
  const displayedMessage =
    screen === "typing" ? question : screen === "vacationTyping" ? vacationMessage : message;

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (screen === "typing") {
      onSearch();
      return;
    }
    if (screen === "vacationTyping") {
      onVacationSend();
      return;
    }
    const trimmedMessage = message.trim();
    if (!trimmedMessage) return;
    setSentMessages((current) => [...current, trimmedMessage]);
    setMessage("");
  }

  function selectReply(reply: string) {
    if (
      reply === "Documentar una tarea" &&
      (screen === "chat" ||
        screen === "done" ||
        screen === "answer" ||
        screen === "mood" ||
        screen === "vacationReport")
    ) {
      onDocument();
      return;
    }
    if (
      reply === "¿Cómo se hace…?" &&
      (screen === "chat" ||
        screen === "done" ||
        screen === "answer" ||
        screen === "mood" ||
        screen === "vacationReport")
    ) {
      setMessage("");
      onHowTo();
      return;
    }
    if (reply === "Ver mi ranking" && screen === "chat") {
      onRanking();
      return;
    }
    if (
      reply === "¿Cómo estás, Tikecito?" &&
      (screen === "chat" ||
        screen === "done" ||
        screen === "answer" ||
        screen === "mood" ||
        screen === "vacationReport")
    ) {
      onMood();
      return;
    }
    setSentMessages((current) => [...current, reply]);
  }

  return (
    <section className="chat-window" aria-label="Chat con Tikecito">
      <header className="flex h-[76px] shrink-0 items-center border-b border-slate-100 px-5">
        <TikecitoAvatar size="small" variant={screen === "mood" ? "sad" : "default"} />
        <div className="ml-3 min-w-0 flex-1">
          <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">Tikecito</h1>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                screen === "processing" || screen === "searching"
                  ? "bg-amber-400"
                  : "bg-emerald-500"
              }`}
            />
            {screen === "processing"
              ? "Procesando"
              : screen === "searching"
                ? "Buscando"
                : "En línea"}
          </div>
        </div>
        <button className="chat-close" onClick={onClose} type="button" aria-label="Cerrar chat">
          <svg
            className="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="chat-scroll flex-1 overflow-y-auto px-5 py-5">
        <div className="screen-enter space-y-3" key={screen}>
          {(screen === "chat" || screen === "vacationTyping") && (
            <>
              <AssistantMessage>¡Hola! Soy Tikecito 👋 ¿En qué te puedo ayudar?</AssistantMessage>
              <QuickReplies onSelect={selectReply} />
            </>
          )}

          {screen === "documenting" && (
            <>
              <UserMessage>Documentar una tarea</UserMessage>
              <AssistantMessage>
                ¡Dale! Voy a grabar tu pantalla mientras hacés la tarea. Hacela como siempre, yo me
                encargo de anotar los pasos 🎥
              </AssistantMessage>
              <div className="ml-[42px] flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2.5 text-xs font-medium text-teal-800">
                <span className="countdown-dot" />
                La grabación empieza en 3… 2… 1…
              </div>
            </>
          )}

          {screen === "recordingChat" && (
            <>
              <AssistantMessage>Estoy grabando… Avisame cuando termines.</AssistantMessage>
              <div className="ml-[42px] pt-1">
                <button className="stop-recording-button" onClick={onStop} type="button">
                  <span className="h-2.5 w-2.5 rounded-[2px] bg-white" />
                  Detener grabación
                </button>
              </div>
            </>
          )}

          {screen === "processing" && (
            <>
              <UserMessage>Detener grabación</UserMessage>
              <AssistantMessage>
                ¡Listo! Estoy procesando la grabación y armando el documento…
              </AssistantMessage>
              <div
                className="ml-[42px] flex h-9 items-center gap-1 rounded-xl bg-slate-50 px-4 text-slate-400"
                aria-label="Procesando"
              >
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="loading-dot" />
              </div>
            </>
          )}

          {screen === "done" && (
            <>
              <AssistantMessage>
                ¡Documenté la tarea con éxito! 🎉 Ya la puede consultar todo el equipo.
              </AssistantMessage>
              <a
                className="document-card"
                href="#documento"
                onClick={(event) => event.preventDefault()}
              >
                <span className="document-card-icon">
                  <DocumentIcon className="h-6 w-6" />
                </span>
                <span className="min-w-0 flex-1">
                  <strong>Alta de usuarios en Gestión interna</strong>
                  <small>Documento · creado por vos con Tikecito</small>
                  <span className="document-link">Abrir documento →</span>
                </span>
              </a>
              <QuickReplies onSelect={selectReply} />
            </>
          )}

          {(screen === "howTo" || screen === "typing") && (
            <>
              <UserMessage>¿Cómo se hace…?</UserMessage>
              <AssistantMessage>¡Claro! Decime qué querés hacer.</AssistantMessage>
            </>
          )}

          {screen === "searching" && (
            <>
              <UserMessage>{question}</UserMessage>
              <AssistantMessage>¡Ya te averiguo! 🔍</AssistantMessage>
              <div
                className="ml-[42px] flex h-9 items-center gap-1 rounded-xl bg-slate-50 px-4 text-slate-400"
                aria-label="Buscando una respuesta"
              >
                <span className="loading-dot" />
                <span className="loading-dot" />
                <span className="loading-dot" />
              </div>
            </>
          )}

          {screen === "answer" && (
            <>
              <UserMessage>{question}</UserMessage>
              <AssistantMessage>
                <div className="answer-message">
                  <p>
                    Para resolver este tipo de ticket, primero revisá la información reportada y
                    confirmá que el usuario tenga acceso al sistema. Después, validá si el
                    comportamiento puede reproducirse.
                  </p>
                  <ol>
                    <li>Buscá el ticket y verificá los datos del usuario.</li>
                    <li>Revisá los permisos y el estado de su cuenta.</li>
                    <li>Reproducí el inconveniente en un entorno de prueba.</li>
                    <li>Aplicá la solución y registrá el resultado en el ticket.</li>
                  </ol>
                  <p>
                    Si el problema continúa, adjuntá las evidencias y derivá el caso al equipo de
                    Infraestructura indicando todo lo que ya verificaste.
                  </p>
                  <div className="answer-source">📚 Esto me lo enseñó Romina</div>
                </div>
              </AssistantMessage>
              <QuickReplies onSelect={selectReply} />
            </>
          )}

          {screen === "mood" && (
            <>
              <UserMessage>¿Cómo estás, Tikecito?</UserMessage>
              <MoodAssistantMessage>
                <MoodAnswer />
              </MoodAssistantMessage>
              <QuickReplies onSelect={selectReply} />
            </>
          )}

          {screen === "vacationMode" && (
            <>
              <UserMessage>{vacationMessage}</UserMessage>
              <AssistantMessage>
                ¡Ok, que la pases bien! 🏖️ Mientras no estás, voy a ayudar al equipo con tu
                conocimiento, así no te molestan.
              </AssistantMessage>
              <div className="ml-[42px] pt-1">
                <button className="quick-reply" onClick={onReturn} type="button">
                  Volví
                </button>
              </div>
            </>
          )}

          {(screen === "returned" || screen === "vacationReport") && (
            <>
              <UserMessage>{vacationMessage}</UserMessage>
              <AssistantMessage>
                ¡Ok, que la pases bien! 🏖️ Mientras no estás, voy a ayudar al equipo con tu
                conocimiento, así no te molestan.
              </AssistantMessage>
              <div className="time-separator">
                <span>15 días después</span>
              </div>
              <UserMessage>Volví</UserMessage>
              <AssistantMessage>
                ¡Hola, Juanito! ¿Cómo estuvieron las vacas? ¿Todo piola? Esto fue lo que pasó
                mientras no estabas:
              </AssistantMessage>

              {screen === "vacationReport" && (
                <>
                  <div className="vacation-report">
                    <div className="vacation-report-header">
                      <span className="text-[10px] font-bold uppercase tracking-[0.12em] text-teal-700">
                        Informe personal
                      </span>
                      <h2>Mientras no estabas</h2>
                    </div>

                    <div className="vacation-stat">
                      <strong>23</strong>
                      <span>consultas resueltas gracias a lo que documentaste</span>
                    </div>

                    <div className="report-section">
                      <h3>Tus documentos más usados</h3>
                      <div className="report-documents">
                        {[
                          ["[Documento 1]", "12 usos"],
                          ["[Documento 2]", "7 usos"],
                          ["[Documento 3]", "4 usos"],
                        ].map(([title, uses]) => (
                          <div className="report-document-row" key={title}>
                            <span className="report-document-icon">
                              <DocumentIcon className="h-4 w-4" />
                            </span>
                            <span className="min-w-0 flex-1 truncate">{title}</span>
                            <small>{uses}</small>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="ranking-points">
                      <span className="ranking-icon">
                        <TrophyIcon className="h-5 w-5" />
                      </span>
                      <span>
                        <small>Puntos en el ranking</small>
                        <strong>+150 puntos</strong>
                      </span>
                    </div>
                  </div>
                  <QuickReplies onSelect={selectReply} />
                </>
              )}
            </>
          )}

          {sentMessages.map((sentMessage, index) => (
            <UserMessage key={`${sentMessage}-${index}`}>{sentMessage}</UserMessage>
          ))}
        </div>
      </div>

      <form className="border-t border-slate-100 p-4" onSubmit={sendMessage}>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 pl-4 transition focus-within:border-teal-600 focus-within:bg-white focus-within:ring-3 focus-within:ring-teal-600/10">
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            onChange={(event) => setMessage(event.target.value)}
            onClick={() => {
              if (screen === "howTo") onStartTyping();
              if (screen === "chat") onVacationType();
            }}
            onFocus={() => {
              if (screen === "howTo") onStartTyping();
              if (screen === "chat") onVacationType();
            }}
            placeholder="Escribile a Tikecito…"
            value={displayedMessage}
          />
          <button
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#167d7d] text-white shadow-sm transition hover:bg-[#116b6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-45"
            disabled={screen !== "typing" && screen !== "vacationTyping" && !message.trim()}
            type="submit"
            aria-label="Enviar mensaje"
          >
            <SendIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </form>
    </section>
  );
}

type RankingScreen = "desktop" | "initial" | "result";

const rankingRows = [
  { place: "🥇", name: "Romina", points: "1580" },
  { place: "🥈", name: "Martín", points: "1410" },
  { place: "🥉", name: "Juanito", points: "1260", current: true },
  { place: "4", name: "Sofía", points: "980" },
  { place: "5", name: "Diego", points: "870" },
  { place: "6", name: "Carla", points: "640" },
];

const pointDetails = [
  { icon: "📝", value: "520", description: "por documentar tareas" },
  { icon: "👀", value: "740", description: "porque tus documentos fueron consultados" },
  { icon: "📈", value: "+105", description: "ganados esta semana", accent: true },
];

function RankingCard() {
  return (
    <div className="ranking-card">
      <section className="ranking-table-section">
        <div className="ranking-section-heading">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-50 text-lg">🏆</span>
          <div>
            <span>Temporada actual</span>
            <h2>Ranking de la temporada</h2>
          </div>
        </div>
        <div className="ranking-table-wrap">
          <table className="ranking-table">
            <thead>
              <tr>
                <th>Puesto</th>
                <th>Nombre</th>
                <th>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {rankingRows.map((row) => (
                <tr className={row.current ? "is-current-user" : ""} key={row.name}>
                  <td className="ranking-place">{row.place}</td>
                  <td>
                    <span className="ranking-person">
                      {row.name}
                      {row.current && <small>Vos</small>}
                    </span>
                  </td>
                  <td className="ranking-score">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <aside className="points-column">
        <div className="points-heading">
          <span>Tu desempeño</span>
          <h2>Tus puntos</h2>
        </div>
        <div className="point-blocks">
          {pointDetails.map((detail) => (
            <div
              className={`point-block ${detail.accent ? "point-block-accent" : ""}`}
              key={detail.value}
            >
              <span className="point-icon">{detail.icon}</span>
              <div>
                <strong>{detail.value}</strong>
                <p>{detail.description}</p>
              </div>
            </div>
          ))}
        </div>
      </aside>
    </div>
  );
}

function RankingChatWindow({
  screen,
  onClose,
  onShowRanking,
}: {
  screen: Exclude<RankingScreen, "desktop">;
  onClose: () => void;
  onShowRanking: () => void;
}) {
  function selectReply(reply: string) {
    if (screen === "initial" && reply === "Ver mi ranking") onShowRanking();
  }

  return (
    <section
      className={`chat-window ranking-chat-shell ${screen === "result" ? "ranking-chat-expanded" : ""}`}
      aria-label="Chat de ranking con Tikecito"
    >
      <header className="flex h-[76px] shrink-0 items-center border-b border-slate-100 px-5">
        <TikecitoAvatar size="small" />
        <div className="ml-3 min-w-0 flex-1">
          <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">Tikecito</h1>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            En línea
          </div>
        </div>
        <button className="chat-close" onClick={onClose} type="button" aria-label="Cerrar chat">
          <svg
            className="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="chat-scroll flex-1 overflow-y-auto px-5 py-5">
        <div className="screen-enter space-y-3" key={screen}>
          {screen === "initial" ? (
            <>
              <AssistantMessage>¡Hola! Soy Tikecito 👋 ¿En qué te puedo ayudar?</AssistantMessage>
              <QuickReplies onSelect={selectReply} />
            </>
          ) : (
            <>
              <UserMessage>Ver mi ranking</UserMessage>
              <AssistantMessage>¡Ok, acá está el ranking! 🏆</AssistantMessage>
              <div className="ml-[42px]">
                <RankingCard />
              </div>
              <QuickReplies onSelect={selectReply} />
            </>
          )}
        </div>
      </div>

      <form className="border-t border-slate-100 p-4" onSubmit={(event) => event.preventDefault()}>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 pl-4">
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Escribile a Tikecito…"
            readOnly
          />
          <button
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#167d7d] text-white opacity-45 shadow-sm"
            disabled
            type="submit"
            aria-label="Enviar mensaje"
          >
            <SendIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </form>
    </section>
  );
}

function RankingFlow({ startAtResult = false }: { startAtResult?: boolean }) {
  const [screen, setScreen] = useState<RankingScreen>(startAtResult ? "initial" : "desktop");
  const chatVisible = screen !== "desktop";

  useEffect(() => {
    if (!startAtResult) return;
    const timer = window.setTimeout(() => setScreen("result"), 60);
    return () => window.clearTimeout(timer);
  }, [startAtResult]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#dfe7e9]">
      <div className="desktop-frame">
        <DesktopBackground />

        <div
          className={`absolute bottom-[86px] right-8 z-10 flex items-end gap-3 transition-all duration-300 ${
            screen === "desktop"
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-5 scale-90 opacity-0"
          }`}
        >
          <div className="hello-bubble">
            ¡Hola! Hacé click si
            <br />
            me necesitás
          </div>
          <button
            className="avatar-button group"
            onClick={() => setScreen("initial")}
            type="button"
            aria-label="Abrir chat con Tikecito"
          >
            <span className="absolute inset-0 rounded-full bg-[#167d7d]/20 opacity-0 transition group-hover:scale-125 group-hover:opacity-100" />
            <TikecitoAvatar className="relative transition-transform group-hover:-translate-y-1" />
          </button>
        </div>

        <div
          className={`absolute bottom-[76px] right-7 z-40 origin-bottom-right transition-all duration-300 ease-out ${
            chatVisible
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-8 scale-[0.94] opacity-0"
          }`}
        >
          {chatVisible && (
            <RankingChatWindow
              screen={screen}
              onClose={() => setScreen("desktop")}
              onShowRanking={() => setScreen("result")}
            />
          )}
        </div>
      </div>
    </main>
  );
}

type MoodScreen = "desktop" | "initial" | "response";

function MoodAssistantMessage({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end gap-2.5">
      <TikecitoAvatar size="small" variant="sad" className="mb-0.5 !h-8 !w-8 shrink-0" />
      <div className="max-w-[290px] rounded-[18px] rounded-bl-[5px] bg-slate-100 px-4 py-3 text-sm leading-[1.5] text-slate-700">
        {children}
      </div>
    </div>
  );
}

function MoodChatWindow({
  screen,
  onClose,
  onShowMood,
}: {
  screen: Exclude<MoodScreen, "desktop">;
  onClose: () => void;
  onShowMood: () => void;
}) {
  return (
    <section className="chat-window" aria-label="Chat de estado de ánimo con Tikecito">
      <header className="flex h-[76px] shrink-0 items-center border-b border-slate-100 px-5">
        <TikecitoAvatar size="small" variant="sad" />
        <div className="ml-3 min-w-0 flex-1">
          <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">Tikecito</h1>
          <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            En línea
          </div>
        </div>
        <button className="chat-close" onClick={onClose} type="button" aria-label="Cerrar chat">
          <svg
            className="h-[18px] w-[18px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.9"
            aria-hidden="true"
          >
            <path d="m6 6 12 12M18 6 6 18" strokeLinecap="round" />
          </svg>
        </button>
      </header>

      <div className="chat-scroll flex-1 overflow-y-auto px-5 py-5">
        <div className="screen-enter space-y-3" key={screen}>
          {screen === "initial" ? (
            <>
              <MoodAssistantMessage>
                ¡Hola! Soy Tikecito 👋 ¿En qué te puedo ayudar?
              </MoodAssistantMessage>
              <div className="ml-[42px] mt-3 flex max-w-[292px] flex-wrap gap-2">
                {quickReplies.map((reply) => (
                  <button
                    className={`quick-reply ${
                      reply === "¿Cómo estás, Tikecito?" ? "mood-question-chip" : ""
                    }`}
                    key={reply}
                    onClick={reply === "¿Cómo estás, Tikecito?" ? onShowMood : undefined}
                    type="button"
                  >
                    {reply}
                  </button>
                ))}
              </div>
            </>
          ) : (
            <>
              <UserMessage>¿Cómo estás, Tikecito?</UserMessage>
              <MoodAssistantMessage>
                <MoodAnswer />
              </MoodAssistantMessage>
              <QuickReplies onSelect={() => undefined} />
            </>
          )}
        </div>
      </div>

      <form className="border-t border-slate-100 p-4" onSubmit={(event) => event.preventDefault()}>
        <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 pl-4">
          <input
            className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
            placeholder="Escribile a Tikecito…"
            readOnly
          />
          <button
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#167d7d] text-white opacity-45 shadow-sm"
            disabled
            type="submit"
            aria-label="Enviar mensaje"
          >
            <SendIcon className="h-[18px] w-[18px]" />
          </button>
        </div>
      </form>
    </section>
  );
}

function MoodFlow() {
  const [screen, setScreen] = useState<MoodScreen>("desktop");
  const chatVisible = screen !== "desktop";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#dfe7e9]">
      <div className="desktop-frame">
        <DesktopBackground />

        <div
          className={`absolute bottom-[86px] right-8 z-10 flex items-end gap-3 transition-all duration-300 ${
            screen === "desktop"
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-5 scale-90 opacity-0"
          }`}
        >
          <div className="hello-bubble">
            ¡Hola! Hacé click si
            <br />
            me necesitás
          </div>
          <button
            className="avatar-button group"
            onClick={() => setScreen("initial")}
            type="button"
            aria-label="Abrir chat con Tikecito"
          >
            <span className="absolute inset-0 rounded-full bg-[#167d7d]/20 opacity-0 transition group-hover:scale-125 group-hover:opacity-100" />
            <TikecitoAvatar
              variant="sad"
              className="relative transition-transform group-hover:-translate-y-1"
            />
          </button>
        </div>

        <div
          className={`absolute bottom-[76px] right-7 z-40 origin-bottom-right transition-all duration-300 ease-out ${
            chatVisible
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-8 scale-[0.94] opacity-0"
          }`}
        >
          {chatVisible && (
            <MoodChatWindow
              screen={screen}
              onClose={() => setScreen("desktop")}
              onShowMood={() => setScreen("response")}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default function App() {
  const [screen, setScreen] = useState<Screen>("desktop");
  const [elapsed, setElapsed] = useState(42);
  const [rankingShortcut, setRankingShortcut] = useState(false);
  const hasTaskBackground = ["recording", "recordingChat", "processing", "done"].includes(screen);
  const chatVisible = [
    "chat",
    "documenting",
    "recordingChat",
    "processing",
    "done",
    "howTo",
    "typing",
    "searching",
    "answer",
    "mood",
    "vacationTyping",
    "vacationMode",
    "returned",
    "vacationReport",
  ].includes(screen);

  useEffect(() => {
    if (
      screen !== "documenting" &&
      screen !== "processing" &&
      screen !== "searching" &&
      screen !== "returned"
    )
      return;
    const nextScreen =
      screen === "documenting"
        ? "recording"
        : screen === "processing"
          ? "done"
          : screen === "searching"
            ? "answer"
            : "vacationReport";
    const timer = window.setTimeout(
      () => setScreen(nextScreen),
      screen === "returned" ? 2000 : 3000,
    );
    return () => window.clearTimeout(timer);
  }, [screen]);

  useEffect(() => {
    if (screen !== "recording" && screen !== "recordingChat") return;
    const timer = window.setInterval(() => setElapsed((current) => current + 1), 1000);
    return () => window.clearInterval(timer);
  }, [screen]);

  function startDocumenting() {
    setElapsed(42);
    setScreen("documenting");
  }

  const isRankingFlow =
    window.location.pathname.endsWith("/ranking") ||
    new URLSearchParams(window.location.search).get("flujo") === "ranking";
  const isMoodFlow =
    window.location.pathname.endsWith("/estado") ||
    new URLSearchParams(window.location.search).get("flujo") === "estado";

  if (isMoodFlow) return <MoodFlow />;
  if (isRankingFlow || rankingShortcut) {
    const startsAtResult =
      rankingShortcut ||
      new URLSearchParams(window.location.search).get("pantalla") === "resultado";
    return <RankingFlow startAtResult={startsAtResult} />;
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#dfe7e9]">
      <div
        className={`desktop-frame ${screen === "recording" || screen === "recordingChat" ? "is-recording" : ""}`}
      >
        {hasTaskBackground ? <TaskApplication /> : <DesktopBackground />}

        <div
          className={`absolute bottom-[86px] right-8 z-10 flex items-end gap-3 transition-all duration-300 ${
            screen === "desktop"
              ? "translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-5 scale-90 opacity-0"
          }`}
        >
          <div className="hello-bubble">
            ¡Hola! Hacé click si
            <br />
            me necesitás
          </div>
          <button
            className="avatar-button group"
            onClick={() => setScreen("chat")}
            type="button"
            aria-label="Abrir chat con Tikecito"
          >
            <span className="absolute inset-0 rounded-full bg-[#167d7d]/20 opacity-0 transition group-hover:scale-125 group-hover:opacity-100" />
            <TikecitoAvatar className="relative transition-transform group-hover:-translate-y-1" />
          </button>
        </div>

        {screen === "recording" && (
          <div className="absolute bottom-7 right-7 z-30 screen-enter">
            <TikecitoRecording elapsed={elapsed} onClick={() => setScreen("recordingChat")} />
          </div>
        )}

        <div
          className={`absolute bottom-[76px] right-7 z-40 origin-bottom-right transition-all duration-300 ease-out ${
            chatVisible
              ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
              : "pointer-events-none translate-y-8 scale-[0.94] opacity-0"
          }`}
        >
          {chatVisible && (
            <ChatWindow
              screen={screen as Exclude<Screen, "desktop" | "recording">}
              onClose={() => setScreen("desktop")}
              onDocument={startDocumenting}
              onHowTo={() => setScreen("howTo")}
              onStartTyping={() => setScreen("typing")}
              onSearch={() => setScreen("searching")}
              onVacationType={() => setScreen("vacationTyping")}
              onVacationSend={() => setScreen("vacationMode")}
              onReturn={() => setScreen("returned")}
              onRanking={() => setRankingShortcut(true)}
              onMood={() => setScreen("mood")}
              onStop={() => setScreen("processing")}
            />
          )}
        </div>
      </div>
    </main>
  );
}
