function generateCharacters(startChar: string, endChar: string): string {
  const startCharCode = startChar.charCodeAt(0);
  const endCharCode = endChar.charCodeAt(0);

  return Array.from({ length: endCharCode - startCharCode + 1 }, (_, i) =>
    String.fromCharCode(startCharCode + i)
  ).join('');
}

const characters = generateCharacters('a', 'z');

export function generateHash(length = 7): string {
  return Array.from({ length }, () =>
    characters.charAt(Math.floor(Math.random() * characters.length))
  ).join('');
}
