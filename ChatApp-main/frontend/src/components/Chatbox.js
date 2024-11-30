import { Box, Text } from "@chakra-ui/react";
import "./styles.css";
import SingleChat from "./SingleChat";
import { ChatState } from "../Context/ChatProvider";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
  const { selectedChat } = ChatState();

  return (
    <Box
      display={{ base: selectedChat ? "flex" : "none", md: "flex" }}
      alignItems="center"
      flexDir="column"
      p={2}
      bg="white"
      w={{ base: "100%", md: "100%" }}
      h="100%"
      borderRadius="lg"
      borderWidth="1px"
      shadow="lg"
      overflowY="hidden"
    >
      {selectedChat ? (
        <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
      ) : (
        <Box
          display="flex"
          alignItems="center"
          justifyContent="center"
          flexDir="column"
          h="100%"
          color="gray.500"
        >
          <Text fontSize="2xl" fontWeight="bold">
            No Chat Selected
          </Text>
          <Text fontSize="lg">Select a chat to start messaging</Text>
        </Box>
      )}
    </Box>
  );
};

export default Chatbox;
