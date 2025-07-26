# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

# Authentication System Documentation

## Overview

This frontend implements a comprehensive authentication system that checks user authentication status on every page mount using HTTP-only cookies from the backend.

## Key Components

### 1. Authentication Store (`useAuthStore.ts`)

- Manages authentication state using Zustand
- Provides `checkAuth()` method to verify authentication with backend
- Handles user data and authentication status
- Includes loading states for better UX

### 2. Authentication Hooks (`useAuth.ts`)

- `useAuth()`: Checks authentication and redirects to login if not authenticated
- `useAuthRedirect()`: Checks authentication and redirects to dashboard if authenticated

### 3. Route Protection Components

- `ProtectedRoute`: Wraps protected pages, redirects to login if not authenticated
- `PublicRoute`: Wraps auth pages, redirects to dashboard if already authenticated

### 4. Backend Integration

- Uses `/api/v1/users/me` endpoint to check authentication status
- HTTP-only cookies are automatically sent with requests
- Axios configured with `withCredentials: true`

## How It Works

### Page Load Flow

1. **Every page mount** triggers authentication check via `useAuth()` or `useAuthRedirect()`
2. **Backend call** to `/users/me` with HTTP-only cookies
3. **Response handling**:
   - Success: User data stored in Zustand store, page renders
   - Failure: Redirect to appropriate page (login/dashboard)

### Authentication States

- **Loading**: Shows loading spinner while checking auth
- **Authenticated**: User can access protected pages
- **Not Authenticated**: User redirected to login page

### Route Protection

- **Protected Routes** (e.g., `/dashboard`): Require authentication
- **Public Routes** (e.g., `/login`, `/register`): Redirect authenticated users to dashboard

## Usage

### Protected Pages

```tsx
<Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <Dashboard />
    </ProtectedRoute>
  }
/>
```

### Public Pages

```tsx
<Route
  path="/login"
  element={
    <PublicRoute>
      <Login />
    </PublicRoute>
  }
/>
```

### Manual Auth Check

```tsx
const {isAuthenticated, isLoading} = useAuth();
```

## Benefits

1. **Automatic Authentication**: Every page checks auth status on mount
2. **Persistent Sessions**: HTTP-only cookies survive page reloads
3. **Secure**: No client-side token storage
4. **User-Friendly**: Smooth redirects and loading states
5. **Reliable**: Works even after browser refresh

## Backend Requirements

- `/api/v1/users/me` endpoint that returns user data
- HTTP-only cookies for session management
- CORS configured to allow credentials
- Proper error handling for unauthenticated requests

