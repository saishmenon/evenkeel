import { createContext, useCallback, useContext, useEffect, useState, type CSSProperties, type ReactNode } from 'react';
import './AppLayout.css';

/*
 * Figma "App layout"            →  React
 *   Show navigation             →  navigation (+ navigationOpen)
 *   Show inspector              →  inspector (+ inspectorOpen)
 *   Show breadcrumbs            →  breadcrumbs
 *   Content width               →  contentWidth
 *   Breakpoint = desktop/mobile →  browser width (below 900px the side panels float over the page)
 *
 * The frame every dashboard screen sits in:
 *   ┌──────────── top bar ────────────┐
 *   │ sidebar │   content   │ inspector │
 *   └─────────┴─────────────┴───────────┘
 * Each column scrolls on its own, so the sidebar and inspector never scroll away.
 */
export interface AppLayoutProps {
  /** Usually a <TopBar>. It gets a sidebar toggle automatically. */
  topBar?: ReactNode;
  /** Usually a <SideNavigation>. */
  navigation?: ReactNode;
  navigationOpen?: boolean;
  defaultNavigationOpen?: boolean;
  onNavigationChange?: (open: boolean) => void;
  /** Usually an <Inspector>: details of whatever is selected. */
  inspector?: ReactNode;
  inspectorOpen?: boolean;
  onInspectorChange?: (open: boolean) => void;
  breadcrumbs?: ReactNode;
  /** Page-level alerts, shown above the content. */
  notifications?: ReactNode;
  /** default: comfortable reading width (1280) · full: tables and dashboards that use every pixel. */
  contentWidth?: 'default' | 'full';
  navigationWidth?: number;
  inspectorWidth?: number;
  /** Height of the whole layout. Defaults to the viewport; set a number to embed it (docs, demos). */
  height?: number | string;
  children?: ReactNode;
}

interface Ctx { navigationOpen: boolean; toggleNavigation?: () => void; inspectorOpen: boolean; toggleInspector?: () => void; narrow: boolean }
const AppLayoutContext = createContext<Ctx>({ navigationOpen: false, inspectorOpen: false, narrow: false });
/** For components inside the layout (TopBar uses it to show the sidebar toggle). */
export const useAppLayout = () => useContext(AppLayoutContext);

/** React 18 has no `inert` prop yet; an empty-string attribute works everywhere. */
const inert = (on: boolean) => (on ? ({ inert: '' } as Record<string, string>) : {});

function useNarrow(query = '(max-width: 899px)') {
  const get = () => typeof window !== 'undefined' && window.matchMedia(query).matches;
  const [narrow, setNarrow] = useState(get);
  useEffect(() => {
    const m = window.matchMedia(query);
    const on = () => setNarrow(m.matches);
    m.addEventListener('change', on);
    return () => m.removeEventListener('change', on);
  }, [query]);
  return narrow;
}

function useControllable(value: boolean | undefined, initial: boolean, onChange?: (v: boolean) => void) {
  const [inner, setInner] = useState(initial);
  const v = value ?? inner;
  const set = useCallback((n: boolean) => { setInner(n); onChange?.(n); }, [onChange]);
  return [v, set] as const;
}

export function AppLayout({
  topBar, navigation, navigationOpen, defaultNavigationOpen, onNavigationChange,
  inspector, inspectorOpen, onInspectorChange, breadcrumbs, notifications,
  contentWidth = 'default', navigationWidth = 260, inspectorWidth = 360, height, children,
}: AppLayoutProps) {
  const narrow = useNarrow();
  const [navOpen, setNavOpen] = useControllable(navigationOpen, defaultNavigationOpen ?? !narrow, onNavigationChange);
  const [insOpen, setInsOpen] = useControllable(inspectorOpen, true, onInspectorChange);
  const hasNav = !!navigation;
  const hasIns = !!inspector && insOpen;
  const floating = narrow && ((hasNav && navOpen) || hasIns);

  useEffect(() => {
    if (!floating) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { setNavOpen(false); setInsOpen(false); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [floating, setNavOpen, setInsOpen]);

  const style = {
    '--ek-nav-w': `${navigationWidth}px`,
    '--ek-ins-w': `${inspectorWidth}px`,
    height: height ?? undefined,
  } as CSSProperties;

  return (
    <AppLayoutContext.Provider value={{
      navigationOpen: hasNav && navOpen, toggleNavigation: hasNav ? () => setNavOpen(!navOpen) : undefined,
      inspectorOpen: hasIns, toggleInspector: inspector ? () => setInsOpen(!insOpen) : undefined, narrow,
    }}>
      <div className="ek-app" style={style} data-nav={hasNav && navOpen ? 'open' : 'closed'} data-inspector={hasIns ? 'open' : 'closed'} data-narrow={narrow || undefined}>
        <a className="ek-app__skip" href="#ek-main">Skip to main content</a>
        {topBar && <div className="ek-app__top">{topBar}</div>}
        <div className="ek-app__body">
          {hasNav && (
            <div className="ek-app__nav" {...inert(!navOpen)} aria-hidden={!navOpen || undefined}>{navigation}</div>
          )}
          <main className="ek-app__main" id="ek-main" tabIndex={-1}>
            <div className={`ek-app__content ek-app__content--${contentWidth}`}>
              {breadcrumbs && <div className="ek-app__crumbs">{breadcrumbs}</div>}
              {notifications && <div className="ek-app__notes">{notifications}</div>}
              {children}
            </div>
          </main>
          {inspector && <div className="ek-app__inspector" {...inert(!hasIns)} aria-hidden={!hasIns || undefined}>{inspector}</div>}
          {floating && <div className="ek-app__scrim" onClick={() => { setNavOpen(false); setInsOpen(false); }} aria-hidden="true" />}
        </div>
      </div>
    </AppLayoutContext.Provider>
  );
}
