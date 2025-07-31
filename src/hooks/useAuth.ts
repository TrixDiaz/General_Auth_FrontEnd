import { authStore } from "../store/authStore";
import { useEffect } from "react";
import axios from "../lib/axios";

export const useAuth = () => {
    const {
        user,
        email,
        isAuthenticated,
        setUser,
        setEmail,
        setIsAuthenticated,
        logout
    } = authStore();

    return {
        user,
        email,
        isAuthenticated,
        setUser,
        setEmail,
        setIsAuthenticated,
        logout
    }
}

export const useAuthInit = () => {
    const { user, isAuthenticated, setUser, setEmail, setIsAuthenticated } = useAuth();

    useEffect(() => {
        console.log("useAuthInit: Current state - user:", user, "isAuthenticated:", isAuthenticated);

        const fetchUser = async () => {
            // Fetch user data if we don't have it already or if not authenticated
            // Also fetch if we have email and isAuthenticated but no user object
            if (!user || !isAuthenticated || (isAuthenticated && !user)) {
                console.log("useAuthInit: Fetching user data from API...");
                try {
                    const response = await axios.get("/users/me", { withCredentials: true });
                    console.log("useAuthInit: API response:", response.data);
                    setUser(response.data.user);
                    setEmail(response.data.user.email);
                    setIsAuthenticated(true);
                } catch (error) {
                    console.error("useAuthInit: Error fetching user:", error);
                    // If the API call fails and we don't have persisted data, clear the state
                    if (!user) {
                        console.log("useAuthInit: Clearing state due to API failure and no persisted data");
                        setUser(null);
                        setEmail(null);
                        setIsAuthenticated(false);
                    } else {
                        console.log("useAuthInit: Keeping persisted data despite API failure");
                    }
                }
            } else {
                console.log("useAuthInit: Using persisted data, skipping API call");
            }
        }
        fetchUser();
    }, []); // Empty dependency array - only run once on mount
}