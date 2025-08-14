import { Button, Text } from "@chakra-ui/react"; // UI components from Chakra UI
import useShowToast from "../hooks/useShowToast"; // Custom hook to show toast notifications
import useLogout from "../hooks/useLogout"; // Custom hook to log out the user

const SettingPage = () => {
  // Initialize custom hooks
  const showToast = useShowToast();
  const logout = useLogout();

  // Function to handle account freezing
  const freezeAccount = async () => {
    // Ask for confirmation before freezing
    if (!window.confirm("Are you sure you want to freeze your account?")) {
      return; // If user cancels, stop the function
    }

    try {
      // Send a PUT request to the backend to freeze the account
      const res = await fetch("/api/users/freeze", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
      });

      // Convert the response into JSON
      const data = await res.json();

      // If there is an error from the backend, show it
      if (data.error) {
        return showToast("Error", data.error, "error");
      }

      // If the account is successfully frozen
      if (data.success) {
        await logout(); // Log the user out
        showToast("Success", "Your Account has been freezed", "success"); // Show success message
      }
    } catch (error) {
      // Log any unexpected error
      console.log("Error", error.message, "error");
    }
  };

  return (
    <>
      {/* Heading */}
      <Text my={2} fontSize={25} fontWeight={"bold"}>
        Freeze Your Account
      </Text>

      {/* Subtext */}
      <Text my={2}>
        You can unfreeze your account anytime by logging in 😁
      </Text>

      {/* Freeze Button */}
      <Button size={"md"} my={2} colorScheme={"red"} onClick={freezeAccount}>
        Freeze
      </Button>
    </>
  );
};

export default SettingPage;
