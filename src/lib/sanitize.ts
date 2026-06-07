import sanitizeHtml from 'sanitize-html';

const LEADING_EMOJI =
  /^[\p{Extended_Pictographic}\p{Emoji_Component}\p{Variation_Selector}‍\s]+/u;

const ALLCAPS_PREFIX =
  /^([A-ZÁÉÍÓÚÜÑ0-9][A-ZÁÉÍÓÚÜÑ0-9\s\-/&"'()%]*?):\s+/;

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function titleCasePrefix(prefix: string): string {
  const trimmed = prefix.trim();
  if (!trimmed) return '';
  const first = trimmed.charAt(0);
  const rest = trimmed.slice(1).toLocaleLowerCase('es-ES');
  return first + rest;
}

export interface CleanedBullet {
  html: string;
  hadPrefix: boolean;
}

export function cleanBullet(raw: string): CleanedBullet {
  const stripped = raw.replace(LEADING_EMOJI, '').trim();
  const match = stripped.match(ALLCAPS_PREFIX);

  if (!match) {
    return { html: escapeHtml(stripped), hadPrefix: false };
  }

  const prefix = titleCasePrefix(match[1]);
  let rest = stripped.slice(match[0].length);
  if (rest.length > 0) {
    const firstChar = rest.charAt(0);
    const upper = firstChar.toLocaleUpperCase('es-ES');
    if (upper !== firstChar) {
      rest = upper + rest.slice(1);
    }
  }

  return {
    html: `<strong>${escapeHtml(prefix)}.</strong> ${escapeHtml(rest)}`,
    hadPrefix: true,
  };
}

const ALLOWED_TAGS = ['p', 'ul', 'ol', 'li', 'strong', 'em', 'br', 'h3'];

export function cleanDescriptionHtml(raw: string): string {
  return sanitizeHtml(raw, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {},
    disallowedTagsMode: 'discard',
    allowedSchemes: [],
  });
}
