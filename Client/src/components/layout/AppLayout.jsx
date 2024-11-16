import React, { useCallback, useEffect, useState } from 'react';
import Header from './Header';
import Title from '../shared/Title';
import { Drawer, Grid, Skeleton } from '@mui/material';
import ChatList from '../specific/ChatList';
import { useNavigate, useParams } from 'react-router-dom';
import Profile from '../specific/Profile';
import { useMyChatsQuery, useRenameGroupMutation } from '../../Redux/api/api';
import { useDispatch, useSelector } from 'react-redux';
import { setLeaveMenu, setSelectedDeleteChat, toggleMobileMenuFriend } from '../../Redux/reducers/misc';
import { useErrors, useSocketEvents } from '../../hooks/hook';
import { getSocket } from '../../utils/Socket';
import { NEW_MESSAGE_ALERT, NEW_REQUEST, ONLINE_USER, REFETCH_CHATS } from '../../constants/event';
import { incrementNotification, setMessagesAlert } from '../../Redux/reducers/chat';
import { getOrSaveFromStorage } from '../../lib/features';
import DeletChat from '../dialogs/DeletChat'


const AppLayout = () => (WrappedComponent) => {
  return (props) => {
    const params = useParams(); // Move useParams inside this inner function
    const chatId = params.chatId;
    const dispatch = useDispatch()
    const navigate=useNavigate()
    const [anchorEl, setAnchorEl] = useState(null);
    const socket = getSocket()

    const { isError, data, refetch, error, isLoading } = useMyChatsQuery();
    const { isMobileMenuFriend } = useSelector((state) => state.misc)
    const { newMessagesAlert } = useSelector((state) => state.chat)

    useErrors([{ isError, error }]);

    useEffect(()=>{
      getOrSaveFromStorage({key:NEW_MESSAGE_ALERT,value:newMessagesAlert})
    },[newMessagesAlert])


    const handleDeleteChat = (event, _id,groupChat) => {
      event.preventDefault();
      setAnchorEl(event.currentTarget); // Set anchorEl to open the menu
      dispatch(setLeaveMenu(true));
      dispatch(setSelectedDeleteChat({_id,groupChat}))
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
      console.log(data);
      dispatch(incrementNotification())
    }, [dispatch])

    const refetchListener=useCallback(()=>{ 
      refetch()
      navigate("/")
    },[refetch])  

    const [onlineUsers,setOnlineUsers]=useState([]);

    const onlineUsersListener = useCallback((data) => {
      setOnlineUsers(data);
    }, [dispatch])

    const eventHandlers = {
      [NEW_MESSAGE_ALERT]: newMessageAlertHandler,
      [NEW_REQUEST]: newRequestListener,
      [REFETCH_CHATS]:refetchListener,
      [ONLINE_USER]:onlineUsersListener,
    };
 
     useSocketEvents(socket, eventHandlers)

    return (
      <>

        <Title />
        <Header />
        <DeletChat anchorEl={anchorEl} onClose={handleCloseMenu} />
        {isLoading ?
          <Skeleton /> :
          <Drawer open={isMobileMenuFriend} onClose={handleClose}>
            <ChatList
              w="70vw"
              chats={data.transformedChats}
              chatId={chatId}
              newMessagesAlert={newMessagesAlert}
              onlineUser={onlineUsers}
              handleDeleteChat={handleDeleteChat}
            />
          </Drawer>
        }
        <Grid container height={"calc(100vh - 4rem)"}>
          <Grid
            item
            sm={4}
            md={3}
            sx={{ display: { xs: 'none', sm: 'block' } }
            }
            overflow={'auto'}
            height={'100%'}
          >
            {isLoading ?
              <Skeleton /> :
              <ChatList
                chats={data.transformedChats}
                chatId={chatId}
                newMessagesAlert={newMessagesAlert}
                onlineUser={onlineUsers}
                handleDeleteChat={handleDeleteChat}
              />}

          </Grid>
          <Grid item xs={12} sm={8} md={5} lg={6} height={"100%"}>
            <WrappedComponent {...props} chatId={chatId} />
          </Grid>
          <Grid item lg={3} md={4} height={"100%"}
            sx={{ display: { xs: 'none', md: 'block', padding: '1rem' }, padding: '1rem', bgcolor: 'rgba(0,0,0,0.60)' }}
          >
            <Profile />
          </Grid>
        </Grid>
      </>
    );
  };
};

export default AppLayout;

