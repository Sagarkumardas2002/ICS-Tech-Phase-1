import { useState } from "react"; // React hook for managing local component state
import useShowToast from "./useShowToast"; // Custom hook for showing toast notifications
import userAtom from "../atoms/userAtom"; // Global state for storing current logged-in user
import { useRecoilValue } from "recoil"; // Hook for reading Recoil state without modifying it

/**
 * Custom hook: useFollowUnfollow
 * Handles following/unfollowing a user and updates UI state accordingly.
 *
 * @param {Object} user - The profile user to follow/unfollow
 */
const useFollowUnfollow = (user) => {
    // Get the currently logged-in user from global state
    const currentUser = useRecoilValue(userAtom);

    /**
     * following → boolean, true if the current user already follows this profile user
     * Initially set by checking if currentUser's ID is in the user's followers list
     */
    const [following, setFollowing] = useState(
        user.followers.includes(currentUser?._id)
    );

    // Boolean state to track if the follow/unfollow request is in progress
    const [updating, setUpdating] = useState(false);

    // Function to display toast notifications
    const showToast = useShowToast();

    /**
     * Handles the follow/unfollow logic
     * Makes a POST request to the server and updates the UI state
     */
    const handleFollowUnfollow = async () => {
        // If user is not logged in → show error toast and exit
        if (!currentUser) {
            showToast("Error", "Please login to follow", "error");
            return;
        }

        // Prevent duplicate requests while already updating
        if (updating) return;

        setUpdating(true); // Start request

        try {
            // API request to follow/unfollow the user
            const res = await fetch(`/api/users/follow/${user._id}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await res.json();

            // If server returned an error → show toast and exit
            if (data.error) {
                showToast("Error", data.error, "error");
                return;
            }

            if (following) {
                // If already following → unfollow and show success message
                showToast("Success", `Unfollowed ${user.name}`, "success");
                user.followers.pop(); // Simulate removing current user from followers list
            } else {
                // If not following → follow and show success message
                showToast("Success", `Followed ${user.name}`, "success");
                user.followers.push(currentUser?._id); // Simulate adding current user to followers list
            }

            // Toggle following state in UI
            setFollowing(!following);

            console.log(data); // Debugging response
        } catch (error) {
            // Show error toast if request fails
            showToast("Error", error, "error");
        } finally {
            // End request
            setUpdating(false);
        }
    };

    /**
     * Return values:
     * handleFollowUnfollow → function to trigger follow/unfollow
     * updating             → boolean, request in progress
     * following            → boolean, current follow status
     */
    return { handleFollowUnfollow, updating, following };
};

export default useFollowUnfollow;
