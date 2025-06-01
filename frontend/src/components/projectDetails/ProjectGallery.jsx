import React, { useState, useEffect, useCallback } from 'react';
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

const ProjectGallery = ({ images: initialImages = [], title }) => {
  const [preloadedImages, setPreloadedImages] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [imageSize, setImageSize] = useState({ width: 0, height: 0 });

  // Process and preload images
  useEffect(() => {
    const processImages = async () => {
      if (!initialImages || initialImages.length === 0) return;

      try {
        setIsLoading(true);
        const processed = await Promise.all(
          initialImages.map(async (img) => {
            // Handle both object with 'image' property and direct URL strings
            const src = img?.image || img?.url || img;
            try {
              if (typeof src === 'string') {
                await preloadImage(src);
                return { 
                  src, 
                  thumbnail: img.thumbnail || src, 
                  error: false 
                };
              }
              throw new Error('Invalid image source');
            } catch (err) {
              console.error('Error preloading image:', img, err);
              return { 
                src: '/images/placeholder.jpg', 
                thumbnail: '/images/placeholder.jpg',
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
  }, [initialImages]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev === 0 ? preloadedImages.length - 1 : prev - 1));
  }, [preloadedImages.length]);

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => (prev === preloadedImages.length - 1 ? 0 : prev + 1));
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
  
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.1 : 0.1;
      setScale(prev => {
        const newScale = Math.max(1, Math.min(prev + delta, 3));
        return newScale;
      });
    }
  }, []);
  
  const handleMouseDown = useCallback((e) => {
    if (scale > 1) {
      setIsDragging(true);
      setStartPos({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  }, [position, scale]);
  
  const handleMouseMove = useCallback((e) => {
    if (isDragging) {
      setPosition({
        x: e.clientX - startPos.x,
        y: e.clientY - startPos.y
      });
    }
  }, [isDragging, startPos]);
  
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);
  
  const handleImageLoad = useCallback((e) => {
    setImageSize({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight
    });
  }, []);
  
  // Add event listeners for mouse up outside the element
  useEffect(() => {
    if (isViewerOpen) {
      document.addEventListener('mouseup', handleMouseUp);
      document.addEventListener('mousemove', handleMouseMove);
      return () => {
        document.removeEventListener('mouseup', handleMouseUp);
        document.removeEventListener('mousemove', handleMouseMove);
      };
    }
  }, [isViewerOpen, handleMouseUp, handleMouseMove]);

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
  const currentSrc = currentImage.src || '';

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
        <div className="image-wrapper">
          <img
            src={currentSrc}
            alt={`${title || 'Project'} - ${currentIndex + 1}`}
            className={`main-image ${isLoading ? 'loading' : ''}`}
            onClick={() => openViewer(currentIndex)}
            onError={(e) => {
              e.target.src = '/images/placeholder.jpg';
              setError(true);
            }}
          />
          
          {preloadedImages.length > 1 && (
            <>
              <button 
                className="nav-arrow prev-arrow" 
                onClick={(e) => {
                  e.stopPropagation();
                  handlePrev();
                }}
                aria-label="Previous image"
              >
                <FiChevronLeft />
              </button>
              <button 
                className="nav-arrow next-arrow" 
                onClick={(e) => {
                  e.stopPropagation();
                  handleNext();
                }}
                aria-label="Next image"
              >
                <FiChevronRight />
              </button>
              <div className="image-counter">
                {currentIndex + 1} / {preloadedImages.length}
              </div>
            </>
          )}
          
          <button 
            className="zoom-button" 
            onClick={(e) => {
              e.stopPropagation();
              openViewer(currentIndex);
            }}
            aria-label="View full screen"
          >
            <FiZoomIn />
          </button>
        </div>
      </div>

      {/* Thumbnails */}
      {preloadedImages.length > 1 && (
        <div className="thumbnails-container">
          <div className="thumbnails">
            {preloadedImages.map((img, index) => (
              <div 
                key={index}
                className={`thumbnail ${currentIndex === index ? 'active' : ''}`}
                onClick={() => goToImage(index)}
              >
                <img 
                  src={img.thumbnail || img.src} 
                  alt={`Thumbnail ${index + 1}`}
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Viewer */}
      <AnimatePresence>
        {isViewerOpen && (
          <motion.div 
            className="image-viewer-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeViewer}
            onWheel={handleWheel}
            onContextMenu={(e) => e.preventDefault()}
          >
            <div 
              className="viewer-content" 
              onClick={e => e.stopPropagation()}
              onMouseDown={handleMouseDown}
              style={{ cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'default' }}
            >
              <div 
                className="image-container"
                style={{
                  transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
                  transition: isDragging ? 'none' : 'transform 0.2s ease-out',
                  transformOrigin: 'center center',
                  maxWidth: '90vw',
                  maxHeight: '90vh',
                  position: 'relative'
                }}
              >
                <img 
                  src={currentSrc}
                  alt={`${title} - ${currentIndex + 1}`}
                  className="viewer-image"
                  onError={(e) => {
                    e.target.src = '/images/placeholder.jpg';
                  }}
                  onLoad={handleImageLoad}
                  draggable={false}
                />
              </div>
              
              {preloadedImages.length > 1 && (
                <div className="viewer-navigation">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePrev();
                      resetZoom();
                    }} 
                    className="viewer-nav-button viewer-nav-prev"
                    aria-label="Previous image"
                  >
                    <FiChevronLeft />
                  </button>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      handleNext();
                      resetZoom();
                    }} 
                    className="viewer-nav-button viewer-nav-next"
                    aria-label="Next image"
                  >
                    <FiChevronRight />
                  </button>
                </div>
              )}
              
              <div className="viewer-controls">
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    zoomIn();
                  }}
                  className="zoom-control zoom-in"
                  aria-label="Zoom in"
                  disabled={scale >= 3}
                >
                  <FiZoomIn />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    zoomOut();
                  }}
                  className="zoom-control zoom-out"
                  aria-label="Zoom out"
                  disabled={scale <= 1}
                >
                  <FiZoomOut />
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    resetZoom();
                  }}
                  className="zoom-control reset"
                  aria-label="Reset zoom"
                  disabled={scale === 1}
                >
                  <FiMaximize />
                </button>
              </div>
              
              <button 
                className="close-button" 
                onClick={(e) => {
                  e.stopPropagation();
                  closeViewer();
                }}
                aria-label="Close viewer"
              >
                <FiX />
              </button>
              
              <div className="viewer-caption">
                {title} - {currentIndex + 1} of {preloadedImages.length}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProjectGallery;
