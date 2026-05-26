/**
 * HomeBackground — rejilla hexagonal uniforme.
 *
 * Sin colores, sin foco central.
 * Panal de abejas (flat-top hexágonos) que cubren toda la pantalla.
 * Fondo negro plano + líneas muy tenues.
 */

const VW = 390;
const VH = 844;

/** Circunradio del hexágono (centro → vértice). */
const S = 22;

/** Pasos de la rejilla hex flat-top. */
const HSTEP = Math.sqrt(3) * S;       // ≈ 38.1 px  — separación entre columnas
const VSTEP = 1.5 * S;                // = 33 px    — separación entre filas
const HOFFSET = (Math.sqrt(3) / 2) * S; // ≈ 19 px  — desplazamiento en filas impares

/** Genera el path SVG de un hexágono flat-top centrado en (cx, cy). */
function hexPath(cx: number, cy: number): string {
  const pts: string[] = [];
  for (let i = 0; i < 6; i++) {
    const a = (i * 60) * (Math.PI / 180);
    pts.push(
      `${(cx + S * Math.cos(a)).toFixed(1)} ${(cy + S * Math.sin(a)).toFixed(1)}`
    );
  }
  return `M ${pts[0]} L ${pts.slice(1).join(' L ')} Z`;
}

const COLS = Math.ceil(VW / HSTEP) + 3;  // ~14 columnas
const ROWS = Math.ceil(VH / VSTEP) + 3;  // ~29 filas
const HEX_PATHS: string[] = [];

for (let row = -1; row < ROWS; row++) {
  for (let col = -1; col < COLS; col++) {
    const cx = col * HSTEP + (row % 2 !== 0 ? HOFFSET : 0);
    const cy = row * VSTEP;
    HEX_PATHS.push(hexPath(cx, cy));
  }
}

// ─────────────────────────────────────────────────────────────────────────────

export default function HomeBackground() {
  return (
    <svg
      className="pointer-events-none absolute inset-0 h-full w-full"
      viewBox={`0 0 ${VW} ${VH}`}
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      {/* Fondo negro plano — sin degradados ni colores */}
      <rect width={VW} height={VH} fill="#07070d" />

      {/* Rejilla hexagonal uniforme */}
      {HEX_PATHS.map((d, i) => (
        <path
          key={i}
          d={d}
          fill="none"
          stroke="rgba(255,255,255,0.07)"
          strokeWidth="0.6"
        />
      ))}
    </svg>
  );
}
