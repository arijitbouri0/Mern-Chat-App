import { useInputValidation } from '6pp';
import { Search as SearchIcon } from '@mui/icons-material';
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { useAsyncMutation } from '../../hooks/hook';
import { useLazySearchUserQuery, useSentFriendRequestMutation } from '../../Redux/api/api';
import { toggleSearch } from '../../Redux/reducers/misc';
import UserItem from '../shared/UserItem';

const Search = ({ isSearch }) => {
  const dispatch = useDispatch();
  const search = useInputValidation("");

  const [users, setUsers] = useState([]);
  const [triggerSearchUser] = useLazySearchUserQuery();
  const [executeMutation, isLoading, data] = useAsyncMutation(useSentFriendRequestMutation);


  const addFriendHandler = async (id) => {
    try {
      await executeMutation("Sending friend request...", { receiverId: id });
    } catch (error) {
      console.error("Error sending friend request:", error);
    }
  };

  useEffect(() => {
    if (search.value) {
      const timeOutId = setTimeout(() => {
        triggerSearchUser(search.value)
          .then(({ data }) => {
            setUsers(data?.users);  // Assuming the response structure is { users: [] }
          })
          .catch((error) => {
            toast.error(error?.data?.message || "Something went wrong");
          });
      }, 1000);
      return () => clearTimeout(timeOutId);
    }
  }, [search.value]);

  return (
    <Dialog
      open={isSearch}
      onClose={() => dispatch(toggleSearch(false))}
    >
      <Stack
        p={'2rem'}
        direction={'column'}
        bgcolor={"#121212"}
        color={"white"}
        width={{ xs: '100%', sm: '25rem' }} // Responsive width
        sx={{
          maxWidth: '400px', // Apply maxWidth using the sx prop
        }}
      >
        <DialogTitle textAlign={'center'}>Find People</DialogTitle>
        <TextField
          label=''
          value={search.value}
          onChange={search.changeHandler}
          variant='outlined'
          size='small'
          sx={{
            backgroundColor: '#555', // Dark background color for the text field
            marginBottom: '1rem',
            color: 'white', // Text color
            '& .MuiInputBase-root': {
              color: 'white', // Ensure input text is white
            },
            '& .MuiOutlinedInput-notchedOutline': {
              borderColor: '#888', // Subtle border color
            },
            '&:hover .MuiOutlinedInput-notchedOutline': {
              borderColor: '#bbb', // Lighter border color on hover
            },
            '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
              borderColor: '#fff', // White border color on focus for contrast
            },
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon sx={{ color: '#ccc' }} /> {/* Light color for the icon */}
              </InputAdornment>
            ),
          }}
        />

        <List>
          {users?.map((i) => (
            <UserItem
              user={i}
              key={i._id}
              handler={addFriendHandler}
              handelerIsLoading={isLoading}
              avatar={i.avatar}
            />
          ))}
        </List>
      </Stack>
    </Dialog>
  );
};

export default Search;


