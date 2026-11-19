// Demo automática del prototipo de Tikecito: recorre todas las opciones solo.
//
//   npm run demo                      → una pasada, a ritmo de presentación
//   npm run demo -- --loop            → repite hasta que cierres la ventana
//   npm run demo -- --rapido          → la mitad de pausas
//   npm run demo -- --video           → graba un video en videos/ (sin ventana, 1440x900)
//   npm run demo -- --video --tamaño 1920x1080   → video con otro tamaño
//   npm run demo -- --url https://…   → usa otra dirección (por ejemplo, la publicada en Figma Make)
//
// Sin --url levanta el prototipo local (Vite) si no está corriendo.
import { chromium } from "playwright";
import { spawn } from "node:child_process";

const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const option = (name) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 ? args[i + 1] : undefined;
};

const LOCAL_URL = "http://localhost:5199/";
const url = option("url") ?? LOCAL_URL;
const pace = flag("rapido") ? 0.5 : 1;
const loop = flag("loop");
const video = flag("video");
const [videoWidth, videoHeight] = (option("tamaño") ?? "1440x900").split("x").map(Number);
// El prototipo está pensado para ~1440 px de ancho: en videos más grandes se agranda todo
// en vez de dejar el escritorio chico en el medio.
const videoScale = Math.max(1, videoWidth / 1440);

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms * pace));

// ---------- servidor local ----------

async function isUp(target) {
  try {
    return (await fetch(target)).ok;
  } catch {
    return false;
  }
}

let server;
if (url === LOCAL_URL && !(await isUp(url))) {
  console.log("Levantando el prototipo local…");
  server = spawn("npx", ["vite", "--port", "5199", "--strictPort"], {
    cwd: import.meta.dirname,
    stdio: "ignore",
  });
  for (let i = 0; i < 60 && !(await isUp(url)); i++) await new Promise((r) => setTimeout(r, 250));
}

// ---------- navegador ----------

const launchOptions = {
  // El video se graba sin ventana, así no depende del tamaño de la pantalla.
  headless: video,
  args: video ? [] : ["--start-maximized"],
};
// Usa el Chrome instalado; si no hay, el Chromium de Playwright (npx playwright install chromium).
const browser = await chromium
  .launch({ ...launchOptions, channel: "chrome" })
  .catch(() => chromium.launch(launchOptions));
const context = await browser.newContext({
  viewport: video ? { width: videoWidth, height: videoHeight } : null,
  recordVideo: video ? { dir: "videos", size: { width: videoWidth, height: videoHeight } } : undefined,
});
const page = await context.newPage();

// Cursor visible y cartel con el paso actual, para que se entienda qué está pasando.
await page.addInitScript((zoom) => {
  window.addEventListener("DOMContentLoaded", () => {
    const style = document.createElement("style");
    // El escritorio ocupa toda la pantalla; en videos grandes se agranda con zoom (solo el
    // prototipo, no el cursor ni el cartel de la demo).
    style.textContent = `
      #root { zoom: ${zoom}; }
      #root > main { display: block !important; min-height: 0 !important; }
      .desktop-frame { width: ${zoom === 1 ? "100vw" : `${innerWidth / zoom}px`} !important;
        height: ${zoom === 1 ? "100vh" : `${innerHeight / zoom}px`} !important;
        max-height: none !important; aspect-ratio: auto !important; box-shadow: none !important; }
      #demo-cursor { position: fixed; z-index: 99999; top: 0; left: 0; width: 26px; height: 26px;
        pointer-events: none; transform: translate(-3px, -2px); filter: drop-shadow(0 2px 3px rgb(0 0 0 / 35%)); }
      #demo-cursor.click::after { content: ""; position: absolute; top: -14px; left: -14px; width: 30px; height: 30px;
        border-radius: 50%; border: 3px solid #167d7d; animation: demo-ripple 450ms ease-out forwards; }
      @keyframes demo-ripple { from { transform: scale(.3); opacity: 1 } to { transform: scale(1.4); opacity: 0 } }
      #demo-caption { position: fixed; z-index: 99998; top: 18px; left: 50%; transform: translateX(-50%);
        padding: 10px 22px; border-radius: 999px; background: rgb(15 23 42 / 82%); color: white;
        font: 600 17px/1.3 Inter, system-ui, sans-serif; letter-spacing: -.01em; pointer-events: none;
        transition: opacity 300ms; opacity: 0; }
      .demo-highlight { position: relative; border-radius: 12px;
        animation: demo-pulse 900ms ease-in-out infinite alternate; }
      @keyframes demo-pulse {
        from { box-shadow: 0 0 0 3px rgb(245 158 11 / 90%), 0 0 0 6px rgb(245 158 11 / 15%); }
        to { box-shadow: 0 0 0 3px rgb(245 158 11 / 90%), 0 0 0 14px rgb(245 158 11 / 0%); } }`;
    document.head.append(style);
    const cursor = document.createElement("div");
    cursor.id = "demo-cursor";
    cursor.innerHTML = `<svg viewBox="0 0 24 24" width="26" height="26"><path d="M4 2.5v17l4.6-4.3 3 6.6 3.1-1.4-3-6.4h6.3L4 2.5Z" fill="white" stroke="#0f172a" stroke-width="1.5" stroke-linejoin="round"/></svg>`;
    const caption = document.createElement("div");
    caption.id = "demo-caption";
    document.body.append(cursor, caption);
    window.__demoScroll = (node, block) => {
      const area = node.closest(".chat-scroll, .overflow-y-auto");
      if (!area) return;
      const a = area.getBoundingClientRect();
      const r = node.getBoundingClientRect();
      const z = area.currentCSSZoom || 1;
      let top = area.scrollTop + (r.top - a.top) / z - 12;
      if (block === "center") top -= (a.height - r.height) / z / 2 - 12;
      if (block === "nearest") {
        if (r.top >= a.top && r.bottom <= a.bottom) return;
        if (r.bottom > a.bottom) top = area.scrollTop + (r.bottom - a.bottom) / z + 12;
      }
      area.scrollTo({ top, behavior: "smooth" });
    };
    window.addEventListener("mousemove", (e) => (cursor.style.translate = `${e.clientX}px ${e.clientY}px`));
    window.addEventListener("mousedown", () => {
      cursor.classList.remove("click");
      void cursor.offsetWidth;
      cursor.classList.add("click");
    });
  });
}, video ? videoScale : 1);

async function caption(text) {
  console.log(text || "");
  await page.evaluate((t) => {
    const el = document.getElementById("demo-caption");
    if (!el) return;
    el.textContent = t;
    el.style.opacity = t ? "1" : "0";
  }, text);
}

let mouse = { x: 700, y: 450 };

// Lleva el cursor hasta el elemento con un movimiento suave y hace click.
async function click(locator) {
  await locator.waitFor({ state: "visible", timeout: 15000 });
  // Si quedó fuera de la vista (por ejemplo, abajo en el chat), lo trae con un scroll suave.
  const hidden = await locator.evaluate((node) => {
    const area = node.closest(".chat-scroll, .overflow-y-auto");
    if (!area) return false;
    const a = area.getBoundingClientRect();
    const r = node.getBoundingClientRect();
    return r.top < a.top || r.bottom > a.bottom;
  });
  if (hidden) {
    await locator.evaluate((node) => window.__demoScroll(node, "nearest"));
    await sleep(900);
  }
  // Espera a que termine cualquier animación (el chat se abre agrandándose).
  let box = await locator.boundingBox();
  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 80));
    const next = await locator.boundingBox();
    const still = Math.abs(next.x - box.x) < 0.5 && Math.abs(next.y - box.y) < 0.5 && Math.abs(next.width - box.width) < 0.5;
    box = next;
    if (still) break;
  }
  const target = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const distance = Math.hypot(target.x - mouse.x, target.y - mouse.y);
  await page.mouse.move(target.x, target.y, { steps: Math.max(8, Math.round(distance / 18)) });
  mouse = target;
  await sleep(250);
  await page.mouse.down();
  await page.mouse.up();
  await sleep(350);
}

const button = (name) => page.getByRole("button", { name, exact: true });

// Desplaza de a poco un área con scroll, para que se pueda leer.
async function scrollThrough(selector, { back = false } = {}) {
  const area = page.locator(selector).last();
  const box = await area.boundingBox();
  if (!box) return;
  await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 10 });
  mouse = { x: box.x + box.width / 2, y: box.y + box.height / 2 };
  const scrollable = await area.evaluate((el) => el.scrollHeight - el.clientHeight);
  for (let done = 0; done < scrollable; done += 60) {
    await page.mouse.wheel(0, 60);
    await sleep(140);
  }
  await sleep(1500);
  if (back) await area.evaluate((el) => el.scrollTo({ top: 0, behavior: "smooth" }));
}

// Lleva un elemento a la vista entero y lo deja quieto unos segundos para que se lea.
async function show(selector, { hold = 5000, block = "start", highlight = false } = {}) {
  const el = page.locator(selector).last();
  await el.waitFor({ state: "visible", timeout: 15000 });
  await el.evaluate((node, b) => window.__demoScroll(node, b), block);
  await sleep(900);
  if (highlight) {
    await el.evaluate((node) => node.classList.add("demo-highlight"));
    const box = await el.boundingBox();
    const target = { x: box.x + box.width - 14, y: box.y + box.height - 8 };
    await page.mouse.move(target.x, target.y, { steps: 20 });
    mouse = target;
  } else {
    await moveAside();
  }
  await sleep(hold);
  if (highlight) await el.evaluate((node) => node.classList.remove("demo-highlight"));
}

// Deja quieta la pantalla para que se lean los mensajes de Tikecito.
async function read(ms) {
  await moveAside();
  await sleep(ms);
}

// Corre el cursor hacia el escritorio para que no tape lo que se está mostrando.
async function moveAside() {
  const target = { x: 520, y: 360 };
  await page.mouse.move(target.x, target.y, { steps: 15 });
  mouse = target;
}

// ---------- recorrido ----------

async function demo() {
  await page.goto(url);
  await sleep(1500);

  await caption("Tikecito vive en el escritorio");
  await sleep(2000);
  await click(button("Abrir chat con Tikecito"));
  await read(3000);

  // 1. Documentar una tarea
  await caption("1 · Documentar una tarea");
  await click(button("Documentar una tarea"));
  await moveAside();
  await button("Abrir chat con Tikecito mientras graba").waitFor({ timeout: 15000 });
  await caption("1 · Tikecito graba la pantalla mientras hacés la tarea");
  await sleep(3500);
  await click(button("Abrir chat con Tikecito mientras graba"));
  await read(2500);
  await click(button("Detener grabación"));
  await caption("1 · …y arma el documento solo");
  await moveAside();
  await page.locator(".document-card").waitFor({ timeout: 15000 });
  await read(3500);
  await click(page.locator(".document-card"));
  await moveAside();
  await sleep(2500);
  await scrollThrough(".document-window .overflow-y-auto");
  await sleep(1500);
  await click(button("Cerrar documento"));
  await sleep(800);

  // 2. ¿Cómo se hace…?
  await caption("2 · Preguntarle cómo se hace algo");
  await click(button("¿Cómo se hace…?"));
  await read(2500);
  await click(page.getByPlaceholder("Escribile a Tikecito…"));
  await sleep(1500);
  await click(button("Enviar mensaje"));
  await moveAside();
  await page.locator(".answer-message").waitFor({ timeout: 15000 });
  await caption("2 · Responde con lo que documentó el equipo");
  await read(3000);
  await show(".answer-message", { hold: 4000 });
  const teacher = await page.locator(".answer-source strong").innerText();
  await caption(`2 · …y dice quién se lo enseñó: ${teacher}`);
  await show(".answer-source", { hold: 5000, block: "center", highlight: true });

  // 3. ¿Cómo estás, Tikecito?
  await caption("3 · El estado de Tikecito refleja el de los tickets");
  await click(button("¿Cómo estás, Tikecito?"));
  await read(2000);
  await show(".mood-answer", { hold: 5500, block: "center" });

  // 4. Ranking
  await caption("4 · Ranking: documentar suma puntos");
  await click(button("Ver mi ranking"));
  await read(2000);
  await show(".ranking-card", { hold: 6500 });

  // 5. Vacaciones
  await caption("5 · Me voy de vacaciones");
  await click(button("Me voy de vacaciones"));
  await read(4000);
  await caption("5 · …15 días después");
  await click(button("Volví"));
  await moveAside();
  await page.locator(".vacation-report").waitFor({ timeout: 15000 });
  await read(1500);
  await caption("5 · Lo que pasó mientras no estabas");
  await show(".vacation-report", { hold: 6500 });

  await caption("");
  await click(button("Cerrar chat"));
  await sleep(2500);
}

try {
  do {
    await demo();
  } while (loop);
} catch (error) {
  // Cerrar la ventana a mano corta la demo; cualquier otro error se muestra.
  if (!String(error).includes("closed")) console.error(error);
} finally {
  const recording = page.video();
  await context.close().catch(() => {});
  await browser.close().catch(() => {});
  if (recording) console.log("Video guardado en", await recording.path());
  server?.kill();
}
