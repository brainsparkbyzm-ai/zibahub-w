export function one(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

export function pageNumber(value: string | undefined) {
  const page = Number(value || 1);
  if (!Number.isFinite(page) || page < 1) return 1;
  return Math.floor(page);
}
