import { Add as AddIcon } from '@mui/icons-material';
import SearchIcon from '@mui/icons-material/Search';
import { Box, Divider, IconButton, Stack, Tooltip, Typography, useTheme } from '@mui/material';
import React from 'react';
import { useDispatch } from 'react-redux';
import { toggleNewGroup, toggleSearch } from '../../Redux/reducers/misc';
import ChatItem from '../shared/ChatItem';

const ChatList = ({
    w = '100%',
    chats = [],
    chatId,
    onlineUser = [],
    newMessagesAlert = [],
    handleDeleteChat,
    handleClose
}) => {
    const dispatch = useDispatch();
    const theme=useTheme()

    const handlerOpenToggleSeach=()=>{
        dispatch(toggleSearch(true))
        handleClose()
    }

    const handlerOpenToggleNewGroup=()=>{
        dispatch(toggleNewGroup(true))
        handleClose()
    }

    return (
        <div>
            <Box
                width={w}
                sx={{
                    padding: '1rem 2rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    gap: '1rem',
                    bgcolor:'#121212',
                    color:'white'
                }}
            >
                {/* Title */}
                <Typography
                    variant="h3"
                    sx={{
                        fontWeight: 700,
                        fontSize: { xs: '1.5rem', md: '4rem' }, // Adjust font size for responsiveness
                    }}
                >
                    Chats
                </Typography>

                {/* Icons Section */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Search Icon */}
                    <Tooltip title="Search Friends">
                        <IconButton
                            color="inherit"
                            size="large"
                            sx={{
                                fontSize: '5rem', // Increase icon size slightly
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '1.5rem',
                                },
                                color: 'white', 
                            }}
                            onClick={handlerOpenToggleSeach}
                        >
                            <SearchIcon fontSize='large' />
                        </IconButton>
                    </Tooltip>

                    <Tooltip title="New Group">
                        <IconButton
                            color="inherit"
                            size="large"
                            sx={{
                                fontSize: '5rem', // Increase icon size slightly
                                [theme.breakpoints.down('sm')]: {
                                    fontSize: '1.5rem',
                                },
                                color: 'white',
                            }}
                            onClick={handlerOpenToggleNewGroup}
                        >
                            <AddIcon fontSize='large' />
                        </IconButton>
                    </Tooltip>

                </Box>
            </Box>

            <Divider />
            {/* Chat List */}
            <Stack
                width={w}
                direction="column"
                bgcolor={'#121212'}
                spacing={2}
                padding={{ xs: '1rem', sm: '2rem' }}
                sx={{
                    maxHeight: 'calc(100vh)', // Dynamic height for responsiveness
                    overflowY: 'auto', // Enables scrolling for the chat list
                    color: 'white',
                }}
            >
                {chats.map((data) => {
                    const { avatar, _id, name, groupChat, members } = data;

                    const newMessageAlert = newMessagesAlert.find((alert) => alert.chatId === _id);

                    const isOnline = members?.some((member) => onlineUser.includes(member));
                    return (
                        <ChatItem
                            newMessageAlert={newMessageAlert}
                            isOnline={isOnline}
                            avatar={avatar}
                            name={name}
                            _id={_id}
                            key={_id}
                            groupChat={groupChat}
                            samesender={chatId === _id}
                            handleDeleteChat={handleDeleteChat}
                        />
                    );
                })}
            </Stack>

        </div>
    );
};

export default ChatList;

