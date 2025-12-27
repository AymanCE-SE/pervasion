# Jumooh Media Frontend Documentation

## Production Environment

- **Domain**: jumoohmedia.com
- **Build Tool**: Vite
- **Hosting**: Hostinger
- **SSL**: Enabled (HTTPS)

## SEO Features

- SEO-friendly meta tags via `react-helmet-async` and social sharing meta
- Structured data for projects (JSON-LD)
- Sitemap generation and `robots.txt` configuration
- Language-specific URLs for Arabic/English

> Note: this project uses client-side rendering (Vite + React). There is no server-side rendering (SSR) in the current setup — SEO is handled with meta tags and static sitemap generation.

## Performance Optimizations

- Image lazy loading
- Code splitting
- Asset compression
- Browser caching
- CDN integration
- Resource preloading
- Critical CSS inlining

## Security

- HTTPS enforcement
- CORS configuration
- Content Security Policy
- XSS protection
- CSRF protection
- Secure cookie handling

## Production Configuration

```javascript
// [vite.config.js](http://_vscodecontentref_/1)
export default defineConfig({
  server: {
    host: '0.0.0.0',
    port: 5173,
    allowedHosts: ['jumoohmedia.com', 'www.jumoohmedia.com']
  },
  build: {
    sourcemap: false,
    minify: 'terser',
    cssMinify: true
  }
})

## Planned improvements & To‑Do

- **CI & Tests:** Add GitHub Actions to run backend `pytest` and frontend tests on PRs; increase test coverage for API endpoints, serializers, and image uploads.
- **Centralize HTTP client:** Consolidate axios instances into a single `src/services/api.js` client for consistent auth, error handling, and base URL usage.
- **Image optimization:** Serve responsive images with `srcset` and modern formats (WebP/AVIF), and add server-side caching/CDN headers for media.
- **Accessibility audit:** Improve keyboard navigation, focus management, and ensure `alt` text on images; test with keyboard-only flows and screen readers.
- **Lockfiles & dependency hygiene:** Commit `package-lock.json` and use a Python locking tool (pip-compile/poetry) for reproducible installs.
- **Cache & Service Worker:** Evaluate service worker usage and caching strategy; avoid unexpected `304` responses during dev by using cache-busting where needed.