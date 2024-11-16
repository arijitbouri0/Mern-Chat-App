import React, { useEffect, useState } from 'react'
import { Dialog, DialogTitle, InputAdornment, List, Stack, TextField } from '@mui/material'
import { useInputValidation } from '6pp'
import { Search as SearchIcon } from '@mui/icons-material'
import UserItem from '../shared/UserItem';
import { useDispatch } from 'react-redux';
import { toggleSearch } from '../../Redux/reducers/misc';
import api, { useLazySearchUserQuery, useSentFriendRequestMutation } from '../../Redux/api/api';
import toast from 'react-hot-toast';
import { useAsyncMutation } from '../../hooks/hook';
import { incrementNotification } from '../../Redux/reducers/chat';

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
    <Dialog open={isSearch} onClose={() => dispatch(toggleSearch(false))}>
      <Stack p={'2rem'} direction={'column'} width={'25rem'}>
        <DialogTitle textAlign={'center'}>Find People</DialogTitle>
        <TextField
          label=''
          value={search.value}
          onChange={search.changeHandler}
          variant='outlined'
          size='small'
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <SearchIcon />
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

