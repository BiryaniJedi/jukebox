import { format, parseISO } from 'date-fns';

export function formatTimestamp(timestamp: string) {
  const date = parseISO(timestamp);
  return format(date, "MMM d, hh:mm aaa");
}