import { DOCK_SOCIAL_HREF } from '../config/socialLinks';
import { appIconShellClassName } from './LinkAppIcon';

const DOCK_ITEMS = [
  {
    label: 'Instagram',
    href: DOCK_SOCIAL_HREF.instagram,
    iconSrc: '/app-icons/instagram.png',
  },
  {
    label: 'WhatsApp',
    href: 'https://wa.me/34671552474',
    iconSrc: '/app-icons/whatsapp.png',
  },
] as const;

export default function LinksDock() {
  return (
    <div className="absolute bottom-2 left-2 right-2 z-[8] flex flex-col items-center justify-center max-md:bottom-2 md:bottom-3 md:left-[10px] md:right-4">
      <div className="dock-glass grid h-[84px] w-full grid-cols-2 rounded-[30px] border border-black/10 px-2 py-2 shadow-[0_12px_32px_rgba(55,48,40,0.12)]">
        {DOCK_ITEMS.map((item) => (
          <a
            key={item.label}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={item.label}
            className="flex touch-manipulation flex-col items-center justify-center gap-1"
          >
            <div className={appIconShellClassName}>
              <img src={item.iconSrc} alt="" width={74} height={74} draggable={false} />
            </div>
            <span className="text-[10px] font-medium leading-none text-neutral-700">{item.label}</span>
          </a>
        ))}
      </div>
    </div>
  );
}
