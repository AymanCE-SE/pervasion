# Frontend Documentation

## Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── layout/           # Layout components (Header, Footer, etc.)
│   ├── common/          # Shared components (Buttons, Loaders, etc.)
│   └── [feature]/       # Feature-specific components
├── hooks/               # Custom React hooks
├── i18n/                # Internationalization files
├── redux/               # Redux store, slices, and actions
│   ├── slices/          # Redux slices
│   └── store.js         # Redux store configuration
├── services/            # API services
├── styles/              # Global styles and themes
├── utils/               # Utility functions
└── App.jsx             # Main application component
```

## Key Features

### 1. Internationalization (i18n)
- Uses `i18next` with React integration
- Supports English and Arabic (RTL)
- Language detection with fallback
- Translation files in JSON format

### 2. State Management
- Redux Toolkit for global state
- Redux Persist for persisting state
- Slices for different features (auth, theme, etc.)

### 3. API Integration
- Axios for HTTP requests
- Request/response interceptors
- Centralized API service with error handling
- JWT authentication

### 4. UI/UX
- Responsive design
- Dark/Light theme support
- Loading states and error boundaries
- Form validation
- Animations with Framer Motion

## Setup Instructions

1. Install dependencies:
   ```bash
   npm install
   ```

2. Create a `.env` file in the root directory:
   ```env
   VITE_API_URL=http://localhost:8000/api
   VITE_APP_NAME=Portfolio
   ```

3. Start development server:
   ```bash
   npm run dev
   ```

## API Integration

### Base Configuration
API requests are handled through the centralized Axios instance in `src/utils/api.js`. It includes:
- Base URL configuration
- Request/response interceptors
- Error handling
- Authentication token management

### Making API Calls

1. **Using the API utility**
   ```javascript
   import api from './utils/api';
   
   // GET request
   const response = await api.get('/endpoint');
   
   // POST request
   const response = await api.post('/endpoint', data);
   
   // With error handling
   try {
     const response = await api.get('/endpoint');
   } catch (error) {
     console.error('API Error:', error.message);
   }
   ```

2. **Using the useApi hook**
   ```javascript
   import { useApi } from '../hooks/useApi';
   import api from '../utils/api';
   
   function MyComponent() {
     const [fetchData, { loading, data, error }] = useApi(api.get('/endpoint'));
     
     useEffect(() => {
       fetchData();
     }, [fetchData]);
     
     if (loading) return <div>Loading...</div>;
     if (error) return <div>Error: {error.message}</div>;
     
     return <div>{JSON.stringify(data)}</div>;
   }
   ```

## Authentication Flow

1. **Login**
   - User submits credentials
   - API returns JWT token
   - Token is stored in localStorage and Redux store
   - User is redirected to dashboard

2. **Protected Routes**
   - Routes are protected using the `ProtectedRoute` component
   - Unauthenticated users are redirected to login
   - Token is verified on page refresh

3. **Logout**
   - Clear token from storage and Redux
   - Redirect to login page

## Styling

- CSS Modules for component-scoped styles
- CSS Variables for theming
- Responsive design with media queries
- Bootstrap 5 for layout and components

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| VITE_API_URL | API base URL | http://localhost:8000/api |
| VITE_APP_NAME | Application name | Portfolio |

## Deployment

1. Build for production:
   ```bash
   npm run build
   ```

2. Deploy the `dist` directory to your hosting provider

## Troubleshooting

### Common Issues

1. **CORS Errors**
   - Ensure backend has proper CORS headers
   - Check if API URL is correct

2. **Authentication Issues**
   - Verify token is being set correctly
   - Check token expiration

3. **i18n Not Working**
   - Verify translation files exist
   - Check language detection settings

## Future Improvements

- Add more test coverage
- Implement code splitting
- Add service worker for offline support
- Improve accessibility
- Add more analytics

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request
