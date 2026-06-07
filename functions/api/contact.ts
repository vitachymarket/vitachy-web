interface Env {
  RESEND_API_KEY: string;
  TURNSTILE_SECRET_KEY: string;
}

interface Context {
  request: Request;
  env: Env;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

export async function onRequestPost(context: Context): Promise<Response> {
  const { request, env } = context;
  const origin = new URL(request.url).origin;
  const redirectTo = (path: string) =>
    Response.redirect(`${origin}${path}`, 303);

  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return redirectTo('/contacto/?error=send');
  }

  const nombre = (form.get('nombre')?.toString() ?? '').trim();
  const email = (form.get('email')?.toString() ?? '').trim();
  const mensaje = (form.get('mensaje')?.toString() ?? '').trim();
  const consentimiento = form.get('consentimiento');
  const token = (form.get('cf-turnstile-response')?.toString() ?? '').trim();

  if (!nombre || !email || !mensaje) {
    return redirectTo('/contacto/?error=missing');
  }
  if (!consentimiento) {
    return redirectTo('/contacto/?error=consent');
  }
  if (!EMAIL_RE.test(email)) {
    return redirectTo('/contacto/?error=email');
  }
  if (!token) {
    return redirectTo('/contacto/?error=turnstile');
  }
  if (nombre.length > 120 || email.length > 160 || mensaje.length > 4000) {
    return redirectTo('/contacto/?error=missing');
  }

  const verifyBody = new FormData();
  verifyBody.append('secret', env.TURNSTILE_SECRET_KEY);
  verifyBody.append('response', token);
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
  if (!verifyOk) {
    return redirectTo('/contacto/?error=turnstile');
  }

  const text = [
    `Nombre: ${nombre}`,
    `Email: ${email}`,
    '',
    'Mensaje:',
    mensaje,
  ].join('\n');

  const html = `<p><strong>Nombre:</strong> ${escapeHtml(nombre)}</p>
<p><strong>Email:</strong> ${escapeHtml(email)}</p>
<p><strong>Mensaje:</strong></p>
<p style="white-space:pre-wrap">${escapeHtml(mensaje)}</p>`;

  try {
    const sendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Vitachy <web@mail.vitachy.com>',
        to: ['hola@vitachy.com'],
        reply_to: email,
        subject: `Mensaje desde vitachy.com — ${nombre}`,
        text,
        html,
      }),
    });
    if (!sendRes.ok) {
      return redirectTo('/contacto/?error=send');
    }
  } catch {
    return redirectTo('/contacto/?error=send');
  }

  return redirectTo('/contacto/?ok=1');
}
