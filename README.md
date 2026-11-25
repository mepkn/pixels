# Pixels

A teaching app that shows how a computer sees an image: a picture is a grid of pixels, and every pixel is a number.

## Features

- One 8 × 8 screen: the picture on the left (click or drag to paint), the same picture as an editable table of numbers on the right, kept in sync.
- Black & White (0/1) or Colour (R, G, B), with presets. Invalid numbers show in red and are ignored.
- No backend, no login, nothing stored.

## Stack

React 19 · Vite · Tailwind CSS v4 · Vitest

## Development

Node 22.18+.

```bash
npm install
npm run dev
```

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server |
| `npm run build` | Build the static site into `dist/` |
| `npm run preview` | Serve the built site locally |
| `npm test` | Run the Vitest tests |
| `npm run lint` | Lint with oxlint |

## Deployment

`npm run build` and serve `dist/` from the root of the subdomain (base path `/`).

## How it works

- `src/App.jsx`: header and the single page.
- `src/components/`: `DrawTab` (picture + numbers), `PixelGrid`, small UI pieces in `ui.jsx`.
- `src/data/presets.js`: presets as 8 rows of 8 characters (see below).
- `src/utils/image.js`: pixelate, read a pixel.

### Adding a preset

Add an entry to `PATTERNS` in `src/data/presets.js`:

```js
Star: {
  bw: [ // '#' = 1 (black), '.' = 0 (white)
    '...#....', /* 8 rows of 8 characters */
  ],
  colour: [ // letters from PALETTE: R G B Y O P K W, '.' = white
    '...Y....', /* 8 rows of 8 characters */
  ],
},
```

The button appears automatically, and the tests check its size.
