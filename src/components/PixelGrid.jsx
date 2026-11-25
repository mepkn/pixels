import { useRef } from 'react'
import { MODES } from '../data/presets.js'
import { toGray } from '../utils/image.js'

/** CSS colour of one cell value. */
function cellColour(value, mode) {
  if (mode === MODES.BW) return value === 1 ? 'rgb(0,0,0)' : 'rgb(255,255,255)'
  return `rgb(${value[0]},${value[1]},${value[2]})`
}

/** Text colour that stays readable on top of a cell. */
function textColour(value, mode) {
  let lum
  if (mode === MODES.BW) lum = value === 1 ? 0 : 255
  else lum = toGray(...value)
  return lum < 128 ? '#ffffff' : '#0f172a'
}

function cellLabel(value, mode) {
  if (mode === MODES.COLOUR) {
    return (
      <span className="flex flex-col leading-tight">
        <span>{value[0]}</span>
        <span>{value[1]}</span>
        <span>{value[2]}</span>
      </span>
    )
  }
  return value
}

/**
 * A square grid of cells. When onPaintStart / onPaint are given, cells can be
 * clicked or dragged over (mouse, pen or touch).
 */
export default function PixelGrid({ size, mode, cells, showNumbers = false, onPaintStart, onPaint }) {
  const painting = useRef(false)
  const last = useRef(-1)
  const interactive = Boolean(onPaint)

  const indexAt = (e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY)
    const idx = el?.closest?.('[data-idx]')?.dataset.idx
    return idx === undefined ? -1 : Number(idx)
  }

  const down = (e) => {
    if (!interactive) return
    const i = indexAt(e)
    if (i < 0) return
    e.preventDefault()
    painting.current = true
    last.current = i
    onPaintStart?.(i)
    onPaint(i)
  }
  const move = (e) => {
    if (!painting.current) return
    const i = indexAt(e)
    if (i < 0 || i === last.current) return
    last.current = i
    onPaint(i)
  }
  const up = () => {
    painting.current = false
    last.current = -1
  }

  const fontSize = mode === MODES.COLOUR ? 'text-[0.6rem] sm:text-sm' : size > 8 ? 'text-[0.55rem] sm:text-xs' : 'text-sm sm:text-xl'

  return (
    <div
      className={`grid w-full aspect-square select-none border-2 border-slate-400 bg-slate-300 gap-px ${interactive ? 'cursor-crosshair touch-none' : ''}`}
      style={{ gridTemplateColumns: `repeat(${size}, minmax(0, 1fr))` }}
      onPointerDown={down}
      onPointerMove={move}
      onPointerUp={up}
      onPointerLeave={up}
      onPointerCancel={up}
      role="img"
      aria-label={`${size} by ${size} pixel picture`}
    >
      {cells.map((v, i) => (
        <div
          key={i}
          data-idx={i}
          className={`flex items-center justify-center font-mono font-semibold ${fontSize}`}
          style={{ background: cellColour(v, mode), color: textColour(v, mode) }}
        >
          {showNumbers && cellLabel(v, mode)}
        </div>
      ))}
    </div>
  )
}
