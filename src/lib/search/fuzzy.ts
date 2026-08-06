/** Classic Levenshtein edit distance between two strings. */
export function editDistance(a: string, b: string): number {
  if (a === b) return 0;
  if (a.length === 0) return b.length;
  if (b.length === 0) return a.length;

  const prev = new Array(b.length + 1);
  const curr = new Array(b.length + 1);
  for (let j = 0; j <= b.length; j++) prev[j] = j;

  for (let i = 1; i <= a.length; i++) {
    curr[0] = i;
    for (let j = 1; j <= b.length; j++) {
      const cost = a[i - 1] === b[j - 1] ? 0 : 1;
      curr[j] = Math.min(curr[j - 1] + 1, prev[j] + 1, prev[j - 1] + cost);
    }
    for (let j = 0; j <= b.length; j++) prev[j] = curr[j];
  }
  return prev[b.length];
}

/**
 * Returns true if `word` plausibly matches `query` allowing for typos —
 * tolerance scales with query length so short queries stay strict.
 */
export function fuzzyMatches(query: string, word: string): boolean {
  if (word.includes(query)) return true;
  if (query.length < 3) return false;
  const maxDistance = query.length <= 5 ? 1 : query.length <= 9 ? 2 : 3;
  // Compare against a same-length window of the word for cheap approximate matching.
  for (let start = 0; start <= Math.max(word.length - query.length, 0); start++) {
    const window = word.slice(start, start + query.length + maxDistance);
    if (editDistance(query, window.slice(0, query.length)) <= maxDistance) return true;
  }
  return editDistance(query, word) <= maxDistance;
}
