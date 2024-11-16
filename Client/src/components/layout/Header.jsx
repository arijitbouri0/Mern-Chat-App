import React, { lazy, Suspense, useState } from 'react'
import { AppBar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material'
import { orange } from '../../constants/color'
import { Add as AddIcon, Group as GroupIcon, Logout as LogoutIcon, Menu as MenuIcon, Notifications as NotificationsIcon, Search as SearchIcon } from '@mui/icons-material'
import { useNavigate } from 'react-router-dom';
import axios from 'axios'
import { toast } from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import { userNotExists } from '../../Redux/reducers/auth'
import { server } from '../../constants/confing'
import { toggleMobileMenuFriend, toggleNewGroup, toggleNotification, toggleSearch } from '../../Redux/reducers/misc';
import { resetNotification } from '../../Redux/reducers/chat';

const Search = lazy(() => import('../specific/Search'))
const NewGroup = lazy(() => import('../specific/NewGroup'))
const Notification = lazy(() => import('../specific/Notification'))


const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Accessing toggle states from Redux store
  const { isSearch, isNewGroup, isNotification } = useSelector((state) => state.misc);
  const { notificationCounts } = useSelector((state) => state.chat)
  
  const navigateToGroup = () => {
    navigate('/group-chats');
  };

  const logoutHandler = async () => {
    try {
      const { data } = await axios.get(`${server}/api/user/logout`, { withCredentials: true });
      dispatch(userNotExists());
      toast.success(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Something went wrong');
    }
  };

  const openNotification=()=>{
    dispatch(toggleNotification(true))
    dispatch(resetNotification())
  }

  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={'4rem'}>
        <AppBar position='static' sx={{ bgcolor: orange }}>
          <Toolbar>
            <Typography
              variant='h6'
              sx={{
                display: { xs: 'none', sm: 'block' },
              }}
            >
              ChatApp
            </Typography>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IconButton color='inherit' onClick={() => dispatch(toggleMobileMenuFriend(true))}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box>
              {/* Using IconBtn component with Redux actions for toggles */}
              <IconBtn title={'Search'} icon={<SearchIcon />} onClick={() => dispatch(toggleSearch(true))} />
              <IconBtn title={'New Group'} icon={<AddIcon />} onClick={() => dispatch(toggleNewGroup(true))} />
              <IconBtn title={'Manage Groups'} icon={<GroupIcon />} onClick={navigateToGroup} />
              <IconBtn title={'Notifications'}  icon={<NotificationsIcon />} value={notificationCounts} onClick={openNotification} />
              <IconBtn title={'Logout'} icon={<LogoutIcon />} onClick={logoutHandler} />
            </Box>
          </Toolbar>
        </AppBar>
      </Box>

      {/* Lazy-loaded components with Suspense fallback */}
      <Suspense fallback={<Backdrop open />}>
        <Search isSearch={isSearch} />
      </Suspense>
      <Suspense fallback={<Backdrop open />}>
        <NewGroup isNewGroup={isNewGroup} />
      </Suspense>
      <Suspense fallback={<Backdrop open />}>
        <Notification isNotification={isNotification} />
      </Suspense>
    </>
  );
};

const IconBtn = ({ title, icon, onClick, value }) => (

  <Tooltip title={title}>
    <IconButton color='inherit' size='large' onClick={onClick}>
      {value ? (
        <Badge badgeContent={value}  color='error'>
          {icon}
        </Badge>
      ) : (
        icon
      )}
    </IconButton>
  </Tooltip>
);


export default Header;