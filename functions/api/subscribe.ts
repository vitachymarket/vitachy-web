interface Env {
  RESEND_API_KEY: string;
  RESEND_AUDIENCE_ID: string;
  TURNSTILE_SECRET_KEY: string;
  SUBSCRIBE_TOKEN_SECRET: string;
}

interface Context {
  request: Request;
  env: Env;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const LANGS = ['es', 'en', 'fr', 'it', 'de'] as const;
type Lang = (typeof LANGS)[number];

const PENDING_PATHS: Record<Lang, string> = {
  es: '/suscripcion-pendiente/',
  en: '/en/subscription-pending/',
  fr: '/fr/abonnement-en-attente/',
  it: '/it/iscrizione-in-attesa/',
  de: '/de/anmeldung-ausstehend/',
};

const SUBJECTS: Record<Lang, string> = {
  es: 'Confirma tu suscripción a Vitachy',
  en: 'Confirm your Vitachy subscription',
  fr: 'Confirmez votre abonnement Vitachy',
  it: 'Conferma la tua iscrizione a Vitachy',
  de: 'Bestätigen Sie Ihr Vitachy-Abonnement',
};

const INTRO: Record<Lang, string> = {
  es: 'Has solicitado recibir comunicaciones de Vitachy. Pulsa el botón para confirmar tu suscripción.',
  en: 'You requested to receive communications from Vitachy. Click the button to confirm your subscription.',
  fr: 'Vous avez demandé à recevoir des communications de Vitachy. Cliquez sur le bouton pour confirmer votre abonnement.',
  it: 'Hai richiesto di ricevere comunicazioni da Vitachy. Clicca sul pulsante per confermare la tua iscrizione.',
  de: 'Sie haben angefragt, Mitteilungen von Vitachy zu erhalten. Klicken Sie auf die Schaltfläche, um Ihr Abonnement zu bestätigen.',
};

const CTA: Record<Lang, string> = {
  es: 'Confirmar suscripción',
  en: 'Confirm subscription',
  fr: 'Confirmer l’abonnement',
  it: 'Conferma iscrizione',
  de: 'Abonnement bestätigen',
};

const FOOT: Record<Lang, string> = {
  es: 'El enlace caduca en 7 días. Si no has solicitado esta suscripción, ignora este mensaje.',
  en: 'The link expires in 7 days. If you did not request this subscription, please ignore this email.',
  fr: 'Le lien expire dans 7 jours. Si vous n’avez pas demandé cet abonnement, ignorez ce message.',
  it: 'Il link scade in 7 giorni. Se non hai richiesto questa iscrizione, ignora questo messaggio.',
  de: 'Der Link läuft in 7 Tagen ab. Wenn Sie dieses Abonnement nicht angefordert haben, ignorieren Sie diese E-Mail.',
};

function escapeHtml(s: string): string {
  return s.replace(/[&<>"']/g, (c) => {
    switch (c) {
      case '&': return '&amp;';
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '"': return '&quot;';
      case "'": return '&#39;';
      default: return c;
    }
  });
}

function base64url(buf: ArrayBuffer | Uint8Array): string {
  const bytes = buf instanceof Uint8Array ? buf : new Uint8Array(buf);
  let s = '';
  for (let i = 0; i < bytes.length; i++) s += String.fromCharCode(bytes[i]);
  return btoa(s).replace(/=+$/, '').replace(/\+/g, '-').replace(/\//g, '_');
}

async function signToken(payload: object, secret: string): Promise<string> {
  const json = JSON.stringify(payload);
  const data = base64url(new TextEncoder().encode(json));
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(data));
  return `${data}.${base64url(sig)}`;
}

export async function onRequestPost(context: Context): Promise<Response> {
  const { request, env } = context;
  const url = new URL(request.url);
  const origin = url.origin;
  const langQ = url.searchParams.get('lang');
  const lang: Lang = (LANGS as readonly string[]).includes(langQ ?? '') ? (langQ as Lang) : 'es';
  const pendingPath = PENDING_PATHS[lang];
  const referer = request.headers.get('Referer');

  const redirectBack = (err: string) => {
    const back = referer && referer.startsWith(origin) ? referer : `${origin}/`;
    const sep = back.includes('?') ? '&' : '?';
    return Response.redirect(`${back}${sep}subscribe_err=${err}`, 303);
  };

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirectBack('send');
  }

  const email = (form.get('email')?.toString() ?? '').trim().toLowerCase();
  const consent = form.get('consentimiento');
  const turnstileToken = (form.get('cf-turnstile-response')?.toString() ?? '').trim();

  if (!email) return redirectBack('email');
  if (!consent) return redirectBack('consent');
  if (!EMAIL_RE.test(email) || email.length > 160) return redirectBack('email');
  if (!turnstileToken) return redirectBack('turnstile');

  const verifyBody = new FormData();
  verifyBody.append('secret', env.TURNSTILE_SECRET_KEY);
  verifyBody.append('response', turnstileToken);
  const clientIp = request.headers.get('CF-Connecting-IP');
  if (clientIp) verifyBody.append('remoteip', clientIp);

  let verifyOk = false;
  try {
    const verifyRes = await fetch(
      'https://challenges.cloudflare.com/turnstile/v0/siteverify',
      { method: 'POST', body: verifyBody },
    );
    const verifyData = (await verifyRes.json()) as { success?: boolean };
    verifyOk = verifyData.success === true;
  } catch {
    verifyOk = false;
  }
  if (!verifyOk) return redirectBack('turnstile');

  if (!env.RESEND_AUDIENCE_ID) {
    console.error('[subscribe] Missing RESEND_AUDIENCE_ID env var');
    return redirectBack('send');
  }
  if (!env.RESEND_API_KEY) {
    console.error('[subscribe] Missing RESEND_API_KEY env var');
    return redirectBack('send');
  }
  if (!env.SUBSCRIBE_TOKEN_SECRET) {
    console.error('[subscribe] Missing SUBSCRIBE_TOKEN_SECRET env var');
    return redirectBack('send');
  }

  try {
    const res = await fetch(`https://api.resend.com/audiences/${env.RESEND_AUDIENCE_ID}/contacts`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, unsubscribed: true }),
    });
    if (!res.ok && res.status !== 409) {
      const body = await res.text();
      console.error('[subscribe] Resend contacts.create failed', res.status, body);
      return redirectBack('send');
    }
  } catch (e) {
    console.error('[subscribe] Resend contacts.create threw', e);
    return redirectBack('send');
  }

  const exp = Math.floor(Date.now() / 1000) + 7 * 24 * 60 * 60;
  const confToken = await signToken({ email, lang, exp }, env.SUBSCRIBE_TOKEN_SECRET);
  const confirmUrl = `${origin}/api/subscribe-confirm?t=${encodeURIComponent(confToken)}`;

  const subject = SUBJECTS[lang];
  const intro = INTRO[lang];
  const cta = CTA[lang];
  const foot = FOOT[lang];

  const html = `<!doctype html><html><body style="margin:0;padding:24px;background:#FAF7F0;color:#16140F;font-family:Arial,Helvetica,sans-serif;">
  <div style="max-width:560px;margin:0 auto;background:#fff;border-radius:16px;padding:32px;border:1px solid #E6E1D3;">
    <img src="https://vitachy.com/brand/logo-web.png" alt="Vitachy" width="120" style="display:block;height:30px;width:auto;margin-bottom:24px;" />
    <h1 style="font-size:20px;margin:0 0 16px;">${escapeHtml(subject)}</h1>
    <p style="font-size:16px;line-height:1.55;color:#454135;margin:0 0 24px;">${escapeHtml(intro)}</p>
    <p style="margin:0 0 24px;">
      <a href="${escapeHtml(confirmUrl)}" style="display:inline-block;background:#16140F;color:#fff;padding:12px 24px;text-decoration:none;border-radius:999px;font-weight:600;font-size:15px;">${escapeHtml(cta)}</a>
    </p>
    <p style="font-size:13px;color:#807c70;line-height:1.5;margin:0;">${escapeHtml(foot)}</p>
  </div>
</body></html>`;

  const text = `${subject}\n\n${intro}\n\n${confirmUrl}\n\n${foot}`;

  try {
    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vitachy <web@mail.vitachy.com>',
        to: [email],
        subject,
        html,
        text,
      }),
    });
    if (!sendRes.ok) {
      const body = await sendRes.text();
      console.error('[subscribe] Resend emails.send failed', sendRes.status, body);
      return redirectBack('send');
    }
  } catch (e) {
    console.error('[subscribe] Resend emails.send threw', e);
    return redirectBack('send');
  }

  return Response.redirect(`${origin}${pendingPath}`, 303);
}
