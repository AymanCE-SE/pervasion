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

const MIN_SCALE = 1;
const MAX_SCALE = 4;
const AUTO_ZOOM_SCALE = 2;

const ProjectGallery = ({ images: initialImages = [], mainImage, title }) => {
  const [preloadedImages, setPreloadedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  const [mainLoaded, setMainLoaded] = useState(false);
  const [transformOrigin, setTransformOrigin] = useState('center center');
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isTouchDevice, setIsTouchDevice] = useState(false);
  const [openFromZoom, setOpenFromZoom] = useState(false);
  const tapRef = useRef({ last: 0 });
  const viewerRef = useRef(null);
  const touchState = useRef({ startX: 0, startY: 0, tracking: false, startDistance: 0, pinchStartScale: 1 });
  
  // Use ref for drag state to avoid unnecessary re-renders
  const dragState = useRef({
    isDragging: false,
    startX: 0,
    startY: 0
  });

  // keep active thumbnail in view
  const thumbsRef = useRef([]);
  useEffect(() => {
    if (thumbsRef.current && thumbsRef.current[currentIndex]) {
      try { thumbsRef.current[currentIndex].scrollIntoView({ behavior: 'smooth', inline: 'center', block: 'nearest' }); } catch (e) {}
    }
  }, [currentIndex]);

  // Detect touch-capable devices for mobile UI tweaks
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsTouchDevice(!!(('ontouchstart' in window) || (navigator.maxTouchPoints && navigator.maxTouchPoints > 0)));
    }
  }, []);

  // Process and preload images
  useEffect(() => {
    const processImages = async () => {
      try {
        setIsLoading(true);
        
        // Create array with main image first if it exists
        const allImages = mainImage 
          ? [{ image: mainImage, isFeatured: true }, ...initialImages]
          : initialImages;

        // Deduplicate images by source to avoid showing the same image multiple times
        const getSrc = (i) => i?.image || i?.url || i;
        const seen = new Set();
        const uniqueImages = [];
        for (const img of allImages) {
          const src = getSrc(img);
          if (!src || seen.has(src)) continue;
          seen.add(src);
          uniqueImages.push(img);
        }

        if (!uniqueImages || uniqueImages.length === 0) return;

        const processed = await Promise.all(
          uniqueImages.map(async (img) => {
            const src = getSrc(img);
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
    try {
      if (document.exitFullscreen) document.exitFullscreen();
      else if (document.webkitExitFullscreen) document.webkitExitFullscreen();
    } catch (e) {}
  }, []);

  const clampScale = (s) => Math.max(MIN_SCALE, Math.min(s, MAX_SCALE));

  const zoomIn = useCallback(() => {
    setScale(prev => clampScale(prev + 0.5));
  }, []);

  const zoomOut = useCallback(() => {
    setScale(prev => clampScale(prev - 0.5));
  }, []);

  const resetZoom = useCallback(() => {
    setScale(MIN_SCALE);
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

  // Touch handlers: swipe to navigate, pinch to zoom
  const handleTouchStart = useCallback((e) => {
    if (!e.touches) return;
    if (e.touches.length === 1) {
      const t = e.touches[0];
      touchState.current.startX = t.clientX;
      touchState.current.startY = t.clientY;
      touchState.current.tracking = true;
      // double tap detection
      const now = Date.now();
      if (now - tapRef.current.last < 300) {
        if (!isViewerOpen) {
          openViewer(currentIndex);
          setTimeout(() => setScale(AUTO_ZOOM_SCALE), 60);
        } else {
          const rect = viewerRef.current?.getBoundingClientRect();
          if (rect) {
            const dx = t.clientX - (rect.left + rect.width / 2);
            const dy = t.clientY - (rect.top + rect.height / 2);
            if (scale === 1) {
              setScale(AUTO_ZOOM_SCALE);
              setPosition({ x: -dx, y: -dy });
            } else {
              resetZoom();
            }
          } else {
            if (scale === 1) setScale(AUTO_ZOOM_SCALE); else resetZoom();
          }
        }
      }
      tapRef.current.last = now;
    } else if (e.touches.length === 2) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      touchState.current.startDistance = Math.hypot(dx, dy);
      touchState.current.pinchStartScale = scale;
      touchState.current.tracking = false;
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const rect = viewerRef.current?.getBoundingClientRect();
      if (rect) {
        const px = ((midX - rect.left) / rect.width) * 100;
        const py = ((midY - rect.top) / rect.height) * 100;
        setTransformOrigin(`${px}% ${py}%`);
      }
    }
  }, [scale, isViewerOpen, currentIndex, openViewer, resetZoom]);

  const handleTouchMove = useCallback((e) => {
    if (!e.touches) return;
    if (e.touches.length === 1 && touchState.current.tracking) {
      const dx = e.touches[0].clientX - touchState.current.startX;
      // don't update position here to avoid jitter, track for end
      touchState.current.deltaX = dx;
    } else if (e.touches.length === 2) {
      // pinch
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const ratio = dist / (touchState.current.startDistance || dist);
      const newScale = clampScale(touchState.current.pinchStartScale * ratio);
      setScale(newScale);
      // update transform origin as pinch moves
      const midX = (e.touches[0].clientX + e.touches[1].clientX) / 2;
      const midY = (e.touches[0].clientY + e.touches[1].clientY) / 2;
      const rect = viewerRef.current?.getBoundingClientRect();
      if (rect) {
        const px = ((midX - rect.left) / rect.width) * 100;
        const py = ((midY - rect.top) / rect.height) * 100;
        setTransformOrigin(`${px}% ${py}%`);
      }
    }
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (touchState.current.tracking && typeof touchState.current.deltaX === 'number') {
      const dx = touchState.current.deltaX;
      const threshold = 60; // px
      if (dx > threshold) handlePrev();
      else if (dx < -threshold) handleNext();
    }
    touchState.current.tracking = false;
    touchState.current.deltaX = 0;
  }, [handleNext, handlePrev]);

  // Fullscreen toggle
  const toggleFullscreen = useCallback(() => {
    const el = viewerRef.current;
    if (!el) return;
    if (!document.fullscreenElement) {
      el.requestFullscreen?.();
    } else {
      document.exitFullscreen?.();
    }
  }, []);

  // Handle image load to update loading state
  const handleImageLoad = useCallback(() => {
    setIsLoading(false);
    setMainLoaded(true);
  }, []);

  // Small subcomponent for viewer controls (keeps main render smaller)
  const ViewerControls = ({ hidden }) => (
    <motion.div
      className="viewer-controls"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0, transition: { delay: 0.3 } }}
      exit={{ opacity: 0, y: 20 }}
      aria-hidden={hidden}
    >
      <motion.button className="zoom-control" onClick={zoomIn} aria-label="Zoom in" whileTap={{ scale: 0.95 }}>
        <FiZoomIn size={24} />
      </motion.button>
      <motion.button className="zoom-control" onClick={zoomOut} aria-label="Zoom out" disabled={scale <= MIN_SCALE} whileTap={{ scale: 0.95 }}>
        <FiZoomOut size={24} />
      </motion.button>
      <motion.button className="zoom-control" onClick={resetZoom} aria-label="Reset zoom" disabled={scale === MIN_SCALE} whileTap={{ scale: 0.95 }}>
        <FiMaximize size={20} />
      </motion.button>
      <motion.button className="zoom-control" onClick={toggleFullscreen} aria-label="Toggle fullscreen" whileTap={{ scale: 0.95 }}>
        <FiMaximize size={20} />
      </motion.button>
    </motion.div>
  );



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
      document.addEventListener('touchstart', handleTouchStart, { passive: true });
      document.addEventListener('touchmove', handleTouchMove, { passive: false });
      document.addEventListener('touchend', handleTouchEnd, { passive: true });
      
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('wheel', handleWheel);
        document.removeEventListener('touchstart', handleTouchStart);
        document.removeEventListener('touchmove', handleTouchMove);
        document.removeEventListener('touchend', handleTouchEnd);
        document.body.style.cursor = '';
      };
    }
  }, [isViewerOpen, handleMouseUp, handleMouseMove, handleWheel]);

  // When opened via the zoom button, request fullscreen and set an initial zoom
  useEffect(() => {
    if (isViewerOpen && openFromZoom) {
      const el = viewerRef.current;
      const requestFull = () => {
        if (!el) return;
        if (el.requestFullscreen) el.requestFullscreen();
        else if (el.webkitRequestFullscreen) el.webkitRequestFullscreen();
        else if (el.msRequestFullscreen) el.msRequestFullscreen();
      };
      const t = setTimeout(() => {
        try { requestFull(); } catch (e) {}
        setScale(2);
      }, 80);
      // reset the trigger flag
      setOpenFromZoom(false);
      return () => clearTimeout(t);
    }
  }, [isViewerOpen, openFromZoom]);

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

  // Reset mainLoaded whenever currentSrc changes so blur-up will show until image loads
  useEffect(() => {
    setMainLoaded(false);
  }, [currentSrc]);

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
            data-loaded={mainLoaded}
            data-touch-zoomed={isTouchDevice && isViewerOpen && scale > 1}
            style={{
              ['--bg-image']: currentImage?.thumbnail ? `url(${currentImage.thumbnail})` : undefined
            }}
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
              onClick={() => openViewer(currentIndex)}
              onTouchStart={(e) => handleTouchStart(e)}
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
                // If user clicks the zoom glass, open the viewer and request fullscreen/zoom
                setOpenFromZoom(true);
                openViewer(currentIndex);
              }}
              aria-label="Zoom image"
              whileHover={{ scale: 1.1, backgroundColor: 'rgba(0, 0, 0, 0.9)' }}
              whileTap={{ scale: 0.95 }}
              aria-hidden={isTouchDevice && isViewerOpen && scale > 1}
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
                  ref={(el) => (thumbsRef.current[index] = el)}
                  className={`thumbnail ${currentIndex === index ? 'active' : ''} ${img.isFeatured ? 'featured' : ''}`}
                  onClick={() => goToImage(index)}
                  tabIndex={0}
                  aria-label={`View image ${index + 1}`}
                  aria-current={currentIndex === index}
                  onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); goToImage(index); } }}
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
              ref={viewerRef}
              onClick={e => e.stopPropagation()}
              onMouseDown={handleMouseDown}
              onTouchStart={(e) => { handleTouchStart(e); }}
              onTouchMove={(e) => { handleTouchMove(e); }}
              onTouchEnd={(e) => { handleTouchEnd(e); }}
              style={{ cursor: scale > 1 ? (dragState.current.isDragging ? 'grabbing' : 'grab') : 'default' }}
              data-touch-zoomed={isTouchDevice && isViewerOpen && scale > 1}
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
                data-loaded={mainLoaded}
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transformOrigin: transformOrigin,
                  ['--bg-image']: currentImage?.thumbnail ? `url(${currentImage.thumbnail})` : undefined,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
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
                  onLoad={() => setMainLoaded(true)}
                  draggable={false}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.2 }}
                  exit={{ opacity: 0 }}
                  key={`viewer-${currentIndex}`}
                />
              </motion.div>
              
              <ViewerControls hidden={isTouchDevice && scale > 1} />
              
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
