# Pervasion Portfolio Backend

This is the backend API for the Pervasion Portfolio project. It's built with Django and Django REST Framework, providing a robust and scalable API for the frontend application.

## Features

- RESTful API with Django REST Framework
- JWT Authentication
- PostgreSQL database integration
- Image upload and management
- Multilingual support (English/Arabic)
- Admin dashboard for content management

## Project Structure

- **api/** - API routing and configuration
- **projects/** - Project and category models and views
- **users/** - Custom user model and authentication
- **contact/** - Contact form submissions
- **pervasion/** - Main project settings

## Requirements

- Python 3.8+
- PostgreSQL (optional, can use SQLite for development)
- Windows, macOS, or Linux

## Setup

### 1. Clone the repository

```bash
git clone <repository-url>
cd portfolio/backend
```

### 2. Create a virtual environment

```bash
python -m venv venv
```

### 3. Activate the virtual environment

**Windows:**
```powershell
.\venv\Scripts\Activate.ps1
```

**macOS/Linux:**
```bash
source venv/bin/activate
```

### 4. Install dependencies

```bash
pip install -r requirements.txt
```

### 5. Configure environment variables

Copy the `.env.example` file to `.env` and update the values as needed:

```bash
cp .env.example .env
```

### 6. Run the setup script

**Windows:**
```powershell
.\setup.ps1
```

**macOS/Linux:**
Create a `setup.sh` script with similar commands to the PowerShell script.

### 7. Run the development server

```bash
python manage.py runserver
```

The API will be available at http://localhost:8000/api/

## API Endpoints

### Authentication
- `POST /api/auth/login/` - Login and get JWT token
- `POST /api/auth/refresh/` - Refresh JWT token
- `POST /api/auth/register/` - Register a new user

### Projects
- `GET /api/projects/` - List all projects
- `GET /api/projects/{id}/` - Get project details
- `POST /api/projects/` - Create a new project (admin only)
- `PUT /api/projects/{id}/` - Update a project (admin only)
- `DELETE /api/projects/{id}/` - Delete a project (admin only)
- `GET /api/projects/featured/` - Get featured projects

### Categories
- `GET /api/categories/` - List all categories
- `GET /api/categories/{id}/` - Get category details
- `POST /api/categories/` - Create a new category (admin only)
- `PUT /api/categories/{id}/` - Update a category (admin only)
- `DELETE /api/categories/{id}/` - Delete a category (admin only)

### Users
- `GET /api/users/` - List all users (admin only)
- `GET /api/users/{id}/` - Get user details (admin only)
- `POST /api/users/` - Create a new user (admin only)
- `PUT /api/users/{id}/` - Update a user (admin only)
- `DELETE /api/users/{id}/` - Delete a user (admin only)

### Contact
- `POST /api/contacts/` - Submit a contact form
- `GET /api/contacts/` - List all contact submissions (admin only)
- `PATCH /api/contacts/{id}/` - Mark a contact as read (admin only)

## Admin Interface

The Django admin interface is available at http://localhost:8000/admin/

## License

This project is licensed under the MIT License.
