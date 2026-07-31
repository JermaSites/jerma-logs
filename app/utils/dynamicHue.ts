import hexToHSL from './hexToHSL'

const HEX_COLOR = /^#[0-9a-f]{6}$/i

export default function (hex: string, colorMode: string): string {
  // Twitch sends an empty colour for users who never picked one.
  if (!HEX_COLOR.test(hex))
    return 'currentColor'

  let { h, s, l } = hexToHSL(hex)

  if (colorMode === 'light')
    l = Math.max(0, l - 15)

  return `hsl(${h},${s}%,${l}%)`
}
