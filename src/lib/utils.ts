import ms from 'ms';

export function parseDuration(input: string): number | null {
  if (!input) return null;
  const duration = ms(input as any);
  return typeof duration === 'number' ? duration : null;
}

export function formatDuration(msValue: number): string {
  return ms(msValue, { long: true });
}
