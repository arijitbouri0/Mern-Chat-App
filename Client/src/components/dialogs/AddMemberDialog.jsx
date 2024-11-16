import { Dialog, DialogActions, DialogContent, DialogTitle, Button, Checkbox, FormControlLabel, Grid, Typography, Stack } from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleAddMember } from '../../Redux/reducers/misc'
import UserItem from '../shared/UserItem'

const AddMemberDialog = ({ onAddMembers, availableUsers, selectedMembers, setSelectedMembers }) => {

  const { isAddMember } = useSelector((state) => state.misc)
  const dispatch = useDispatch()
  const handleClose = () => {
    dispatch(toggleAddMember(false))
  }


  const handleToggleMember = (id) => {
    setSelectedMembers((prev) =>
    (prev.includes(id)
      ? prev.filter((currElement) => currElement !== id)
      : [...prev, id]))
  }

  return (
    <Dialog
      open={isAddMember}
      onClose={handleClose}
    >
      <Stack
        p={{ xs: '1rem', sm: '1rem' }}
        width={'30rem'}
        spacing={'1rem'}
      >
        <DialogTitle>Add Members</DialogTitle>
        <DialogContent>
          <div>
            {availableUsers?.length === 0 ? (
              <Typography>No users available to add</Typography>
            ) : (
              availableUsers?.map((user) => (
                <UserItem
                  key={user._id}
                  user={user}
                  handler={handleToggleMember} // Pass user selection handler// Check if user is already added
                  isAdded={selectedMembers.includes(user._id)}
                  avatar={user?.avatar?.url}
                />
              ))
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button
            color="primary"
            onClick={onAddMembers}
          >
            Add
          </Button>
        </DialogActions>
      </Stack>

    </Dialog>
  )
}

export default AddMemberDialog
