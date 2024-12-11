import React from 'react';
import { Avatar, Button, Stack, Typography, CircularProgress } from '@mui/material';

const MemberList = ({
  members,
  admin,
  isAccess,
  handleChangeAdmin,
  removeMember,
  isLoadingRemoveGroupMember,
}) => {
  return (
    <Stack
      maxWidth="100%"
      width="100%"
      padding="1rem"
      spacing={2}
      borderRadius="0.5rem"
      sx={{
        overflowY: 'auto',  
        height:"60vh",
        bgcolor: 'rgba(0,0,0,0.7)',
        boxSizing: 'border-box',
        borderRadius: '0.5rem',  // Scroll if content exceeds height
      }}
      color="white"
    >
      {isLoadingRemoveGroupMember ? (
        <CircularProgress />
      ) : (
        members.map((member) => (
          <Stack
            key={member._id}
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            padding="1rem"
            spacing={'1rem'}
            borderRadius="0.5rem"
            border="1px solid #555"
            sx={{
              boxSizing: 'border-box',
              whiteSpace: 'nowrap',
              textOverflow: 'ellipsis',
              display: 'flex',
              alignItems: 'center',
              transition: '0.3s',
              '&:hover': { backgroundColor: '#1e1e1e' },
            }}
          >
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar src={member.avatar?.url} alt={member.name} />
              <Typography
                variant="body1"
                fontWeight="500"
                sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
              >
                {member.name}
              </Typography>

              {admin === member._id && (
                <Typography
                  sx={{
                    bgcolor: 'green',
                    color: 'white',
                    px: 1.3,
                    py: 0.5,
                    borderRadius: '12px',
                    fontSize: '0.8rem',
                    fontWeight: 'bold',
                  }}
                >
                  Group Admin
                </Typography>
              )}
            </Stack>

            {isAccess && (
              <Stack direction="row" spacing={2}>
                {admin !== member._id && (
                  <Button
                    onClick={() => handleChangeAdmin(member._id)}
                    variant="outlined"
                    size="small"
                  >
                    Make Admin
                  </Button>
                )}
                <Button
                  variant="outlined"
                  color="error"
                  size="small"
                  onClick={() => removeMember(member._id)}
                >
                  Remove
                </Button>
              </Stack>
            )}
          </Stack>
        ))
      )}
    </Stack>
  );
};

export default MemberList;
