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

type ContactPayload = {
  email: string;
  about?: string;
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

  const body = req.body as ContactPayload;
  if (!body?.email) {
    res.status(400).json({ error: 'Email requerido.' });
    return;
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    // En desarrollo sin API key: simula éxito y loguea
    console.log('[contact] Nueva entrada lista de espera:', body);
    res.status(200).json({ ok: true });
    return;
  }

  const emailBody = `
Nueva entrada en la lista de espera — links.joseplopeztorres.com

Email: ${body.email}
En qué está trabajando: ${body.about ?? '(no especificado)'}

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
      from: 'Lista de espera <onboarding@resend.dev>',
      to: ['joseplopez1999@gmail.com'],
      subject: `📬 Nueva entrada — ${body.email}`,
      text: emailBody,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('[contact] Resend error:', err);
    res.status(500).json({ error: 'No se pudo enviar el email. Inténtalo de nuevo.' });
    return;
  }

  res.status(200).json({ ok: true });
}
