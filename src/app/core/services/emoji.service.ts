import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class EmojiService {
  /**
   * Convert each Unicode code point in the input string to a lowercase hexadecimal string.
   *
   * - Returns `null` if `emoji` is empty or if any code point cannot be determined.
   * - Does not handle grapheme clusters: ZWJ sequences, skin-tone modifiers, or flag pairs are not interpreted as a single glyph.
   * - Hex values are lowercase without zero-padding (for example `1f455`).
   * - For multi-codepoint sequences, each code point is converted and joined with `-` (for example `1f1e7-1f1f7`).
   *
   * @param emoji - A string containing one or more Unicode code points (e.g., '👕', '🇫🇷').
   * @returns A hex string suitable for Twemoji asset names or `null` on failure.
   */
  getEmojiCode(emoji: string): string | null {
    if (!emoji) return null;

    const codePoints: number[] = [];
    for (const char of [...emoji]) {
      const cp = char.codePointAt(0);
      if (cp == null) return null;
      codePoints.push(cp);
    }

    return codePoints.map((cp) => cp.toString(16)).join('-');
  }

  /**
   * Get the URL of the SVG asset for the given emoji code.
   *
   * @param emojiCode - The hexadecimal code of the emoji (e.g., '1f455').
   * @returns The URL of the corresponding SVG asset.
   */
  getEmojiUrl(emojiCode: string): string {
    return `https://cdn.jsdelivr.net/gh/jdecked/twemoji@latest/assets/svg/${emojiCode}.svg`;
  }
}
