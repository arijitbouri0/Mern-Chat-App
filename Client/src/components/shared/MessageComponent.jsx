import React, { memo, useState } from "react";
import { Typography, Box } from "@mui/material";
import { Mood as MoodIcon } from "@mui/icons-material";
import { motion } from "framer-motion";
import moment from "moment";
import ReactionMenuDialog from "../dialogs/ReactionMenuDialog";
import RenderAttachment from "./RenderAttachment";
import { fileFormat } from "../../lib/features";

const MessageComponent = ({ message, user }) => {
  const { sender, content, attachments = [], createdAt } = message;
  const timeAgo = moment(createdAt).fromNow();
  const sameSender = sender?._id === user?._id;

  const [isHovered, setIsHovered] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedReaction, setSelectedReaction] = useState("");

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);

  const handleReactionClick = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleReactionSelect = (reaction) => {
    setSelectedReaction(reaction);
    setAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? "#DCF8C6" : "#E6F7FF", // Lighter background for better contrast
        color: "#333", // Dark text for contrast
        borderRadius: "20px",
        padding: "1rem 1.2rem", // Adding more padding for a balanced design
        width: "fit-content",
        position: "relative",
        marginBottom: "20px",
        maxWidth: "90%", // Prevent the message from stretching too wide
      }}
    >
      {/* Sender Info */}
      {!sameSender && (
        <Typography variant="caption" style={{ fontWeight: 600, color: "#333", marginBottom: "5px" }}>
          {sender.name}
        </Typography>
      )}

      {/* Message Content */}
      {content && <Typography>{content}</Typography>}

      {/* Attachments */}
      {attachments.length > 0 &&
        attachments.map((attachment, index) => {
          const url = attachment.url;
          const file = fileFormat(url);
          return (
            <Box key={index} style={{ marginTop: "10px" }}>
              {RenderAttachment(file, url)}
            </Box>
          );
        })}

      {/* Time */}
      <Typography variant="caption" style={{ color: "#666", marginTop: "5px" }}>
        {timeAgo}
      </Typography>

      {/* Tail */}
      <div
        style={{
          position: "absolute",
          bottom: "-8px",
          left: sameSender ? "auto" : "10px",
          right: sameSender ? "10px" : "auto",
          width: "0",
          height: "0",
          borderLeft: "10px solid transparent",
          borderRight: "10px solid transparent",
          borderTop: `10px solid ${sameSender ? "#DCF8C6" : "#E6F7FF"}`, // Matching the tail color
        }}
      />

      {/* Reaction Icon */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: sameSender ? "calc(-40px)" : "calc(100% + 10px)", // Adjusted for spacing
            transform: "translateY(-50%)",
            backgroundColor: "#999",
            borderRadius: "50%",
            padding: "8px",
            cursor: "pointer",
            zIndex: 2,
          }}
        >
          <MoodIcon style={{ color: "white" }} onClick={handleReactionClick} />
        </div>
      )}

      {/* Reaction Dialog */}
      <ReactionMenuDialog
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        sameSender={sameSender}
        onClose={handleMenuClose}
        onSelectReaction={handleReactionSelect}
      />

      {/* Selected Reaction */}
      {selectedReaction && (
        <Typography
          variant="body2"
          style={{
            position: "absolute",
            bottom: "-20px",
            right: "10px",
            color: "#333",
            fontWeight: "bold", // Make reaction text bold for emphasis
          }}
        >
          {selectedReaction}
        </Typography>
      )}
    </motion.div>
  );
};

export default memo(MessageComponent);
