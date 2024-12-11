// import React, { useState } from 'react';
// import {
//   Avatar,
//   Box,
//   Button,
//   Dialog,
//   DialogActions,
//   IconButton,
//   Stack,
//   TextField,
//   Typography,
// } from '@mui/material';
// import EditIcon from '@mui/icons-material/Edit';
// import SaveIcon from '@mui/icons-material/Save';
// import { useDispatch, useSelector } from 'react-redux';
// import { toggleShowProfile } from '../../Redux/reducers/misc';
// import { motion, AnimatePresence } from 'framer-motion';

// const ProfileDialog = ({ isShowProfile }) => {
//   const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();

//   const [name, setName] = useState(user?.name || '');
//   const [userName, setUserName] = useState(user?.userName || '');
//   const [bio, setBio] = useState(user?.bio || '');
//   const [image, setImage] = useState(user?.avatar?.url || '');
//   const [preview, setPreview] = useState(user?.avatar?.url || '');
//   const [isEditing, setIsEditing] = useState(false);

//   const handleClose = () => {
//     setName(user?.name || '');
//     setUserName(user?.userName || '');
//     setBio(user?.bio || '');
//     setImage(user?.avatar?.url || '');
//     setPreview(user?.avatar?.url || '');
//     setIsEditing(false)
//     dispatch(toggleShowProfile(false));
//   };

//   const toggleEditing = () => setIsEditing(!isEditing);

//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setImage(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setPreview(reader.result);
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   const handleSaveChanges = () => {
//     console.log('Saved Changes', { name, bio, image });
//     dispatch(toggleShowProfile(false));
//   };

//   return (
//     <AnimatePresence>
//       {isShowProfile && (
//         <Dialog
//           open={isShowProfile}
//           onClose={handleClose}
//           fullWidth
//           maxWidth="xs"
//           sx={{
//             backdropFilter: 'blur(10px)',
//             '& .MuiPaper-root': {
//               background: 'black', // Set background to black
//               borderRadius: '20px',
//               overflow: 'hidden',
//               color: 'white',
//               boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
//             },
//           }}
//           PaperProps={{
//             component: motion.div,
//             initial: { opacity: 0, y: 50, scale: 0.9 },
//             animate: { opacity: 1, y: 0, scale: 1 },
//             exit: { opacity: 0, y: 50, scale: 0.9 },
//             transition: { duration: 0.3 },
//           }}
//         >
//           <motion.div
//             initial={{ opacity: 0 }}
//             animate={{ opacity: 1 }}
//             exit={{ opacity: 0 }}
//             transition={{ duration: 0.3 }}
//           >
//             <Stack spacing={3} padding="2rem" alignItems="center">
//               <Stack
//                 position="relative"
//                 direction="row"
//                 justifyContent="center"
//                 alignItems="center"
//               >
//                 <Avatar
//                   src={preview}
//                   alt="Profile Picture"
//                   sx={{
//                     width: 140,
//                     height: 140,
//                     boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
//                   }}
//                 />
//                 <IconButton
//                   color="primary"
//                   component="label"
//                   sx={{
//                     position: 'absolute',
//                     bottom: -10,
//                     right: 20,
//                     background: 'white',
//                     boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
//                   }}
//                 >
//                   <EditIcon />
//                   <input type="file" hidden accept="image/*" onChange={handleImageChange} />
//                 </IconButton>
//               </Stack>

//               <Stack spacing={2} width="100%" alignItems="center">
//                 <Box
//                   display="flex"
//                   alignItems="center" // Align items vertically at the center

//                 >
//                   {isEditing ? (
//                     <TextField
//                       label="Name"
//                       variant="outlined"
//                       fullWidth
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                       InputLabelProps={{
//                         style: { color: 'gray' }, // Label color
//                       }}
//                       InputProps={{
//                         style: { color: 'white' }, // Text color
//                       }}
//                       sx={{
//                         '& .MuiOutlinedInput-root': {
//                           '& fieldset': { borderColor: 'gray' }, // Border color
//                           '&:hover fieldset': { borderColor: 'white' },
//                         },
//                       }}
//                     />
//                   ) : (
//                     <Typography variant="h5" fontWeight="bold" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
//                       {name}
//                     </Typography>
//                   )}
//                   <IconButton onClick={toggleEditing} sx={{ color: 'gray', marginLeft: '8px' }}>
//                     {isEditing ? <SaveIcon fontSize="small" /> : <EditIcon fontSize="small" />}
//                   </IconButton>
//                 </Box>


//                 {isEditing ? (
//                   <TextField
//                     label="Bio"
//                     variant="outlined"
//                     fullWidth
//                     multiline
//                     rows={2}
//                     value={bio}
//                     onChange={(e) => setBio(e.target.value)}
//                     InputLabelProps={{
//                       style: { color: 'gray' },
//                     }}
//                     InputProps={{
//                       style: { color: 'white' },
//                     }}
//                     sx={{
//                       '& .MuiOutlinedInput-root': {
//                         '& fieldset': { borderColor: 'gray' },
//                         '&:hover fieldset': { borderColor: 'white' },
//                       },
//                     }}
//                   />
//                 ) : (
//                   <Typography variant="body2" textAlign="center" color="white">
//                     {bio || 'Add a bio to your profile.'}
//                   </Typography>
//                 )}

//                 <Typography variant="body1" color="white">
//                   @{userName}
//                 </Typography>
//               </Stack>

//               <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
//                 <Button
//                   variant="outlined"
//                   onClick={handleClose}
//                   sx={{ textTransform: 'none', borderRadius: '20px', color: 'white', borderColor: 'gray' }}
//                 >
//                   Close
//                 </Button>
//                 <Button
//                   variant="contained"
//                   onClick={handleSaveChanges}
//                   sx={{
//                     textTransform: 'none',
//                     borderRadius: '20px',
//                     background: 'linear-gradient(90deg, #007BFF, #0056b3)',
//                   }}
//                 >
//                   Save Changes
//                 </Button>
//               </DialogActions>
//             </Stack>
//           </motion.div>
//         </Dialog>
//       )}
//     </AnimatePresence>
//   );
// };

// export default ProfileDialog;


import React, { useEffect, useState } from 'react';
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  IconButton,
  Stack,
  TextField,
  Typography,
  CircularProgress,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import { useDispatch, useSelector } from 'react-redux';
import { toggleShowProfile } from '../../Redux/reducers/misc';
import { motion, AnimatePresence } from 'framer-motion';
import { useUpdadteUserMutation } from '../../Redux/api/api';
import toast from 'react-hot-toast';
import { userExist } from '../../Redux/reducers/auth';
import moment from 'moment';

const ProfileDialog = ({ isShowProfile }) => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [name, setName] = useState(user?.name || '');
  const [userName] = useState(user?.userName || ''); // Uneditable
  const [bio, setBio] = useState(user?.bio || '');
  const [avatar, setAvatar] = useState(null);
  const [preview, setPreview] = useState(user?.avatar?.url || '');
  const [isEditing, setIsEditing] = useState(false);

  const [updateUser, { isLoading }] = useUpdadteUserMutation();

  useEffect(() => {
    if (user) {
      setName(user?.name || '');
      setBio(user?.bio || '');
      setAvatar(user?.avatar?.url || '');
    }

    return () => {
      setName('');
      setBio('');
      setAvatar(null);
    };
  }, [user]);

  const handleClose = () => {
    setName(user?.name || '');
    setBio(user?.bio || '');
    setAvatar(null);
    setPreview(user?.avatar?.url || '');
    setIsEditing(false);
    dispatch(toggleShowProfile(false));
  };

  const toggleEditing = () => setIsEditing(!isEditing);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatar(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = async () => {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('bio', bio);
    if (avatar) {
      formData.append('avatar', avatar);
    }

    try {
      const res = await updateUser(formData).unwrap();
      if (res && res.message) {
        toast.success(res.message);
      } else {
        toast.success('Profile updated successfully!');
      }
      dispatch(userExist(res.user))
      handleClose()
    } catch (error) {
      toast.error('Failed to update profile. Please try again.');
    }
  };

  return (
    <AnimatePresence>
      {isShowProfile && (
        <Dialog
          open={isShowProfile}
          onClose={handleClose}
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
            transition: { duration: 0.3 },
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <Stack spacing={3} padding="2rem" alignItems="center">
              <Stack
                position="relative"
                direction="row"
                justifyContent="center"
                alignItems="center"
              >
                <Avatar
                  src={preview}
                  alt="Profile Picture"
                  sx={{
                    width: 140,
                    height: 140,
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                />
                <IconButton
                  color="primary"
                  component="label"
                  sx={{
                    position: 'absolute',
                    bottom: -10,
                    right: 20,
                    background: 'white',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
                  }}
                >
                  <EditIcon />
                  <input type="file" hidden accept="image/*" onChange={handleImageChange} />
                </IconButton>
              </Stack>

              <Stack spacing={2} width="100%" alignItems="center">
                <Box display="flex" alignItems="center">
                  {isEditing ? (
                    <TextField
                      label="Name"
                      variant="outlined"
                      fullWidth
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      InputLabelProps={{ style: { color: 'gray' } }}
                      InputProps={{ style: { color: 'white' } }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { borderColor: 'gray' },
                          '&:hover fieldset': { borderColor: 'white' },
                        },
                      }}
                    />
                  ) : (
                    <Typography variant="h5" fontWeight="bold" sx={{ flexGrow: 1, whiteSpace: 'nowrap' }}>
                      {name}
                    </Typography>
                  )}
                  <IconButton onClick={toggleEditing} sx={{ color: 'gray', marginLeft: '8px' }}>
                    {isEditing ? <SaveIcon fontSize="small" /> : <EditIcon fontSize="small" />}
                  </IconButton>
                </Box>

                {isEditing ? (
                  <TextField
                    label="Bio"
                    variant="outlined"
                    fullWidth
                    multiline
                    rows={2}
                    value={bio}
                    onChange={(e) => setBio(e.target.value)}
                    InputLabelProps={{ style: { color: 'gray' } }}
                    InputProps={{ style: { color: 'white' } }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        '& fieldset': { borderColor: 'gray' },
                        '&:hover fieldset': { borderColor: 'white' },
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body2" textAlign="center" color="white">
                    {bio || 'Add a bio to your profile.'}
                  </Typography>
                )}

                <Typography variant="body1" color="white">
                  @{userName}
                </Typography>
                <Typography variant="body1" color="white">
                  Joined {moment(user.createdAt).fromNow()}
                </Typography>
              </Stack>

              <DialogActions sx={{ justifyContent: 'center', gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={handleClose}
                  sx={{ textTransform: 'none', borderRadius: '20px', color: 'white', borderColor: 'gray' }}
                >
                  Close
                </Button>
                <Button
                  variant="contained"
                  onClick={handleSaveChanges}
                  disabled={isLoading}
                  sx={{
                    textTransform: 'none',
                    borderRadius: '20px',
                    background: isLoading ? 'gray' : 'linear-gradient(90deg, #007BFF, #0056b3)',
                  }}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Save Changes'}
                </Button>
              </DialogActions>
            </Stack>
          </motion.div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default ProfileDialog;
