import { Drawer, Grid, Skeleton } from '@mui/material';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useMyChatsQuery } from '../../Redux/api/api';
import { incrementNotification, setMessagesAlert } from '../../Redux/reducers/chat';
import { setLeaveMenu, setSelectedDeleteChat, toggleMobileMenuFriend } from '../../Redux/reducers/misc';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USER, REFETCH_CHATS } from '../../constants/event';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { getOrSaveFromStorage } from '../../lib/features';
import { getSocket } from '../../utils/Socket';
import DeletChat from '../dialogs/DeletChat';
import Title from '../shared/Title';
import ChatList from '../specific/ChatList';
import Header from './Header';


const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams(); // Move useParams inside this inner function
    const chatId = params.chatId;
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);
    const socket = getSocket()

    const { isError, data, refetch, error, isLoading } = useMyChatsQuery();
    const { isMobileMenuFriend } = useSelector((state) => state.misc)
    const { newMessagesAlert } = useSelector((state) => state.chat)

    useErrors([{ isError, error }]);

    useEffect(() => {
      getOrSaveFromStorage({ key: NEW_MESSAGE_ALERT, value: newMessagesAlert })
    }, [newMessagesAlert])


    const handleDeleteChat = (event, _id, groupChat) => {
      event.preventDefault();
      setAnchorEl(event.currentTarget); // Set anchorEl to open the menu
      dispatch(setLeaveMenu(true));
      dispatch(setSelectedDeleteChat({ _id, groupChat }))
    };

    const handleCloseMenu = () => {
      setAnchorEl(null);
      dispatch(setLeaveMenu(false));
    };

    const handleClose = () => {
      dispatch(toggleMobileMenuFriend(false))
    };

    const newMessageAlertHandler = useCallback((data) => {
      if (data.chatId === chatId) return;
      dispatch(setMessagesAlert(data))
    }, [chatId])

    const newRequestListener = useCallback((data) => {
      dispatch(incrementNotification())
    }, [dispatch])

    const refetchListener = useCallback(() => {
      refetch()
      navigate("/")
    }, [refetch])

    const [onlineUsers, setOnlineUsers] = useState([]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, [dispatch])

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]: refetchListener,
      [ONLINE_USER]: onlineUsersListener,
    };

    useSocketEvents(socket, eventHandlers)


    return (
      <>
        <Title />
        <Header sx={{
          position: 'sticky',
          top: 0,
          zIndex: '1000',
        }} />
        <DeletChat anchorEl={anchorEl} onClose={handleCloseMenu} />
        {isLoading ?
          <Skeleton /> :
          <Drawer
            open={isMobileMenuFriend}
            onClose={handleClose}
            PaperProps={{
              sx: {
                backgroundColor: '#121212',
                borderColor: '#28282B',  // Add the border color
                borderWidth: '1px',
              }
            }}>
            <ChatList
              w="80vw"
              chats={data?.transformedChats}
              chatId={chatId}
              newMessagesAlert={newMessagesAlert}
              onlineUser={onlineUsers}
              handleDeleteChat={handleDeleteChat}
              handleClose={handleClose}
            />
          </Drawer>
        }
        <Grid container height={"calc(100vh-4rem)"} backgroundColor={'#121212'} overflow={'hidden'}>
          <Grid
            item
            lg={4}
            md={3}
            sm={2}
            xs={0}
            sx={{
              display: { xs: 'none', sm: 'none', md: 'block' },
              border: "1px solid #28282B",
            }
            }
            height={'100%'}
            overflow={'auto'}

          >
            {isLoading ?
              <Skeleton /> :
              <ChatList
                chats={data?.transformedChats}
                chatId={chatId}
                newMessagesAlert={newMessagesAlert}
                onlineUser={onlineUsers}
                handleDeleteChat={handleDeleteChat}
              />
            }
          </Grid>
          <Grid item xs={12} sm={10} md={9} lg={8} height={"calc(100vh-4rem)"} backgroundColor={'black'} sx={{ overflow: 'hidden' }}>
            <WrappedComponent {...props} chatId={chatId} onlineUser={onlineUsers} chats={data?.transformedChats} />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;
