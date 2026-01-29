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

function NavigationItem({ href, children, background, position }: { href: string; background?: string; position?: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
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
          className="absolute inset-0 -z-30 grayscale transition-all duration-300 group-hover:grayscale-0"
          style={{
            backgroundImage: `url(${background})`,
            backgroundSize: "cover",
            backgroundPosition: position ?? "center",
          }}
        />
      )}
      <span className="relative z-10">{children}</span>
      <span className="absolute inset-y-0 -z-10 w-screen bg-neutral-900 opacity-50 transition group-odd:right-0 group-even:left-0 group-hover:opacity-0" />
    </a>
  )
}

function Navigation() {
  return (
    <nav className="font-display mt-px text-5xl font-medium tracking-tight text-white">
      <NavigationRow>
        <NavigationItem href="/gallery" background="/images/greece.jpg" position="center">
          Gallery
        </NavigationItem>
        <NavigationItem href="/c/visual-development" background="/images/light-in-the-dark.jpg">
          Visual Dev
        </NavigationItem>
      </NavigationRow>
      <NavigationRow>
        <NavigationItem href="/c/character-design" background="/images/lyra-design-exploration.jpg" position="center 30%">
          Character Design
        </NavigationItem>
        <NavigationItem href="/personal" background="/images/me-again.jpg">
          Personal
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
                  <h2 className="font-display text-base font-semibold text-white">Follow us</h2>
                  <ul role="list" className="mt-6 flex gap-x-10 text-white">
                    <li>
                      <a href="https://www.instagram.com/victoriaagambill/" className="text-gray-600 hover:text-white">
                        <span className="sr-only">Instagram</span>
                        <svg className="size-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path
                            fill-rule="evenodd"
                            d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                            clip-rule="evenodd"
                          ></path>
                        </svg>
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
