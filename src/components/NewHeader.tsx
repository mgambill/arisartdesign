import SocialLinks from "./SocialLinks"
import { useState, useRef, useEffect } from "react"

function Container({ children }: { children: React.ReactNode }) {
  return (
    <div className="px-10">
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

function NavigationItem({ href, children, background, position, isHome = false }: { href: string; background?: string; position?: string; children: React.ReactNode; isHome?: boolean }) {
  return (
    <a
      href={href}
      data-link
      className="group relative isolate -mx-6 overflow-hidden bg-neutral-950 px-6 py-10 even:mt-px sm:mx-0 sm:px-0 sm:py-16 sm:odd:pl-16 sm:even:mt-0 sm:even:border-l sm:even:border-neutral-800 sm:even:pl-16"
      style={
        background
          ? {
              backgroundImage: `url(${background})`,
              backgroundSize: "cover",
              backgroundPosition: position ?? "center",
              backgroundRepeat: "no-repeat",
            }
          : undefined
      }
    >
      {background && <span className="absolute inset-0 -z-20 bg-neutral-950/60 " />}
      {background && (
        <span
          className={`absolute inset-0 -z-30 transition-all duration-300 ${isHome ? "group-hover:grayscale" : "grayscale group-hover:grayscale-0"}`}
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: position ?? "center",
          }}
        />
      )}
      <span className="relative z-10 tracking-wide group-hover:font-light">{children}</span>
      <span className={`${isHome ? "hidden" : "absolute inset-y-0 -z-10 w-screen bg-neutral-500 opacity-50 transition group-odd:right-0 group-even:left-0 group-hover:opacity-0"}`} />
    </a>
  )
}

export function Navigation({ isHome = false }: { isHome?: boolean }) {
  return (
    <nav className="font-display mt-px text-5xl font-medium tracking-tight text-white">
      <NavigationRow>
        <NavigationItem isHome={isHome} href="/gallery" background="/images/greece.jpg" position="center">
          Gallery
        </NavigationItem>
        <NavigationItem isHome={isHome} href="/c/visual-development" background="/images/light-in-the-dark.jpg">
          Visual Dev
        </NavigationItem>
      </NavigationRow>
      <NavigationRow>
        <NavigationItem isHome={isHome} href="/c/character-design" background="/images/lyra-design-exploration.jpg" position="center 30%">
          Character Design
        </NavigationItem>
        <NavigationItem isHome={isHome} href="/misc" background="/images/me-again.jpg">
          Miscellaneous
        </NavigationItem>
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

function HeaderInner({ panelId, icon: Icon, toggleRef, expanded, onToggle, invert = false, isHome = false }: HeaderProps & { isHome?: boolean }) {
  return (
    <Container>
      <div className={`flex items-center justify-between ${isHome ? "text-white" : "text-black"}`}>
        <a aria-label="Home" href="/" className={`tracking-wider`}>
          Ari's Art Design
        </a>
        <div className="flex items-center gap-x-8">
          <a href="/gallery">Gallery</a>

          <button
            ref={toggleRef}
            type="button"
            onClick={onToggle}
            aria-expanded={expanded}
            aria-controls={panelId}
            className={`group -m-2.5 rounded-full p-2.5 transition ${isHome ? "fill-white" : "fill-black"}`}
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
  const panelId = "navigation-panel"

  useEffect(() => {
    setIsHome(window.location.pathname === "/")
  }, [])

  return (
    <header>
      <div className="absolute left-0 right-0 z-40 pt-8 lg:pt-16" aria-hidden={expanded ? "true" : undefined} {...(expanded ? ({ inert: true } as any) : {})}>
        <HeaderInner
          panelId={panelId}
          icon={MenuIcon}
          toggleRef={openRef}
          expanded={expanded}
          onToggle={() => {
            setExpanded((expanded) => !expanded)
            window.setTimeout(() => closeRef.current?.focus({ preventScroll: true }))
          }}
          isHome={isHome}
        />
      </div>

      <div
        id={panelId}
        style={{ maxHeight: expanded ? "1000px" : "0.5rem" }}
        className="relative z-50 overflow-hidden bg-neutral-950 pt-2 transition-all duration-500 ease-in-out"
        aria-hidden={expanded ? undefined : "true"}
        {...(expanded ? {} : ({ inert: true } as any))}
      >
        <div className="bg-neutral-800 transition-opacity duration-300" style={{ opacity: expanded ? 1 : 0 }}>
          <div
            ref={navRef}
            className="bg-neutral-950 pb-16 pt-14 transition-transform duration-300"
            style={{ transform: expanded ? "translateY(0)" : "translateY(-10px)" }}
          >
            <HeaderInner
              panelId={panelId}
              icon={XIcon}
              toggleRef={closeRef}
              expanded={expanded}
              onToggle={() => {
                setExpanded((expanded) => !expanded)
                window.setTimeout(() => openRef.current?.focus({ preventScroll: true }))
              }}
              isHome={true}
            />
          </div>
          <Navigation />
          <div className="relative bg-neutral-950 before:absolute before:inset-x-0 before:top-0 before:h-px before:bg-neutral-800">
            <Container>
              <div className="grid grid-cols-1 gap-y-10 pb-16 pt-10 sm:grid-cols-2 sm:pt-16">
                <div>
                  <h2 className="font-display text-base font-semibold text-white">Links</h2>
                  <ul className="font-display text-base text-white">
                    <li>
                      <a className="block py-2 hover:opacity-90" href="/about">
                        About
                      </a>
                    </li>
                    <li>
                      <a className="block py-2 hover:opacity-90" href="/commission">
                        Commissions
                      </a>
                    </li>
                  </ul>
                </div>
                <div className="sm:border-l sm:border-transparent sm:pl-16">
                  <h2 className="font-display text-base font-semibold text-white">Follow Me</h2>
                  <SocialLinks className="mt-6 flex gap-x-10" linkClassName="text-gray-600 hover:text-white" />
                </div>
              </div>
            </Container>
          </div>
        </div>
      </div>
    </header>
  )
}
