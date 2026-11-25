// Pure helpers for working with pixels. An "image" here is an ImageData-like
// object: { width, height, data } where data is RGBA, 4 numbers per pixel.

/** Luminance-weighted grayscale value (0–255) of one RGB colour. */
export function toGray(r, g, b) {
  return Math.round(0.299 * r + 0.587 * g + 0.114 * b)
}

/**
 * Shrinks an image to outW × outH. Each output pixel is the average of the
 * block of source pixels it covers.
 */
export function pixelate(img, outW, outH) {
  const data = new Uint8ClampedArray(outW * outH * 4)
  for (let oy = 0; oy < outH; oy++) {
    const y0 = Math.floor((oy * img.height) / outH)
    const y1 = Math.max(y0 + 1, Math.floor(((oy + 1) * img.height) / outH))
    for (let ox = 0; ox < outW; ox++) {
      const x0 = Math.floor((ox * img.width) / outW)
      const x1 = Math.max(x0 + 1, Math.floor(((ox + 1) * img.width) / outW))
      let r = 0, g = 0, b = 0, a = 0, n = 0
      for (let y = y0; y < y1; y++) {
        for (let x = x0; x < x1; x++) {
          const i = (y * img.width + x) * 4
          r += img.data[i]
          g += img.data[i + 1]
          b += img.data[i + 2]
          a += img.data[i + 3]
          n++
        }
      }
      const o = (oy * outW + ox) * 4
      data[o] = Math.round(r / n)
      data[o + 1] = Math.round(g / n)
      data[o + 2] = Math.round(b / n)
      data[o + 3] = Math.round(a / n)
    }
  }
  return { width: outW, height: outH, data }
}

/** Reads the RGB values of the pixel at column x, row y. */
export function getPixel(img, x, y) {
  const i = (y * img.width + x) * 4
  return { r: img.data[i], g: img.data[i + 1], b: img.data[i + 2] }
}
