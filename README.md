# Tikecito: prototipo

Prototipo de **Tikecito**, el asistente que documenta tareas y responde con el conocimiento del equipo. Es el TP de Design Thinking de Sistemas de Información IV (UNLu). Está hecho con React, Vite y Tailwind, a partir de Figma Make.

Opciones del chat: documentar una tarea, «¿Cómo se hace…?», «¿Cómo estás, Tikecito?», ranking y vacaciones.



[Demo](https://github.com/user-attachments/assets/76ec8f9a-7b71-4df3-a565-679cfd396526)


## Levantarlo

Necesita Node.js 18 o más nuevo.

```bash
npm install
npm run dev      # http://localhost:5199
```

## Demo automática

Abre Chrome y recorre sola todas las opciones, con un cartel que indica cada paso. Si el prototipo no está corriendo, la demo lo levanta.

```bash
npm run demo                  # una pasada (~1:50)
npm run demo -- --loop        # se repite hasta cerrar la ventana
npm run demo -- --rapido      # pausas a la mitad
npm run demo -- --video       # graba un video en videos/ (opcional: --tamaño 1920x1080)
npm run demo -- --url https://…   # usa otra dirección, por ejemplo la publicada en Make
```

Si no tenés Chrome, corré `npx playwright install chromium`. Si `--video` da un error de ffmpeg, corré `npx playwright install ffmpeg`.

## Cambiar el dibujo de Tikecito

En `tikecitoImages`, arriba de todo en `src/App.tsx`, poné la ruta de cada imagen: `normal`, `feliz`, `pensando` y `triste`. Las imágenes pueden ir en `public/`; por ejemplo, `public/tikecito/normal.png` se carga como `"/tikecito/normal.png"`.

- Una expresión vacía usa la imagen de `normal`.
- Si `normal` también está vacía, se ve el Tikecito actual.
- Conviene usar PNG cuadrado con fondo transparente.

## Pasarlo a Figma Make

En la vista de código de Make, reemplazá el contenido de `App.tsx` y de `index.css` por el de `src/`. No agregues librerías nuevas, porque Make puede no tenerlas.
