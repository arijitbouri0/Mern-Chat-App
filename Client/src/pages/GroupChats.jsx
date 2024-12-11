import { Add as AddIcon, Delete as DeleteIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { Backdrop, Box, Button, Drawer, Grid, IconButton, Stack, Tooltip, Typography } from '@mui/material'
import React, { lazy, Suspense, useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { LayoutLoaders } from '../components/layout/Loaders'
import GroupList from '../components/specific/GroupList'
import GroupName from '../components/specific/GroupName'
import MemberList from '../components/specific/MemberList'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import { useAddGroupMemberMutation, useChangeGroupAdminMutation, useChatDetailsQuery, useDeleteChatMutation, useGetAvailableMembersQuery, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../Redux/api/api'
import { toggleAddMember, toggleDeleteMenu } from '../Redux/reducers/misc'
const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'))

const GroupChats = () => {

  const { user } = useSelector((state) => state.auth)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate()
  const [members, setMembers] = useState([])
  const [isEdit, setIsEdit] = useState(false);
  const [groupName, setGroupName] = useState("");
  const [updatedGroupName, setUpdatedGroupName] = useState("");
  const chatId = useSearchParams()[0].get("group");
  const navigateBack = () => {
    navigate("/")
  }
  const dispatch = useDispatch()

  const myGroups = useMyGroupsQuery();
  const groupDetails = useChatDetailsQuery({ chatId, populate: true },
    { skip: !chatId }
  )

  const [renameGroup, isLoadingGroupName] = useAsyncMutation(useRenameGroupMutation)
  const [removeGroupMember, isLoadingRemoveGroupMember] = useAsyncMutation(useRemoveGroupMemberMutation)
  const [addGroupMember, isLoadingAddGroupMember] = useAsyncMutation(useAddGroupMemberMutation)
  const [deleteGroup, isDeleteGroupMember] = useAsyncMutation(useDeleteChatMutation)

  const handleMobile = () => {
    setIsMobileMenuOpen((prev) => !prev)
  }

  const handleMobileClose = () => {
    setIsMobileMenuOpen(false)
  }
  const admin = groupDetails?.data?.chat?.creator;
  const isAccess = admin === user._id;

  const errors = [{
    isError: myGroups.isError,
    error: myGroups.error

  },
  {
    isError: groupDetails.isError,
    error: groupDetails.error
  }
  ]

  useErrors(errors);

  useEffect(() => {
    const groupData = groupDetails.data;
    if (groupData) {
      setGroupName(groupData.chat.name);
      setUpdatedGroupName(groupData.chat.name);
      setMembers(groupData.chat.members)
    }
    else {
      setGroupName("");
      setUpdatedGroupName("");
      setMembers([]);
    }

    return () => {
      setGroupName("");
      setUpdatedGroupName("");
      setMembers([])
      setIsEdit(false)
    }
  }, [groupDetails.data, isDeleteGroupMember])



  const IconBtns = <>
    <Box
      sx={{
        display: {
          xs: 'block',
          sm: 'none',
          position: 'fixed',
          top: '1rem',
          right: '1rem'
        }
      }}
    >
      <Tooltip title='menu'>
        <IconButton onClick={handleMobile}>
          <MenuIcon sx={{ color: 'white' }} />
        </IconButton>
      </Tooltip>
    </Box>
    <Tooltip title='back'>
      <IconButton
        sx={{
          position: 'absolute',
          top: '2rem',
          left: '2rem',
          bgcolor: 'rgba(0,0,0,0.6)',
          color: 'white',
          ":hover": {
            bgcolor: 'black',
          }
        }}
        onClick={navigateBack}
      >
        <KeyboardBackspaceIcon />
      </IconButton>
    </Tooltip>
  </>

  const handlerUpdateGroupName = () => {
    setIsEdit(false)
    renameGroup("Updating Group Name..", {
      chatId,
      name: updatedGroupName
    })
  }

  const removeMember = (userId) => {
    removeGroupMember("Removing Member...", {
      chatId,
      userId
    })
  }

  useEffect(() => {
    setGroupName(`Group Name ${chatId}`)
    setUpdatedGroupName(`Group Name ${chatId}`)
    return (() => {
      setGroupName("")
      setUpdatedGroupName("")
      setIsEdit(false)
    })
  }, [chatId])


  const { data, isLoading, isError } = useGetAvailableMembersQuery({ chatId }, { skip: !chatId })
  const openAddMembersDialog = () => {
    dispatch(toggleAddMember(true));
  }

  const [changeAdmin] = useAsyncMutation(useChangeGroupAdminMutation)

  const handleChangeAdmin = (newAdminId) => {
    changeAdmin("Assigning new admin..", { chatId, newAdminId })
  }


  const [selectedMembers, setSelectedMembers] = useState([]);
  const addMemberHandler = () => {
    dispatch(toggleAddMember(false));
    addGroupMember("Adding Members...", {
      members: selectedMembers,
      chatId
    })
    groupDetails.refetch()
  }
  const oprnDeleteDialog = () => {
    dispatch(toggleDeleteMenu(true))
  }

  const confirmDeleteGroup = () => {
    deleteGroup("Deleting Group...", { id: chatId })
      .then(() => {
        navigate("/group-chats");
        setGroupName("");
        setUpdatedGroupName("");
        setMembers([]);
        dispatch(toggleDeleteMenu(false));
        groupDetails.refetch();
        myGroups.refetch();
      })
      .catch((error) => {
        toast.error("Error deleting group:", error);
        // Handle error, e.g., show a notification
      });
  }
  const ButtonGroup = <Stack
    direction={{
      sm: 'row',
      xs: 'column-reverse'
    }}
    spacing={'1rem'}
    p={{
      sm: '1rem',
      xs: '0',
      md: '1rem 4rem'
    }}>
    <Button variant='outlined' size='large' color='error' startIcon={<DeleteIcon />} onClick={oprnDeleteDialog}>Delete Group</Button>
    <Button variant='contained' size='large' startIcon={<AddIcon />} onClick={openAddMembersDialog}>Add Member</Button>
  </Stack>
  return (
    myGroups.isLoading ? <LayoutLoaders /> :
      <Grid
        container
        height={'100vh'}
        sx={{ backgroundColor: 'black', color: 'white' }}
      >
        <Grid
          item
          sx={{
            display: {
              xs: 'none',
              sm: 'block'
            }
          }}
          sm={4}
          bgcolor={'#121212'}
          overflow={'auto'}
          height={'100%'}

        >
          <GroupList myGroups={myGroups.data.groups} chatId={chatId}/>
        </Grid>
        <Grid
          item
          xs={12}
          sm={8}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            position: 'relative',
            padding: '1rem 3rem'
          }}
        >
          {IconBtns}
          {
            groupName && <>
              <GroupName
                groupName={groupName}
                updatedGroupName={updatedGroupName}
                setUpdatedGroupName={setUpdatedGroupName}
                isEdit={isEdit}
                setIsEdit={setIsEdit}
                isLoading={isLoadingGroupName}
                handlerUpdateGroupName={handlerUpdateGroupName}
              />

              <Typography
                margin={'1rem'}
                alignSelf={'flex-start'}
                variant='body1'
                sx={{ color: 'white' }}
              >Members
              </Typography>
              <MemberList
                members={members}
                admin={admin}
                isAccess={isAccess}
                handleChangeAdmin={handleChangeAdmin}
                removeMember={removeMember}
                isLoadingRemoveGroupMember={false}
              />
              {ButtonGroup}
            </>
          }
        </Grid>

        {
          <Suspense fallback={<Backdrop open />}>
            <ConfirmDeleteDialog
              deleteHandler={confirmDeleteGroup}
            />
          </Suspense>

        }
        <AddMemberDialog
          onAddMembers={addMemberHandler} // Passing addMemberHandler to handle the addition of members
          availableUsers={data?.availableUsers
            || []}
          selectedMembers={selectedMembers} // Pass selected members here
          setSelectedMembers={setSelectedMembers} // Pass function to update selected members
        />
        <Drawer
          open={isMobileMenuOpen}
          onClose={handleMobileClose}
          PaperProps={{
            sx: {
              backgroundColor:'#121212',
              borderColor: '#28282B',  // Add the border color
              borderWidth: '1px',
            }
          }}
          sx={{
            display: {
              xs: 'block',
              sm: 'none'
            },
          }}
        >
          <GroupList w={'80vw'} myGroups={myGroups.data.groups} chatId={chatId} />
        </Drawer>
      </Grid>
  )
}

export default GroupChats


