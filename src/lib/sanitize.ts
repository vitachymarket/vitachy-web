import sanitizeHtml from 'sanitize-html';

const LEADING_EMOJI =
  /^[\p{Extended_Pictographic}\p{Emoji_Component}\p{Variation_Selector}‍\s]+/u;

const ALLCAPS_PREFIX =
  /^([A-ZÁÉÍÓÚÜÑÄÖÜ0-9][A-ZÁÉÍÓÚÜÑÄÖÜ0-9\s/&"'()%]*?)\s*[:\-–—]\s+/;

const ACRONYMS = [
  'BPA', 'UV', 'PVC', 'PET', 'HIPS', 'PP', 'TPR', 'ABS', 'DIY', 'XL', 'TPU',
] as const;

const ACRONYM_REGEX = new RegExp(`\\b(?:${ACRONYMS.join('|')})\\b`, 'gi');

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

function restoreAcronyms(text: string): string {
  return text.replace(ACRONYM_REGEX, (match) => match.toUpperCase());
}

export interface CleanedBullet {
  html: string;
  hadPrefix: boolean;
}

export function cleanBullet(raw: string): CleanedBullet {
  const stripped = raw.replace(LEADING_EMOJI, '').trim();
  const match = stripped.match(ALLCAPS_PREFIX);

  if (!match) {
    return {
      html: escapeHtml(restoreAcronyms(stripped)),
      hadPrefix: false,
    };
  }

  const prefix = restoreAcronyms(titleCasePrefix(match[1]));
  let rest = stripped.slice(match[0].length);
  if (rest.length > 0) {
    const firstChar = rest.charAt(0);
    const upper = firstChar.toLocaleUpperCase('es-ES');
    if (upper !== firstChar) {
      rest = upper + rest.slice(1);
    }
  }
  rest = restoreAcronyms(rest);

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
