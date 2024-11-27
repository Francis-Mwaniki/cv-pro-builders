import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Maximize2, Minimize2 } from 'lucide-react'
import { Button } from "@/components/ui/button"

interface ZoomableModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBack: () => void;
  children: React.ReactNode;
}

export function ZoomableModal({ isOpen, onClose, onBack, children }: ZoomableModalProps) {
  const [isZoomed, setIsZoomed] = useState(false)

  const toggleZoom = () => setIsZoomed(!isZoomed)

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ type: "spring", duration: 0.5 }}
          className={`fixed ${isZoomed ? 'inset-4' : 'bottom-20 right-4 w-full max-w-md'} bg-white rounded-lg shadow-xl border overflow-hidden flex flex-col`}
          style={{ maxHeight: isZoomed ? 'calc(100vh - 2rem)' : 'calc(100vh - 6rem)' }}
        >
          <div className="flex justify-between items-center p-4 border-b">
            <Button variant="ghost" size="icon" onClick={onBack}>
              <span className="sr-only">Back</span>
              ←
            </Button>
            <div className="flex items-center space-x-2">
              <Button variant="ghost" size="icon" onClick={toggleZoom}>
                {isZoomed ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <div className="flex-grow overflow-auto">
            {children}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
