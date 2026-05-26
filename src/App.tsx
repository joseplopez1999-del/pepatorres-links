import { useState } from 'react';
import AdventCalendarScreen from './components/advent/AdventCalendarScreen';
import PhoneFrame from './components/PhoneFrame';
import HomeScreenGrid from './components/HomeScreenGrid';
import HomeBackground from './components/HomeBackground';
import LinksDock from './components/LinksDock';
import OnAnemScreen from './components/projects/OnAnemScreen';
import Zero2HeroScreen from './components/projects/Zero2HeroScreen';
import VibeCodingScreen from './components/vibe/VibeCodingScreen';
import NewsletterScreen from './components/NewsletterScreen';
import ProjectScreen from './components/ProjectScreen';
import ContactScreen from './components/ContactScreen';

type AppView = 'home' | 'advent' | 'vibe' | 'zero2hero' | 'onanem';

const INNER_SCREEN_CLASS: Record<AppView, string> = {
  home: 'bg-[#04030c]',
  advent: 'bg-[#1D3F25]',
  vibe: 'bg-[#05142b]',
  zero2hero: 'bg-white',
  onanem: 'bg-white',
};

const STATUS_BAR_CLASS: Partial<Record<AppView, string>> = {
  home: 'text-white/85 [&_.status-bar-pill]:border-white/30 [&_.status-bar-pill]:bg-white/10',
  advent:
    'text-[#FEF8E8] [&_.status-bar-pill]:border-[#FEF8E8]/35 [&_.status-bar-pill]:bg-white/10',
  vibe: 'text-white/85 [&_.status-bar-pill]:border-white/30 [&_.status-bar-pill]:bg-white/10',
};

const CONTENT_OUTER_HOME =
  'pointer-events-none max-md:px-2.5 max-md:pb-24 max-md:pt-3 px-4 pb-[8.5rem] pt-4 md:pt-14';
const CONTENT_OUTER_OTHER = 'min-h-0 flex-col px-0 pb-0 pt-0 md:pt-0';

function App() {
  const [view, setView] = useState<AppView>('home');
  const [newsletterOpen, setNewsletterOpen] = useState(false);
  const [projectOpen, setProjectOpen] = useState(false);
  const [contactOpen, setContactOpen] = useState(false);
  const [openProjectsFolderOnHome, setOpenProjectsFolderOnHome] = useState(false);

  const innerScreenClassName = INNER_SCREEN_CLASS[view];
  const statusBarClassName = STATUS_BAR_CLASS[view];

  const openProjectView = (target: 'zero2hero' | 'onanem') => {
    setOpenProjectsFolderOnHome(false);
    setView(target);
  };

  const handleProjectBack = () => {
    setOpenProjectsFolderOnHome(true);
    setView('home');
  };

  const isHome = view === 'home';
  const contentOuterClass = isHome ? CONTENT_OUTER_HOME : CONTENT_OUTER_OTHER;
  const contentInnerClass = isHome ? 'pointer-events-auto' : '';

  const activeScreen = (() => {
    switch (view) {
      case 'home':
        return (
          <HomeScreenGrid
            onOpenAdvent={() => setView('advent')}
            onOpenVibe={() => setView('vibe')}
            onOpenZero2Hero={() => openProjectView('zero2hero')}
            onOpenOnAnem={() => openProjectView('onanem')}
            onOpenNewsletter={() => setNewsletterOpen(true)}
            onOpenProject={() => setProjectOpen(true)}
            onOpenContact={() => setContactOpen(true)}
            openProjectsFolderOnMount={openProjectsFolderOnHome}
            onProjectsFolderOpenHandled={() => setOpenProjectsFolderOnHome(false)}
          />
        );
      case 'advent':
        return <AdventCalendarScreen onBack={() => setView('home')} />;
      case 'vibe':
        return <VibeCodingScreen onBack={() => setView('home')} />;
      case 'zero2hero':
        return <Zero2HeroScreen onBack={handleProjectBack} />;
      case 'onanem':
        return <OnAnemScreen onBack={handleProjectBack} />;
      default:
        return null;
    }
  })();

  return (
    <main className="flex min-h-svh flex-col items-center justify-start overflow-x-hidden bg-[#B0ADA0] max-md:h-svh max-md:overflow-hidden max-md:px-0 max-md:pb-0 max-md:pt-0 md:overflow-y-auto md:px-[clamp(0.375rem,2vw,1.5rem)] md:pb-[clamp(0.75rem,2.5vw,2.25rem)] md:pt-[clamp(0.375rem,2vw,1.5rem)]">
      <PhoneFrame
        innerScreenClassName={innerScreenClassName}
        statusBarClassName={statusBarClassName}
        enableMobileContentScale={isHome}
      >
        {isHome ? <HomeBackground /> : null}
        <div
          className={`relative z-10 flex h-full min-h-0 w-full flex-1 flex-col ${contentOuterClass}`}
        >
          <div className={`relative flex h-full min-h-0 flex-1 flex-col ${contentInnerClass}`}>
            {activeScreen}
          </div>
        </div>
        {isHome ? <LinksDock /> : null}

        {/* Modal newsletter — overlay sobre la pantalla del móvil */}
        {newsletterOpen ? (
          <NewsletterScreen onClose={() => setNewsletterOpen(false)} />
        ) : null}

        {projectOpen ? (
          <ProjectScreen onClose={() => setProjectOpen(false)} />
        ) : null}

        {contactOpen ? (
          <ContactScreen onClose={() => setContactOpen(false)} />
        ) : null}
      </PhoneFrame>
    </main>
  );
}

export default App;
