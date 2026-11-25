import { describe, expect, it } from 'vitest'
import { getPixel, pixelate, toGray } from './image.js'
import { MODES, PRESET_NAMES, getPreset } from '../data/presets.js'

function image(width, height, pixels) {
  return { width, height, data: new Uint8ClampedArray(pixels.flatMap((p) => [...p, 255])) }
}

describe('toGray', () => {
  it('converts a known RGB value', () => {
    // 0.299·120 + 0.587·200 + 0.114·80 = 35.88 + 117.4 + 9.12 = 162.4
    expect(toGray(120, 200, 80)).toBe(162)
    expect(toGray(0, 0, 0)).toBe(0)
    expect(toGray(255, 255, 255)).toBe(255)
  })
})

describe('pixelate', () => {
  it('averages a 4 × 4 image down to 2 × 2', () => {
    const R = [200, 0, 0], r = [100, 0, 0]
    const G = [0, 200, 0], g = [0, 0, 0]
    const B = [0, 0, 40], b = [0, 0, 80]
    const W = [255, 255, 255], K = [0, 0, 0]
    // prettier-ignore
    const src = image(4, 4, [
      R, r, G, g,
      r, R, g, G,
      B, b, W, K,
      b, B, K, W,
    ])
    const out = pixelate(src, 2, 2)
    expect(out.width).toBe(2)
    expect(out.height).toBe(2)
    expect(getPixel(out, 0, 0)).toEqual({ r: 150, g: 0, b: 0 })
    expect(getPixel(out, 1, 0)).toEqual({ r: 0, g: 100, b: 0 })
    expect(getPixel(out, 0, 1)).toEqual({ r: 0, g: 0, b: 60 })
    expect(getPixel(out, 1, 1)).toEqual({ r: 128, g: 128, b: 128 }) // 127.5 rounds up
  })
})

describe('presets', () => {
  for (const name of PRESET_NAMES) {
    it(`${name} has the right grid size for each mode`, () => {
      expect(getPreset(name, MODES.BW, 8)).toHaveLength(64)
      expect(getPreset(name, MODES.BW, 16)).toHaveLength(256)
      // Colour is always 8 × 8, even when 16 is asked for.
      expect(getPreset(name, MODES.COLOUR, 16)).toHaveLength(64)
    })

    it(`${name} has valid values for each mode`, () => {
      expect(getPreset(name, MODES.BW).every((v) => v === 0 || v === 1)).toBe(true)
      expect(getPreset(name, MODES.COLOUR).every((v) => v.length === 3)).toBe(true)
    })
  }
})
