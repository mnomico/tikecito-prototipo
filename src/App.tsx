import { FormEvent, createContext, useContext, useEffect, useRef, useState } from "react";
import felizImage from "../images/ticket-feliz.png";
import grabandoImage from "../images/ticket-grabando.png";
import neutralImage from "../images/ticket-neutral.png";
import pensandoImage from "../images/ticket-pensando.png";
import tristeImage from "../images/ticket-triste.png";

// ===================== AVATAR DE TIKECITO =====================
// Para cambiar el dibujo de Tikecito, poné acá la imagen de cada expresión
// (una URL, o el import que genera Figma Make al subir la imagen).
// Si una expresión queda vacía (""), se usa la de "normal"; si "normal" también
// está vacía, se dibuja el Tikecito actual (la carita en el círculo verde).
//
//   normal   → saludo, charla en general
//   feliz    → tarea documentada, respuesta encontrada, ranking, informe de vacaciones
//   pensando → procesando la grabación, buscando una respuesta
//   triste   → "¿Cómo estás, Tikecito?"
//   grabando → grabación de pantalla en curso
const tikecitoImages: Record<TikecitoMood, string> = {
  normal: neutralImage,
  feliz: felizImage,
  pensando: pensandoImage,
  triste: tristeImage,
  grabando: grabandoImage,
};
// ==============================================================

type TikecitoMood = "normal" | "feliz" | "pensando" | "triste" | "grabando";

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
  | "vacationMode"
  | "returned"
  | "vacationReport"
  | "ranking";

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

// Expresión de Tikecito que usan los mensajes de la pantalla actual.
const MoodContext = createContext<TikecitoMood>("normal");

function TikecitoAvatar({
  size = "large",
  className = "",
  variant,
}: {
  size?: "small" | "large";
  className?: string;
  variant?: TikecitoMood;
}) {
  const contextMood = useContext(MoodContext);
  const mood = variant ?? contextMood;
  const dimension = size === "large" ? "h-20 w-20" : "h-10 w-10";
  const image = tikecitoImages[mood] || tikecitoImages.normal;

  if (image) {
    return (
      <div className={`tikecito-avatar has-image ${dimension} ${className}`}>
        <img src={image} alt="Tikecito" />
      </div>
    );
  }

  return (
    <div className={`tikecito-avatar ${dimension} ${className}`} aria-label="Tikecito avatar">
      <svg viewBox="0 0 48 48" fill="none" aria-hidden="true">
        <path
          d="M16 20.5h.01M32 20.5h.01"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
        />
        {mood === "triste" ? (
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
        <TikecitoAvatar className="!h-14 !w-14" variant="grabando" />
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
    <div
      className="task-application screen-enter"
      aria-label="Aplicación en la que se graba la tarea"
    >
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

const documentSteps = [
  <>
    Abrí <b>Gestión interna</b> y entrá en <b>Usuarios</b> desde el menú de la izquierda.
  </>,
  <>
    En <b>Crear usuario</b>, completá <b>Nombre y apellido</b>, <b>Correo electrónico</b> y{" "}
    <b>Área</b>.
  </>,
  <>
    Tocá <b>Guardar usuario</b>.
  </>,
  <>
    Revisá que la persona aparezca en <b>Usuarios recientes</b> con estado <b>Activo</b>.
  </>,
];

function DocumentWindow({ elapsed, onClose }: { elapsed: number; onClose: () => void }) {
  return (
    <section className="document-window screen-enter" aria-label="Documento generado por Tikecito">
      <header className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
        <span className="document-card-icon">
          <DocumentIcon className="h-6 w-6" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-teal-700">
            Documentación del equipo
          </p>
          <h2 className="truncate text-lg font-semibold tracking-[-0.02em] text-slate-800">
            Alta de usuarios en Gestión interna
          </h2>
        </div>
        <button
          className="chat-close"
          onClick={onClose}
          type="button"
          aria-label="Cerrar documento"
        >
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

      <div className="flex-1 overflow-y-auto px-6 py-5">
        <div className="flex items-center gap-2.5 text-xs text-slate-500">
          <TikecitoAvatar size="small" variant="feliz" className="!h-7 !w-7" />
          <span>
            Creado por <b className="text-slate-700">Juanito</b> con Tikecito · 18/06/2025 ·
            grabación de {formatTime(elapsed)}
          </span>
        </div>

        <h3 className="mt-6 text-sm font-semibold text-slate-800">Para qué sirve</h3>
        <p className="mt-1.5 text-sm leading-[1.6] text-slate-600">
          Dar de alta a una persona en Gestión interna para que tenga acceso al sistema.
        </p>

        <h3 className="mt-6 text-sm font-semibold text-slate-800">Pasos</h3>
        <ol className="document-steps">
          {documentSteps.map((step, index) => (
            <li key={index}>
              <span>{index + 1}</span>
              <p>{step}</p>
            </li>
          ))}
        </ol>

        <p className="mt-6 rounded-xl bg-teal-50 px-4 py-3 text-xs leading-[1.5] text-teal-800">
          📝 Tikecito armó este documento a partir de la grabación de pantalla. Ya lo puede
          consultar todo el equipo.
        </p>
      </div>
    </section>
  );
}

const quickReplies = [
  "Documentar una tarea",
  "¿Cómo se hace…?",
  "¿Cómo estás, Tikecito?",
  "Ver mi ranking",
  "Me voy de vacaciones",
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

function QuickReplies({
  onSelect,
  highlight,
}: {
  onSelect: (reply: string) => void;
  highlight?: string;
}) {
  return (
    <div className="appear-later ml-[42px] mt-3 flex max-w-[292px] flex-wrap gap-2">
      {quickReplies.map((reply) => (
        <button
          className={`quick-reply ${reply === highlight ? "mood-question-chip" : ""}`}
          key={reply}
          onClick={() => onSelect(reply)}
          type="button"
        >
          {reply}
        </button>
      ))}
    </div>
  );
}

function ChatWindow({
  screen,
  highlightReply,
  onClose,
  onDocument,
  onHowTo,
  onStartTyping,
  onSearch,
  onVacation,
  onReturn,
  onRanking,
  onMood,
  onStop,
  onOpenDocument,
}: {
  screen: Exclude<Screen, "desktop" | "recording">;
  highlightReply?: string;
  onClose: () => void;
  onDocument: () => void;
  onHowTo: () => void;
  onStartTyping: () => void;
  onSearch: () => void;
  onVacation: () => void;
  onOpenDocument: () => void;
  onReturn: () => void;
  onRanking: () => void;
  onMood: () => void;
  onStop: () => void;
}) {
  const question = "Necesito saber cómo puedo resolver el ticket X";
  const vacationMessage = "Me voy de vacaciones";
  const displayedMessage = screen === "typing" ? question : "";
  const view = screen;
  const canSend = screen === "typing";
  const mood: TikecitoMood =
    view === "mood"
      ? "triste"
      : view === "recordingChat"
        ? "grabando"
        : view === "processing" || view === "searching"
          ? "pensando"
          : view === "done" || view === "answer" || view === "ranking" || view === "vacationReport"
            ? "feliz"
            : "normal";

  // Al cambiar de pantalla, el chat vuelve arriba para que se lea la respuesta desde el principio.
  // En el informe de vacaciones no, porque se agrega abajo de los mensajes que ya se estaban viendo.
  const scrollRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (view !== "vacationReport") scrollRef.current?.scrollTo({ top: 0 });
  }, [view]);

  function sendMessage(event: FormEvent) {
    event.preventDefault();
    if (screen === "typing") onSearch();
  }

  function startTyping() {
    if (screen === "howTo") onStartTyping();
  }

  function selectReply(reply: string) {
    if (reply === "Documentar una tarea") onDocument();
    if (reply === "¿Cómo se hace…?") onHowTo();
    if (reply === "¿Cómo estás, Tikecito?") onMood();
    if (reply === "Ver mi ranking") onRanking();
    if (reply === "Me voy de vacaciones") onVacation();
  }

  return (
    <MoodContext.Provider value={mood}>
      <section
        className={`chat-window ranking-chat-shell ${view === "ranking" ? "ranking-chat-expanded" : ""}`}
        aria-label="Chat con Tikecito"
      >
        <header className="flex h-[76px] shrink-0 items-center border-b border-slate-100 px-5">
          <TikecitoAvatar size="small" />
          <div className="ml-3 min-w-0 flex-1">
            <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-slate-900">
              Tikecito
            </h1>
            <div className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  view === "processing" || view === "searching" ? "bg-amber-400" : "bg-emerald-500"
                }`}
              />
              {view === "processing"
                ? "Procesando"
                : view === "searching"
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

        <div className="chat-scroll flex-1 overflow-y-auto px-5 py-5" ref={scrollRef}>
          <div className="screen-enter space-y-3" key={view}>
            {view === "chat" && (
              <>
                <AssistantMessage>¡Hola! Soy Tikecito 👋 ¿En qué te puedo ayudar?</AssistantMessage>
                <QuickReplies onSelect={selectReply} highlight={highlightReply} />
              </>
            )}

            {view === "documenting" && (
              <>
                <UserMessage>Documentar una tarea</UserMessage>
                <AssistantMessage>
                  ¡Dale! Voy a grabar tu pantalla mientras hacés la tarea. Hacela como siempre, yo
                  me encargo de anotar los pasos 🎥
                </AssistantMessage>
                <div className="ml-[42px] flex items-center gap-2 rounded-xl border border-teal-100 bg-teal-50 px-3 py-2.5 text-xs font-medium text-teal-800">
                  <span className="countdown-dot" />
                  La grabación empieza en 3… 2… 1…
                </div>
              </>
            )}

            {view === "recordingChat" && (
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

            {view === "processing" && (
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

            {view === "done" && (
              <>
                <AssistantMessage>
                  ¡Documenté la tarea con éxito! 🎉 Ya la puede consultar todo el equipo.
                </AssistantMessage>
                <a
                  className="document-card"
                  href="#documento"
                  onClick={(event) => {
                    event.preventDefault();
                    onOpenDocument();
                  }}
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

            {(view === "howTo" || view === "typing") && (
              <>
                <UserMessage>¿Cómo se hace…?</UserMessage>
                <AssistantMessage>¡Claro! Decime qué querés hacer.</AssistantMessage>
              </>
            )}

            {view === "searching" && (
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

            {view === "answer" && (
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
                    <div className="answer-source">
                      <span className="answer-source-avatar">R</span>
                      <span>
                        Esto me lo enseñó <strong>Romina</strong>
                        <small>a partir de un documento que hizo con Tikecito</small>
                      </span>
                    </div>
                  </div>
                </AssistantMessage>
                <QuickReplies onSelect={selectReply} />
              </>
            )}

            {view === "mood" && (
              <>
                <UserMessage>¿Cómo estás, Tikecito?</UserMessage>
                <AssistantMessage>
                  <MoodAnswer />
                </AssistantMessage>
                <QuickReplies onSelect={selectReply} />
              </>
            )}

            {view === "vacationMode" && (
              <>
                <UserMessage>{vacationMessage}</UserMessage>
                <AssistantMessage>
                  ¡Ok, que la pases bien! 🏖️ Mientras no estás, voy a ayudar al equipo con tu
                  conocimiento, así no te molestan.
                </AssistantMessage>
                <div className="appear-later ml-[42px] pt-1">
                  <button className="quick-reply" onClick={onReturn} type="button">
                    Volví
                  </button>
                </div>
              </>
            )}

            {(view === "returned" || view === "vacationReport") && (
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

                {view === "vacationReport" && (
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
                            ["Alta de usuarios en Gestión interna", "12 usos"],
                            ["Restablecer la contraseña de un usuario", "7 usos"],
                            ["Asignar permisos a un equipo", "4 usos"],
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

            {view === "ranking" && (
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

        <form className="border-t border-slate-100 p-4" onSubmit={sendMessage}>
          <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-1.5 pl-4 transition focus-within:border-teal-600 focus-within:bg-white focus-within:ring-3 focus-within:ring-teal-600/10">
            <input
              className="min-w-0 flex-1 bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
              onClick={startTyping}
              onFocus={startTyping}
              placeholder="Escribile a Tikecito…"
              readOnly
              value={displayedMessage}
            />
            <button
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#167d7d] text-white shadow-sm transition hover:bg-[#116b6b] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-600 focus-visible:ring-offset-2 disabled:opacity-45"
              disabled={!canSend}
              type="submit"
              aria-label="Enviar mensaje"
            >
              <SendIcon className="h-[18px] w-[18px]" />
            </button>
          </div>
        </form>
      </section>
    </MoodContext.Provider>
  );
}

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

// Entradas directas por URL: ?flujo=ranking&pantalla=resultado abre el ranking;
// ?flujo=estado muestra a Tikecito triste en el escritorio y resalta "¿Cómo estás, Tikecito?".
const params = new URLSearchParams(window.location.search);
const flow = window.location.pathname.endsWith("/ranking")
  ? "ranking"
  : window.location.pathname.endsWith("/estado")
    ? "estado"
    : params.get("flujo");
const initialScreen: Screen =
  flow === "ranking" && params.get("pantalla") === "resultado" ? "ranking" : "desktop";
const moodEntry = flow === "estado";

export default function App() {
  const [screen, setScreen] = useState<Screen>(initialScreen);
  const [documentOpen, setDocumentOpen] = useState(false);
  const [elapsed, setElapsed] = useState(42);
  const hasTaskBackground = ["recording", "recordingChat", "processing", "done"].includes(screen);
  const chatVisible = screen !== "desktop" && screen !== "recording";

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
      // Tiempo para leer el mensaje de Tikecito antes de pasar a lo siguiente.
      screen === "documenting" ? 4500 : 3000,
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

  // El documento se cierra al pasar a cualquier otra pantalla.
  useEffect(() => setDocumentOpen(false), [screen]);

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
            <TikecitoAvatar
              variant={moodEntry ? "triste" : "normal"}
              className="relative transition-transform group-hover:-translate-y-1"
            />
          </button>
        </div>

        {documentOpen && (
          <DocumentWindow elapsed={elapsed} onClose={() => setDocumentOpen(false)} />
        )}

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
              highlightReply={moodEntry ? "¿Cómo estás, Tikecito?" : undefined}
              onClose={() => setScreen("desktop")}
              onDocument={startDocumenting}
              onHowTo={() => setScreen("howTo")}
              onStartTyping={() => setScreen("typing")}
              onSearch={() => setScreen("searching")}
              onVacation={() => setScreen("vacationMode")}
              onOpenDocument={() => setDocumentOpen(true)}
              onReturn={() => setScreen("returned")}
              onRanking={() => setScreen("ranking")}
              onMood={() => setScreen("mood")}
              onStop={() => setScreen("processing")}
            />
          )}
        </div>
      </div>
    </main>
  );
}
