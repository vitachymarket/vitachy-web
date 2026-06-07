import type { Locale } from './marketplaces';
import { DEFAULT_LOCALE, LOCALES } from './marketplaces';

export type FamilySlug =
  | 'dispensadores-cocina'
  | 'dispensadores-ducha'
  | 'dispensadores-bano'
  | 'aceiteras'
  | 'pulverizadores'
  | 'pastilleros';

export const FAMILY_SLUGS: FamilySlug[] = [
  'dispensadores-cocina',
  'dispensadores-ducha',
  'dispensadores-bano',
  'aceiteras',
  'pulverizadores',
  'pastilleros',
];

export const PRODUCT_CODES = [
  'DC1', 'DC2', 'DC3', 'DC4',
  'DG1', 'DG2',
  'DB1', 'DB2',
  'DA1',
  'P2N', 'P1A', 'P1S', 'P2A',
  'PT1',
] as const;
export type ProductCode = (typeof PRODUCT_CODES)[number];

export const PRODUCT_FAMILY: Record<ProductCode, FamilySlug> = {
  DC1: 'dispensadores-cocina',
  DC2: 'dispensadores-cocina',
  DC3: 'dispensadores-cocina',
  DC4: 'dispensadores-cocina',
  DG1: 'dispensadores-ducha',
  DG2: 'dispensadores-ducha',
  DB1: 'dispensadores-bano',
  DB2: 'dispensadores-bano',
  DA1: 'aceiteras',
  P2N: 'pulverizadores',
  P1A: 'pulverizadores',
  P1S: 'pulverizadores',
  P2A: 'pulverizadores',
  PT1: 'pastilleros',
};

export const FAMILY_SLUG_BY_LANG: Record<Locale, Record<FamilySlug, string>> = {
  es: {
    'dispensadores-cocina': 'dispensadores-cocina',
    'dispensadores-ducha': 'dispensadores-ducha',
    'dispensadores-bano': 'dispensadores-bano',
    'aceiteras': 'aceiteras',
    'pulverizadores': 'pulverizadores',
    'pastilleros': 'pastilleros',
  },
  en: {
    'dispensadores-cocina': 'kitchen-dispensers',
    'dispensadores-ducha': 'shower-dispensers',
    'dispensadores-bano': 'bathroom-dispensers',
    'aceiteras': 'oil-sprayers',
    'pulverizadores': 'spray-bottles',
    'pastilleros': 'pill-organisers',
  },
  fr: {
    'dispensadores-cocina': 'distributeurs-cuisine',
    'dispensadores-ducha': 'distributeurs-douche',
    'dispensadores-bano': 'distributeurs-salle-de-bain',
    'aceiteras': 'huiliers-spray',
    'pulverizadores': 'vaporisateurs',
    'pastilleros': 'piluliers',
  },
  it: {
    'dispensadores-cocina': 'dispenser-cucina',
    'dispensadores-ducha': 'dispenser-doccia',
    'dispensadores-bano': 'dispenser-bagno',
    'aceiteras': 'oliere-spray',
    'pulverizadores': 'flaconi-spray',
    'pastilleros': 'portapillole',
  },
  de: {
    'dispensadores-cocina': 'kuechenspender',
    'dispensadores-ducha': 'duschspender',
    'dispensadores-bano': 'badspender',
    'aceiteras': 'oelsprueher',
    'pulverizadores': 'spruehflaschen',
    'pastilleros': 'tablettenboxen',
  },
};

export const PRODUCT_SLUG_BY_LANG: Record<Locale, Record<ProductCode, string>> = {
  es: {
    DC1: 'dispensador-doble',
    DC2: 'jabonera-organizador',
    DC3: 'dispensador-con-bayeta',
    DC4: 'organizador-fregadero-4-en-1',
    DG1: 'pack-3-dispensadores-ducha-negros',
    DG2: 'pack-3-dispensadores-ducha-azules',
    DB1: 'dispensador-pure-soap',
    DB2: 'pack-2-dispensadores-ambar',
    DA1: 'aceitera-2-en-1',
    P2N: 'pulverizador-ambar-chocolate',
    P1A: 'pulverizador-azul-gris',
    P1S: 'pulverizador-salmon',
    P2A: 'pulverizador-ambar-eucalipto',
    PT1: 'pastillero-semanal-pack-2',
  },
  en: {
    DC1: 'double-soap-dispenser',
    DC2: 'soap-dispenser-tray',
    DC3: 'soap-dispenser-cloth',
    DC4: 'sink-organiser-4-in-1',
    DG1: 'shower-dispenser-set-black',
    DG2: 'shower-dispenser-set-blue',
    DB1: 'pure-soap-ceramic-dispenser',
    DB2: 'amber-glass-soap-dispenser',
    DA1: 'oil-sprayer-2-in-1',
    P2N: 'amber-spray-bottle-chocolate',
    P1A: 'spray-bottle-blue-grey',
    P1S: 'spray-bottle-salmon',
    P2A: 'amber-spray-bottle-eucalyptus',
    PT1: 'weekly-pill-organiser',
  },
  fr: {
    DC1: 'distributeur-double',
    DC2: 'distributeur-savon-bac',
    DC3: 'distributeur-savon-chiffon',
    DC4: 'organisateur-evier-4-en-1',
    DG1: 'pack-3-distributeurs-douche-noirs',
    DG2: 'pack-3-distributeurs-douche-bleus',
    DB1: 'distributeur-ceramique-pure-soap',
    DB2: 'distributeur-verre-ambre',
    DA1: 'huilier-spray-2-en-1',
    P2N: 'vaporisateur-ambre-chocolat',
    P1A: 'vaporisateur-bleu-gris',
    P1S: 'vaporisateur-saumon',
    P2A: 'vaporisateur-ambre-eucalyptus',
    PT1: 'pilulier-hebdomadaire',
  },
  it: {
    DC1: 'dispenser-doppio',
    DC2: 'dispenser-sapone-vassoio',
    DC3: 'dispenser-sapone-panno',
    DC4: 'organizer-lavello-4-in-1',
    DG1: 'pack-3-dispenser-doccia-neri',
    DG2: 'pack-3-dispenser-doccia-azzurri',
    DB1: 'dispenser-ceramica-pure-soap',
    DB2: 'dispenser-vetro-ambra',
    DA1: 'oliera-spray-2-in-1',
    P2N: 'flacone-spray-ambra-cioccolato',
    P1A: 'flacone-spray-blu-grigio',
    P1S: 'flacone-spray-salmone',
    P2A: 'flacone-spray-ambra-eucalipto',
    PT1: 'portapillole-settimanale',
  },
  de: {
    DC1: 'doppelter-seifenspender',
    DC2: 'seifenspender-ablage',
    DC3: 'seifenspender-tuch',
    DC4: 'spuelbecken-organizer-4-in-1',
    DG1: 'duschspender-set-schwarz',
    DG2: 'duschspender-set-blau',
    DB1: 'pure-soap-keramikspender',
    DB2: 'amberglas-seifenspender',
    DA1: 'oelsprueher-2-in-1',
    P2N: 'amber-spruehflasche-schoko',
    P1A: 'spruehflasche-blau-grau',
    P1S: 'spruehflasche-lachs',
    P2A: 'amber-spruehflasche-eukalyptus',
    PT1: 'wochen-tablettenbox',
  },
};

export const ROUTE_PREFIXES: Record<Locale, { family: string; product: string; about: string; estancia: string }> = {
  es: { family: 'familia',   product: 'producto', about: 'sobre-vitachy', estancia: 'estancia' },
  en: { family: 'family',    product: 'product',  about: 'about-vitachy', estancia: 'room' },
  fr: { family: 'famille',   product: 'produit',  about: 'a-propos',      estancia: 'piece' },
  it: { family: 'famiglia',  product: 'prodotto', about: 'chi-siamo',     estancia: 'ambiente' },
  de: { family: 'familie',   product: 'produkt',  about: 'ueber-vitachy', estancia: 'raum' },
};

export type EstanciaSlug = 'cocina' | 'bano' | 'hogar';

export const ESTANCIAS: Record<EstanciaSlug, {
  label: string;
  description: string;
  families: FamilySlug[];
}> = {
  cocina: {
    label: 'Cocina',
    description: 'Dispensadores y organizadores para el fregadero.',
    families: ['dispensadores-cocina'],
  },
  bano: {
    label: 'Baño',
    description: 'Dispensadores recargables para el lavabo y dispensadores fijos para la pared de la ducha.',
    families: ['dispensadores-bano', 'dispensadores-ducha'],
  },
  hogar: {
    label: 'Hogar',
    description: 'Pulverizadores de cristal recargables, aceiteras pulverizadoras y pastilleros semanales.',
    families: ['pulverizadores', 'aceiteras', 'pastilleros'],
  },
};

export const ESTANCIA_SLUG_BY_LANG: Record<Locale, Record<EstanciaSlug, string>> = {
  es: { cocina: 'cocina', bano: 'bano', hogar: 'hogar' },
  en: { cocina: 'kitchen', bano: 'bathroom', hogar: 'home' },
  fr: { cocina: 'cuisine', bano: 'salle-de-bain', hogar: 'maison' },
  it: { cocina: 'cucina', bano: 'bagno', hogar: 'casa' },
  de: { cocina: 'kueche', bano: 'badezimmer', hogar: 'haushalt' },
};

export function familyToEstancia(family: FamilySlug): EstanciaSlug {
  for (const [slug, def] of Object.entries(ESTANCIAS) as [EstanciaSlug, (typeof ESTANCIAS)[EstanciaSlug]][]) {
    if (def.families.includes(family)) return slug;
  }
  return 'hogar';
}

function langPrefix(lang: Locale): string {
  return lang === DEFAULT_LOCALE ? '' : `/${lang}`;
}

export function familyUrl(slug: FamilySlug, lang: Locale): string {
  const localised = FAMILY_SLUG_BY_LANG[lang][slug];
  return `${langPrefix(lang)}/${ROUTE_PREFIXES[lang].family}/${localised}/`;
}

export function productUrl(code: ProductCode, lang: Locale): string {
  const slug = PRODUCT_SLUG_BY_LANG[lang][code];
  return `${langPrefix(lang)}/${ROUTE_PREFIXES[lang].product}/${code.toLowerCase()}-${slug}/`;
}

export function homeUrl(lang: Locale): string {
  return `${langPrefix(lang)}/`;
}

export function aboutUrl(lang: Locale): string {
  return `${langPrefix(lang)}/${ROUTE_PREFIXES[lang].about}/`;
}

export function estanciaUrl(slug: EstanciaSlug, lang: Locale): string {
  const localised = ESTANCIA_SLUG_BY_LANG[lang][slug];
  return `${langPrefix(lang)}/${ROUTE_PREFIXES[lang].estancia}/${localised}/`;
}

export function hreflangFor(
  build: (lang: Locale) => string,
): Array<{ lang: Locale | 'x-default'; href: string }> {
  const out: Array<{ lang: Locale | 'x-default'; href: string }> = [];
  for (const lang of LOCALES) {
    out.push({ lang, href: build(lang) });
  }
  out.push({ lang: 'x-default', href: build(DEFAULT_LOCALE) });
  return out;
}
