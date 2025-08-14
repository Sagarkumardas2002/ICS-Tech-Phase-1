// UI components from Chakra UI
import {
  Avatar,
  Box,
  Button,
  Divider,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";

// Custom components & hooks
import Actions from "../components/Actions"; // Buttons for like, comment, etc.
import useGetUserProfile from "../hooks/useGetUserProfile"; // Fetches the current viewed user's profile
import { useEffect } from "react";
import useShowToast from "../hooks/useShowToast"; // For showing toast notifications
import { useNavigate, useParams } from "react-router-dom"; // For reading URL params & navigation
import { formatDistanceToNow } from "date-fns"; // Formats date like "5 minutes ago"
import { useRecoilState, useRecoilValue } from "recoil"; // State management hooks from Recoil
import userAtom from "../atoms/userAtom"; // Current logged-in user data
import { DeleteIcon } from "@chakra-ui/icons";
import Comment from "../components/Comment"; // Comment component
import postsAtom from "../atoms/postsAtom"; // Global posts state

const PostPage = () => {
  // Hook to get user profile & loading state
  const { user, loading } = useGetUserProfile();

  // Global posts state & updater
  const [posts, setPosts] = useRecoilState(postsAtom);

  // Toast notification function
  const showToast = useShowToast();

  // Read post ID (pid) from the URL → e.g., /post/123
  const { pid } = useParams();

  // Logged-in user info
  const currentUser = useRecoilValue(userAtom);

  // Hook for navigation after deleting a post
  const navigate = useNavigate();

  // Get the first post from postsAtom (the one we're viewing)
  const currentPost = posts[0];

  // Fetch the post data when the page loads or when pid changes
  useEffect(() => {
    const getPost = async () => {
      try {
        const res = await fetch(`/api/posts/${pid}`);
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }

        // Store the fetched post in Recoil state
        setPosts([data]);
        console.log(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      }
    };

    getPost();
  }, [showToast, pid, setPosts]);

  // Function to handle post deletion
  const handleDeletePost = async () => {
    try {
      if (!window.confirm("Are you sure you want to delete this post?")) return;

      const res = await fetch(`/api/posts/${currentPost._id}`, {
        method: "DELETE",
      });
      const data = await res.json();

      if (data.error) {
        showToast("Error", data.message, "error");
        return;
      }

      showToast("Success", "Post Deleted Successfully 😁", "success");

      // Redirect to the user's profile page after deleting
      navigate(`/${user.username}`);
    } catch (error) {
      showToast("Error", error.message, "error");
    }
  };

  // Show a spinner while loading the user profile
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  // If there's no post found, don't render anything
  if (!currentPost) return null;

  return (
  <>
    {/* ==================== POST HEADER ==================== */}
    <Flex>
      {/* Left side: User avatar + username + verified badge */}
      <Flex w={"full"} alignItems={"center"} gap={3}>
        {/* Avatar: shows user's profile picture */}
        <Avatar src={user.profilePic} size={"md"} name={user.username} />
        
        {/* Username + verified checkmark */}
        <Flex>
          {/* Username text */}
          <Text fontSize={"sm"} fontWeight={"bold"}>
            {user.username}
          </Text>
          {/* Small verified badge image */}
          <Image src="/verified.png" w="4" h={4} ml={4} />
        </Flex>
      </Flex>

      {/* Right side: Post timestamp + Delete icon */}
      <Flex gap={4} alignItems={"center"}>
        {/* Time since post creation (e.g. '5 minutes ago') */}
        <Text fontSize={"xs"} w={36} textAlign={"right"} color={"gray.light"}>
          {formatDistanceToNow(new Date(currentPost.createdAt))} ago
        </Text>

        {/* Delete icon appears only if current user is the owner of the post */}
        {currentUser?._id === user._id && (
          <DeleteIcon
            size={20}
            cursor={"pointer"}
            onClick={handleDeletePost} // Deletes the post
          />
        )}
      </Flex>
    </Flex>

    {/* ==================== POST TEXT CONTENT ==================== */}
    <Text my={3}>
      {currentPost.text} {/* Main post text */}
    </Text>

    {/* ==================== POST IMAGE ==================== */}
    {currentPost.img && ( // Only show if image exists
      <Box
        borderRadius={6}
        overflow={"hidden"} // Prevents image from overflowing
        border={"1px solid"}
        borderColor={"gray.light"}
      >
        <Image src={currentPost.img} w={"full"} /> {/* Post image */}
      </Box>
    )}

    {/* ==================== POST ACTION BUTTONS ==================== */}
    <Flex gap={3} my={3}>
      {/* Custom Actions component → Like, Comment, Share, etc. */}
      <Actions post={currentPost} />
    </Flex>

    <Divider my={3} /> {/* Horizontal line separator */}

    {/* ==================== CALL-TO-ACTION ==================== */}
    <Flex justifyContent={"space-between"}>
      {/* Left side: Emoji + message */}
      <Flex gap={2} alignItems={"center"}>
        <Text fontSize={"2xl"}>👏</Text>
        <Text color={"gray.light"}>
          Get the app to like, reply and post.
        </Text>
      </Flex>
      {/* Right side: "Get" button */}
      <Button>Get</Button>
    </Flex>

    <Divider my={4} />

    {/* ==================== COMMENTS SECTION ==================== */}
    {currentPost.replies.map((reply) => (
      <Comment
        key={reply._id} // Unique ID for React list rendering
        reply={reply} // Passing reply data to Comment component
        lastReply={
          reply._id ===
          currentPost.replies[currentPost.replies.length - 1]._id
        } // Marks the last reply for styling
      />
    ))}
  </>
);
export default PostPage;
