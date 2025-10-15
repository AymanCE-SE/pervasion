# Jumooh Media Portfolio

A modern platform application showcasing creative design works, deployed at [jumoohmedia.com](https://jumoohmedia.com).

## Production Deployment

- **Frontend**: [jumoohmedia.com](https://jumoohmedia.com)
- **API**: [jumoohmedia.com/api](https://jumoohmedia.com/api)
- **Admin**: [jumoohmedia.com/admin](https://jumoohmedia.com/admin)


## Technology Stack
- React with Vite
- Redux Toolkit for state management
- i18next for Arabic/English localization
- Framer Motion for animations
- Bootstrap 5 for responsive layout

- **Backend**:
- Django REST Framework
- PostgreSQL database
- JWT Authentication
- Custom user model
- Media file handling
- Multi-language support

## Features
- Responsive design with dark/light theme
- Bilingual support (Arabic/English)
- Project portfolio with image galleries
- Contact form with email notifications
- Admin dashboard for content management
- Secure file upload and management
- Social media integration


## Prerequisites

- Node.js 16+ (for frontend)
- Python 3.8+ (for backend)
- PostgreSQL (for production)
- Git

## Quick Start

### 1. Clone the repository

```bash
git clone <repository-url>
cd Portfolio
```

### 2. Set up the Backend

```bash
# Navigate to backend
cd backend

# Create and activate virtual environment
python -m venv venv
# On Windows:
venv\Scripts\activate
# On Unix/MacOS:
# source venv/bin/activate

# Run the setup script (Windows)
.\setup_fix.ps1
# On Unix/MacOS:
# bash setup.sh

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration
# For production, set DATABASE_URL for PostgreSQL

# Start the development server
venv\Scripts\python manage.py runserver
```

#### Database Configuration

The application supports both SQLite (development) and PostgreSQL (production):

- **Development**: SQLite is used by default when no DATABASE_URL is set
- **Production**: Set the DATABASE_URL in your .env file to use PostgreSQL

```
DATABASE_URL=postgres://username:password@hostname:port/database_name
```

### 3. Set up the Frontend

```bash
# Navigate to frontend
cd ../frontend

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your API URL

# Start the development server
npm run dev
```

## File Upload Functionality

The application now supports direct file uploads for project images:

- **Main Image**: Each project has one main image that is displayed in the project list and as the featured image
- **Additional Images**: Projects can have multiple additional images that are displayed in the project detail page

The admin dashboard provides an intuitive interface for uploading and managing images:

1. Navigate to the admin dashboard at `/admin/projects`
2. Create a new project or edit an existing one
3. Use the file upload fields to select images from your computer
4. For additional images, you can select multiple files at once
5. Preview images before saving
6. Remove unwanted images using the remove button

## Development

### Running the application

1. Start the backend server:
   ```bash
   cd backend
   python manage.py runserver
   ```

2. In a new terminal, start the frontend development server:
   ```bash
   cd frontend
   npm run dev
   ```

### Accessing the application

- Frontend: http://localhost:5173
- Backend API: http://localhost:8000/api
- Admin interface: http://localhost:8000/admin
- API Documentation:
  - Swagger UI: http://localhost:8000/api/docs/
  - ReDoc: http://localhost:8000/api/redoc/

## Environment Variables

### Backend (`.env` in `backend/`)

```env
# Django
DEBUG=True
SECRET_KEY=your-secret-key
ALLOWED_HOSTS=localhost,127.0.0.1

# Database
DATABASE_URL=sqlite:///db.sqlite3  # For development
# DATABASE_URL=postgres://user:password@localhost:5432/dbname  # For production

# CORS
CORS_ALLOW_ALL_ORIGINS=True  # For development
# CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173

# Media files
MEDIA_URL=/media/
MEDIA_ROOT=media/
```

### Frontend (`.env` in `frontend/`)

```env
VITE_API_URL=http://localhost:8000/api
VITE_APP_NAME=Portfolio
VITE_APP_DESCRIPTION=A modern portfolio application
VITE_DEFAULT_LANGUAGE=en
```

## Testing

### Backend Tests

```bash
cd backend
pytest
```

### Frontend Tests

```bash
cd frontend
npm test
```

## Deployment

### Backend

1. Set up a production server (e.g., Gunicorn with Nginx)
2. Configure environment variables
3. Set up a production database (PostgreSQL)
4. Collect static files:
   ```bash
   python manage.py collectstatic --noinput
   ```
5. Set up a process manager (e.g., systemd, Supervisor)

### Frontend

1. Build for production:
   ```bash
   npm run build
   ```
2. Deploy the `dist` directory to a static file server or CDN

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
