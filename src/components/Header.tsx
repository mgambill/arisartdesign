import {
  Disclosure,
  DisclosureButton,
  DisclosurePanel,
} from "@headlessui/react"

export default function Header() {
  const pathname =
    typeof window !== "undefined" ? window.location.pathname : "/"

  const menu = [
    { href: "/about", text: "About Me" },
    { href: "/commission", text: "Commission" },
    { href: "/contact", text: "Contact" },
    { logo: true },
    { href: "/portfolio", text: "Portfolio" },
    { href: "/coming-soon", text: "Shop" },
    { href: "/projects", text: "Projects" },
  ]

  return (
    <Disclosure as="nav" className="bg-white/40 dark:bg-transparent">
      <div className=" bg-white dark:border-stone-900 dark:bg-black">
        <div className="relative flex h-24 justify-between">
          <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
            {/* Mobile menu button */}
            <DisclosureButton className="group relative inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary">
              <span className="absolute -inset-0.5" />
              <span className="sr-only">Open main menu</span>
              <svg
                className="block size-6 group-data-[open]:hidden"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"
                />
              </svg>

              <svg
                className="hidden size-6 group-data-[open]:block"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                aria-hidden="true"
                data-slot="icon"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18 18 6M6 6l12 12"
                />
              </svg>
            </DisclosureButton>
          </div>

          <div className="flex flex-1 items-center justify-center sm:items-stretch">
            <a className="sm:hidden" href="/">
              <img src="/logo.png" alt="Logo" className="h-24 dark:invert" />
            </a>
            <div className="hidden items-center sm:ml-6 sm:flex sm:space-x-8 text-xl">
              {menu.map((item) =>
                item.logo ? (
                  <a key="logo" href="/">
                    <img
                      src="/logo.png"
                      alt="Logo"
                      className="h-24 dark:invert"
                    />
                  </a>
                ) : (
                  <a
                    key={item.href}
                    href={item.href}
                    className={
                      pathname === item.href
                        ? "text-shadow font-serif text-primary font-medium  border-b border-primary"
                        : "font-serif text-gray-500 hover:border-gray-300 hover:text-gray-700"
                    }

                  >
                    {item.text}
                  </a>
                ),
              )}
            </div>
          </div>
        </div>
      </div>

      <DisclosurePanel className="lg:hidden">
        <div className="space-y-1 pb-4 pt-2">
          {[{ text: "Home", href: "/" }, ...menu]
            .filter((item) => !item.logo)
            .map((item) => (
              <DisclosureButton
                as="a"
                key={item.href}
                href={item.href}
                className={`
                      block border-l-4 py-2 pl-3 pr-4 font-medium
                      ${
                        pathname === item.href
                          ? "border-primary bg-blue-50 text-primary"
                          : "border-transparent text-gray-500 hover:border-gray-300 hover:bg-gray-50 hover:text-gray-700"
                      }
                    `}
              >
                {item.text}
              </DisclosureButton>
            ))}
        </div>
      </DisclosurePanel>
    </Disclosure>
  )
}

