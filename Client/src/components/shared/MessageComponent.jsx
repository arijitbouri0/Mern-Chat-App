import React, { memo, useState } from "react";
import { Typography, Box, Button } from "@mui/material";
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
  const [showFullMessage, setShowFullMessage] = useState(false); // State for "Read More"

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

  const toggleShowFullMessage = () => {
    setShowFullMessage((prev) => !prev);
  };

  const truncatedContent =
    content && content.length > 250 && !showFullMessage
      ? `${content.slice(0, 250)}...`
      : content;

  return (
    <motion.div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      initial={{ opacity: 0, x: "-100%" }}
      animate={{ opacity: 1, x: 0 }}
      style={{
        alignSelf: sameSender ? "flex-end" : "flex-start",
        backgroundColor: sameSender ? "#7F00FF" : "white",
        color: sameSender ? "white" : "#333",
        borderRadius: "20px",
        padding: "1rem 1rem",
        width: "fit-content",
        position: "relative",
        marginBottom: "20px",
        maxWidth: "90%",
      }}
    >
      {!sameSender && (
        <Typography
          variant="body2"
          style={{ fontWeight: 600, color: "red", marginBottom: "5px" }}
        >
          {sender.name}
        </Typography>
      )}

      {content && (
        <Typography>
          {truncatedContent}
          {content.length > 250 && (
            <Button
              size="small"
              style={{ textTransform: "none", marginLeft: "5px", padding: 0, color:'black' }}
              onClick={toggleShowFullMessage}
            >
              {showFullMessage ? "Show Less" : "Read More"}
            </Button>
          )}
        </Typography>
      )}

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

      <Typography
        variant="caption"
        color=""
        style={{ color: sameSender ? "#E6F7FF" : "black", marginTop: "5px" }}
      >
        {timeAgo}
      </Typography>

      <div
        style={{
          position: "absolute",
          bottom: sameSender ? "-8px" : "auto",
          top: sameSender ? "auto" : "-8px",
          left: sameSender ? "auto" : "10px",
          right: sameSender ? "10px" : "auto",
          width: "0",
          height: "0",
          borderLeft: "15px solid transparent",  // Left side of the triangle
          borderRight: "15px solid transparent",
          borderTop: sameSender ? "15px solid #7F00FF" : "none", // Tail points down for same sender
          borderBottom: sameSender ? "none" : "15px solid white", // Tail points up for not same sender

        }}
      />

      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: sameSender ? "calc(-40px)" : "calc(100% + 2px)",
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

      <ReactionMenuDialog
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        sameSender={sameSender}
        onClose={handleMenuClose}
        onSelectReaction={handleReactionSelect}
      />

      {selectedReaction && (
        <Typography
          variant="h4"
          style={{
            position: "absolute",
            bottom: "-20px",
            left: "10px",
            color: "#333",
            fontWeight: "bold",
          }}
        >
          {selectedReaction}
        </Typography>
      )}
    </motion.div>
  );
};

export default memo(MessageComponent);

