import { useToast } from "@chakra-ui/react"; // Chakra UI hook for showing toast notifications
import { useCallback } from "react"; // React hook for memoizing functions

/**
 * Custom hook: useShowToast
 * Wraps Chakra UI's `useToast` to simplify showing toast notifications
 * with predefined settings (duration, closable, etc.).
 */
const useShowToast = () => {

    // Initialize Chakra's toast function
    const toast = useToast();

    /**
     * showToast → Displays a toast notification.
     * Wrapped in useCallback to avoid unnecessary re-creations on re-render.
     *
     * @param {string} title       - Main heading of the toast
     * @param {string} description - Additional message text
     * @param {string} status      - Type of toast ("success", "error", "warning", "info")
     */
    const showToast = useCallback((title, description, status) => {
        toast({
            title,
            description,
            status,
            duration: 3000,    // Toast will auto-close after 3 seconds
            isClosable: true,  // Allows user to manually close the toast
        });
    }, [toast]); // Dependency array ensures stability

    // Return the function so components can use it
    return showToast;
};

export default useShowToast;
