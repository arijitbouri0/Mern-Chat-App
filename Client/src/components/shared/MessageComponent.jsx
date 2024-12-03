// import { Mood as MoodIcon } from '@mui/icons-material';
// import { Box, Typography } from '@mui/material';
// import { motion } from 'framer-motion';
// import moment from 'moment';
// import React, { memo, useState } from 'react';
// import { lightBlue } from '../../constants/color';
// import { fileFormat } from '../../lib/features';
// import ReactionMenuDialog from '../dialogs/ReactionMenuDialog';
// import RenderAttachment from './RenderAttachment';

// const MessageComponent = ({ message, user }) => {
//   const { sender, content, attachments = [], createdAt } = message;
//   const timeAgo = moment(createdAt).fromNow();
//   const sameSender = sender?._id === user?._id;

//   const [isHovered, setIsHovered] = useState(false);
//   const [showReactionMenu, setShowReactionMenu] = useState(false);
//   const [selectedReaction, setSelectedReaction] = useState("");

//   const handleMouseEnter = () => setIsHovered(true);
//   const handleMouseLeave = () => setIsHovered(false);



//   const [anchorEl, setAnchorEl] = useState(null);

//   const handleReactionSelect = (reaction) => {
//     setSelectedReaction(reaction); // Store the selected reaction
//     setAnchorEl(null) // Close the menu after selecting a reaction
//   };

//   const reactionDialogHandler = (e) => {
//     setAnchorEl(e.currentTarget);
//   };

//   const handleMenuClose = () => setAnchorEl(null);


//   return (
//     <motion.div
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//       initial={{ opacity: 0, x: '-100%' }}
//       animate={{ opacity: 1, x: 0 }}
//       style={{
//         alignSelf: sameSender ? 'flex-end' : 'flex-start',
//         backgroundColor: sameSender ? '#98FB98' : '#00B0FF',
//         color: 'white',
//         borderRadius: '20px',
//         padding: '0.5rem 1rem',
//         maxWidth: '70%',
//         position: 'relative',
//         marginBottom: '10px',
//         cursor: 'pointer',
//         overflow:'visible'
//       }}
//     >
//       {/* Wrapper div for the message and the mood icon */}
//       <div
//         style={{
//           position: 'relative',
//           display: 'flex',
//           flexDirection: 'column',
//           alignItems: sameSender ? 'flex-end' : 'flex-start',
//         }}
//       >
//         {/* Display sender's name if not the same sender */}
//         {!sameSender && (
//           <Typography color={lightBlue} fontWeight={'600'} variant="caption">
//             {sender.name}
//           </Typography>
//         )}

//         {/* Display the message content */}
//         {content && <Typography>{content}</Typography>}

//         {/* Display attachments */}
//         {attachments.length > 0 &&
//           attachments.map((attachment, index) => {
//             const url = attachment.url;
//             const file = fileFormat(url);

//             return (
//               <Box key={index}>
//                 {RenderAttachment(file, url)}
//               </Box>
//             );
//           })}

//         {/* Display message time */}
//         <Typography variant="caption" color="text.secondary">
//           {timeAgo}
//         </Typography>

//         {/* Tail for the other sender */}
//         {!sameSender && (
//           <div
//             style={{
//               position: 'absolute',
//               bottom: '-8px',
//               left: '10px',
//               width: '0',
//               height: '0',
//               borderLeft: '10px solid transparent',
//               borderRight: '10px solid transparent',
//               borderTop: `10px solid #00B0FF`,
//               zIndex: 1, // Ensure visibility
//             }}
//           />
//         )}

//         {sameSender && (
//           <div
//             style={{
//               position: 'absolute',
//               bottom: '-8px',
//               right: '10px',
//               width: '0',
//               height: '0',
//               borderLeft: '10px solid transparent',
//               borderRight: '10px solid transparent',
//               borderTop: `10px solid #98FB98`,
//               zIndex: 1, // Ensure visibility
//             }}
//           />
//         )}

//         {/* Show MoodIcon when hovered */}
//         {isHovered && (
//           <div
//             style={{
//               position: 'absolute',
//               left: sameSender ? 'calc(-50px)' : 'calc(100% + 10px)', // Dynamic positioning
//               top: '50%',
//               transform: 'translateY(-50%)',
//               backgroundColor: 'gray',
//               borderRadius: '50%',
//               padding: '8px',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               zIndex: 10,
//               transition: 'left 0.3s ease-in-out',
//             }}
//           >
//             <MoodIcon style={{ color: 'white' }} onClick={reactionDialogHandler} />
//           </div>
//         )}

//         <ReactionMenuDialog
//           anchorEl={anchorEl}
//           open={Boolean(anchorEl)}
//           onClose={handleMenuClose}
//           onSelectReaction={handleReactionSelect}
//         />

//         {/* Show selected reaction */}
//         {selectedReaction && (
//           <div style={{ position: 'absolute', bottom: '10px', right: '10px' }}>
//             <Typography variant="body2">{selectedReaction}</Typography>
//           </div>
//         )}
//       </div>
//     </motion.div>
//   );
// };

// export default memo(MessageComponent);

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
        backgroundColor: sameSender ? "#98FB98" : "#00B0FF",
        color: "white",
        borderRadius: "20px",
        padding: "1rem",
        width:'fit-content',
        position: "relative",
        marginBottom: "20px",
      }}
    >
      {/* Sender Info */}
      {!sameSender && (
        <Typography
          variant="caption"
          style={{ fontWeight: 600, color: "#333" }}
        >
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
            <Box key={index}>
              {RenderAttachment(file, url)}
            </Box>
          );
        })}

      {/* Time */}
      <Typography variant="caption" style={{ color: "#ddd" }}>
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
          borderTop: `10px solid ${sameSender ? "#98FB98" : "#00B0FF"}`,
        }}
      />

      {/* Reaction Icon */}
      {isHovered && (
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: sameSender ? 'calc(-40px)' : 'calc(100% )', 
            transform: "translateY(-50%)",
            backgroundColor: "gray",
            borderRadius: "50%",
            padding: "8px",
            cursor: "pointer",
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
            color: "#000",
          }}
        >
          {selectedReaction}
        </Typography>
      )}
    </motion.div>
  );
};

export default memo(MessageComponent);
