import { useInputValidation } from '6pp'
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../Redux/api/api'
import { toggleNewGroup } from '../../Redux/reducers/misc'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import UserItem from '../shared/UserItem'

const NewGroup = ({ isNewGroup }) => {


  const dispatch = useDispatch()
  const { isError, isLoading, error, data } = useAvailableFriendsQuery()
  const [newGroup,isLoadingNewGroup]=useAsyncMutation(useNewGroupMutation)

  const errors = [{
    isError,
    error
  }]

  useErrors(errors)

  const groupName = useInputValidation("")
  const [selectMembers, setSelectMembers] = useState([])

  const selectMemberHandler = (id) => {
    setSelectMembers((prev) =>
    (prev.includes(id)
      ? prev.filter((currElement) => currElement !== id)
      : [...prev, id]))
  }
  const submitHandle = () => {
    if(!groupName.value) return toast.error("Group Name is Required");
    if(selectMembers.length<2) return toast.error("Please select atleast 2 Members");
    newGroup("Creating New Group...",{name:groupName.value,members:selectMembers})
    dispatch(toggleNewGroup(false))
  }

  return (
    <Dialog open={isNewGroup} onClose={() => dispatch(toggleNewGroup(false))}>
      <Stack
        p={{ xs: '1rem', sm: '2rem' }}
        width={'30rem'}
        spacing={'2rem'}
      >
        <DialogTitle textAlign={'center'} variant='h4'>New Group</DialogTitle>

        <TextField value={groupName.value} label='Group Name' onChange={groupName.changeHandler} />

        <Typography varient='body1'>Members</Typography>
        <Stack>
          {isLoading ? <Skeleton /> :
            data?.friends?.map((i) => (
              <UserItem
                user={i}
                key={i._id}
                handler={selectMemberHandler}
                isAdded={selectMembers.includes(i._id)}
                avatar={i.avatar}
              />
            ))}
        </Stack>

        <Stack direction={'row'} justifyContent={'space-evenly'}>
          <Button variant='outlined' color='error' size='large' onClick={()=>dispatch(toggleNewGroup(false))}>Cancel</Button>
          <Button variant='contained' size='large' onClick={submitHandle} disabled={isLoadingNewGroup}>Create</Button>
        </Stack>
      </Stack>
    </Dialog>
  )
}

export default NewGroup
