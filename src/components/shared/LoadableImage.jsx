import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import PropTypes from 'prop-types';

const LoadableImage = ({ src, alt, containerClassName = '', className = '', priority = false, ...props }) => {
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        setIsLoaded(false);
    }, [src]);

    return (
        <div className={`relative overflow-hidden ${containerClassName}`}>

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
