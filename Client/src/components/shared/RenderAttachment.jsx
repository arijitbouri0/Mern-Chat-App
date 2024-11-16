// import React from 'react'
// import { transformImage } from '../../lib/features';
// import { FileOpen as FileOpenIcon } from '@mui/icons-material';

// const RenderAttachment = (file, url) => {
//     switch (file) {
//         case "video":
//             return <video src={url} preload='none' width={'200px'} controls />
//         case "audio":
//             return <audio src={url} preload='none' controls />
//         case "image":
//             return <img
//                 src={transformImage(url, 200)}
//                 alt='Attachment'
//                 width={'200px'}
//                 height={'150px'}
//                 style={{
//                     objectFit: 'contain',
//                     cursor: "pointer",
//                 }}
//             />
//         default:
//             return <FileOpenIcon />
//     }
// }

// export default RenderAttachment;


import React from 'react';
import { transformImage } from '../../lib/features';
import { FileOpen as FileOpenIcon } from '@mui/icons-material';

const RenderAttachment = (file, url) => {
    switch (file) {
        case "video":
            return (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <video src={url} preload="none" width={"200px"} controls />
                </a>
            );
        case "audio":
            return (
                <a href={url} target="_blank" rel="noopener noreferrer">
                    <audio src={url} preload="none" controls />
                </a>
            );
        case "image":
            return (
                <a href={url} target="_blank" rel="noopener noreferrer" download>
                    <img
                        src={transformImage(url, 200)}
                        alt="Attachment"
                        width={"200px"}
                        height={"150px"}
                        style={{
                            objectFit: "contain",
                            cursor: "pointer", // Indicate it's clickable
                        }}
                    />
                </a>
            );
        default:
            return (
                <a href={url} download>
                    <FileOpenIcon />
                </a>
            );
    }
};

export default RenderAttachment;
