export function findMatching<T>(...lists: T[][]): T[] {
  // Ensure that there are at least two lists to compare
  if (lists.length < 2) {
    throw new Error("At least two lists are required for comparison.");
  }

  // Intersect the lists
  const result = lists.reduce((previous, current) =>
    previous.filter((value) => current.includes(value))
  );

  // Remove duplicates
  return Array.from(new Set(result));
}
