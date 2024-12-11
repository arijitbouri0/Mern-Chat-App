import AddIcon from "@mui/icons-material/Add";
import { Menu, MenuItem, Stack } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { setShowEmojiPicker } from '../../Redux/reducers/misc';

const ReactionMenuDialog = ({ anchorEl, open, onClose, onSelectReaction,sameSender }) => {
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null); // Ref to emoji picker div for outside click detection
  const messageAreaRef = useRef(null); // Ref for the message area to detect clicks outside

  // Close emoji picker when clicked outside
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        messageAreaRef.current &&
        !messageAreaRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    // Add event listener on mount
    document.addEventListener("mousedown", handleOutsideClick);

    // Cleanup on unmount
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleEmojiClick = (emojiData) => {
    console.log(emojiData); // Handle emoji selection here
    setShowEmojiPicker(false); // Close picker after selecting emoji
  };

  const toggleEmojiPicker = () => {
    dispatch(setShowEmojiPicker(true));
    onClose(); // Toggle emoji picker visibility
  };

  return (
    <>
      {/* Reaction Menu */}
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={onClose}
        PaperProps={{
          style: {
            borderRadius: "50px",
            padding: "1rem",
            boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
            display: "flex",
            justifyContent: "center",
            zIndex: 1400, // Below emoji picker
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {reactions.map((reaction) => (
            <MenuItem
              key={reaction}
              onClick={() => onSelectReaction(reaction)}
              sx={{
                fontSize: "2rem", // Increased size
                cursor: "pointer",
                padding: "0.1rem",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              {reaction}
            </MenuItem>
          ))}

          {/* Add Button to toggle emoji picker */}
          {/* <MenuItem
            onClick={toggleEmojiPicker}
            sx={{ padding: "0.1rem" }}
          >
            <AddIcon fontSize="inherit" />
          </MenuItem>  */}
        </Stack>
      </Menu>
    </>

  );
};

export default ReactionMenuDialog;
