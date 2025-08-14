import { useState } from "react"; // React hook for local state management
import useShowToast from './useShowToast'; // Custom hook for showing toast notifications

/**
 * Custom hook: usePreviewImg
 * Handles image file selection and generates a preview URL for it.
 */
const usePreviewImg = () => {
    // imgUrl → stores the preview image's Base64 data URL
    // setImgUrl → updates the imgUrl state
    const [imgUrl, setImgUrl] = useState(null);

    // Function to display toast notifications
    const showToast = useShowToast();

    /**
     * handleImageChange → Called when a user selects a file from an <input type="file" />
     * Validates file type and creates a preview if it's an image.
     */
    const handleImageChange = (e) => {
        // Get the first file from the file input
        const file = e.target.files[0];

        // Check if a file is selected and it is an image type
        if (file && file.type.startsWith("image/")) {
            // Create a new FileReader instance to read the file
            const reader = new FileReader();

            // When file reading is finished → update preview image URL
            reader.onloadend = () => {
                setImgUrl(reader.result); // reader.result contains Base64 encoded image
            };

            // Read the file as a Base64 data URL (usable for <img src="..." />)
            reader.readAsDataURL(file);
        } 
        else {
            // If invalid file type → show error toast and clear preview
            showToast("Invalid file type", "Please select an image file", "error");
            setImgUrl(null);
        }
    };

    /**
     * Returned values:
     * handleImageChange → function to handle file input change
     * imgUrl            → Base64 preview image URL
     * setImgUrl         → function to manually update or clear the preview
     */
    return { handleImageChange, imgUrl, setImgUrl };
};

export default usePreviewImg;
