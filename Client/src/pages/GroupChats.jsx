import { Add as AddIcon, Delete as DeleteIcon, Done as DoneIcon, Edit as EditIcon, KeyboardBackspace as KeyboardBackspaceIcon, Menu as MenuIcon } from '@mui/icons-material'
import { Avatar, Backdrop, Box, Button, CircularProgress, Drawer, Grid, IconButton, Stack, TextField, Tooltip, Typography } from '@mui/material'
import React, { lazy, memo, Suspense, useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { LayoutLoaders } from '../components/layout/Loaders'
import AvatrCard from '../components/shared/AvatrCard'
import { Link } from '../components/styles/StyledComponents'
import { useAsyncMutation, useErrors } from '../hooks/hook'
import { useAddGroupMemberMutation, useChatDetailsQuery, useDeleteChatMutation, useGetAvailableMembersQuery, useMyGroupsQuery, useRemoveGroupMemberMutation, useRenameGroupMutation } from '../Redux/api/api'
import { toggleAddMember, toggleDeleteMenu } from '../Redux/reducers/misc'
const ConfirmDeleteDialog = lazy(() => import('../components/dialogs/ConfirmDeleteDialog'))
const AddMemberDialog = lazy(() => import('../components/dialogs/AddMemberDialog'))

const GroupChats = () => {

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
      setUpdatedGroupName(groupData.name);
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
          <MenuIcon />
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

  const updateGroupName = () => {
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

  const GroupName = <Stack
    direction={'row'}
    alignItems={'center'}
    justifyContent={'center'}
    spacing={'1rem'}
    padding={'3rem'}>
    {isEdit ? (
      <>
        <TextField value={updatedGroupName} onChange={(e) => setUpdatedGroupName(e.target.value)} />
        <IconButton onClick={updateGroupName} disabled={isLoadingGroupName}>
          <DoneIcon />
        </IconButton>
      </>
    ) : (
      <>
        <Typography variant='h4'>{groupName}</Typography>
        <IconButton disabled={isLoadingGroupName} onClick={() => setIsEdit(true)}>
          <EditIcon />
        </IconButton>
      </>
    )}
  </Stack>

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
        height={'100vh'}>
        <Grid
          item
          sx={{
            display: {
              xs: 'none',
              sm: 'block'
            }
          }}
          sm={4}
          bgcolor={'bisque'}
          overflow={'auto'}
          height={'100%'}

        >
          <GroupList myGroups={myGroups.data.groups} />
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
              {GroupName}

              <Typography
                margin={'2rem'}
                alignSelf={'flex-start'}
                variant='body1'
              >Members
              </Typography>

              <Stack
                maxWidth="45rem"
                width="100%"
                boxSizing="border-box"
                padding={{
                  sm: '1rem',
                  xs: '0',
                  md: '1rem 4rem',
                }}
                spacing={2} // Adjust spacing
                height="50vh"
                overflow="auto"
                borderRadius="0.5rem" // Add rounded corners to main container
              >

                {isLoadingRemoveGroupMember || isDeleteGroupMember ? <CircularProgress /> :
                  groupDetails?.data?.chat?.members.map((member) => (
                    <Stack
                      key={member._id}
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      padding="0.75rem"
                      bgcolor="white"
                      borderRadius="0.5rem"
                      border="2px solid grey"
                      marginBottom="0.5rem"
                    >
                      <Stack direction="row" alignItems="center" spacing={2}>
                        <Avatar src={member.avatar} alt={member.name} />
                        <Typography var
                          iant="body1" style={{ fontWeight: '500' }}>
                          {member.name}
                        </Typography>
                      </Stack>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        onClick={() => removeMember(member._id)}
                        sx={{
                          borderRadius: '0.5rem',
                          padding: '0.25rem 1rem',
                        }}
                      >
                        Remove
                      </Button>
                    </Stack>
                  ))}


              </Stack>


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
          sx={{
            display: {
              xs: 'block',
              sm: 'none'
            }
          }}
        >
          <GroupList w={'50vw'} myGroups={myGroups.data.groups} chatId={chatId} />
        </Drawer>
      </Grid>
  )
}

const GroupList = ({ w = '100%', myGroups = [], chatId }) => (
  <Stack width={w}>
    {
      myGroups.length > 0 ? (
        myGroups.map((group) => <GroupListItem group={group} chatId={chatId} key={group._id} />)
      ) : (
        <Typography padding={'1rem'} textAlign={'center'}>
          No groups
        </Typography>
      )
    }
  </Stack>
)


const GroupListItem = memo(({ group, chatId }) => {
  const {
    name,
    avatar,
    _id,
  } = group

  return (
    <Link to={`?group=${_id}`}
      onClick={(e) => {
        if (chatId === _id) e.preventDefault();
      }}

    >
      <Stack
        direction={'row'}
        spacing={'1rem'}
        alignItems={'center'}
      >
        <AvatrCard avatar={avatar} />
        <Typography>{name}</Typography>
      </Stack>
    </Link>
  )
})

export default GroupChats


