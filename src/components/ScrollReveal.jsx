import React from 'react';
import { motion } from 'framer-motion';

export default function ScrollReveal({
  as = 'div',
  className = '',
  children,
  width = '100%',
  delay = 0,
  duration = 0.5,
  once = true,
  variants,
  delayMs,
  ...rest
}) {
  const finalDelay = delayMs ? delayMs / 1000 : delay;

  const defaultVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: duration,
        delay: finalDelay,
        ease: [0.25, 0.46, 0.45, 0.94],
      }
    },
  };

  const Component = motion[as] || motion.div;

  return (
    <Component
      variants={variants || defaultVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: once, margin: "-50px" }}
      className={className}
      {...rest}
    >
      {children}
    </Component>
  );
}
