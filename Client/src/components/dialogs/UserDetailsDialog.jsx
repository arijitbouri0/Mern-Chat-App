import EditIcon from '@mui/icons-material/Edit';
import { Avatar, Dialog, IconButton, Stack, Typography } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';


const UserDetailsDialog = ({ open, onClose, user }) => {
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
                                        src={user?.avatar?.url || '/default-avatar.png'}
                                        alt="Profile Picture"
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
                                        {user?.name || 'Anonymous User'}
                                    </Typography>
                                    <Typography variant="body2" color="white">
                                        @{user?.userName || 'username'}
                                    </Typography>
                                    <Typography variant="body1" color="white">
                                        {user?.bio || 'This is the user bio. Tell the world about yourself!'}
                                    </Typography>
                                </Stack>
                            </motion.div>

                            {/* Dialog Actions */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: 0.5 }}
                            >
                            </motion.div>
                        </Stack>
                    </motion.div>
                </Dialog>
            )}
        </AnimatePresence>
    );
};

export default UserDetailsDialog;
