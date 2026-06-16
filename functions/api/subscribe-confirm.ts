interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
  SUBSCRIBE_TOKEN_SECRET: string;
}

interface Context {
  request: Request;
  env: Env;
}

const LANGS = ['es', 'en', 'fr', 'it', 'de'] as const;
type Lang = (typeof LANGS)[number];

const CONFIRMED_PATHS: Record<Lang, string> = {
  es: '/suscripcion-confirmada/',
  en: '/en/subscription-confirmed/',
  fr: '/fr/abonnement-confirme/',
  it: '/it/iscrizione-confermata/',
  de: '/de/anmeldung-bestaetigt/',
};

const PENDING_PATHS: Record<Lang, string> = {
  es: '/suscripcion-pendiente/',
  en: '/en/subscription-pending/',
  fr: '/fr/abonnement-en-attente/',
  it: '/it/iscrizione-in-attesa/',
  de: '/de/anmeldung-ausstehend/',
};

function base64urlDecode(s: string): Uint8Array {
  let p = s.replace(/-/g, '+').replace(/_/g, '/');
  while (p.length % 4) p += '=';
  const b = atob(p);
  const out = new Uint8Array(b.length);
  for (let i = 0; i < b.length; i++) out[i] = b.charCodeAt(i);
  return out;
}

async function verifyToken(
  token: string,
  secret: string,
): Promise<{ email: string; lang: Lang; exp: number } | null> {
  const parts = token.split('.');
  if (parts.length !== 2) return null;
  const [data, sig] = parts;
  try {
    const key = await crypto.subtle.importKey(
      'raw',
      new TextEncoder().encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify'],
    );
    const ok = await crypto.subtle.verify(
      'HMAC',
      key,
      base64urlDecode(sig),
      new TextEncoder().encode(data),
    );
    if (!ok) return null;
    const bytes = base64urlDecode(data);
    const str = new TextDecoder().decode(bytes);
    const obj = JSON.parse(str);
    if (
      typeof obj?.email !== 'string' ||
      typeof obj?.lang !== 'string' ||
      typeof obj?.exp !== 'number'
    ) {
      return null;
    }
    if (!(LANGS as readonly string[]).includes(obj.lang)) return null;
    return obj as { email: string; lang: Lang; exp: number };
  } catch {
    return null;
  }
}

export async function onRequestGet(context: Context): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = url.origin;
  const tokenParam = url.searchParams.get('t');

  if (!tokenParam) {
    return Response.redirect(`${origin}${PENDING_PATHS.es}?err=expired`, 303);
  }

  const decoded = await verifyToken(tokenParam, env.SUBSCRIBE_TOKEN_SECRET);
  if (!decoded) {
    return Response.redirect(`${origin}${PENDING_PATHS.es}?err=expired`, 303);
  }

  const lang = decoded.lang;
  const pendingPath = PENDING_PATHS[lang];
  const confirmedPath = CONFIRMED_PATHS[lang];

  const now = Math.floor(Date.now() / 1000);
  if (decoded.exp < now) {
    return Response.redirect(`${origin}${pendingPath}?err=expired`, 303);
  }

  try {
    const res = await fetch(
      `https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts/${encodeURIComponent(decoded.email)}`,
      {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${env.RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ unsubscribed: false }),
      },
    );
    if (!res.ok) {
      return Response.redirect(`${origin}${pendingPath}?err=send`, 303);
    }
  } catch {
    return Response.redirect(`${origin}${pendingPath}?err=send`, 303);
  }

  return Response.redirect(`${origin}${confirmedPath}`, 303);
}
