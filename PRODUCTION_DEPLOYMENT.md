# Production Deployment Guide for www.pervasionsa.com

This guide will walk you through deploying your Pervasion Portfolio project to production on www.pervasionsa.com.

## Prerequisites

- A domain name (www.pervasionsa.com) with DNS properly configured
- A web server (Nginx or Apache) with SSL/TLS support
- PostgreSQL database server
- Python 3.10+ and Node.js 18+

## 1. Backend (Django) Deployment

### Environment Setup

1. Create a `.env` file in the backend directory based on `.env.example`:

```bash
# Copy example file
cp .env.example .env

# Edit with production values
nano .env
```

2. Generate a secure Django secret key:

```bash
python -c 'from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())'
```

3. Update the `.env` file with:
   - Your production PostgreSQL database URL
   - The generated secret key
   - Set `DEBUG=False`
   - Set `ALLOWED_HOSTS=pervasionsa.com,www.pervasionsa.com`
   - Configure email settings

### Database Setup

1. Create a PostgreSQL database:

```bash
sudo -u postgres psql
CREATE DATABASE pervasion;
CREATE USER pervasion WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE pervasion TO pervasion;
\q
```

2. Update your `.env` file with the database credentials.

### Install Dependencies & Prepare Django

1. Create a virtual environment and install dependencies:

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Apply migrations and collect static files:

```bash
python manage.py migrate
python manage.py collectstatic --no-input
```

3. Create a superuser for the admin panel:

```bash
python manage.py createsuperuser
```

### Configure Gunicorn

1. Create a systemd service file to run Gunicorn:

```
[Unit]
Description=Pervasion Portfolio Gunicorn Daemon
After=network.target

[Service]
User=your_server_user
Group=your_server_group
WorkingDirectory=/path/to/backend
ExecStart=/path/to/venv/bin/gunicorn --workers 3 --bind 127.0.0.1:8000 pervasion.wsgi:application
Restart=on-failure

[Install]
WantedBy=multi-user.target
```

2. Start and enable the service:

```bash
sudo systemctl start pervasion_gunicorn
sudo systemctl enable pervasion_gunicorn
```

## 2. Frontend (React) Deployment

### Environment Setup

1. Create a `.env` file in the frontend directory based on `.env.example`:

```bash
cp .env.example .env
```

2. Update the `.env` file with:
   - `VITE_API_URL=https://www.pervasionsa.com/api`
   - `NODE_ENV=production`
   - Set any other required environment variables

### Build for Production

1. Install dependencies and build the frontend:

```bash
npm install
npm run build
```

2. This will create a `dist` directory with optimized production files.

## 3. Web Server Configuration (Nginx)

Create an Nginx configuration file for your domain:

```nginx
server {
    listen 80;
    server_name pervasionsa.com www.pervasionsa.com;
    return 301 https://www.pervasionsa.com$request_uri;
}

server {
    listen 443 ssl http2;
    server_name www.pervasionsa.com;
    
    ssl_certificate /path/to/ssl/certificate.crt;
    ssl_certificate_key /path/to/ssl/private.key;
    
    # SSL configurations
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384;
    
    # Frontend
    root /path/to/frontend/dist;
    index index.html;
    
    # Handle SPA routing
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8000/api/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Django Admin
    location /admin/ {
        proxy_pass http://127.0.0.1:8000/admin/;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # Media files
    location /media/ {
        alias /path/to/backend/media/;
    }
    
    # Static files for Django admin
    location /static/ {
        alias /path/to/backend/staticfiles/;
    }
}
```

## 4. Security Considerations

1. **SSL/TLS Certificate**: Use Let's Encrypt or a commercial certificate
2. **Firewall**: Configure firewall to only allow necessary ports (80, 443)
3. **Database Backups**: Set up regular backups
4. **Security Updates**: Keep all software up to date

## 5. Post-Deployment Tasks

1. **Test all features**: Thoroughly test all features of your application
2. **Configure Email**: Ensure email sending works correctly
3. **Set up monitoring**: Consider adding monitoring tools like New Relic or Sentry
4. **Check file uploads**: Verify that file uploads work correctly in production

## 6. File Upload Troubleshooting

If you encounter file upload issues:

1. Ensure your forms have `encType="multipart/form-data"`
2. Check that Nginx client_max_body_size is sufficient
3. Verify media file permissions are correctly set
4. Check Django file upload handling in settings.py

## 7. Additional Resources

- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [Vite Production Build Guide](https://vitejs.dev/guide/build.html)
- [Nginx Documentation](https://nginx.org/en/docs/)
