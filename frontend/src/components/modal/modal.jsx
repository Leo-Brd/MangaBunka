import { motion, AnimatePresence } from 'framer-motion';
import './modal.scss';

export default function Modal({ isOpen, onClose, children }) {
    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div 
                className="modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={onClose}
            >
                <motion.div 
                    className="modal-content"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <button className="modal-close" onClick={onClose}>✖️</button>
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
