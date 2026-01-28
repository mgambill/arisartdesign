import { useState, useRef, useEffect } from 'react'

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-12">
      <div className="mx-auto max-w-2xl lg:max-w-none">{children}</div>
    </div>
  )
}

function NavigationRow({ children }: { children: React.ReactNode }) {
  return (
    <div className="even:mt-px sm:bg-neutral-950">
      <div className="grid grid-cols-1 sm:grid-cols-2">{children}</div>
    </div>
  )
}

function NavigationItem({
  href,
  children,
  background,
  position,
}: {
  href: string
  background?: string
  position?: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      className="group relative isolate -mx-6 bg-neutral-950 px-6 py-10 even:mt-px sm:mx-0 sm:px-0 sm:py-16 sm:odd:pl-16 sm:even:mt-0 sm:even:border-l sm:even:border-neutral-800 sm:even:pl-16 overflow-hidden"
      style={
        background
          ? {
              backgroundImage: `url(${background})`,
              backgroundSize: 'cover',
              backgroundPosition: position ?? 'center',
              backgroundRepeat: 'no-repeat',
            }
          : undefined
      }
    >
      {background && (
        <span className="absolute inset-0 -z-20 bg-neutral-950/60 " />
      )}
      {background && (
        <span className="absolute inset-0 -z-30 grayscale group-hover:grayscale-0 transition-all duration-300" style={{
          backgroundImage: `url(${background})`,
          backgroundSize: 'cover',
          backgroundPosition: position ??'center',
        }} />
      )}
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-y-0 -z-10 w-screen bg-neutral-900 opacity-50 transition group-odd:right-0 group-even:left-0 group-hover:opacity-0" />
    </a>
  )
}

function Navigation() {
  return (
    <nav className="mt-px font-display text-5xl font-medium tracking-tight text-white">
      <NavigationRow>
        <NavigationItem href="/gallery" background="/images/greece.jpg" position="center">Gallery</NavigationItem>
        <NavigationItem href="/c/visual-development" background="/images/light-in-the-dark.jpg">Visual Dev</NavigationItem>
      </NavigationRow>
      <NavigationRow>
        <NavigationItem href="/c/character-design" background="/images/character-design.jpg" position="top">Character Design</NavigationItem>
        <NavigationItem href="/personal" background="/images/me-again.jpg">Personal</NavigationItem>
      </NavigationRow>
    </nav>
  )
}

const MenuIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6">
    <path d="M2 6h20v2H2zM2 16h20v2H2z"></path>
  </svg>
)

const XIcon = () => (
  <svg viewBox="0 0 24 24" aria-hidden="true" className="h-6 w-6 fill-white">
    <path d="m5.636 4.223 14.142 14.142-1.414 1.414L4.222 5.637z"></path>
    <path d="M4.222 18.363 18.364 4.22l1.414 1.414L5.636 19.777z"></path>
  </svg>
)

interface HeaderProps {
  panelId: string
  icon: React.ComponentType
  toggleRef: React.RefObject<HTMLButtonElement>
  expanded: boolean
  onToggle: () => void
  invert?: boolean
}

function HeaderInner({
  panelId,
  icon: Icon,
  toggleRef,
  expanded,
  onToggle,
  invert = false,
  isHome = false,
}: HeaderProps & { isHome?: boolean }) {
  return (
    <Container>
      <div className={`flex items-center justify-between ${isHome ? 'text-white' : 'text-black'}`}>
        <a aria-label="Home" href="/" className={`tracking-wider`} >
        Ari's Art Design
        </a>
        <div className="flex items-center gap-x-8">

          <a href='/gallery'>Gallery</a>

          <button
            ref={toggleRef}
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={panelId}
            className={`group -m-2.5 rounded-full p-2.5 transition ${isHome ? 'fill-white' : 'fill-black'}`}
            aria-label="Toggle navigation"
          >
            <Icon />
          </button>
        </div>
      </div>
    </Container>
  )
}

export function Header() {
  const [expanded, setExpanded] = useState(false)
  const [isHome, setIsHome] = useState(true)
  const openRef = useRef<HTMLButtonElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const navRef = useRef<HTMLDivElement>(null)
  const panelId = 'navigation-panel'

  useEffect(() => {
    setIsHome(window.location.pathname === '/')
  }, [])

  return (
    <header>
      <div
        className="absolute right-0 left-0 z-40 pt-16"
        aria-hidden={expanded ? 'true' : undefined}
        {...(expanded ? { inert: true } as any : {})}
      >
        <HeaderInner
          panelId={panelId}
          icon={MenuIcon}
          toggleRef={openRef}
          expanded={expanded}
          onToggle={() => {
            setExpanded((expanded) => !expanded)
            window.setTimeout(() =>
              closeRef.current?.focus({ preventScroll: true }),
            )
          }}
          isHome={isHome}
        />
      </div>

      <div
        id={panelId}
        style={{ maxHeight: expanded ? '1000px' : '0.5rem' }}
        className="relative z-50 overflow-hidden bg-neutral-950 pt-2 transition-all duration-500 ease-in-out"
        aria-hidden={expanded ? undefined : 'true'}
        {...(expanded ? {} : { inert: true } as any)}
      >
        <div className="bg-neutral-800 transition-opacity duration-300" style={{ opacity: expanded ? 1 : 0 }}>
          <div ref={navRef} className="bg-neutral-950 pt-14 pb-16 transition-transform duration-300" style={{ transform: expanded ? 'translateY(0)' : 'translateY(-10px)' }}>
            <HeaderInner
              panelId={panelId}
              icon={XIcon}
              toggleRef={closeRef}
              expanded={expanded}
              onToggle={() => {
                setExpanded((expanded) => !expanded)
                window.setTimeout(() =>
                  openRef.current?.focus({ preventScroll: true }),
                )
              }}
              isHome={true}
            />
          </div>
          <Navigation />
          <div className="relative bg-neutral-950 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-neutral-800">
            <Container>
              <div className="grid grid-cols-1 gap-y-10 pt-10 pb-16 sm:grid-cols-2 sm:pt-16">
                <div>
                  <h2 className="font-display text-base font-semibold text-white">
                    Links
                  </h2>
                  <ul className="font-display text-base text-white">
                    <li><a href="/about">About</a></li>
                    <li><a href="/commission">Commissions</a></li>
                  </ul>
                  {/* <ul role="list" className="mt-6 grid grid-cols-1 gap-8 sm:grid-cols-2">
                    <li>
                      <address className="text-sm not-italic text-neutral-300">
                        <strong className="text-white">Copenhagen</strong>
                        <br />
                        1 Carlsberg Gate
                        <br />
                        1260, København, Denmark
                      </address>
                    </li>
                    <li>
                      <address className="text-sm not-italic text-neutral-300">
                        <strong className="text-white">Billund</strong>
                        <br />
                        24 Lego Allé
                        <br />
                        7190, Billund, Denmark
                      </address>
                    </li>
                  </ul> */}
                </div>
                <div className="sm:border-l sm:border-transparent sm:pl-16">
                  <h2 className="font-display text-base font-semibold text-white">
                    Follow us
                  </h2>
                  <ul role="list" className="mt-6 flex gap-x-10 text-white">
                    <li>
                      <a
                        aria-label="Facebook"
                        className="transition hover:text-neutral-200"
                        href="https://facebook.com"
                      >
                        {/* Facebook icon */}
                      </a>
                    </li>
                    <li>
                      <a
                        aria-label="Instagram"
                        className="transition hover:text-neutral-200"
                        href="https://instagram.com"
                      >
                        {/* Instagram icon */}
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </header>
  )
}
