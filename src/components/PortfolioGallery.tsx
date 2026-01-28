// src/components/PortfolioGallery.tsx
import { useState } from 'react'
import Lightbox from './Lightbox'

interface PortfolioItem {
  id: string
  title: string
  image: string
  category?: string
}

interface PortfolioGalleryProps {
  items: PortfolioItem[]
}

export default function PortfolioGallery({ items }: PortfolioGalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  const images = items.map(item => ({
    src: item.image,
    alt: item.title
  }))

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            type="button"
            onClick={() => openLightbox(index)}
            data-category={item.category}
            className="group relative mb-6 block w-full break-inside-avoid overflow-hidden text-left"
          >
            <div className="group absolute inset-0">
              <div className="balance absolute left-1/2 top-1/2 z-30 -translate-x-3/4 -translate-y-1/2 text-center uppercase tracking-wide text-white opacity-0 transition-all duration-300 focus:-translate-x-1/2 focus:opacity-100 group-hover:-translate-x-1/2 group-hover:opacity-100">
                {item.title}
              </div>
              <div className="absolute inset-0 z-20 bg-black/70 opacity-0 duration-300 group-hover:opacity-100"></div>
            </div>
            <img
              src={item.image}
              alt={item.title}
              className="aspect-auto max-h-[80vh] object-contain transition-transform duration-300 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      <Lightbox
        images={images}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        initialIndex={lightboxIndex}
      />
    </>
  )
}
