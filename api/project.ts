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

type ProjectPayload = {
  name: string;
  contact: string;
  service?: string;
  description?: string;
  occupation?: string;
  socialAccounts?: string;
  wantsAudit?: string;
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

  const body = req.body as ProjectPayload;
  if (!body?.name || !body?.contact) {
    res.status(400).json({ error: 'Nombre y contacto requeridos.' });
    return;
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.log('[project] Nueva consulta de proyecto:', body);
    res.status(200).json({ ok: true });
    return;
  }

  const emailBody = `
Nueva consulta de proyecto — links.joseplopeztorres.com

Nombre: ${body.name}
Contacto: ${body.contact}
Servicio: ${body.service ?? '(no especificado)'}
Quiere auditoría previa: ${body.wantsAudit === 'si' ? 'Sí' : body.wantsAudit === 'no' ? 'No' : '(no indicado)'}
Descripción: ${body.description ?? '(no especificado)'}
A qué se dedica: ${body.occupation ?? '(no especificado)'}
RRSS que gestiona: ${body.socialAccounts ?? '(no especificado)'}

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
      from: 'Proyectos <onboarding@resend.dev>',
      to: ['joseplopez1999@gmail.com'],
      subject: `🚀 Nuevo proyecto — ${body.name} (${body.service ?? 'sin categoría'})`,
      text: emailBody,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    console.error('[project] Resend error:', err);
    res.status(500).json({ error: 'No se pudo enviar el email. Inténtalo de nuevo.' });
    return;
  }

  res.status(200).json({ ok: true });
}
