const ESCAPES: Record<string, string> = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  '\'': '&#39;',
}

/**
 * Escape text that is about to be interpolated into an HTML string rendered
 * with `v-html`. Chat messages are attacker-controlled, so every untrusted
 * substring — text, attribute values, URLs — has to go through this.
 */
export default function (value: string): string {
  return value.replace(/[&<>"']/g, char => ESCAPES[char]!)
}
