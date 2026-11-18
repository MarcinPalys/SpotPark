/**
 * Polish plural form: plural(n, ['opinia', 'opinie', 'opinii']).
 * forms = [one, few (2-4), many (5+)]
 */
export function plural(n, [one, few, many]) {
  if (n === 1) return one;
  const last = n % 10;
  const lastTwo = n % 100;
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return few;
  return many;
}
