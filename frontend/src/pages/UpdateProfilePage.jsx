import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  useColorModeValue,
  Avatar,
  Center,
} from "@chakra-ui/react"; // UI components from Chakra UI
import { useRef, useState } from "react"; // React hooks
import { useRecoilState } from "recoil"; // Hook to get/set global state in Recoil
import userAtom from "../atoms/userAtom"; // Recoil atom for storing user data
import usePreviewImg from "../hooks/usePreviewImg"; // Custom hook for previewing uploaded images
import useShowToast from "../hooks/useShowToast"; // Custom hook to display toast notifications

export default function UpdateProfilePage() {
  // Global state for logged-in user
  const [user, setUser] = useRecoilState(userAtom);

  // Local state for form inputs, initialized with current user values
  const [inputs, setInputs] = useState({
    name: user.name,
    username: user.username,
    email: user.email,
    bio: user.bio,
    password: "",
  });

  // Ref to access file input programmatically
  const fileRef = useRef(null);

  // State to track if the update process is running
  const [updating, seteUpdating] = useState(false);

  // Toast notification function
  const showToast = useShowToast();

  // Hook for handling image preview before upload
  const { handleImageChange, imgUrl } = usePreviewImg();

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    if (updating) return; // Avoid duplicate submissions
    seteUpdating(true); // Set loading state

    try {
      // Send PUT request to backend to update user profile
      const res = await fetch(`/api/users/update/${user._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        // Spread form inputs + profile picture into request body
        body: JSON.stringify({ ...inputs, profilePic: imgUrl }),
      });

      // Get updated user data from response
      const data = await res.json();

      // Show error toast if update failed
      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      // Show success toast and update Recoil + localStorage
      showToast("Success", "Profile Updated Successfully", "success");
      setUser(data); // Update global state
      localStorage.setItem("user-threads", JSON.stringify(data)); // Save to browser
    } catch (error) {
      // Handle unexpected errors
      showToast("Error", error, "error");
    } finally {
      // Always stop loading spinner
      seteUpdating(false);
    }
  };

  return (
    // Form wrapper
    <form onSubmit={handleSubmit}>
      <Flex align={"center"} justify={"center"}>
        <Stack
          spacing={4}
          w={"full"}
          maxW={"md"} // Limit max width
          bg={useColorModeValue("white", "gray.700")} // Light/dark mode support
          rounded={"xl"} // Rounded corners
          boxShadow={"lg"} // Shadow effect
          p={5} // Padding
        >
          {/* Page heading */}
          <Heading
            lineHeight={1.1}
            textAlign={"center"}
            fontSize={{ base: "2xl", sm: "2xl" }}
          >
            Edit Profile
          </Heading>

          {/* Avatar upload section */}
          <FormControl id="userName">
            <Stack direction={["column", "row"]} spacing={6}>
              <Center>
                {/* Show selected image preview or current profile picture */}
                <Avatar
                  size="xl"
                  boxShadow={"md"}
                  src={imgUrl || user.profilePic}
                />
              </Center>
              <Center w="full">
                {/* Button to open file picker */}
                <Button w="full" onClick={() => fileRef.current.click()}>
                  Change Avatar
                </Button>
                {/* Hidden file input */}
                <Input
                  type="file"
                  hidden
                  ref={fileRef}
                  onChange={handleImageChange} // Preview image on change
                />
              </Center>
            </Stack>
          </FormControl>

          {/* Full Name input */}
          <FormControl>
            <FormLabel>Full name</FormLabel>
            <Input
              placeholder="Fullname"
              value={inputs.name}
              onChange={(e) => setInputs({ ...inputs, name: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>

          {/* Username input */}
          <FormControl>
            <FormLabel>User name</FormLabel>
            <Input
              placeholder="johndoe"
              value={inputs.username}
              onChange={(e) =>
                setInputs({ ...inputs, username: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>

          {/* Email input */}
          <FormControl>
            <FormLabel>Email address</FormLabel>
            <Input
              placeholder="email@example.com"
              value={inputs.email}
              onChange={(e) => setInputs({ ...inputs, email: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="email"
            />
          </FormControl>

          {/* Bio input */}
          <FormControl>
            <FormLabel>Bio </FormLabel>
            <Input
              placeholder="Bio"
              value={inputs.bio}
              onChange={(e) => setInputs({ ...inputs, bio: e.target.value })}
              _placeholder={{ color: "gray.500" }}
              type="text"
            />
          </FormControl>

          {/* Password input */}
          <FormControl>
            <FormLabel>Password</FormLabel>
            <Input
              placeholder="password"
              value={inputs.password}
              onChange={(e) =>
                setInputs({ ...inputs, password: e.target.value })
              }
              _placeholder={{ color: "gray.500" }}
              type="password"
            />
          </FormControl>

          {/* Action buttons */}
          <Stack spacing={6} direction={["column", "row"]}>
            {/* Cancel button (currently just closes without action) */}
            <Button
              bg={"red.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "red.500",
              }}
            >
              Cancel
            </Button>
            {/* Submit button */}
            <Button
              bg={"green.400"}
              color={"white"}
              w="full"
              _hover={{
                bg: "green.500",
              }}
              type="submit"
              isLoading={updating} // Show loading spinner if updating
            >
              Submit
            </Button>
          </Stack>
        </Stack>
      </Flex>
    </form>
  );
}
