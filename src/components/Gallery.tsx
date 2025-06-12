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
  const allImages = [mainImage, ...galleryImages.map(img => ({ src: img.src, alt: img.alt }))]

  const openLightbox = (index: number) => {
    setLightboxIndex(index)
    setIsLightboxOpen(true)
  }

  return (
    <>


      {/* Gallery images */}
      <div className="columns-1 p-6 sm:columns-2 lg:columns-3">
        {galleryImages.map((image, index) => (
          <div key={index} className="mb-4 break-inside-avoid">
            <BlockImage
              url={image.url}
              title={image.title}
              image={image.src}
              onClick={() => openLightbox(index + 1)}
            >
              <pre>{ JSON.stringify(image, null, 2 ) }</pre>
              <Image src={image.url} alt={image.title} className="object-cover transition group-hover:scale-110" />
            </BlockImage>
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