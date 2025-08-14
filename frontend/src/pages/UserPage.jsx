import { useEffect, useState } from "react"; // React hooks for side-effects and local state
import UserHeader from "../components/UserHeader"; // Component to display user profile header info
import { useParams } from "react-router-dom"; // Hook to extract dynamic URL parameters
import useShowToast from "../hooks/useShowToast"; // Custom hook for showing toast notifications
import { Flex, Spinner } from "@chakra-ui/react"; // Chakra UI components for layout and loading indicators
import Post from "../components/Post"; // Component for displaying individual posts
import useGetUserProfile from "../hooks/useGetUserProfile"; // Custom hook to fetch user profile data
import { useRecoilState } from "recoil"; // Hook for reading and updating Recoil state
import postsAtom from "../atoms/postsAtom"; // Global state atom for storing posts

// -----------------------------
// UserPage Component
// -----------------------------
const UserPage = () => {
  /**
   * user       → user profile object fetched from API (via custom hook)
   * loading    → boolean, true while user profile is being fetched
   */
  const { user, loading } = useGetUserProfile();

  // Extract "username" from the current URL path (e.g., /user/john → username = "john")
  const { username } = useParams();

  // Function to show toast notifications for success/error messages
  const showToast = useShowToast();

  /**
   * posts          → global state array storing user's posts
   * setPosts       → function to update the posts state
   */
  const [posts, setPosts] = useRecoilState(postsAtom);

  // Local state to track if we are currently fetching posts
  const [fetchingPosts, setFetchingPosts] = useState(true);

  /**
   * Side-effect: Fetch all posts of the user once the `user` data is available
   * Runs whenever: `user`, `username`, `showToast`, or `setPosts` changes
   */
  useEffect(() => {
    const getPosts = async () => {
      // If no user is loaded yet, skip fetching
      if (!user) return;

      // Show loading spinner for posts
      setFetchingPosts(true);

      try {
        // API call to fetch posts by username
        const res = await fetch(`/api/posts/user/${username}`);
        const data = await res.json();

        // Log data for debugging
        console.log(data);

        // Save posts into global state
        setPosts(data);
      } catch (error) {
        // Show error toast if API call fails
        showToast("Error", error.message, "error");

        // Reset posts to an empty array to avoid stale data
        setPosts([]);
      } finally {
        // Stop loading spinner regardless of success or failure
        setFetchingPosts(false);
      }
    };

    // Only trigger fetching if the user data is available
    if (user) {
      getPosts();
    }
  }, [user, username, showToast, setPosts]);

  // -----------------------------
  // Conditional UI Rendering
  // -----------------------------

  // Case 1: Still fetching user profile → show loading spinner
  if (!user && loading) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  // Case 2: User profile not found after loading → show error message
  if (!user && !loading) {
    return <h1>User Not Found</h1>;
  }

  // -----------------------------
  // Main UI Rendering
  // -----------------------------
  return (
    <>
      {/* Top section: User profile info */}
      <UserHeader user={user} />

      {/* Case: No posts to display */}
      {!fetchingPosts && posts.length === 0 && <h1>User has not posts.</h1>}

      {/* Case: Posts are still being fetched */}
      {fetchingPosts && (
        <Flex justifyContent={"center"} my={12}>
          <Spinner size={"xl"} />
        </Flex>
      )}

      {/* Case: Posts are available → Render each post */}
      {Array.isArray(posts) &&
        posts.map((post) => (
          <Post
            key={post._id}        // Unique key for list rendering
            post={post}           // Post data object
            postedBy={post.postedBy} // User who posted it
          />
        ))}
    </>
  );
};

export default UserPage;
