import { useEffect, useState } from 'react';

type Props = Readonly<{ onClose: () => void }>;
type Step = 'form' | 'success' | 'error';

export default function ContactScreen({ onClose }: Props) {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [step, setStep] = useState<Step>('form');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !message) return;
    setLoading(true);
    try {
      const res = await fetch('/api/contact-message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, name, message }),
      });
      const data = await res.json() as { ok?: boolean; error?: string };
      if (data.ok) {
        setStep('success');
      } else {
        setErrorMsg(data.error ?? 'Algo salió mal.');
        setStep('error');
      }
    } catch {
      setErrorMsg('No se pudo conectar. Inténtalo de nuevo.');
      setStep('error');
    }
    setLoading(false);
  };

  return (
    <div
      className="absolute inset-0 z-[150] flex items-end justify-center rounded-[34px] bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="max-h-[90%] w-full overflow-y-auto rounded-t-[28px] bg-[#0d0d14] px-6 pb-10 pt-5 shadow-2xl">

        <div className="mb-5 flex items-center justify-between">
          <div className="h-1 w-10 rounded-full bg-white/20" />
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="flex h-7 w-7 items-center justify-center rounded-full bg-white/10 text-white/50 transition-colors hover:bg-white/20 hover:text-white"
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
              <path d="M1 1L11 11M11 1L1 11" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </button>
        </div>

        {step === 'form' && (
          <>
            <p className="mb-1 font-sans text-[10px] font-semibold uppercase tracking-widest text-[#a78bfa]/60">
              Contacto
            </p>
            <h2 className="mb-1 font-sans text-xl font-bold text-white">Escríbeme</h2>
            <p className="mb-5 font-sans text-xs leading-relaxed text-white/40">
              Te respondo lo antes posible.
            </p>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="text"
                placeholder="Tu nombre (opcional)"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-[#a78bfa]/50"
              />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-[#a78bfa]/50"
              />
              <textarea
                required
                placeholder="¿En qué te puedo ayudar?"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 font-sans text-sm text-white placeholder-white/30 outline-none focus:border-[#a78bfa]/50"
              />
              <button
                type="submit"
                disabled={loading || !email || !message}
                className="w-full rounded-xl bg-[#a78bfa] py-3 font-sans text-sm font-semibold text-[#0d0d14] transition-opacity disabled:opacity-40"
              >
                {loading ? 'Enviando...' : 'Enviar mensaje'}
              </button>
            </form>
          </>
        )}

        {step === 'success' && (
          <div className="py-6 text-center">
            <p className="mb-3 text-4xl">✉️</p>
            <h2 className="mb-1 font-sans text-xl font-bold text-white">Enviado.</h2>
            <p className="mb-6 font-sans text-xs leading-relaxed text-white/40">
              Mensaje recibido. Te respondo pronto.
            </p>
            <button type="button" onClick={onClose}
              className="font-sans text-sm font-medium text-[#a78bfa]">
              Cerrar
            </button>
          </div>
        )}

        {step === 'error' && (
          <div className="py-6 text-center">
            <p className="mb-3 text-4xl">🤔</p>
            <h2 className="mb-1 font-sans text-xl font-bold text-white">Algo falló.</h2>
            <p className="mb-4 font-sans text-xs text-white/40">{errorMsg}</p>
            <button type="button" onClick={() => setStep('form')}
              className="font-sans text-sm font-medium text-[#a78bfa]">
              Intentar de nuevo
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
