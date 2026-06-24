/**
 * Validation utilities for PitchSync.
 * Provides reusable field and schema validators for pitch and presentation data.
 */

/** Check an email address format */
export function isValidEmail(email: string): boolean {
  return /^[^s@]+@[^s@]+.[^s@]+$/.test(email.trim());
}

/** Check a URL is well-formed (http or https) */
export function isValidUrl(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === 'http:' || u.protocol === 'https:';
  } catch {
    return false;
  }
}

/** Ensure a string is non-empty after trimming */
export function isNonEmpty(value: string): boolean {
  return value.trim().length > 0;
}

/** Check a value falls within an inclusive range */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max;
}

export interface PitchDeck {
  title: string;
  ownerEmail: string;
  slides: unknown[];
  shareUrl?: string;
}

/** Validate a PitchDeck object and return a list of field errors */
export function validatePitchDeck(deck: PitchDeck): string[] {
  const errors: string[] = [];
  if (!isNonEmpty(deck.title)) errors.push('title must not be empty');
  if (!isValidEmail(deck.ownerEmail)) errors.push('ownerEmail is not a valid email address');
  if (!Array.isArray(deck.slides) || deck.slides.length === 0) errors.push('deck must contain at least one slide');
  if (deck.shareUrl && !isValidUrl(deck.shareUrl)) errors.push('shareUrl is not a valid URL');
  return errors;
}
