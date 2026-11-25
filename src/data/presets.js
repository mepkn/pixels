// Presets for the Draw and Numbers tabs.
//
// Every preset is drawn as 8 text rows of 8 characters:
//   bw:     '#' = 1 (black), '.' = 0 (white)
//   colour: one letter per cell, see PALETTE below ('.' = white)
// For a 16 × 16 grid each cell is doubled in both directions.

export const MODES = { BW: 'bw', COLOUR: 'colour' }

export const PALETTE = {
  R: { name: 'Red', rgb: [255, 0, 0] },
  G: { name: 'Green', rgb: [0, 160, 0] },
  B: { name: 'Blue', rgb: [0, 0, 255] },
  Y: { name: 'Yellow', rgb: [255, 220, 0] },
  O: { name: 'Orange', rgb: [255, 140, 0] },
  P: { name: 'Purple', rgb: [128, 0, 160] },
  K: { name: 'Black', rgb: [0, 0, 0] },
  W: { name: 'White', rgb: [255, 255, 255] },
}

const PATTERNS = {
  Smiley: {
    bw: [
      '..####..',
      '.#....#.',
      '#.#..#.#',
      '#......#',
      '#.#..#.#',
      '#..##..#',
      '.#....#.',
      '..####..',
    ],
    colour: [
      '..OOOO..',
      '.OYYYYO.',
      'OYKYYKYO',
      'OYYYYYYO',
      'OYRYYRYO',
      'OYYRRYYO',
      '.OYYYYO.',
      '..OOOO..',
    ],
  },
  Heart: {
    bw: [
      '........',
      '.##..##.',
      '########',
      '########',
      '.######.',
      '..####..',
      '...##...',
      '........',
    ],
    colour: [
      '........',
      '.RR..RR.',
      'RRRRRRRR',
      'RRRRRRRR',
      '.RRRRRR.',
      '..RRRR..',
      '...RR...',
      '........',
    ],
  },
  'Letter A': {
    bw: [
      '...##...',
      '..#..#..',
      '.#....#.',
      '.#....#.',
      '.######.',
      '.#....#.',
      '.#....#.',
      '........',
    ],
    colour: [
      '...BB...',
      '..B..B..',
      '.B....B.',
      '.B....B.',
      '.BBBBBB.',
      '.B....B.',
      '.B....B.',
      '........',
    ],
  },
  Clear: {
    bw: Array(8).fill('........'),
    colour: Array(8).fill('........'),
  },
}

export const MODE_OPTIONS = [
  { value: MODES.BW, label: 'Black & White' },
  { value: MODES.COLOUR, label: 'Colour' },
]

export const PRESET_NAMES = Object.keys(PATTERNS)

/** A blank cell value for a mode. */
export function blankValue(mode) {
  if (mode === MODES.BW) return 0
  return [255, 255, 255]
}

function charValue(ch, mode, bwChar) {
  if (mode === MODES.BW) return bwChar === '#' ? 1 : 0
  const rgb = (PALETTE[ch] ?? PALETTE.W).rgb
  return [...rgb]
}

/**
 * Returns the cells (row by row, size × size) of a preset.
 * Colour mode is always 8 × 8.
 */
export function getPreset(name, mode, size = 8) {
  const p = PATTERNS[name]
  if (!p) throw new Error(`Unknown preset: ${name}`)
  const n = mode === MODES.COLOUR ? 8 : size
  const scale = n / 8
  const cells = []
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      const py = Math.floor(y / scale)
      const px = Math.floor(x / scale)
      cells.push(charValue(p.colour[py][px], mode, p.bw[py][px]))
    }
  }
  return cells
}
