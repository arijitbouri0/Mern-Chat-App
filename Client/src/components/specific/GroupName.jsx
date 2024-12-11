import React from 'react';
import { IconButton, Stack, TextField, Typography } from '@mui/material';
import { Done as DoneIcon, Edit as EditIcon } from '@mui/icons-material';

const GroupName = ({ groupName, updatedGroupName, setUpdatedGroupName, isEdit, setIsEdit, isLoading,handlerUpdateGroupName }) => (
  <Stack direction="row" alignItems="center" spacing={2} mt={4}>
    {isEdit ? (
      <>
        <TextField
          value={updatedGroupName}
          onChange={(e) => setUpdatedGroupName(e.target.value)}
          variant="outlined"
          size="small"
          sx={{ input: { color: 'white' }, '& .MuiOutlinedInput-root': { color: 'white' } }}
        />
        <IconButton onClick={handlerUpdateGroupName} disabled={isLoading} >
          <DoneIcon sx={{ color: 'white' }}/>
        </IconButton>
      </>
    ) : (
      <>
        <Typography variant="h4" sx={{ color: 'white' }}>{groupName}</Typography>
        <IconButton onClick={()=>setIsEdit(true)} disabled={isLoading}>
          <EditIcon sx={{ color: 'white' }}/>
        </IconButton>
      </>
    )}
  </Stack>
);

export default GroupName;
