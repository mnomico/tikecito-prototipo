# Tikecito: prototipo

Prototipo interactivo de **Tikecito**, el asistente que documenta tareas y responde consultas con el conocimiento del equipo. Es el TP de Design Thinking de Sistemas de Información IV (LSI, UNLu). Se generó en Figma Make y después se ajustó a mano: está hecho con React, Vite y Tailwind.

## Qué se puede hacer

Al hacer click en Tikecito, abajo a la derecha del escritorio, se abre el chat con cinco opciones:

| Opción | Qué pasa |
|---|---|
| **Documentar una tarea** | Tikecito graba la pantalla mientras hacés la tarea, la detenés y arma el documento. «Abrir documento →» lo muestra. |
| **¿Cómo se hace…?** | Al hacer click en el campo de texto se carga una pregunta, y Tikecito responde con los pasos y con quién se lo enseñó. |
| **¿Cómo estás, Tikecito?** | Su ánimo refleja el estado de los tickets: abiertos, cupos de urgencia y cerrados en la semana. |
| **Ver mi ranking** | Ranking de la temporada y desglose de tus puntos. |
| **Me voy de vacaciones** | Tikecito cubre tu ausencia. Al tocar «Volví» aparece el informe de lo que pasó mientras no estabas. |

Hay dos entradas directas por URL:

- `?flujo=ranking&pantalla=resultado` abre directo en el ranking.
- `?flujo=estado` muestra a Tikecito triste en el escritorio y resalta «¿Cómo estás, Tikecito?».

## Requisitos

- [Node.js](https://nodejs.org/) 18 o más nuevo, con npm.
- Google Chrome, solo para la demo automática. Si no está instalado, ver [Problemas comunes](#problemas-comunes).

## Levantar el prototipo

```bash
npm install
npm run dev
```

Queda andando en <http://localhost:5199>. Los cambios en `src/` se ven al instante, sin recargar.

## Demo automática

La demo abre Chrome y recorre sola las cinco opciones. Muestra un cursor visible y un cartel arriba que indica en qué paso está, y hace pausas para que se lean los mensajes. Sirve para presentar el prototipo sin tener que manejarlo en vivo.

```bash
npm run demo                  # una pasada a ritmo de presentación (~1:50)
npm run demo -- --loop        # se repite hasta que cierres la ventana
npm run demo -- --rapido      # pausas a la mitad (~1 min)
npm run demo -- --video       # graba un video en videos/, sin abrir ventana (1440x900)
npm run demo -- --video --tamaño 1920x1080   # video con otra resolución
npm run demo -- --url https://…              # usa otra dirección, por ejemplo la publicada en Figma Make
```

- **No hace falta levantar el prototipo antes:** si no está corriendo, la demo lo arranca y lo cierra al terminar.
- **Para cortarla,** cerrá la ventana de Chrome o apretá `Ctrl+C` en la terminal.
- **Para la presentación,** lo más seguro es grabar el video antes y llevarlo, así no depende de que algo ande en vivo.

## Cambiar el dibujo de Tikecito

Arriba de todo en `src/App.tsx` está `tikecitoImages`, con una imagen por expresión:

```ts
const tikecitoImages: Record<TikecitoMood, string> = {
  normal: "",   // saludo, charla en general
  feliz: "",    // tarea documentada, respuesta, ranking, informe de vacaciones
  pensando: "", // procesando la grabación, buscando una respuesta
  triste: "",   // "¿Cómo estás, Tikecito?"
};
```

- **Cómo cargarlas:** en cada expresión va una URL o la ruta de la imagen. Si las ponen en una carpeta `public/`, por ejemplo `public/tikecito/normal.png`, la ruta es `"/tikecito/normal.png"`.
- **Qué pasa si falta alguna:** una expresión vacía usa la imagen de `normal`. Si `normal` también está vacía, se ve el Tikecito actual.
- **Formato recomendado:** PNG con fondo transparente y más o menos cuadrado, porque la imagen reemplaza al círculo verde completo.

## Pasar los cambios a Figma Make

El código de `src/` es el mismo que exporta Figma Make. Para actualizar el proyecto de Make, abrí su vista de código y reemplazá el contenido de `App.tsx` y de `index.css` por el de este repo. `main.tsx` no cambia.

Al hacer cambios hay que tener en cuenta dos cosas:

- **Mantener la estructura de archivos y Tailwind 4,** que se carga con `@import "tailwindcss"` en `index.css`.
- **No agregar librerías nuevas,** porque Make puede no tenerlas disponibles.

## Estructura

```
src/
  App.tsx        todas las pantallas y flujos del prototipo
  index.css      estilos
  main.tsx       punto de entrada (no se toca)
demo.mjs         demo automática con Playwright
```

## Problemas comunes

- **`Port 5199 is already in use`:** ya hay otro `npm run dev` corriendo. Usá ese o cerralo.
- **La demo no encuentra Chrome:** instalá el navegador de Playwright con `npx playwright install chromium`. La demo lo usa automáticamente.
- **`--video` falla con un error de `ffmpeg`:** instalá el grabador de Playwright con `npx playwright install ffmpeg`.
