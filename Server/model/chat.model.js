import mongoose,{ Schema, model } from 'mongoose';

const ChatSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        // avatar: [
        //     {
        //         type: String,
        //         required: true,
        //     }
        // ],
        groupChat: {
            type: Boolean,
            default: false,
        },
        creator: {
            type: mongoose.Schema.Types.ObjectId,
            ref:"User"
        },
        members: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            }
        ],
    },
    {
        timestamps: true,
    }
);

export const Chat = model("Chat", ChatSchema);
