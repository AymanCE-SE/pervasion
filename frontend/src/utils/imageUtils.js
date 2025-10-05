/**
 * Utility functions for handling images
 */

/**
 * Checks if a URL is absolute (starts with http:// or https://)
 * @param {string} url - The URL to check
 * @returns {boolean} - True if the URL is absolute, false otherwise
 */
export const isAbsoluteUrl = (url) => {
  if (!url) return false;
  return url.startsWith('http://') || url.startsWith('https://');
};

/**
 * Ensures a URL is absolute by prepending the API base URL if necessary
 * @param {string} url - The URL to process
 * @returns {string} - The absolute URL
 */
export const getAbsoluteImageUrl = (path) => {
  if (!path) return getFallbackImageUrl();
  
  // If it's already an absolute URL, return it
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  
  // Clean the path
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  const mediaPath = cleanPath.startsWith('/media/') ? cleanPath : `/media/${cleanPath}`;
  
  // Get base URL from environment
  const baseUrl = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:8000';
  
  // Construct full URL
  return `${baseUrl}${mediaPath}`.replace(/([^:]\/)\/+/g, "$1");
};

/**
 * Get a fallback image URL if the original image fails to load
 * @returns {string} - The fallback image URL
 */
export const getFallbackImageUrl = () => '/images/placeholder.svg';

/**
 * Handle image error by setting the source to a fallback image
 * @param {Event} e - The error event
 */
export const handleImageError = (e) => {
  console.error('Image load failed:', {
    originalSrc: e.target.src,
    fallbackSrc: getFallbackImageUrl(),
    timestamp: new Date().toISOString()
  });
  e.target.src = getFallbackImageUrl();
  e.target.onerror = null; // Prevent infinite loop
};
