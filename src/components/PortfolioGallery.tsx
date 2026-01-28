// src/components/PortfolioGallery.tsx
import { useState, useEffect, useRef } from 'react'
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
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null)
  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([])

  const images = items.map(item => ({
    src: item.image,
    alt: item.title
  }))

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  // Keyboard navigation when lightbox is closed
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isLightboxOpen) return

      // Arrow navigation
      if (event.key === 'ArrowRight' || event.key === 'ArrowDown') {
        event.preventDefault()
        setFocusedIndex(prev => {
          const next = prev === null ? 0 : Math.min(prev + 1, items.length - 1)
          buttonRefs.current[next]?.focus()
          return next
        })
      } else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') {
        event.preventDefault()
        setFocusedIndex(prev => {
          const next = prev === null ? 0 : Math.max(prev - 1, 0)
          buttonRefs.current[next]?.focus()
          return next
        })
      } else if ((event.key === ' ' || event.key === 'Enter') && focusedIndex !== null) {
        event.preventDefault()
        openLightbox(focusedIndex)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [isLightboxOpen, focusedIndex, items.length])

  return (
    <>
      <div className="columns-1 sm:columns-2 lg:columns-3">
        {items.map((item, index) => (
          <button
            key={item.id}
            ref={el => buttonRefs.current[index] = el}
            type="button"
            onClick={() => openLightbox(index)}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
            data-category={item.category}
            className={`group relative mb-6 block w-full break-inside-avoid overflow-hidden text-left transition-shadow ${
              focusedIndex === index ? 'shadow-[0_0_0_4px_rgba(59,130,246,0.5)] ring-4 ring-blue-500 ring-offset-2' : ''
            }`}
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
