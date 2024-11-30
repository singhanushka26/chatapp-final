import { AddIcon } from "@chakra-ui/icons";
import { Box, Stack, Text } from "@chakra-ui/layout";
import { IconButton, Button, useDisclosure } from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { ChatState } from "../Context/ChatProvider";
import { getSender } from "../config/ChatLogics";
import { useToast } from "@chakra-ui/toast";
import {
  FiMessageSquare,
  FiUserPlus,
  FiUsers,
  FiSettings,
  FiLogOut,
  FiUser,
} from "react-icons/fi";
import axios from "axios";
import GroupChatModal from "./miscellaneous/GroupChatModal";

const MyChats = ({ fetchAgain }) => {
  const [activeTab, setActiveTab] = useState("chats"); // Tracks the active tab
  const [loggedUser, setLoggedUser] = useState();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
  const toast = useToast();

  const fetchChats = async () => {
    try {
      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get("/api/chat", config);
      setChats(data);
    } catch (error) {
      toast({
        title: "Error Occurred!",
        description: "Failed to load the chats.",
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  };

  useEffect(() => {
    setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
    fetchChats();
  }, [fetchAgain]);

  const renderContent = () => {

    
    if (activeTab === "chats") {
      return (
        <Box>
        <Text fontSize="xl" fontWeight="bold" p={3} borderBottom="1px solid #E8E8E8">
        Messages
      </Text>
      
        <Stack overflowY="scroll" spacing={3} px={3} py={5}>
          {chats && chats.length > 0 ? (
            chats.map((chat) => (
              <Box
                onClick={() => setSelectedChat(chat)}
                cursor="pointer"
                bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                color={selectedChat === chat ? "white" : "black"}
                px={3}
                py={2}
                borderRadius="lg"
                display="flex"
                alignItems="center"
                gap={3}
                key={chat._id}
              >
                {/* Display Icon based on Chat Type */}
                {chat.isGroupChat ? (
                  <FiUsers fontSize="20px" />
                ) : (
                  <FiUser fontSize="20px" />
                )}
                {/* Chat Name */}
                <Text flex="1">
                  {!chat.isGroupChat
                    ? getSender(loggedUser, chat.users)
                    : chat.chatName}
                </Text>
                {/* Latest Message */}
                {chat.latestMessage && (
                  <Text fontSize="xs" color="gray.500">
                    <b>{chat.latestMessage.sender.name}: </b>
                    {chat.latestMessage.content.length > 50
                      ? chat.latestMessage.content.substring(0, 51) + "..."
                      : chat.latestMessage.content}
                  </Text>
                )}
              </Box>
            ))
          ) : (
            <Text align="center" color="gray.500">
              No chats available.
            </Text>
          )}
        </Stack>
        </Box>
      );
    } else if (activeTab === "newChat") {
      return (
        <Text align="center" fontSize="lg" color="gray.500">
          Add a new private chat (functionality to be implemented).
        </Text>
      );
    } else if (activeTab === "newGroup") {
      // Filter the chats to only show group chats
      const groupChats = chats.filter(chat => chat.isGroupChat);

      return (
        <Box px={3} py={5} w="100%">
          <Text fontSize="xl" mb={3} fontWeight="bold">
            Group Chats
          </Text>
          {groupChats.length > 0 ? (
            <Stack spacing={3}>
              {groupChats.map((chat) => (
                <Box
                  onClick={() => setSelectedChat(chat)}
                  cursor="pointer"
                  bg={selectedChat === chat ? "#38B2AC" : "#E8E8E8"}
                  color={selectedChat === chat ? "white" : "black"}
                  px={3}
                  py={2}
                  borderRadius="lg"
                  display="flex"
                  alignItems="center"
                  gap={3}
                  key={chat._id}
                >
                  <FiUsers fontSize="20px" />
                  <Text flex="1">{chat.chatName}</Text>
                  {chat.latestMessage && (
                    <Text fontSize="xs" color="gray.500">
                      <b>{chat.latestMessage.sender.name}: </b>
                      {chat.latestMessage.content.length > 50
                        ? chat.latestMessage.content.substring(0, 51) + "..."
                        : chat.latestMessage.content}
                    </Text>
                  )}
                </Box>
              ))}
            </Stack>
          ) : (
            <Text color="gray.500">No group chats available.</Text>
          )}
          {/* Option to create new group chat */}
          <GroupChatModal>
            <Button colorScheme="teal" width="100%" mt = {2}>
              New Group
            </Button>
          </GroupChatModal>
        </Box>
      );
    }
  };

  
  return (
    <Box display="flex" h="90vh" w="30%" bg="#F8F8F8">
      {/* Sidebar */}
      <Box
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="space-between"
        bg="white"
        h="100%"
        w="60px" // Adjusted width
        py={3}
        borderRight="0px solid #E8E8E8"
      >
        {/* Top Buttons */}
        <Stack spacing={3}>
          <IconButton
            icon={<FiMessageSquare />}
            aria-label="Chats"
            fontSize="20px"
            variant="ghost"
            bg={activeTab === "chats" ? "#E8E8E8" : "transparent"}
            _hover={{ bg: "#E8E8E8" }}
            isRound
            onClick={() => setActiveTab("chats")}
          />
          <IconButton
            icon={<FiUserPlus />}
            aria-label="New Chat"
            fontSize="20px"
            variant="ghost"
            bg={activeTab === "newChat" ? "#E8E8E8" : "transparent"}
            _hover={{ bg: "#E8E8E8" }}
            isRound
            onClick={() => setActiveTab("newChat")}
          />
          <IconButton
            icon={<FiUsers />}
            aria-label="New Group"
            fontSize="20px"
            variant="ghost"
            bg={activeTab === "newGroup" ? "#E8E8E8" : "transparent"}
            _hover={{ bg: "#E8E8E8" }}
            isRound
            onClick={() => setActiveTab("newGroup")}
          />
        </Stack>

        {/* Bottom Buttons */}
        <Stack spacing={3}>
          <IconButton
            icon={<FiSettings />}
            aria-label="Settings"
            fontSize="20px"
            variant="ghost"
            _hover={{ bg: "#E8E8E8" }}
            isRound
            onClick={() =>
              toast({
                title: "Settings",
                description: "Settings clicked!",
                status: "info",
              })
            }
          />
          <IconButton
            icon={<FiLogOut />}
            aria-label="Logout"
            fontSize="20px"
            variant="ghost"
            _hover={{ bg: "#E8E8E8" }}
            isRound
            onClick={() => {
              localStorage.removeItem("userInfo");
              window.location.reload();
            }}
          />
        </Stack>
      </Box>

      {/* Main Content */}
      <Box
        flex="1"
        display="flex"
        flexDir="column"
        alignItems="center"
        justifyContent="center"
        p={0}
      >
        <Box
          display="flex"
          flexDir="column"
          bg="white"
          w="100%"
          h="100%"
          borderRadius="lg"
          borderWidth="1px"
          overflowY="hidden"
        >
          {renderContent()}
        </Box>
      </Box>
    </Box>
  );
};

export default MyChats;
