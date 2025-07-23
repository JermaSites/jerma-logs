export default function (input: string): string {
  return input[0] ? input[0].toUpperCase() + input.slice(1) : ''
}
