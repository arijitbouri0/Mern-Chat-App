import mongoose ,{ Schema, model } from 'mongoose';

const MessageSchema = new Schema(
    {
        attachments: [
            {
                url: {
                    type: String,
                    required: true,
                },
                public_id: {
                    type: String,
                    required: true,
                },
            }
        ],
        content: {
            type: String,
        },
        sender: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        chat: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Chat",
            required: true,
        },
        reactions: [
            {
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required:true
                },
                reaction: {
                    type: String, // Example reactions like '👍', '❤️'
                },
            },
        ],
    },
    {
        timestamps: true, 
    }
);

export const Message = model("Message", MessageSchema);
