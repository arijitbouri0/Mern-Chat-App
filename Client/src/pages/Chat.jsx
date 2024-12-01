import { useInfiniteScrollTop } from '6pp';
import { AttachFile as AttachFileIcon, Send as SendIcon } from '@mui/icons-material';
import { IconButton, Stack } from '@mui/material';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import FileMenu from '../components/dialogs/FileMenu';
import AppLayout from '../components/layout/AppLayout';
import { TypingLoader } from '../components/layout/Loaders';
import MessageComponent from '../components/shared/MessageComponent';
import { InputBox } from '../components/styles/StyledComponents';
import { grayColor, orange } from '../constants/color';
import { ALERT, CHAT_JOINED, CHAT_LEAVED, NEW_MESSAGE, TYPING_START, TYPING_STOP } from '../constants/event';
import { useErrors, useSocketEvents } from '../hooks/hook';
import { useChatDetailsQuery, useGetMessagesQuery } from '../Redux/api/api';
import { removeMessagesAlert } from '../Redux/reducers/chat';
import { toggleFileMenu } from '../Redux/reducers/misc';
import { getSocket } from '../utils/Socket';

const Chat = ({ chatId }) => {
  const bottomRef = useRef(null)
  const { user } = useSelector((state) => state.auth);
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
  const navigate=useNavigate();

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

  

  const sendMessage = (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    socket.emit(NEW_MESSAGE, { chatId, members, message });
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

  const stopTypingListener=useCallback((data)=>{
    if (data.chatId !== chatId) return;
    setUserTyping(false)
  }, [chatId])


  const alertListener = useCallback((content) => {
    const messageForAlert = {
      content,
      sender: { 
        _id: "bdahjjdsaa",
        name:"Admin"
       },
      chat: chatId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev)=>[...prev,messageForAlert])
  }, [chatId])

  useEffect(() => {
    if (chatDetails?.data?.chat?.members  && user?._id) {
      const members = chatDetails.data.chat.members;
      socket.emit(CHAT_JOINED, { userId: user._id, members });
    }
     dispatch(removeMessagesAlert(chatId));
    return () => {
      setMessages([]);
      setMessage([]);
      setOldMessages([]);
      setPage(1);
      if (chatDetails?.data?.chat?.members ) {
        const members = chatDetails.data.chat.members;
        socket.emit(CHAT_LEAVED, { userId: user._id, members });
      }
    };
  }, [chatId, chatDetails.data, dispatch, socket, user._id])

  useEffect(()=>{
    if(bottomRef.current) bottomRef.current.scrollIntoView({behaviour:"smooth"})
  },[messages])

  useEffect(()=>{
    if(chatDetails.isError)return navigate("/")
  },[chatDetails.isError])

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
      socket.emit(TYPING_START, { members, chatId })
      setIamTyping(true)
    }

    if(typingTimeout.current) clearTimeout(typingTimeout.current);

    typingTimeout.current=setTimeout(()=>{
      socket.emit(TYPING_STOP,{members,chatId})
      setIamTyping(false)
    },[2000])
  }


  const fileMenu = (e) => {
    dispatch(toggleFileMenu(true))
    setFileMenuIcon(e.currentTarget)
  }
  return (
    <>
      <Stack
        ref={containerRef}
        boxSizing={'border-box'}
        padding={'1rem'}
        spacing={'1rem'}
        bgcolor={'white'}
        height={'90%'}
        sx={{
          overflowX: 'hidden',
          overflowY: 'auto'
        }}
      >
        {allMessages.map((i) => (
          <MessageComponent key={i._id} message={i} user={user} />
        ))}

        {userTyping && <TypingLoader/>}

        <div ref={bottomRef}/>
      </Stack>
      <form
        style={{
          height: '10%',
        }}
        onSubmit={sendMessage}
      >

        <Stack direction={'row'} height={'100%'}
          padding={'1rem'} alignItems={'center'} position={'relative'}>
          <IconButton
            sx={{
              position: 'absolute',
              left: '1.5rem',
              rotate: '30deg'
            }}
            onClick={fileMenu}
          >
            <AttachFileIcon />
          </IconButton>
          <InputBox placeholder='Type Message Here ...' value={message} onChange={messageOnChange} />
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
    </>

  )
}

export default AppLayout()(Chat);



