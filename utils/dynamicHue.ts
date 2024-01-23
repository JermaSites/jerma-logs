import hexToHSL from "./hexToHSL";

export default function (hex: string, colorMode: string): string {
  console.log("Hue colorMode:", colorMode);
  let { h, s, l } = hexToHSL(hex);

  if (colorMode === "light") {
    l -= 15;
  }

  return "hsl(" + h + "," + s + "%," + l + "%)";
}
