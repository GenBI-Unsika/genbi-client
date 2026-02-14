import { motion } from 'framer-motion';
import React from 'react';

const pageVariants = {
    initial: {
        opacity: 0,
        y: 10,
    },
    in: {
        opacity: 1,
        y: 0,
    },
    out: {
        opacity: 0,
        y: -10,
    },
};

const pageTransition = {
    type: 'tween',
    ease: 'anticipate',
    duration: 0.4,
};

const PageTransition = ({ children, className = '' }) => {
    return (
        <motion.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className={`min-h-[calc(100vh-64px)] w-full ${className}`}
        >
            {children}
        </motion.div>
    );
};

export default PageTransition;
