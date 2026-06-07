import type { Locale } from './marketplaces';

import esUi from '../content/ui/es.json';
import enUi from '../content/ui/en.json';
import frUi from '../content/ui/fr.json';
import itUi from '../content/ui/it.json';
import deUi from '../content/ui/de.json';

import esFamilies from '../content/es/families.json';
import enFamilies from '../content/en/families.json';
import frFamilies from '../content/fr/families.json';
import itFamilies from '../content/it/families.json';
import deFamilies from '../content/de/families.json';

const uiByLang = { es: esUi, en: enUi, fr: frUi, it: itUi, de: deUi } as const;
const familiesByLang = { es: esFamilies, en: enFamilies, fr: frFamilies, it: itFamilies, de: deFamilies } as const;

export type UIStrings = typeof esUi;
export type FamilyEntry = (typeof esFamilies)[number];

export function getUi(lang: Locale): UIStrings {
  return uiByLang[lang] as UIStrings;
}

export function getFamilies(lang: Locale): FamilyEntry[] {
  return familiesByLang[lang] as FamilyEntry[];
}

export function getFamilyByCode(lang: Locale, slug: string): FamilyEntry | undefined {
  return getFamilies(lang).find((f) => f.slug === slug);
}
