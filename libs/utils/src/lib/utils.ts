export function isLetter(str: string | null | undefined): boolean {
  return !!str?.replace(/[^\p{Letter}]/gu, '');
}
