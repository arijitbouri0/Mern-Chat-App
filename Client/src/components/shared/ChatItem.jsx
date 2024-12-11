import { Box, Stack, Typography, } from '@mui/material';
import { motion } from 'framer-motion';
import React, { memo } from 'react';
import { useDispatch } from 'react-redux';
import DeletChat from '../dialogs/DeletChat';
import { Link } from '../styles/StyledComponents';
import AvatrCard from './AvatrCard';
import { setLeaveMenu } from '../../Redux/reducers/misc';

const ChatItem = ({
    avatar = [],
    name,
    _id,
    groupChat = false,
    samesender,
    isOnline,
    newMessageAlert,
    index = 0,
    handleDeleteChat
}) => {
    return (
        <Link
            to={`/chat/${_id}`}
            style={{ textDecoration: 'none' ,padding:0}}
            onContextMenu={(event) => handleDeleteChat(event, _id, groupChat)}
        >
            <motion.div
                initial={{ opacity: 0, y: "-100%" }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                style={{
                    display: 'flex',
                    gap: '3rem',
                    alignItems: 'center',
                    padding: '2rem',
                    backgroundColor: samesender ? '#7F00FF' : '#333',
                    color: 'white',
                    position: 'relative',
                    borderRadius: '1rem',
                    '&:hover': {
                        backgroundColor: samesender ? '#6a0dad' : '#28282B',
                    },
                }}
            >
                <AvatrCard avatar={avatar} />
                <Stack>
                    <Typography variant='h4'>{name}</Typography>
                    {newMessageAlert && newMessageAlert.count > 0 && (
                        <Typography>{newMessageAlert.count} New Messages</Typography>
                    )}
                </Stack>
                {isOnline && (
                    <Box
                        sx={{
                            width: '10px',
                            height: '10px',
                            borderRadius: '50%',
                            backgroundColor: 'green',
                            position: 'absolute',
                            top: '50%',
                            right: '1rem',
                            transform: 'translateY(-50%)',
                        }}
                    />
                )}
            </motion.div>
            <DeletChat />
        </Link>
    )
}

export default memo(ChatItem);

