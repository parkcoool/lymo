import { AnimatePresence } from "framer-motion";
import { useEffect } from "react";
import { createPortal } from "react-dom";

import { ModalOverlay, ModalContent } from "./Modal.styles";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    } else {
      document.removeEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <ModalOverlay
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <ModalContent
            initial={{ y: "100vh" }}
            animate={{ y: "0" }}
            exit={{ y: "100vh" }}
            transition={{ type: "spring", bounce: 0.2, duration: 0.3 }}
            onClick={(e: React.MouseEvent) => e.stopPropagation()} // Prevent closing when clicking inside modal
          >
            {children}
          </ModalContent>
        </ModalOverlay>
      )}
    </AnimatePresence>,
    document.body
  );
}
