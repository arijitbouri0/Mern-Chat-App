import AddIcon from "@mui/icons-material/Add";
import { Menu, MenuItem, Stack } from "@mui/material";
import React from "react";
import { useDispatch } from "react-redux";
import { setShowEmojiPicker } from '../../Redux/reducers/misc';

const ReactionMenuDialog = ({ anchorEl, open, onClose, onSelectReaction, sameSender }) => {
  const reactions = ["👍", "❤️", "😂", "😮", "😢", "😡"];

  const dispatch = useDispatch();
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
          <MenuItem onClick={toggleEmojiPicker} sx={{ padding: "0.1rem" }}>
            <AddIcon fontSize="inherit" />
          </MenuItem>
        </Stack>
      </Menu>
    </>

  );
};

export default ReactionMenuDialog;
