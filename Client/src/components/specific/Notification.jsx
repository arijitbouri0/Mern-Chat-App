import { Avatar, Button, Dialog, DialogTitle, ListItem, Stack, Typography } from '@mui/material';
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useAcceptFriendRequestMutation, useGetMyNotificationQuery } from '../../Redux/api/api';
import { toggleNotification } from '../../Redux/reducers/misc';
import { useErrors } from '../../hooks/hook';

const Notification = ({ isNotification }) => {
  const dispatch = useDispatch();

  const { isError, data: notifications, isLoading, error,refetch } = useGetMyNotificationQuery();

  const [acceptFriendRequest] = useAcceptFriendRequestMutation();

  const friendRequestHandler = async ({ _id, accept }) => {
    dispatch(toggleNotification(false))
    try {
      const res = await acceptFriendRequest({ requestId: _id, accept });
      if (res.data?.message) {
        toast.success(res.data?.message || "Somthing went worng")
      }
      else {
        toast.error(res.data?.error || "Something went wrong")
      }
    }
    catch (error) {
      toast.error(error?.data?.message || "Something went wrong")
    }
  };

  useErrors([{ isError, error }]);
  useEffect(() => {
    if (isNotification) {
      refetch();
    }
  }, [isNotification, refetch]);

  return (
    <Dialog open={isNotification} onClose={() => dispatch(toggleNotification(false))}>
      <Stack p={{ xs: '1rem', sm: '2rem' }} maxWidth={'35rem'}>
        <DialogTitle textAlign={'center'}>Notifications</DialogTitle>

        {isLoading ? (
          <Typography textAlign={'center'}>Loading notifications...</Typography>
        ) : notifications?.allRequest?.length > 0 ? (
          notifications?.allRequest?.map((i) => (
            <NotificationItem
              key={i._id}
              sender={i.name}
              _id={i._id}
              img={i.avatar}
              handeler={friendRequestHandler}
            />
          ))
        ) : (
          <Typography textAlign={'center'}>No Notifications</Typography>
        )}
      </Stack>
    </Dialog>
  );
};

const NotificationItem = React.memo(({ sender, _id, handeler, img }) => {
  return (
    <ListItem>
      <Stack direction={'row'} alignItems={'center'} spacing={'1rem'} width={'100%'}>
        <Avatar src={img} />
        <Typography
          variant="body1"
          sx={{
            flexGrow: 1,
            display: '-webkit-box',
            WebkitLineClamp: 1,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            width: '100%',
          }}
        >
          {`${sender} sent you a friend request`}
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }}>
          <Button onClick={() => handeler({ _id, accept: true })}>Accept</Button>
          <Button color="error" onClick={() => handeler({ _id, accept: false })}>
            Reject
          </Button>
        </Stack>
      </Stack>
    </ListItem>
  );
});

export default Notification;
