import {
  Avatar,
  AvatarBadge,
  Box,
  Flex,
  Image,
  Stack,
  Text,
  WrapItem,
  useColorMode,
} from "@chakra-ui/react";
import { useRecoilState, useRecoilValue } from "recoil";
import userAtom from "../atoms/userAtom";
import { BsCheck2All, BsFillImageFill } from "react-icons/bs";
import { selectedConversationAtom } from "../atoms/messagesAtom";

/**
 * Conversation Component
 * ----------------------
 * Displays a single conversation item inside the conversation list.
 * Shows:
 *  - User avatar (with online status badge)
 *  - Username (with verified badge if applicable)
 *  - Last message preview (with seen status icon)
 *  - Highlights the selected conversation
 * Clicking sets this conversation as "selected".
 */
const Conversation = ({ conversation, isOnline }) => {
  // Theme mode (light/dark) from Chakra UI
  const { colorMode } = useColorMode();

  // Current logged-in user data
  const currentUser = useRecoilValue(userAtom);

  // State for currently selected conversation (from global state)
  const [selectedConversation, setSelectedConversation] = useRecoilState(
    selectedConversationAtom
  );

  // Guard: If conversation data is invalid, don't render
  if (
    !conversation ||
    !conversation.participants ||
    conversation.participants.length === 0
  ) {
    return null;
  }

  // Assuming first participant is the other user in the chat
  const user = conversation.participants[0];
  const lastMessage = conversation.lastMessage;

  // Guard: If no user is found, skip rendering
  if (!user) {
    return null;
  }

  return (
    <Flex
      gap={4}
      alignItems={"center"}
      p={"1"}
      _hover={{
        cursor: "pointer",
        color: "white",
        bg: "gray.400", // hover background
      }}
      // When clicked, store this conversation in global state as the active one
      onClick={() =>
        setSelectedConversation({
          _id: conversation._id,
          userId: user._id,
          userProfilePic: user.profilePic,
          username: user.username,
          mock: conversation.mock,
        })
      }
      // Highlight the conversation if it is currently selected
      bg={
        selectedConversation?._id === conversation._id
          ? colorMode === "light"
            ? "gray.600"
            : "gray.600"
          : ""
      }
      color={
        selectedConversation?._id === conversation._id
          ? colorMode === "light"
            ? "gray.100"
            : "gray.100"
          : ""
      }
      borderRadius={"md"} // rounded edges
    >
      {/* User avatar with optional online badge */}
      <WrapItem>
        <Avatar
          size={{
            base: "xs",
            sm: "sm",
            md: "md",
          }}
          src={user.profilePic}
        >
          {isOnline ? <AvatarBadge boxSize="1em" bg="green.500" /> : ""}
        </Avatar>
      </WrapItem>

      {/* Stack for username + last message */}
      <Stack direction={"column"} fontSize={"sm"}>
        {/* Username + verified badge */}
        <Text fontWeight="700" display={"flex"} alignItems={"center"}>
          {user.username}
          <Image src="/verified.png" w={4} h={4} ml={1} />
        </Text>

        {/* Last message preview */}
        <Box fontSize={"xs"} display={"flex"} alignItems={"center"} gap={1}>
          {/* Seen status icon (only for messages sent by current user) */}
          {currentUser._id === lastMessage.sender ? (
            <Box color={lastMessage.seen ? "green.400" : ""}>
              <BsCheck2All size={16} />
            </Box>
          ) : (
            ""
          )}

          {/* Show message text or image icon if message has no text */}
          <Text fontSize={"xs"}>
            {lastMessage.text.length > 20
              ? lastMessage.text.substring(0, 24) + "..." // shorten long text
              : lastMessage.text || <BsFillImageFill size={18} />}
          </Text>
        </Box>
      </Stack>
    </Flex>
  );
};

export default Conversation;
