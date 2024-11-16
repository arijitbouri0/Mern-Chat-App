import { Menu, Stack, Typography } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { setLeaveMenu } from '../../Redux/reducers/misc';
import { Delete as DeleteIcon, ExitToApp as ExitToAppIcon } from '@mui/icons-material';
import { useAsyncMutation } from '../../hooks/hook';
import { useDeleteChatMutation, useLeaveGroupMutation } from '../../Redux/api/api';
import { useNavigate } from 'react-router-dom';

const DeletChat = ({ anchorEl, onClose }) => {
    const dispatch = useDispatch();
    const { isLeaveMenu, selectedDeleteChat } = useSelector((state) => state.misc)
    const [deleteChat,_,deleteChatData]=useAsyncMutation(useDeleteChatMutation)
    const [leaveGroup,__,leaveGroupData]=useAsyncMutation(useLeaveGroupMutation)
    const navigate=useNavigate()
    const isGroup = selectedDeleteChat.groupChat;
    const leaveGroupHandler = () => {
        onClose()
        leaveGroup("Leaving Group...",{id:selectedDeleteChat._id})
    }

    const deleteChatHandler = () => {
        onClose()
        deleteChat("Deleting Chat...",{id:selectedDeleteChat._id})
    }

    useEffect(()=>{
        if(deleteChatData || leaveGroupData) navigate("/")
    },[deleteChatData,leaveGroupData])

    return (
        <Menu
            open={Boolean(anchorEl && isLeaveMenu)}
            onClose={onClose}
            anchorEl={anchorEl}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
            }}
            transformOrigin={{
                vertical: 'center',
                horizontal: 'center'
            }}
        >
            <Stack
                sx={{
                    width: '10rem',
                    padding: '0.5rem',
                    cursor: 'pointer'
                }}
                direction={'row'}
                alignItems={'center'}
                spacing={'0.5rem'}
                onClick={isGroup ? leaveGroupHandler : deleteChatHandler}
            >
                {isGroup
                    ? <>
                        <ExitToAppIcon />
                        <Typography>Leave Group</Typography>
                    </>
                    : <>
                        <DeleteIcon/>
                        <Typography>Delete Chat</Typography>
                    </>}
            </Stack>
        </Menu>
    )
}

export default DeletChat
