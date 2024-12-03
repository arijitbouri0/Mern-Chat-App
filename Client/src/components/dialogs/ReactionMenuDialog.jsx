import React, { useState, useEffect, useRef } from "react";
import { Menu, MenuItem, Stack } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EmojiPicker from "emoji-picker-react";

const ReactionMenuDialog = ({ anchorEl, open, onClose, onSelectReaction, sameSender }) => {
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const emojiPickerRef = useRef(null); // Ref for emoji picker
  const containerRef = useRef(null); // Ref for the dialog container

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(event.target) &&
        containerRef.current &&
        !containerRef.current.contains(event.target)
      ) {
        setShowEmojiPicker(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  const handleEmojiClick = (emojiData) => {
    onSelectReaction(emojiData.emoji); // Pass selected emoji back to parent
    setShowEmojiPicker(false);
  };

  const toggleEmojiPicker = () => {
    setShowEmojiPicker(!showEmojiPicker);
    onClose();
  };

  const calculatePickerPosition = () => {
    const baseStyles = {
      position: "fixed",
      transform: "translateY(50%)",
      zIndex: 1500,
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
    };

    if (window.innerWidth <= 768) {
      // For small screens, center the picker
      return { ...baseStyles, left: "50%", top: "50%", transform: "translate(-50%, -50%)" };
    } else {
      // For larger screens, position relative to the message
      return { ...baseStyles, left: sameSender ? "calc(-500%)" : "calc(100%)", top: anchorEl?.getBoundingClientRect().top || 0 };
    }
  };

  return (
    <div ref={containerRef}>
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
          },
        }}
      >
        <Stack direction="row" spacing={1} alignItems="center">
          {reactions.map((reaction) => (
            <MenuItem
              key={reaction}
              onClick={() => onSelectReaction(reaction)}
              sx={{
                fontSize: "2rem",
                cursor: "pointer",
                padding: "0.1rem",
                "&:hover": { backgroundColor: "#f0f0f0" },
              }}
            >
              {reaction}
            </MenuItem>
          ))}
          <MenuItem onClick={toggleEmojiPicker} sx={{ padding: "0.1rem" }}>
            <AddIcon fontSize="large" />
          </MenuItem>
        </Stack>
      </Menu>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div
          ref={emojiPickerRef}
          style={calculatePickerPosition()}
        >
          <EmojiPicker
            onEmojiClick={handleEmojiClick}
            pickerStyle={{
              fontSize: "1.5rem",
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
