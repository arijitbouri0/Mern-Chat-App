import { useInfiniteScrollTop } from '6pp';
import Picker from '@emoji-mart/react';
import { ArrowBack as ArrowBackIcon, AttachFile as AttachFileIcon, Close as CloseIcon, Send as SendIcon } from '@mui/icons-material';
import { Avatar, AvatarGroup, Box, IconButton, Stack, Typography } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from 'react-router-dom';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layout/AppLayout';
import { TypingLoader } from '../components/layout/Loaders';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents';
import { orange } from '../constants/color';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, TYPING_START, TYPING_STOP } from '../constants/event';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../Redux/api/api';
import { removeMessagesAlert } from '../Redux/reducers/chat';
import { setShowEmojiPicker, toggleFileMenu } from '../Redux/reducers/misc';
import { getSocket } from '../utils/Socket';
import UserDetailsDialog from '../components/dialogs/UserDetailsDialog';
import GroupDetailsDialog from '../components/dialogs/GroupDetails';

const Chat = ({ chatId, onlineUser }) => {
  const bottomRef = useRef(null)
  const { user } = useSelector((state) => state.auth);
  const { showEmojiPicker } = useSelector((state) => state.misc)
  const containerRef = useRef(null)
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [page, setPage] = useState(1)
  const [fileMenuAnchor, setFileMenuIcon] = useState(null)
  const [IamTyping, setIamTyping] = useState(false)
  const [userTyping, setUserTyping] = useState(false)
  const typingTimeout = useRef(null)
  const dispatch = useDispatch()
  const socket = getSocket();
  const chatDetails = useChatDetailsQuery({ chatId, skip: !chatId });
  const navigate = useNavigate();
  const oldMessagesChunk = useGetMessagesQuery({ chatId, page })
  const { data: oldMessages, setData: setOldMessages } = useInfiniteScrollTop(
    containerRef,
    oldMessagesChunk?.data?.totalPages,
    page,
    setPage,
    oldMessagesChunk?.data?.message
  )

  const errors = [
    { isError: chatDetails.isError, error: chatDetails.error },
    { isError: oldMessagesChunk.isError, error: oldMessagesChunk.error }
  ];

  const members = chatDetails?.data?.chat?.members
  const memberIds = members?.map(member => member._id);

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, memberIds, message });
    setMessage("");
  }

  const newMessageHandler = useCallback((data) => {
    if (data.chatId !== chatId) return;

    setMessages((prev) => [...prev, data.message])
  }, [chatId])

  const startTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(true)
  }, [chatId])

  const stopTypingListener = useCallback((data) => {
    if (data.chatId !== chatId) return;
    setUserTyping(false)
  }, [chatId])


  const alertListener = useCallback((content) => {
    const messageForAlert = {
      content,
      sender: {
        _id: "bdahjjdsaa",
        name: "Admin"
      },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, messageForAlert])
  }, [chatId])

  useEffect(() => {
    if (chatDetails?.data?.chat?.members && user?._id) {
      const members = chatDetails.data.chat.members;
      socket.emit(CHAT_JOINED, { userId: user._id, memberIds });
    }
    dispatch(removeMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage([]);
      setOldMessages([]);
      setPage(1);
      if (chatDetails?.data?.chat?.members) {
        const members = chatDetails.data.chat.members;
        socket.emit(CHAT_LEAVED, { userId: user._id, memberIds });
      }
    };
  }, [chatId, chatDetails.data, dispatch, socket, user._id])

  useEffect(() => {
    if (bottomRef.current) bottomRef.current.scrollIntoView({ behaviour: "smooth" })
  }, [messages])

  useEffect(() => {
    if (chatDetails.isError) return navigate("/")
  }, [chatDetails.isError])

  const eventHandler = {
    [NEW_MESSAGE]: newMessageHandler,
    [TYPING_START]: startTypingListener,
    [TYPING_STOP]: stopTypingListener,
    [ALERT]: alertListener,
  };

  useSocketEvents(socket, eventHandler)

  useErrors(errors)

  const allMessages = [...oldMessages, ...messages]

  const messageOnChange = (e) => {
    setMessage(e.target.value);
    if (!IamTyping) {
      socket.emit(TYPING_START, { memberIds, chatId })
      setIamTyping(true)
    }

    if (typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current = setTimeout(() => {
      socket.emit(TYPING_STOP, { memberIds, chatId })
      setIamTyping(false)
    }, [2000])
  }

  const handleCloseEmojiPicker = (event) => {
    dispatch(setShowEmojiPicker(false))
  }

  const handlePickerClick = (event) => {
    event.stopPropagation(); // Prevent the click from propagating to the parent container
  };

  let isOnline
  if (memberIds && onlineUser) {
    const onlineUserSet = new Set(onlineUser);
    const intersection = memberIds.filter(id => onlineUserSet.has(id));
    isOnline = intersection.length > 1;
  }



  const filteredMembers = chatDetails?.data?.chat?.members?.filter(member => member._id !== user._id);
  const fileMenu = (e) => {
    dispatch(toggleFileMenu(true))
    setFileMenuIcon(e.currentTarget)
  }

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [openGroupDetailsDialog, setOpenGroupDetailsDialog] = useState(false);

  const handleNameClick = (memberOrChat) => {
    if (filteredMembers && filteredMembers.length === 1) {
      setSelectedUser(memberOrChat);
      setDialogOpen(true);
    } else {
      setSelectedGroup({ name: memberOrChat?.name || "Group Name", description: "Group Description", members: filteredMembers });
      setOpenGroupDetailsDialog(true);
    }
  };

  return (
    <Box sx={{
      display: "flex",
      flexDirection: "column",
      height: 'calc(100vh - 50px)',
    }}>
      <Stack
        direction="row"
        boxSizing="border-box"
        padding="1rem"
        sx={{
          bgcolor: "#333",
          alignItems: "center",
          gap: 2,
          boxShadow: "0px 2px 5px rgba(0,0,0,0.1)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        {/* Back Button */}
        <IconButton
          component={NavLink}
          to="/"
          sx={{
            color: "primary.main",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          <ArrowBackIcon />
        </IconButton>

        {/* User Avatar */}
        {filteredMembers?.length === 1 ? (
          // Single Avatar
          <Avatar
            src={filteredMembers[0]?.avatar?.url || "/default-avatar.png"}
            alt={filteredMembers[0]?.name}
            sx={{
              width: { xs: 60, sm: 80 },
              height: { xs: 60, sm: 80 },
              border: "2px solid",
              borderColor: "primary.main",
            }}
          />
        ) : (
          // Group of Avatars
          <AvatarGroup max={3}>
            {filteredMembers?.slice(0, 3).map((member, index) => (
              <Avatar
                key={index}
                src={member.avatar?.url || "/default-avatar.png"}
                alt={member.name}
                sx={{
                  width: { xs: 40, sm: 50 },
                  height: { xs: 40, sm: 50 },
                  border: "1px solid",
                  borderColor: "primary.main",
                }}
              />
            ))}
          </AvatarGroup>
        )}

        {/* User Info */}
        <Box>
          <Typography
            variant="h6"
            sx={{
              fontWeight: "bold",
              color: "white",
              lineHeight: 1.2,
              cursor: 'pointer', // Add a cursor pointer to indicate it's clickable
            }}
            onClick={() => handleNameClick(filteredMembers?.length > 2 ? chatDetails?.data?.chat : filteredMembers[0])}
          // Pass the selected user or chat details
          >
            {chatDetails?.data?.chat?.name ||
              (filteredMembers?.length > 0 ? filteredMembers[0]?.name : "Anonymous User")}
          </Typography>

          <Typography
            variant="subtitle2"
            sx={{
              color: isOnline ? "success.main" : "error.main",
              fontWeight: "medium",
              display: "flex",
              alignItems: "center",
              gap: 0.5,
            }}
          >
            {isOnline ? "🟢 Online" : "🔴 Offline"}
          </Typography>
        </Box>
      </Stack>


      <Stack
        onClick={handlePickerClick}
        position={'relative'}
        ref={containerRef}
        boxSizing={'border-box'}
        padding={'1rem'}
        spacing={'1rem'}
        bgcolor={'black'}
        height={'80%'}
        sx={{
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader />}

        <div ref={bottomRef} />
      </Stack>
      <form
        style={{
          height: '10%',
          backgroundColor: '#28282B',
        }}
        onSubmit={sendMessage}
      >

        <Stack direction={'row'} height={'100%'}
          padding={'1rem'} alignItems={'center'} position={'relative'}>
          <IconButton
            sx={{
              position: 'absolute',
              left: '1.5rem',
              rotate: '30deg',
              color: 'white'
            }}
            onClick={fileMenu}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox padding='1rem' placeholder='Type Message Here ...' value={message} onChange={messageOnChange} />
          <IconButton type='submit'
            sx={{
              rotate: '-30deg',
              backgroundColor: orange,
              color: 'white',
              marginLeft: '1rem',
              padding: '0.5rem',
              "&:hover": {
                bgcolor: 'error.dark'
              },
            }}
          >
            <SendIcon />
          </IconButton>
        </Stack>
      </form>
      <FileMenu anchorEl={fileMenuAnchor} chatId={chatId} />
      {showEmojiPicker && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1000,
            backgroundColor: "#fff",
            borderRadius: "8px",
            boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
          }}
        // inert={true} // Disable interaction with hidden elements
        >
          <div style={{ textAlign: "right", marginBottom: "10px" }}>
            <IconButton
              onClick={handleCloseEmojiPicker}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <Picker
            onEmojiClick={(emoji) => {
              handleCloseEmojiPicker
              setMessage((prev) => `${prev}${emoji.native}`);
              // Close picker
            }}
          />
        </div>
      )}
      <UserDetailsDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        user={selectedUser}
      />
      <GroupDetailsDialog
        open={openGroupDetailsDialog}
        onClose={() => setOpenGroupDetailsDialog(false)}
        group={selectedGroup}
      />
    </Box>

  )
}

export default AppLayout()(Chat);


