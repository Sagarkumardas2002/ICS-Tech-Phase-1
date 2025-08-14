import { AddIcon } from "@chakra-ui/icons";
import {
  Button,
  CloseButton,
  Flex,
  FormControl,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useColorModeValue,
  useDisclosure,
} from "@chakra-ui/react";
import { useRef, useState } from "react";
import usePreviewImg from "../hooks/usePreviewImg";
import { BsFillImageFill } from "react-icons/bs";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import useShowToast from "../hooks/useShowToast";
import postsAtom from "../atoms/postsAtom";
import { useParams } from "react-router-dom";

const MAX_CHAR = 500; // Character limit for post text

/**
 * CreatePost Component
 * --------------------
 * Floating "Post" button that opens a modal for creating a new post.
 * Features:
 *  - Text area with character limit
 *  - Optional image upload & preview
 *  - Form submission to backend
 *  - Shows success/error toasts
 *  - Updates posts in state if the user is on their own profile
 */
const CreatePost = () => {
  // Chakra UI modal control
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Local state for post content
  const [postText, setPostText] = useState("");

  // Custom hook for image preview handling
  const { handleImageChange, imgUrl, setImgUrl } = usePreviewImg();

  // Ref for hidden file input (to trigger click via icon)
  const imageRef = useRef(null);

  // Remaining characters counter
  const [remainingChar, setRemainingChar] = useState(MAX_CHAR);

  // Current logged-in user from global state
  const user = useRecoilValue(userAtom);

  // Toast notification hook
  const showToast = useShowToast();

  // Loading state during post submission
  const [loading, setLoading] = useState(false);

  // Global posts state (for updating feed without page reload)
  const [posts, setPosts] = useRecoilState(postsAtom);

  // Get username from URL params (to check if user is on their own profile)
  const { username } = useParams();

  /**
   * Handles typing in the textarea
   * - Limits text to MAX_CHAR characters
   * - Updates remaining character count
   */
  const handleTextChange = (e) => {
    const inputText = e.target.value;

    if (inputText.length > MAX_CHAR) {
      const truncatedText = inputText.slice(0, MAX_CHAR);
      setPostText(truncatedText);
      setRemainingChar(0);
    } else {
      setPostText(inputText);
      setRemainingChar(MAX_CHAR - inputText.length);
    }
  };

  /**
   * Sends the new post to the backend
   * - Uses fetch to POST data
   * - Shows toast for success/error
   * - Updates posts list if on own profile
   * - Resets form after success
   */
  const handleCreatePost = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/posts/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postedBy: user._id,
          text: postText,
          img: imgUrl,
        }),
      });

      const data = await res.json();

      if (data.error) {
        showToast("Error", data.error, "error");
        return;
      }

      showToast("Success", "Post created successfully", "success");

      // If user is on their own profile, add new post to the top of feed
      if (username === user.username) {
        setPosts([data, ...posts]);
      }

      // Reset form
      onClose();
      setPostText("");
      setImgUrl("");
    } catch (error) {
      showToast("Error", error, "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating "Post" button in bottom-right corner */}
      <Button
        position={"fixed"}
        bottom={10}
        right={10}
        leftIcon={<AddIcon />}
        bg={useColorModeValue("gray.400", "gray.light")}
        color={useColorModeValue("black", "white")}
        _hover={{
          bg: useColorModeValue("gray.500", "gray.600"),
          color: useColorModeValue("white", "black"),
        }}
        onClick={onOpen}
      >
        Post
      </Button>

      {/* Modal for creating post */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Create Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              {/* Post text input */}
              <Textarea
                placeholder="Post content goes here..."
                onChange={handleTextChange}
                value={postText}
              />
              {/* Character counter */}
              <Text
                fontSize="xs"
                fontWeight="bold"
                textAlign={"right"}
                m={"1"}
                color={"gray.800"}
              >
                {remainingChar}/{MAX_CHAR}
              </Text>

              {/* Hidden file input for image */}
              <Input
                type="file"
                hidden
                ref={imageRef}
                onChange={handleImageChange}
              />

              {/* Image upload icon */}
              <BsFillImageFill
                style={{ marginLeft: "5px", cursor: "pointer" }}
                size={16}
                onClick={() => imageRef.current.click()}
              />
            </FormControl>

            {/* Image preview section */}
            {imgUrl && (
              <Flex mt={5} w={"full"} position={"relative"}>
                <Image src={imgUrl} alt="Selected img" />
                {/* Button to remove image */}
                <CloseButton
                  onClick={() => {
                    setImgUrl("");
                  }}
                  bg={"gray.800"}
                  color={"white"}
                  position={"absolute"}
                  top={2}
                  right={2}
                />
              </Flex>
            )}
          </ModalBody>

          {/* Submit button */}
          <ModalFooter>
            <Button
              colorScheme="green"
              mr={3}
              onClick={handleCreatePost}
              isLoading={loading}
            >
              Post
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CreatePost;
