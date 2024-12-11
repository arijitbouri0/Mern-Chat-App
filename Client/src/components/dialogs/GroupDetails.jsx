


import GroupIcon from '@mui/icons-material/Group';
import { Avatar, Dialog, IconButton, Stack, Typography, List, ListItem, ListItemAvatar, ListItemText } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

const GroupDetailsDialog = ({ open, onClose, group }) => {
    return (
        <AnimatePresence>
            {open && (
                <Dialog
                    open={open}
                    onClose={onClose}
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
                    PaperProps={{
                        component: motion.div,
                        initial: { opacity: 0, y: 50, scale: 0.9 },
                        animate: { opacity: 1, y: 0, scale: 1 },
                        exit: { opacity: 0, y: 50, scale: 0.9 },
                        transition: { duration: 0.2 },
                    }}
                >
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <Stack spacing={3} padding="2rem" alignItems="center">
                            <Stack
                                direction="row"
                                justifyContent="center"
                                alignItems="center"
                                sx={{ position: 'relative' }}
                            >
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ duration: 0.3, delay: 0.1 }}
                                >
                                    <Avatar
                                        src={group?.avatar?.url || '/default-group-avatar.png'}
                                        alt="Group Picture"
                                        sx={{
                                            width: 140,
                                            height: 140,
                                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                                        }}
                                    />
                                </motion.div>
                            </Stack>

                            <motion.div
                                initial={{ y: -10, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: 0.3 }}
                            >
                                <Stack spacing={1} textAlign="center">
                                    <Typography variant="h5" fontWeight="bold" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                                        {group?.name || 'Unnamed Group'}
                                    </Typography>
                                    <Typography variant="body1" color="white">
                                        {group?.bio || 'This is the group bio. Describe your group here!'}
                                    </Typography>
                                </Stack>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.5 }}
                            >
                                <Typography variant="h6" sx={{ textAlign: 'left', marginBottom: '1rem' }}>
                                    Members
                                </Typography>
                                <List>
                                    {group?.members?.map((member) => (
                                        <ListItem key={member.id}>
                                            <ListItemAvatar>
                                                <Avatar
                                                    src={member.avatar?.url || '/default-avatar.png'}
                                                    alt={member.name}
                                                />
                                            </ListItemAvatar>
                                            <ListItemText primary={member.name} secondary={`@${member.userName}`} />
                                        </ListItem>
                                    ))}
                                </List>
                            </motion.div>
                        </Stack>
                    </motion.div>
                </Dialog>
            )}
        </AnimatePresence>
    );
};

export default GroupDetailsDialog;