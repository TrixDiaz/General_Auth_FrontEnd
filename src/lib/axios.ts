import axios from 'axios';
import { authStore } from '../store/authStore';

const baseURL = 'http://localhost:5000/api/v1';

const api = axios.create({
    baseURL,
    withCredentials: true, // This ensures cookies are sent with requests
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth headers if needed
api.interceptors.request.use(
    (config) => {
        // You can add any request preprocessing here if needed
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // If the error is 401 (Unauthorized) and we haven't already tried to refresh
        // Also exclude logout requests from the refresh token logic
        if (error.response?.status === 401 && !originalRequest._retry && !originalRequest.url?.includes('/auth/logout')) {
            originalRequest._retry = true;

            const { setShowRefreshDialog, setPendingRequest, isAuthenticated } = authStore.getState();

            // Only show refresh dialog if user is authenticated
            if (isAuthenticated) {
                setShowRefreshDialog(true);

                // Return a promise that will be resolved when the user chooses to refresh
                return new Promise((resolve, reject) => {
                    // Store the resolve/reject functions to be called later
                    setPendingRequest({ resolve, reject, config: originalRequest });
                });
            }
        }

        return Promise.reject(error);
    }
);

export default api; 