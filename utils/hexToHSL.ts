export default function (hex: string): {
  h: number
  l: number
  s: number
} {
  let r = Number.parseInt(`0x${hex[1]}${hex[2]}`)
  let g = Number.parseInt(`0x${hex[3]}${hex[4]}`)
  let b = Number.parseInt(`0x${hex[5]}${hex[6]}`)

  r /= 255
  g /= 255
  b /= 255

  const cmin = Math.min(r, g, b)
  const cmax = Math.max(r, g, b)
  const delta = cmax - cmin
  let h = 0
  let s = 0
  let l = 0

  if (delta === 0)
    h = 0
  else if (cmax === r)
    h = ((g - b) / delta) % 6
  else if (cmax === g)
    h = (b - r) / delta + 2
  else
    h = (r - g) / delta + 4

  h = Math.round(h * 60)

  if (h < 0)
    h += 360

  l = (cmax + cmin) / 2
  s = delta === 0 ? 0 : delta / (1 - Math.abs(2 * l - 1))
  s = +(s * 100).toFixed(1)
  l = +(l * 100).toFixed(1)

  return { h, s, l }
}
