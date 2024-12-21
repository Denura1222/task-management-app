export function formatDateFromTimestamp(timestamp: number): string {
  const date = new Date(timestamp);
  const month = date.toLocaleString('default', { month: 'short' });
  const day = date.getDate();
  return `${month} ${day}`;
}