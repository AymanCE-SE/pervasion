import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiChevronLeft, FiChevronRight, FiZoomIn, FiZoomOut, FiMaximize, FiX } from 'react-icons/fi';
import './ProjectGallery.css';

// Simple image preloader
const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = src;
    img.onload = () => resolve(src);
    img.onerror = (err) => reject(err);
  });
};

const ProjectGallery = ({ images: initialImages = [], mainImage, title }) => {
  const [preloadedImages, setPreloadedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  
  // Use ref for drag state to avoid unnecessary re-renders
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0
  });

  // Process and preload images
  useEffect(() => {
    const processImages = async () => {
      try {
        setIsLoading(true);
        
        // Create array with main image first if it exists
        const allImages = mainImage 
          ? [{ image: mainImage, isFeatured: true }, ...initialImages]
          : initialImages;

        if (!allImages || allImages.length === 0) return;

        const processed = await Promise.all(
          allImages.map(async (img) => {
            const src = img?.image || img?.url || img;
            try {
              if (typeof src === 'string') {
                await preloadImage(src);
                return { 
                  src, 
                  thumbnail: img.thumbnail || src,
                  isFeatured: img.isFeatured || false,
                  error: false 
                };
              }
              throw new Error('Invalid image source');
            } catch (err) {
              console.error('Error preloading image:', img, err);
              return { 
                src: '/images/placeholder.jpg', 
                thumbnail: '/images/placeholder.jpg',
                isFeatured: false,
                error: true 
              };
            }
          })
        );

        setPreloadedImages(processed);
        setError(false);
      } catch (err) {
        console.error('Error processing images:', err);
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    processImages();
  }, [initialImages, mainImage]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? preloadedImages.length - 1 : prev - 1));
    resetZoom();
  }, [preloadedImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === preloadedImages.length - 1 ? 0 : prev + 1));
    resetZoom();
  }, [preloadedImages.length]);

  const goToImage = useCallback((index) => {
    if (index >= 0 && index < preloadedImages.length) {
      setCurrentIndex(index);
    }
  }, [preloadedImages.length]);

  const openViewer = useCallback((index) => {
    setCurrentIndex(index);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    setIsViewerOpen(true);
    document.body.style.overflow = 'hidden';
  }, []);

  const closeViewer = useCallback(() => {
    setIsViewerOpen(false);
    setScale(1);
    setPosition({ x: 0, y: 0 });
    document.body.style.overflow = 'unset';
  }, []);

  const zoomIn = useCallback(() => {
    setScale(prev => Math.min(prev + 0.5, 3));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => Math.max(prev - 0.5, 1));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  }, []);

  const handleMouseDown = useCallback((e) => {
    if (scale > 1) {
      dragState.current = {
        isDragging: true,
        startX: e.clientX,
        startY: e.clientY
      };
      document.body.style.cursor = 'grabbing';
    }
  }, [scale]);

  const handleMouseMove = useCallback((e) => {
    if (dragState.current.isDragging) {
      setPosition({
        x: e.clientX - dragState.current.startX,
        y: e.clientY - dragState.current.startY
      });
    }
  }, []);

  const handleMouseUp = useCallback(() => {
    dragState.current.isDragging = false;
    document.body.style.cursor = '';
  }, []);

  // Single instance of handleWheel
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => Math.max(1, Math.min(prev + delta, 3)));
    }
  }, []);

  // Handle image load to update loading state
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
  }, []);

  const handleImageError = (e) => {
    console.error('Image failed to load:', e.target.src);
    e.target.src = '/images/placeholder.svg';
  };

  // Add/remove event listeners
  useEffect(() => {
    if (isViewerOpen) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('wheel', handleWheel, { passive: false });
      
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('wheel', handleWheel);
        document.body.style.cursor = '';
      };
    }
  }, [isViewerOpen, handleMouseUp, handleMouseMove, handleWheel]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Escape') closeViewer();
    else if (e.key === 'ArrowLeft') handlePrev();
    else if (e.key === 'ArrowRight') handleNext();
  }, [closeViewer, handlePrev, handleNext]);

  useEffect(() => {
    if (isViewerOpen) {
      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }
  }, [isViewerOpen, handleKeyDown]);

  const currentImage = preloadedImages[currentIndex] || {};
  const currentSrc = currentImage?.src || '';
  const isDragging = dragState.current.isDragging;

  if (isLoading) {
    return (
      <div className="image-loading-container">
        <div className="spinner"></div>
        <p>Loading images...</p>
      </div>
    );
  }
  
  if (error || !preloadedImages || preloadedImages.length === 0) {
    return (
      <div className="no-images-placeholder">
        <p>No images available for this project</p>
      </div>
    );
  }

  return (
    <div className="project-gallery">
      {/* Main Image */}
      <div className="main-image-container">
        <AnimatePresence mode="wait">
          <motion.div 
            className="image-wrapper"
            key={`image-${currentIndex}`}
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            <motion.img
              src={currentSrc}
              alt={`${title} - ${currentIndex + 1}`}
              className={`main-image ${isLoading ? 'loading' : ''}`}
              onClick={openViewer}
              onLoad={handleImageLoad}
              loading="eager"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onError={handleImageError}
            />
            
            <motion.button 
              className="zoom-button" 
              onClick={(e) => {
                e.stopPropagation();
                openViewer(currentIndex);
              }}
              aria-label="Zoom image"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
              whileTap={{ scale: 0.95 }}
            >
              <FiZoomIn size={24} />
            </motion.button>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      {preloadedImages.length > 1 && (
        <motion.div 
          className="thumbnails-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.2 }}
        >
          <div className="thumbnails">
            <AnimatePresence>
              {preloadedImages.map((img, index) => (
                <motion.div
                  key={index}
                  className={`thumbnail ${currentIndex === index ? 'active' : ''} ${img.isFeatured ? 'featured' : ''}`}
                  onClick={() => goToImage(index)}
                  aria-label={`View image ${index + 1}`}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ 
                    opacity: 1, 
                    scale: 1,
                    // borderColor: currentIndex === index ? 'var(--primary)' : 'transparent'
                  }}
                  whileHover={{ 
                    y: -5,
                    scale: 1.05,
                    transition: { duration: 0.1 }
                  }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.img 
                    src={img.thumbnail || img.src} 
                    alt={`${title} thumbnail ${index + 1}`}
                    loading="lazy"
                    initial={{ opacity: 0.7 }}
                    animate={{ opacity: currentIndex === index ? 1 : 0.7 }}
                    transition={{ duration: 0.075 }}
                    onError={(e) => {
                      e.target.src = '/images/placeholder-thumb.jpg';
                    }}
                  />
                  {img.isFeatured && (
                    <div className="featured-badge">Main</div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}

      {/* Navigation Arrows */}
      {preloadedImages.length > 1 && (
        <>
          <motion.button 
            className="nav-arrow prev-arrow" 
            onClick={handlePrev}
            aria-label="Previous image"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            whileTap={{ scale: 0.95, x: -5 }}
            initial={{ x: -10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FiChevronLeft size={32} />
          </motion.button>
          <motion.button 
            className="nav-arrow next-arrow" 
            onClick={handleNext}
            aria-label="Next image"
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
            whileTap={{ scale: 0.95, x: 5 }}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
          >
            <FiChevronRight size={32} />
          </motion.button>
        </>
      )}

      {/* Image Viewer */}
      <AnimatePresence>
        {isViewerOpen && (
          <motion.div
            className="image-viewer-overlay"
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            animate={{ 
              opacity: 1,
              backdropFilter: 'blur(10px)',
              transition: { duration: 0.3 }
            }}
            exit={{ 
              opacity: 0,
              backdropFilter: 'blur(0px)',
              transition: { duration: 0.2 }
            }}
            onClick={closeViewer}
            onWheel={handleWheel}
            onContextMenu={(e) => e.preventDefault()}
          >
            <motion.div 
              className="viewer-content" 
              onClick={e => e.stopPropagation()}
              onMouseDown={handleMouseDown}
              style={{ cursor: scale > 1 ? (dragState.current.isDragging ? 'grabbing' : 'grab') : 'default' }}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ 
                scale: 1,
                opacity: 1,
                transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] }
              }}
              exit={{ 
                scale: 0.9, 
                opacity: 0,
                transition: { duration: 0.2 }
              }}
            >
              <motion.div 
                className="image-container"
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: 'center center',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  position: 'relative'
                }}
                transition={dragState.current.isDragging ? { duration: 0 } : { type: 'spring', damping: 20, stiffness: 300 }}
              >
                <motion.img 
                  src={currentSrc}
                  alt={`${title} - ${currentIndex + 1}`}
                  className="viewer-image"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                  onLoad={() => {}}
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  exit={{ opacity: 0 }}
                  key={`viewer-${currentIndex}`}
                />
              </motion.div>
              
              <motion.div 
                className="viewer-controls"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.3 }
                }}
                exit={{ opacity: 0, y: 20 }}
              >
                <motion.button 
                  className="zoom-control" 
                  onClick={zoomIn}
                  aria-label="Zoom in"
                  whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.7)' }}
                  whileTap={{ scale: 0.95 }}
                >
                  <FiZoomIn size={24} />
                </motion.button>
                <motion.button 
                  className="zoom-control" 
                  onClick={zoomOut}
                  aria-label="Zoom out"
                  disabled={scale <= 1}
                  whileHover={{ 
                    scale: scale > 1 ? 1.1 : 1,
                    backgroundColor: scale > 1 ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)'
                  }}
                  whileTap={{ scale: scale > 1 ? 0.95 : 1 }}
                  style={{ opacity: scale > 1 ? 1 : 0.6, cursor: scale > 1 ? 'pointer' : 'not-allowed' }}
                >
                  <FiZoomOut size={24} />
                </motion.button>
                <motion.button 
                  className="zoom-control" 
                  onClick={resetZoom}
                  aria-label="Reset zoom"
                  disabled={scale === 1}
                  whileHover={{ 
                    scale: scale !== 1 ? 1.1 : 1,
                    backgroundColor: scale !== 1 ? 'rgba(0, 0, 0, 0.7)' : 'rgba(0, 0, 0, 0.3)'
                  }}
                  whileTap={{ scale: scale !== 1 ? 0.95 : 1 }}
                  style={{ opacity: scale !== 1 ? 1 : 0.6, cursor: scale !== 1 ? 'pointer' : 'not-allowed' }}
                >
                  <FiMaximize size={24} />
                </motion.button>
              </motion.div>
              
              <motion.button 
                className="close-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  closeViewer();
                }}
                aria-label="Close viewer"
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.8)' }}
                whileTap={{ scale: 0.9 }}
                initial={{ opacity: 0, y: -20 }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  transition: { delay: 0.2 }
                }}
                exit={{ opacity: 0, y: -20 }}
              >
                <FiX size={28} />
              </motion.button>
              
              <motion.div 
                className="viewer-caption"
                initial={{ opacity: 0, y: 20 }}
                animate={{ 
                  opacity: 1,
                  y: 0,
                  transition: { delay: 0.3 }
                }}
              >
                {title} - {currentIndex + 1} of {preloadedImages.length}
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectGallery;
