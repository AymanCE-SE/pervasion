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
export const getAbsoluteImageUrl = (url) => {
  if (!url) return '/images/placeholder.svg';
  if (isAbsoluteUrl(url)) return url;
  
  // Get the API base URL from environment variable or default
  const apiBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8000';
  
  // Handle Django media URLs
  if (url.startsWith('/media/')) {
    return `${apiBaseUrl}${url}`;
  }
  
  // For other relative URLs
  return `${apiBaseUrl}${url.startsWith('/') ? '' : '/'}${url}`;
};

/**
 * Get a fallback image URL if the original image fails to load
 * @returns {string} - The fallback image URL
 */
 export const getFallbackImageUrl = () => {
  return '/images/placeholder.svg';
};
