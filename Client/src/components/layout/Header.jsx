import { useTheme } from '@emotion/react';
import { Group as GroupIcon, Logout as LogoutIcon, Menu as MenuIcon, Notifications as NotificationsIcon } from '@mui/icons-material';
import { AppBar, Avatar, Backdrop, Badge, Box, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import axios from 'axios';
import React, { lazy, Suspense } from 'react';
import { toast } from 'react-hot-toast';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { orange } from '../../constants/color';
import { server } from '../../constants/confing';
import { userNotExists } from '../../Redux/reducers/auth';
import { resetNotification } from '../../Redux/reducers/chat';
import { toggleMobileMenuFriend, toggleNotification, toggleShowProfile } from '../../Redux/reducers/misc';


const Search = lazy(() => import('../specific/Search'))
const NewGroup = lazy(() => import('../specific/NewGroup'))
const Notification = lazy(() => import('../specific/Notification'))
const ProfileDialog = lazy(() => import('../dialogs/ProfileDialog'))

const Header = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { isSearch, isNewGroup, isNotification, showProfile } = useSelector((state) => state.misc);
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

  const openNotification = () => {
    dispatch(toggleNotification(true))
    dispatch(resetNotification())
  }

  const openProfile = () => {
    dispatch(toggleShowProfile(true))
  }


  return (
    <>
      <Box sx={{ flexGrow: 1 }} height={'4rem'}>
        <AppBar position='static' sx={{ bgcolor: '#FFD700' }}>
          <Toolbar sx={{ justifyContent: 'space-between' }}>
            <Typography
              variant='h4'
              sx={{
                display: { xs: 'none', sm: 'block' },
                fontWeight:'700',
                color:'#00BFFF'
              }}
            >
              ChatterBox
            </Typography>
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              <IconButton color='inherit' onClick={() => dispatch(toggleMobileMenuFriend(true))}>
                <MenuIcon />
              </IconButton>
            </Box>
            <Box sx={{ flexGrow: 1 }} />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' ,color:'#00BFFF'}}>
              <IconBtn title={'Manage Groups'} icon={<GroupIcon />} onClick={navigateToGroup} />
              <IconBtn title={'Notifications'} icon={<NotificationsIcon />} value={notificationCounts} onClick={openNotification} />
              <Tooltip title="Profile">
                <Avatar
                  src={user?.avatar?.url || ''}
                  alt="Profile"
                  sx={{
                    cursor: 'pointer',
                  }}
                  onClick={openProfile}
                />
              </Tooltip>
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
        <ProfileDialog isShowProfile={showProfile} />
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
        <Badge badgeContent={value} color='error'>
          {icon}
        </Badge>
      ) : (
        icon
      )}
    </IconButton>
  </Tooltip>
);


export default Header;

