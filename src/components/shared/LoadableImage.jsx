import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

/**
 * LoadableImage component
 *
 * Handles image preloading and smooth fade-in transition.
 *
 * @param {string} src - Image source URL
 * @param {string} alt - Alt text
 * @param {string} containerClassName - Classes for the wrapper div
 * @param {string} className - Classes for the img element
 * @param {boolean} priority - If true, sets loading="eager" and high fetchPriority
 * @param {object} ...props - Other props passed to img
 */
const LoadableImage = ({ src, alt, containerClassName = '', className = '', priority = false, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        // Reset loaded state when src changes
        setIsLoaded(false);
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>
            {/* Placeholder / Skeleton */}
            {!isLoaded && (
                <div className="absolute inset-0 bg-gray-200 animate-pulse z-10" />
            )}

            <motion.img
                src={src}
                alt={alt}
                initial={{ opacity: 0 }}
                animate={{ opacity: isLoaded ? 1 : 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                onLoad={() => setIsLoaded(true)}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                className={className}
                {...props}
            />
        </div>
    );
};

LoadableImage.propTypes = {
    src: PropTypes.string.isRequired,
    alt: PropTypes.string.isRequired,
    containerClassName: PropTypes.string,
    className: PropTypes.string,
    priority: PropTypes.bool,
};

export default LoadableImage;
