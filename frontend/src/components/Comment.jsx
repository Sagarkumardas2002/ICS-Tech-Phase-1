import { Avatar, Divider, Flex, Text } from "@chakra-ui/react";

// Component to display a single comment/reply
const Comment = ({ reply, lastReply }) => {
  return (
    <>
      {/* Main container for comment with spacing */}
      <Flex gap={4} py={2} w={"full"}>
        {/* Avatar showing user's profile picture */}
        <Avatar src={reply.userProfilePic} size={"sm"} />

        {/* Comment content container */}
        <Flex gap={1} w={"full"} flexDirection={"column"}>
          {/* Username and possible future actions aligned in a row */}
          <Flex
            w={"full"}
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            {/* Display username in bold small text */}
            <Text fontSize="sm" fontWeight="bold">
              {reply.username}
            </Text>
          </Flex>

          {/* Display the actual comment text */}
          <Text>{reply.text}</Text>
        </Flex>
      </Flex>

      {/* Divider to separate replies unless it's the last one */}
      {!lastReply ? <Divider /> : null}

      {/* Empty Text for slight spacing (optional) */}
      <Text> </Text>
    </>
  );
};

export default Comment;
