import React, { memo } from 'react';
import { Avatar, AvatarGroup, Box, Stack, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { transformImage } from '../../lib/features';

// Parent Component: GroupList
const GroupList = ({ w = '100%', myGroups = [], chatId }) => (
  <>
    <Typography padding="1rem" color='white' variant='h4' textAlign={'center'}>Manage Groups</Typography>
    <Stack
      width={w}
      spacing={2}
      padding={{ xs: '1rem', sm: '2rem' }}
      bgcolor={'#121212'}
      sx={{ color: 'white' }}
    >
      {myGroups.length > 0 ? (
        myGroups.map((group) => (
          <GroupListItem group={group} chatId={chatId} key={group._id} />
        ))
      ) : (
        <Typography padding="1rem" textAlign="center">
          No groups
        </Typography>
      )}
    </Stack></>
);

// Child Component: GroupListItem
const GroupListItem = memo(({ group, chatId }) => {
  const { name, avatar, _id } = group;
  const isActive = chatId === _id;

  return (
    <Link
      to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault(); // Prevent navigation if already in the same chat
      }}
      style={{ textDecoration: 'none' }}
    >
      <Stack
        direction="row"
        spacing="4rem"
        alignItems="center"
        padding="1rem"
        margin="0.5rem 0"
        borderRadius="0.5rem"
        // bgcolor="gray"
        sx={{
          bgcolor: isActive ? '#7F00FF' : "#333",
          color: 'white',
          cursor: 'pointer',
          transition: '0.3s',
          '&:hover': {
            backgroundColor: isActive ? '#6a0dad' : '#28282B',
          },
        }}
      >
        <AvatarCard avatar={avatar} />
        <Typography color="white">{name}</Typography>
      </Stack>
    </Link>
  );
});

// Component for displaying group avatar
const AvatarCard = ({ avatar = [], max = 4 }) => {
  return (
    <Stack direction={'row'} spacing={0.5} >
      <AvatarGroup max={max}>
        <Box width={'5rem'} height={'5rem'} position='relative'>
          {avatar.map((src, index) => (
            <Avatar
              key={Math.random() * 100}
              src={transformImage(src)}
              alt={`Avatr ${index}`}
              sx={{
                width: '5rem',
                height: '5rem',
                position: 'absolute',
                left: {
                  xs: `${0.5 + index}rem`,
                  sm: `${index}rem`
                },
              }}
            />
          ))}
        </Box>
      </AvatarGroup>
    </Stack>
  )
}

export default GroupList;
