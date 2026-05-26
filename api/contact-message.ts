type VercelReq = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string | string[] | undefined>;
};

type VercelRes = {
  status: (code: number) => VercelRes;
  setHeader: (k: string, v: string) => void;
  json: (body: unknown) => void;
  end: (body?: string) => void;
};

type MessagePayload = {
  email: string;
  name?: string;
  message: string;
};

export default async function handler(req: VercelReq, res: VercelRes): Promise<void> {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(204).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  const body = req.body as MessagePayload;
  if (!body?.email || !body?.message) {
    res.status(400).json({ error: 'Email y mensaje requeridos.' });
    return;
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.log('[contact-message] Nuevo mensaje:', body);
    res.status(200).json({ ok: true });
    return;
  }

  const emailBody = `
Nuevo mensaje — links.joseplopeztorres.com

De: ${body.name ? `${body.name} <${body.email}>` : body.email}

${body.message}

---
Enviado automáticamente desde tu links page.
  `.trim();

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: 'Contacto <onboarding@resend.dev>',
      to: ['joseplopez1999@gmail.com'],
      subject: `✉️ Mensaje de ${body.name ?? body.email}`,
      text: emailBody,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('[contact-message] Resend error:', err);
    res.status(500).json({ error: 'No se pudo enviar el mensaje. Inténtalo de nuevo.' });
    return;
  }

  res.status(200).json({ ok: true });
}
