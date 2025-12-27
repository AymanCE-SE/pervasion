# Jumooh Platform Backend

This is the backend API for the Jumooh Platform project. It's built with Django and Django REST Framework, providing a robust and scalable API for the frontend application.

## Features

- Django + Django REST Framework API
- JWT Authentication (using `rest_framework_simplejwt`)
- Configurable database (PostgreSQL recommended; uses `DATABASE_URL`)
- Project & category management with image upload support
- Multilingual support (English/Arabic)
- Admin interface for content management

## Project Structure

- **api/** - API routing and configuration
- **projects/** - Projects, categories and image models / views
- **users/** - Custom user model and authentication
- **contact/** - Contact form submissions
- **jobapplicant/** - Job application handling
- **pervasion/** - Main project settings
- **backend/** - Django project root and management files (where applicable)  

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

## Security & Environment notes

- **Keep secrets out of version control.** Set `SECRET_KEY` and `JWT_SIGNING_KEY` in your local `.env` and never commit them.
- **Production configuration:** ensure `DEBUG=False`, set `ALLOWED_HOSTS` to your production host(s), and do not use development defaults with plaintext credentials.
- **CORS in prod:** avoid `CORS_ALLOW_ALL_ORIGINS=True` with `CORS_ALLOW_CREDENTIALS=True` in production — prefer explicit `CORS_ALLOWED_ORIGINS`.
- **Dev proxy:** when using Vite's proxy, ensure your dev host (e.g. `localhost:5173`) is included in `ALLOWED_HOSTS` or configure the proxy to send a matching `Host` header.

## Testing & CI

- Add and run tests with `pytest` from the `backend/` folder:
  ```bash
  cd backend
  pytest
  ```
- Add a CI workflow (example: `.github/workflows/ci.yml`) to run tests and linters on PRs and merges.

## Troubleshooting

- If the frontend receives **Bad Request (400)** when proxied from Vite, either add the dev host (e.g., `localhost:5173`) to `ALLOWED_HOSTS` or configure Vite to set the Host header to `127.0.0.1:8000`.
- If you observe `304 Not Modified` / caching while developing, disable cache in DevTools or ensure the frontend cache-busts GETs (the client already appends `_t`).

## License

This project is licensed under the MIT License.
