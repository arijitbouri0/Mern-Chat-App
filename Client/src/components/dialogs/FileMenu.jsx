import { Menu, MenuItem, ListItemIcon, ListItemText, Tooltip, Input } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import VideoLibraryIcon from '@mui/icons-material/VideoLibrary';
import AudiotrackIcon from '@mui/icons-material/Audiotrack';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setUploadingLoader, toggleFileMenu } from '../../Redux/reducers/misc';
import toast from 'react-hot-toast';
import { useSendAttachementMutation } from '../../Redux/api/api';


const imageColor = "#25d366";  // Green for image (WhatsApp color)
const videoColor = "#34b7f1";  // Blue for video
const audioColor = "#ff9900";  // Yellow for audio
const fileColor = "#128c7e";   // Dark green for file

const FileMenu = ({ anchorEl, chatId }) => {
    const dispatch = useDispatch();
    const { isFileMenu } = useSelector((state) => state.misc);
    const [sendAttachements] = useSendAttachementMutation()
    // File change handler
    const handleFileChange = async (e, type) => {
        const file = Array.from(e.target.files);
        if (file.length <= 0) return;
        if (file.length > 5) return toast.error(`You can only send 5 ${type} at a time`)

        dispatch(setUploadingLoader(true))

        const toastId = toast.loading(`Sending ${type}...`);
        dispatch(toggleFileMenu(false));

        try {
            const myForm = new FormData();
            myForm.append("chatId", chatId);
            file.forEach((file) => myForm.append("files", file));
            const res = await sendAttachements(myForm);
            if (res.data) toast.success(`${key} sent successfully`, {
                id: toastId
            })
            else toast.error(`Failed to send ${type}`, {
                id: toastId
            })
        } catch (error) {
            toast.error(error.message || "An error occurred", { id: toastId });
        } finally {
            dispatch(setUploadingLoader(false))
        }
    };

    return (
        <Menu
            open={isFileMenu}
            anchorEl={anchorEl}
            onClose={() => dispatch(toggleFileMenu(false))}
            PaperProps={{
                style: {
                    borderRadius: '10px',
                    padding: '0.5rem',
                    boxShadow: '0 4px 10px rgba(0, 0, 0, 0.2)',
                }
            }}
            sx={{
                position: 'absolute',
                bottom: '120px',
                zIndex: 1200,
            }}
        >
            {/* Image Upload */}
            <Tooltip title="Send Image" placement="top">
                <MenuItem
                    sx={{
                        backgroundColor: imageColor,
                        color: 'white',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        '&:hover': {
                            backgroundColor: '#1e9e63', // Darker green on hover
                        },
                    }}
                >
                    <input
                        type="file"
                        multiple
                        accept="image/png,image/jpg,image/jpeg,image/gif"
                        onChange={(e) => handleFileChange(e, 'image')}
                        sx={{
                            display: 'none',  // Hides the default file input
                        }}
                        id="image-upload"
                        hidden
                    />
                    {/* Custom button to trigger the input */}
                    <label htmlFor="image-upload" style={{ cursor: 'pointer', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <ImageIcon fontSize="small" sx={{ color: 'white' }} />
                        </ListItemIcon>
                    </label>
                </MenuItem>
            </Tooltip>

            {/* Video Upload */}
            <Tooltip title="Send Video" placement="top">
                <MenuItem
                    sx={{
                        backgroundColor: videoColor,
                        color: 'white',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        '&:hover': {
                            backgroundColor: '#2596be', // Darker blue on hover
                        },
                    }}
                >
                    <input
                        type="file"
                        accept="video/mp4 ,video/webm, video/ogg"
                        onChange={(e) => handleFileChange(e, 'video')}
                        sx={{
                            display: 'none',  // Hides the default file input
                        }}
                        id="video-upload"
                        hidden
                    />
                    {/* Custom button to trigger the input */}
                    <label htmlFor="video-upload" style={{ cursor: 'pointer', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <VideoLibraryIcon fontSize="small" sx={{ color: 'white' }} />
                        </ListItemIcon>
                    </label>
                </MenuItem>
            </Tooltip>

            {/* Audio Upload */}
            <Tooltip title="Send Audio" placement="top">
                <MenuItem
                    sx={{
                        backgroundColor: audioColor,
                        color: 'white',
                        borderRadius: '8px',
                        marginBottom: '0.5rem',
                        '&:hover': {
                            backgroundColor: '#e68900', // Darker yellow on hover
                        },
                    }}
                >
                    <input
                        type="file"
                        accept="audio/mpeg, audio/wav"
                        onChange={(e) => handleFileChange(e, 'audio')}
                        sx={{
                            display: 'none',  // Hides the default file input
                        }}
                        id="audio-upload"
                        hidden
                    />
                    {/* Custom button to trigger the input */}
                    <label htmlFor="audio-upload" style={{ cursor: 'pointer', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <AudiotrackIcon fontSize="small" sx={{ color: 'white' }} />
                        </ListItemIcon>
                    </label>
                </MenuItem>
            </Tooltip>

            {/* Generic File Upload */}
            <Tooltip title="Send File" placement="top">
                <MenuItem
                    sx={{
                        backgroundColor: fileColor,
                        color: 'white',
                        borderRadius: '8px',
                        '&:hover': {
                            backgroundColor: '#0d6b58', // Darker green on hover
                        },
                    }}
                >
                    <input
                        type="file"
                        accept="file"
                        onChange={(e) => handleFileChange(e, 'file')}
                        sx={{
                            display: 'none',  // Hides the default file input
                        }}
                        id="file-upload"
                        hidden
                    />
                    {/* Custom button to trigger the input */}
                    <label htmlFor="file-upload" style={{ cursor: 'pointer', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                        <ListItemIcon sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <InsertDriveFileIcon fontSize="small" sx={{ color: 'white' }} />
                        </ListItemIcon>
                    </label>
                </MenuItem>
            </Tooltip>
        </Menu>
    );
};

export default FileMenu;
