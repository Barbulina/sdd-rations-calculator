export function searchByName<T extends { name: string }>(
  items: T[],
  query: string,
): T[] {
  const trimmed = query.trim();
  if (!trimmed) return items;

  const normalizedQuery = trimmed
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();

  const withNorm = items.map((item) => ({
    item,
    norm: item.name
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .toLowerCase(),
  }));

  return withNorm
    .filter(({ norm }) => norm.includes(normalizedQuery))
    .sort((a, b) => {
      if (a.norm === normalizedQuery && b.norm !== normalizedQuery) return -1;
      if (b.norm === normalizedQuery && a.norm !== normalizedQuery) return 1;
      if (
        a.norm.startsWith(normalizedQuery) &&
        !b.norm.startsWith(normalizedQuery)
      )
        return -1;
      if (
        b.norm.startsWith(normalizedQuery) &&
        !a.norm.startsWith(normalizedQuery)
      )
        return 1;
      return 0;
    })
    .map(({ item }) => item);
}
