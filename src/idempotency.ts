// Espaço e caractere invisível (\p{Cf}, ex.: U+200B) nas bordas não mudam a chave.
const KEY_PADDING = /^[\s\p{Cf}]+|[\s\p{Cf}]+$/gu;

export function normalizeKey(key: string): string {
  return key.replace(KEY_PADDING, "").toLowerCase();
}
