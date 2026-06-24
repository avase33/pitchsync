/**
 * Formatting utilities for PitchSync.
 * Helpers for dates, durations, and display text used in pitch presentations.
 */

/**
 * Format a duration in seconds as a human-readable string (e.g. "2m 35s").
 */
export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  if (m === 0) return `${s}s`;
  return `${m}m ${s}s`;
}

/**
 * Format a Date or ISO string as a short relative label ("Today", "Yesterday", or "Jun 24").
 */
export function formatRelativeDate(date: Date | string): string {
  const d = new Date(date);
  const now = new Date();
  const diffDays = Math.floor((now.getTime() - d.getTime()) / 86_400_000);
  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

/**
 * Capitalise the first letter of each word in a string.
 */
export function titleCase(str: string): string {
  return str.replace(/w/g, c => c.toUpperCase());
}

/**
 * Format a slide count as a human-readable label (e.g. "12 slides").
 */
export function formatSlideCount(count: number): string {
  return count === 1 ? '1 slide' : `${count} slides`;
}
