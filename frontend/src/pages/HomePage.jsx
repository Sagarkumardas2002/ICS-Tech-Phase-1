import { Box, Flex, Spinner } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import useShowToast from "../hooks/useShowToast";
import Post from "../components/Post";
import { useRecoilState } from "recoil";
import postsAtom from "../atoms/postsAtom";
import SuggestedUserss from "../components/SuggestedUserss";


// Post → component for displaying a single post.
// useRecoilState → read & update a Recoil atom.
// postsAtom → global state storing posts list.
// SuggestedUserss → component showing user suggestions.

const HomePage = () => {
  const showToast = useShowToast();
  const [posts, setPosts] = useRecoilState(postsAtom);
  const [loading, setLoading] = useState(true);



// Runs on first render (and when showToast or setPosts changes).
// Fetches /api/posts/feed.
// If there’s an error → show toast.
// If success → save posts to Recoil state.
// Always stop loading at the end.

  useEffect(() => {
    const getFeedPosts = async () => {
      setLoading(true);
      setPosts([]);
      try {
        const res = await fetch("/api/posts/feed");
        const data = await res.json();

        if (data.error) {
          showToast("Error", data.error, "error");
          return;
        }
        // console.log(data);
        setPosts(data);
      } catch (error) {
        showToast("Error", error.message, "error");
      } finally {
        setLoading(false);
      }
    };
    getFeedPosts();
  }, [showToast, setPosts]);

  return (
    <Flex gap={10} alignItems={"flex-start"}>
      <Box flex={75}>
        {!loading && posts.length === 0 && (
          <h1>Follow Some Users to see the Posts</h1>
        )}


{/* If loading → show big spinner in center.
If posts is an array → render each post using <Post> component. */}

        {loading && (
          <Flex justify={"center"}>
            <Spinner size={"xl"} />
          </Flex>
        )}
        {Array.isArray(posts) &&
          posts.map((post) => (
            <Post key={post._id} post={post} postedBy={post.postedBy} />
          ))}
      </Box>
      <Box flex={25} display={{ base: "none", md: "block" }}>
        <SuggestedUserss />
      </Box>
    </Flex>
  );
};

export default HomePage;
