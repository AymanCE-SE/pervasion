import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    host: '0.0.0.0',     // Listen on all network interfaces  
    port: 5173,           // Default Vite port  
    allowedHosts: [
      'jumoohmedia.com',
      'www.jumoohmedia.com',
      'jumooh.media'
    ]
  }
})
