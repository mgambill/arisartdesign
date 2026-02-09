// src/components/Lightbox.tsx
import { Fragment, useState, useEffect } from "react"
import { Dialog, DialogPanel, Transition } from "@headlessui/react"
import { XMarkIcon, ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline"

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

  // Update current index when initialIndex changes or lightbox opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(initialIndex)
    }
  }, [initialIndex, isOpen])

  // Add keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return
      if (event.key === "ArrowLeft") goToPrevious()
      if (event.key === "ArrowRight") goToNext()
      if (event.key === "Escape") onClose()
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isOpen])

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1))
  }

  return (
    <Dialog open={isOpen} as="div" className="relative z-50" onClose={onClose}>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" />

      {/* Full-screen container */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel className="relative flex flex-col max-h-[90vh] max-w-[90vw]">
          {/* Close button */}
          {/* <button type="button" onClick={onClose} className="absolute -top-12 right-0 z-10 rounded-full bg-white/10 p-2 text-white hover:bg-white/20">
            <XMarkIcon className="h-6 w-6" />
          </button> */}

          {/* Navigation buttons */}
          {images.length > 1 && (
            <>
              <button type="button" onClick={goToPrevious} className="group absolute -left-14 top-0 h-full w-1/2 ">
                <div className="flex h-full w-full items-center justify-start">
                  <ChevronLeftIcon className="h-12 w-12 text-slate-200 group-hover:text-slate-400" />
                </div>
              </button>
              <button type="button" onClick={goToNext} className="group absolute -right-14 top-0 h-full w-1/2 ">
                <div className="flex h-full w-full items-center justify-end">
                  <ChevronRightIcon className="h-12 w-12 text-slate-200 group-hover:text-slate-400" />
                </div>
              </button>
            </>
          )}

          {/* Image */}
          <img src={images[currentIndex]?.src} alt={images[currentIndex]?.alt} className="max-h-[80vh] max-w-[90vw] object-contain" />

          {/* Image title */}
          <div className="mt-2 px-4 py-2 text-white text-center">{images[currentIndex]?.alt}</div>
        </DialogPanel>
      </div>
    </Dialog>
  )
}
