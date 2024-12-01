import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItem, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmojiPicker from "emoji-picker-react";

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
    setShowEmojiPicker(!showEmojiPicker);
    onClose() // Toggle emoji picker visibility
  };

  // Styles for the emoji picker
  const emojiPickerStyles = {
    position: "fixed", // Fixed position to center the screen
    top: "50%", // Vertically center
    left: sameSender ? "auto" : "100%", // Center when different sender, else move based on sender condition
    right: sameSender ? "50%" : "auto", 
    transform: "translate(-50%, -50%)", // Adjust for centering
    zIndex: 1500, // Ensure it's on top of other content
    maxHeight: "500px", // Optional max height to prevent overflow
    width:'auto'
  };

  return (
    <div ref={messageAreaRef}>
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
        <Stack direction="row" spacing={2} alignItems="center">
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
          <MenuItem
            onClick={toggleEmojiPicker}
            sx={{ padding: "0.1rem" }}
          >
            <AddIcon fontSize="inherit" />
          </MenuItem>
        </Stack>
      </Menu>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef} // Reference for detecting click outside the emoji picker
          className="emoji-picker-wrapper"
          style={emojiPickerStyles} // Apply center positioning styles
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            pickerStyle={{
              fontSize: "2rem", // Adjust size for the picker
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default ReactionMenuDialog;
