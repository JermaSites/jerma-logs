import hexToHSL from "./hexToHSL";

export default function (hex: string, colorMode: string): string {
  let { h, s, l } = hexToHSL(hex);

  if (colorMode === "light") {
    l -= 15;
  }

  return "hsl(" + h + "," + s + "%," + l + "%)";
}
