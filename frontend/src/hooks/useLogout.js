import { useSetRecoilState } from "recoil"; // Hook to update Recoil state
import userAtom from "../atoms/userAtom";   // Global state atom for storing the current user
import useShowToast from "./useShowToast";  // Custom hook for displaying toast notifications

/**
 * Custom hook: useLogout
 * Handles logging out the current user by:
 * 1. Sending a request to the server
 * 2. Clearing localStorage
 * 3. Resetting global user state
 */
const useLogout = () => {
    // Function to update the global user state (Recoil)
    const setUser = useSetRecoilState(userAtom);

    // Function to show toast notifications
    const showToast = useShowToast();

    /**
     * logout → Async function that performs the logout process
     */
    const logout = async () => {
        try {
            // API request to log out user on the backend
            const res = await fetch("/api/users/logout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            // If server responds with an error → show error toast
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            // Remove saved user data from localStorage
            localStorage.removeItem("user-threads");

            // Clear the user from global state
            setUser(null);
        } catch (error) {
            // Show toast if logout request fails
            showToast("Error", error, "error");
        }
    };

    // Return the logout function so components can call it
    return logout;
};

export default useLogout;
