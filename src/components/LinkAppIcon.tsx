import type { ComponentProps } from 'react';

export const appIconShellClassName =
  'flex h-[calc(74px*0.81)] w-[calc(74px*0.81)] shrink-0 items-center justify-center overflow-hidden rounded-[calc(20px*0.81)] bg-white/92 shadow-[0_4px_14px_rgba(0,0,0,0.18),0_1px_3px_rgba(0,0,0,0.12),inset_0_1px_0_rgba(255,255,255,0.9)] [&_svg]:h-full [&_svg]:w-full [&_img]:h-full [&_img]:w-full [&_img]:object-cover [&_img]:border-0';

/** Mismo tamaño que la shell, sin recuadro ni sombra (p. ej. PNG con transparencia). */
const appIconBareClassName =
  'flex h-[calc(74px*0.81)] w-[calc(74px*0.81)] shrink-0 items-center justify-center overflow-hidden [&_svg]:h-full [&_svg]:w-full [&_img]:h-full [&_img]:w-full [&_img]:border-0 [&_img]:object-cover';

/** Ancho de una fila de N apps respecto al `gap-2` / `md:gap-3` del grid (iconos centrados en celda). */
export const widgetAlignWidthClass = {
  2: 'mx-auto w-full min-w-0 max-w-[calc(2*(74px*0.81)+1*0.5rem)] md:max-w-[calc(2*(74px*0.81)+1*0.75rem)]',
  4: 'mx-auto w-full min-w-0 max-w-[calc(4*(74px*0.81)+3*0.5rem)] md:max-w-[calc(4*(74px*0.81)+3*0.75rem)]',
} as const;

type LinkAppIconProps = Readonly<{
  label: string;
  href: string;
  icon: React.ReactNode;
  className?: string;
  /** Sin caja blanca/redondeada alrededor del icono */
  bare?: boolean;
  /** Atributos extra en el `<a>` (p. ej. handlers de arrastre en la home) */
  anchorProps?: Omit<ComponentProps<'a'>, 'href' | 'children' | 'className' | 'target' | 'rel'>;
}>;

export default function LinkAppIcon({
  label,
  href,
  icon,
  className = '',
  bare = false,
  anchorProps,
}: LinkAppIconProps) {
  const frameClass = bare ? appIconBareClassName : appIconShellClassName;
  const isMailto = href.startsWith('mailto:');
  return (
    <a
      href={href}
      target={isMailto ? '_self' : '_blank'}
      rel={isMailto ? undefined : 'noopener noreferrer'}
      className={`group flex h-full min-h-0 flex-col items-center justify-start gap-2 md:justify-end ${className}`}
      {...anchorProps}
    >
      <div className={`${frameClass} transition-all duration-150 ease-out group-active:scale-[0.93] group-active:shadow-none`}>{icon}</div>
      <span className="shrink-0 text-center text-[12px] font-medium leading-none text-white/75">
        {label}
      </span>
    </a>
  );
}

