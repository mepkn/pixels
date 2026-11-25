import { useRef, useState } from 'react'
import PixelGrid from './PixelGrid.jsx'
import { ButtonGroup } from './ui.jsx'
import { MODES, MODE_OPTIONS, PALETTE, PRESET_NAMES, getPreset } from '../data/presets.js'

const SIZE = 8
const COLOUR_KEYS = ['R', 'G', 'B', 'Y', 'O', 'P', 'K', 'W']
const CHANNELS = ['R', 'G', 'B']

/** Returns the number if text is a valid value for the mode, otherwise null. */
function parseNumber(text, mode) {
  if (!/^\s*\d{1,3}\s*$/.test(text)) return null
  const n = Number(text)
  if (mode === MODES.BW) return n === 0 || n === 1 ? n : null
  return n <= 255 ? n : null
}

const toTexts = (v, mode) => (mode === MODES.COLOUR ? v.map(String) : String(v))

function build(name, mode) {
  const cells = getPreset(name, mode, SIZE)
  return { cells, texts: cells.map((v) => toTexts(v, mode)) }
}

/** Left: the picture you can paint on. Right: the same picture as editable numbers. */
export default function DrawTab() {
  const [mode, setMode] = useState(MODES.BW)
  const [{ cells, texts }, setState] = useState(() => build('Smiley', MODES.BW))
  const [colourBrush, setColourBrush] = useState('R')
  const bwValue = useRef(1)

  const load = (name, m = mode) => setState(build(name, m))

  const setCell = (i, v) =>
    setState((prev) => {
      const cells = prev.cells.slice()
      const texts = prev.texts.slice()
      cells[i] = v
      texts[i] = toTexts(v, mode)
      return { cells, texts }
    })

  // Black & White: the first cell touched decides whether this stroke paints
  // black or white, so a click toggles and a drag keeps going the same way.
  const paintStart = (i) => {
    if (mode === MODES.BW) bwValue.current = cells[i] === 1 ? 0 : 1
  }
  const paint = (i) =>
    setCell(i, mode === MODES.BW ? bwValue.current : [...PALETTE[colourBrush].rgb])

  // Typing: invalid text stays in the box (in red); the picture keeps the last valid number.
  const type = (i, text, ch) =>
    setState((prev) => {
      const texts = prev.texts.slice()
      const cells = prev.cells.slice()
      const v = parseNumber(text, mode)
      if (mode === MODES.COLOUR) {
        texts[i] = prev.texts[i].slice()
        texts[i][ch] = text
        if (v !== null) {
          cells[i] = prev.cells[i].slice()
          cells[i][ch] = v
        }
      } else {
        texts[i] = text
        if (v !== null) cells[i] = v
      }
      return { cells, texts }
    })

  const allTexts = texts.flat()
  const invalidCount = allTexts.filter((t) => parseNumber(t, mode) === null).length
  const pixels = SIZE * SIZE

  const input = (i, value, label, ch, cls) => {
    const bad = parseNumber(value, mode) === null
    return (
      <input
        key={ch ?? 0}
        value={value}
        onChange={(e) => type(i, e.target.value, ch)}
        onFocus={(e) => e.target.select()}
        inputMode="numeric"
        maxLength={3}
        aria-label={label}
        aria-invalid={bad}
        className={`block w-full min-w-0 p-0 text-center font-mono outline-none focus:bg-indigo-100 focus:ring-2 focus:ring-indigo-500 ${cls} ${
          bad ? 'bg-red-100 text-red-700 font-bold' : 'bg-white'
        }`}
      />
    )
  }

  return (
    <section className="space-y-5">
      <ButtonGroup label="Colour mode" options={MODE_OPTIONS} value={mode} onChange={(m) => { setMode(m); load('Smiley', m) }} />

      <div className="flex flex-wrap items-center gap-x-8 gap-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-semibold text-slate-600 mr-1">Presets</span>
          {PRESET_NAMES.map((name) => (
            <button key={name} type="button" onClick={() => load(name)}
              className="px-4 py-2 rounded-lg border-2 border-slate-300 bg-white font-medium hover:border-indigo-400">
              {name}
            </button>
          ))}
        </div>
        {mode === MODES.COLOUR && (
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-700 mr-1">Brush colour</span>
            {COLOUR_KEYS.map((k) => (
              <button key={k} type="button" title={PALETTE[k].name} aria-label={PALETTE[k].name}
                aria-pressed={colourBrush === k} onClick={() => setColourBrush(k)}
                className={`h-10 w-10 rounded-lg border-2 ${colourBrush === k ? 'ring-4 ring-indigo-500 border-white' : 'border-slate-300'}`}
                style={{ background: `rgb(${PALETTE[k].rgb.join(',')})` }} />
            ))}
            <span className="ml-2 font-mono text-slate-700">
              R {PALETTE[colourBrush].rgb[0]}, G {PALETTE[colourBrush].rgb[1]}, B {PALETTE[colourBrush].rgb[2]}
            </span>
          </div>
        )}
      </div>

      <div className="grid gap-8 lg:grid-cols-2 items-start">
        <div>
          <div className="mx-auto w-full max-w-[520px]">
            <PixelGrid size={SIZE} mode={mode} cells={cells} onPaintStart={paintStart} onPaint={paint} />
          </div>
        </div>

        <div>
          <div
            className={`mx-auto grid w-full max-w-[520px] aspect-square border-2 border-slate-400 bg-slate-300 ${mode === MODES.COLOUR ? 'gap-[3px]' : 'gap-px'}`}
            style={{ gridTemplateColumns: `repeat(${SIZE}, minmax(0, 1fr))` }}
          >
            {Array.from({ length: SIZE * SIZE }, (_, i) => {
              const where = `Row ${Math.floor(i / SIZE) + 1}, column ${(i % SIZE) + 1}`
              return mode === MODES.COLOUR ? (
                <div key={i} className="flex min-h-0 min-w-0 flex-col gap-px">
                  {CHANNELS.map((c, ch) => input(i, texts[i][ch], `${where}, ${c}`, ch, 'min-h-0 flex-1 text-[0.45rem] sm:text-[0.65rem]'))}
                </div>
              ) : (
                <div key={i} className="min-h-0 min-w-0">
                  {input(i, texts[i], where, undefined, 'h-full text-sm sm:text-xl')}
                </div>
              )
            })}
          </div>
          {invalidCount > 0 && (
            <p className="mt-3 font-semibold text-red-600">
              {invalidCount} invalid {invalidCount === 1 ? 'value is' : 'values are'} ignored.
            </p>
          )}
        </div>
      </div>

      <p className="text-xl text-center font-medium" aria-live="polite">
        This picture is {SIZE} × {SIZE} = {pixels} pixels. The computer stores{' '}
        {mode === MODES.COLOUR ? `${pixels} × 3 = ${pixels * 3}` : pixels} numbers.
      </p>
    </section>
  )
}
