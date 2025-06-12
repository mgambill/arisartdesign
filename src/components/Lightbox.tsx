// src/components/Lightbox.tsx
import { Fragment, useState } from 'react'
import { Dialog, DialogPanel, Transition } from '@headlessui/react'
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline'

interface LightboxProps {
  images: Array<{
    src: string
    alt: string
  }>
  isOpen: boolean
  onClose: () => void
  initialIndex?: number
}

export default function Lightbox({ images, isOpen, onClose, initialIndex = 0 }: LightboxProps) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex)

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'ArrowLeft') goToPrevious()
    if (event.key === 'ArrowRight') goToNext()
    if (event.key === 'Escape') onClose()
  }

  return (

      <Dialog as="div" className="relative z-50" onClose={onClose}>

        <DialogPanel className="relative max-h-[90vh] max-w-[90vw]">
          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute -top-12 right-0 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={goToPrevious}
                className="absolute left-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronLeftIcon className="h-6 w-6" />
              </button>
              <button
                type="button"
                onClick={goToNext}
                className="absolute right-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
              >
                <ChevronRightIcon className="h-6 w-6" />
              </button>
            </>
          )}

          {/* Image */}
          <img
            src={images[currentIndex]?.src}
            alt={images[currentIndex]?.alt}
            className="max-h-[90vh] max-w-[90vw] object-contain"
          />

          {/* Image counter */}
          {images.length > 1 && (
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 rounded-full bg-white/10 px-4 py-2 text-white">
              {currentIndex + 1} / {images.length}
            </div>
          )}
        </DialogPanel>

      </Dialog>

  )
}