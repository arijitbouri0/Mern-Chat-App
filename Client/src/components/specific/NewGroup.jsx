// import { useInputValidation } from '6pp'
// import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
// import React, { useState } from 'react'
// import toast from 'react-hot-toast'
// import { useDispatch } from 'react-redux'
// import { useAvailableFriendsQuery, useNewGroupMutation } from '../../Redux/api/api'
// import { toggleNewGroup } from '../../Redux/reducers/misc'
// import { useAsyncMutation, useErrors } from '../../hooks/hook'
// import UserItem from '../shared/UserItem'

// const NewGroup = ({ isNewGroup }) => {


//   const dispatch = useDispatch()
//   const { isError, isLoading, error, data } = useAvailableFriendsQuery()
//   const [newGroup,isLoadingNewGroup]=useAsyncMutation(useNewGroupMutation)

//   const errors = [{
//     isError,
//     error
//   }]

//   useErrors(errors)

//   const groupName = useInputValidation("")
//   const [selectMembers, setSelectMembers] = useState([])

//   const selectMemberHandler = (id) => {
//     setSelectMembers((prev) =>
//     (prev.includes(id)
//       ? prev.filter((currElement) => currElement !== id)
//       : [...prev, id]))
//   }
//   const submitHandle = () => {
//     if(!groupName.value) return toast.error("Group Name is Required");
//     if(selectMembers.length<2) return toast.error("Please select atleast 2 Members");
//     newGroup("Creating New Group...",{name:groupName.value,members:selectMembers})
//     dispatch(toggleNewGroup(false))
//   }

//   return (
//     <Dialog open={isNewGroup} onClose={() => dispatch(toggleNewGroup(false))}>
//       <Stack
//         p={{ xs: '1rem', sm: '2rem' }}
//         width={'30rem'}
//         spacing={'2rem'}
//       >
//         <DialogTitle textAlign={'center'} variant='h4'>New Group</DialogTitle>

//         <TextField value={groupName.value} label='Group Name' onChange={groupName.changeHandler} />

//         <Typography varient='body1'>Members</Typography>
//         <Stack>
//           {isLoading ? <Skeleton /> :
//             data?.friends?.map((i) => (
//               <UserItem
//                 user={i}
//                 key={i._id}
//                 handler={selectMemberHandler}
//                 isAdded={selectMembers.includes(i._id)}
//                 avatar={i.avatar}
//               />
//             ))}
//         </Stack>

//         <Stack direction={'row'} justifyContent={'space-evenly'}>
//           <Button variant='outlined' color='error' size='large' onClick={()=>dispatch(toggleNewGroup(false))}>Cancel</Button>
//           <Button variant='contained' size='large' onClick={submitHandle} disabled={isLoadingNewGroup}>Create</Button>
//         </Stack>
//       </Stack>
//     </Dialog>
//   )
// }

// export default NewGroup 

import { useInputValidation } from '6pp'
import { Button, Dialog, DialogTitle, Skeleton, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import toast from 'react-hot-toast'
import { useDispatch } from 'react-redux'
import { useAvailableFriendsQuery, useNewGroupMutation } from '../../Redux/api/api'
import { toggleNewGroup } from '../../Redux/reducers/misc'
import { useAsyncMutation, useErrors } from '../../hooks/hook'
import UserItem from '../shared/UserItem'

// Framer Motion
import { motion } from 'framer-motion'

const NewGroup = ({ isNewGroup }) => {

  const dispatch = useDispatch()
  const { isError, isLoading, error, data } = useAvailableFriendsQuery()
  const [newGroup, isLoadingNewGroup] = useAsyncMutation(useNewGroupMutation)

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
    if (!groupName.value) return toast.error("Group Name is Required");
    if (selectMembers.length < 2) return toast.error("Please select at least 2 Members");
    newGroup("Creating New Group...", { name: groupName.value, members: selectMembers })
    dispatch(toggleNewGroup(false))
  }

  return (
    <Dialog
      open={isNewGroup}
      onClose={() => dispatch(toggleNewGroup(false))}
      fullWidth
      maxWidth="xs"
      sx={{
        backdropFilter: 'blur(10px)',
        '& .MuiPaper-root': {
          background: 'black',
          borderRadius: '20px',
          overflow: 'hidden',
          color: 'white',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
        },
      }}
    >
      {/* Motion applied to Dialog Paper */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        transition={{ duration: 0.3 }}
      >
        <Stack
          p={{ xs: '1rem', sm: '2rem' }}
          spacing={'2rem'}
          sx={{
            color: 'white', // White text for contrast
            borderRadius: '8px' // Optional: Rounded corners for dialog
          }}
        >
          <DialogTitle textAlign={'center'} variant='h4'>New Group</DialogTitle>

          <TextField
            value={groupName.value}
            label='Group Name'
            onChange={groupName.changeHandler}
            sx={{
              input: { color: 'white' }, // Ensure input text is white
              label: { color: 'white' },  // Ensure label is white
              backgroundColor: 'black', // Input field background
              color: 'black', // Input text color
              borderRadius: '4px',
              '& .MuiOutlinedInput-root': {
                '& fieldset': {
                  borderColor: '#fff', // Set the border color to white
                },
              },
            }}
              />

          <Typography variant='body1' sx={{ color: 'white' }}>Members</Typography>
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
            <Button variant='outlined' color='error' size='large' onClick={() => dispatch(toggleNewGroup(false))}>Cancel</Button>
            <Button variant='contained' size='large' onClick={submitHandle} disabled={isLoadingNewGroup}>Create</Button>
          </Stack>
        </Stack>
      </motion.div>
    </Dialog>
  )
}

export default NewGroup
