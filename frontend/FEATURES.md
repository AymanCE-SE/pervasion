# Jumooh Media Frontend Documentation

## Production Environment

- **Domain**: jumoohmedia.com
- **Build Tool**: Vite
- **Hosting**: Hostinger
- **SSL**: Enabled (HTTPS)

## SEO Features

- Server-side rendering for critical pages
- Meta tags for social sharing
- Structured data for projects
- Sitemap generation
- Robots.txt configuration
- Language-specific URLs
- Image optimization

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