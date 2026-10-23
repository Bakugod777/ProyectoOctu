# Medianoche v2.2

Una novela visual cortita para el 31 de octubre: Sirius, un búho con capa, “secuestra” a quien abre el link.
Ella escribe su nombre al entrar, pasa 5 pruebas (faroles · estrellas · pasillo/memoria · fotos · la tabla) y al final abre un sobre con lacre y lee la carta.

## Correr

```bash
npm install
npm run dev      # http://127.0.0.1:43123
npm run build    # exporta estático a out/
```

## Personalizar (src/lib/confession-config.ts, busca "✏️")

- `from` → tu nombre (o por URL: `?de=TuNombre`). **Obligatorio.**
- `recuerdo` → lo primero que notaste de ella (reemplaza `[RECUERDO]`).
- `letter` (un párrafo por línea) y `closing` → la carta.
- `lanternClues`, `memoryPairs` (a, b, note), `timelineItems`, `whisperOptions` / `whisperAnswer`.
- `script` → los diálogos de Sirius. Marcadores: `[ELLA]` (el nombre que ella escribe), `[TU]`, `[RECUERDO]`.
- `?para=Nombre` solo prellena la pantalla del nombre.

Ilustraciones opcionales: `public/scenes/*.webp` (ver LEEME.txt ahí).

## Publicar

Es un sitio 100 % estático: después de `npm run build` sube la carpeta `out/` a cualquier hosting estático (Netlify, Vercel, Cloudflare Pages, GitHub Pages…).

Ojo: todo el texto (carta y respuestas) viaja en el JavaScript del sitio; quien sepa mirar el código fuente lo puede leer. Manda el link solo a ella.
