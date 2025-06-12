import { Image } from "astro:assets"

type BlockImageProps = {
  url: string
  title: string
  image: typeof Image
  children?: React.ReactNode
}

export default function Gallery({ url, title, image, children }: BlockImageProps) {
  return (
    <a href={url} className="group relative mb-6 block break-inside-avoid overflow-hidden" data-astro-prefetch>
      <div className="group absolute inset-0">
        <div
          className="balance absolute left-1/2 top-1/2 z-30 -translate-x-3/4 -translate-y-1/2 text-center uppercase tracking-wide text-white opacity-0 transition-all duration-300 focus:-translate-x-1/2 focus:opacity-100 group-hover:-translate-x-1/2 group-hover:opacity-100"
        >
          {title}
        </div>
        <div className="absolute inset-0 z-20 bg-black/70 opacity-0 duration-300 group-hover:opacity-100" />
      </div>
      { children }
    </a>
  )
}
