// src/components/Gallery.tsx
import { useState } from 'react'
import Lightbox from './Lightbox'
import BlockImage from './BlockImage'
import { Image } from 'astro:assets'
interface ImageEntity {
    src: typeof Image
    alt: string
    title: string
    url: string
  }

interface GalleryProps {

  mainImage?: ImageEntity
  galleryImages?: Array<ImageEntity>
  children?: React.ReactNode
}

export default function Gallery({ mainImage, galleryImages = [], children }: GalleryProps) {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false)
  const [lightboxIndex, setLightboxIndex] = useState(0)

  // Combine all images for the lightbox
  const allImages = [
    ...(mainImage ? [{ src: mainImage.url, alt: mainImage.alt }] : []),
    ...galleryImages.map(img => ({ src: img.url, alt: img.alt }))
  ]

  const openLightbox = (index: number) => {
    setLightboxIndex(mainImage ? index : index - 1)
    setIsLightboxOpen(true)
  }

  return (
    <>


      {/* Gallery images */}
      <div className="columns-1 p-6 sm:columns-2 lg:columns-3">
        {galleryImages.map((image, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            <button
              type="button"
              onClick={() => openLightbox(mainImage ? index + 1 : index)}
              className="group relative block w-full overflow-hidden text-left"
            >
              <div className="group absolute inset-0">
                <div className="balance absolute left-1/2 top-1/2 z-30 -translate-x-3/4 -translate-y-1/2 text-center uppercase tracking-wide text-white opacity-0 transition-all duration-300 focus:-translate-x-1/2 focus:opacity-100 group-hover:-translate-x-1/2 group-hover:opacity-100">
                  {image.title} TEST
                </div>
                <div className="absolute inset-0 z-20 bg-black/70 opacity-0 duration-300 group-hover:opacity-100"></div>
              </div>
              <img
                src={image.url}
                alt={image.title}
                className="aspect-auto max-h-[80vh] w-full object-contain transition-transform duration-300 group-hover:scale-105"
              />
            </button>
          </div>
        ))}
      </div>

      {/* Custom children (like BlockImage components) */}
      {children}

      {/* Lightbox */}
      <Lightbox
        images={allImages}
        isOpen={isLightboxOpen}
        onClose={() => setIsLightboxOpen(false)}
        initialIndex={lightboxIndex}
      />
    </>
  )
}