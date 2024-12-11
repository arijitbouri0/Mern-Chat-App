import { ErrorHandler } from "../utils/utility.js";
import { Chat } from '../model/chat.model.js'
import { emitEvent, deleteFilesFromCloudinary, uploadFilesToCloudinary } from "../utils/feature.js";
import { ALERT, NEW_ATTACHMENT, NEW_MESSAGE, NEW_MESSAGE_ALERT, REFETCH_CHATS } from "../constants/event.js";
import { getOtherMember } from "../lib/helper.js";
import { User } from '../model/user.model.js'
import { Message } from "../model/message.model.js";
import { v4 as uuid } from 'uuid'

export const newGroupChat = async (req, res, next) => {
    try {
        const { name, members } = req.body;
        if (members.length < 2) {
            return next(new ErrorHandler("Group chat must have at least 3 members", 400))
        }

        const allMembers = [...members, req.user]

        await Chat.create({
            name,
            groupChat: true,
            creator: req.user,
            members: allMembers
        })

        emitEvent(req, ALERT, allMembers, `Welcome to ${name} group`);
        emitEvent(req, REFETCH_CHATS, members);

        return res.status(201).json({
            success: true,
            message: "Group chat created"
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}


export const getMyChats = async (req, res, next) => {
    try {
        const chats = await Chat.find({ members: req.user }).populate("members",
            "name avatar userName bio"
        );


        const transformedChats = chats.map(({ _id, name, members, groupChat }) => {
            const otherMember = getOtherMember(members, req.user)
            return {
                _id,
                groupChat,
                avatar: groupChat
                    ? members.slice(0, 3).map(({ avatar }) => avatar.url)
                    : [otherMember.avatar.url],
                name: groupChat ? name : otherMember.name,
                members: members.reduce((prev, curr) => {
                    if (curr._id.toString() !== req.user.toString()) {
                        prev.push(curr._id)
                    }
                    return prev;
                }, []),
            }
        })

        return res.status(200).json({
            success: true,
            transformedChats
        });

    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }
}
export const getMyGroups = async (req, res, next) => {

    try {
        const chats = await Chat.find({
            members: req.user,
            groupChat: true,
        }).populate("members", "name avatar");

        const groups = chats.map(({ name, members, _id, groupChat }) => ({
            _id,
            groupChat,
            avatar: members.slice(0, 3).map(({ avatar }) => avatar.url),
            name
        }));

        return res.status(200).json({
            success: true,
            groups
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500))
    }


}
export const addMembers = async (req, res, next) => {
    try {
        const { chatId, members } = req.body;

        // Validate input
        if (!chatId || !Array.isArray(members) || members.length === 0) {
            return next(new ErrorHandler("Chat ID and members are required", 400));
        }

        // Find the chat by chatId
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }

        // Check if the requesting user is the creator of the chat
        if (chat.creator.toString() !== req.user.toString()) {
            return next(new ErrorHandler("You are not allowed to add members to this chat", 403));
        }

        // Maximum group member limit
        const maxMembers = 100;

        // Filter out members that are already part of the chat
        const existingMemberIds = chat.members.map(member => member.toString());
        const newMembers = members.filter(memberId => !existingMemberIds.includes(memberId));

        // If all members are already in the chat
        if (newMembers.length === 0) {
            return res.status(200).json({
                success: true,
                message: "All members are already part of this chat.",
                chat
            });
        }
        const totalMembersAfterAddition = chat.members.length + newMembers.length;
        if (totalMembersAfterAddition > maxMembers) {
            return next(new ErrorHandler(`Cannot add members. Group limit of ${maxMembers} exceeded.`, 400));
        }

        // Add new members
        const allNewMembersPromise = newMembers.map(async memberId => {
            chat.members.push(memberId); // Assuming members are stored as an array of IDs
        });

        await Promise.all(allNewMembersPromise);
        await chat.save();

        if (newMembers.length > 0) {
            emitEvent(req, ALERT, newMembers, `Welcome to ${chat.name} group`);
        }

        // Emit refetch event to only existing members
        emitEvent(req, REFETCH_CHATS, chat.members.filter(memberId => !newMembers.includes(memberId)));


        return res.status(200).json({
            success: true,
            message: "Members added successfully",
            chat
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const removeMembers = async (req, res, next) => {
    try {
        const { chatId, userId } = req.body;

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }
        if (chat.creator.toString() !== req.user.toString()) {
            return next(new ErrorHandler("You are not allowed to remove members", 403));
        }
        if (!chat.members.map(m => m.toString()).includes(userId)) {
            return next(new ErrorHandler("User not found in the chat members", 400));
        }

        const oldChatMembers = chat.members.map((i) => i.toString());
        chat.members = chat.members.filter(memberId => memberId.toString() !== userId);
        await chat.save();

        const removedMemberDetails = await User.findById(userId, 'name');
        const removedMemberName = removedMemberDetails ? removedMemberDetails.name : 'Unknown Member';

        emitEvent(req, ALERT, [userId], {
            message: `${removedMemberName} has beem removed from the group`,
            chatId
        });
        emitEvent(
            req,
            REFETCH_CHATS,
            oldChatMembers,
            `Member ${removedMemberName} has been removed from the group.`
        );

        return res.status(200).json({
            success: true,
            chat,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const changeAdmin = async (req, res, next) => {
    try {
        const { chatId, newAdminId } = req.body;  // Assuming newAdminId is provided in the request body

        const chat = await Chat.findById(chatId);

        if (!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }
        if (chat.creator.toString() !== req.user.toString()) {
            return next(new ErrorHandler("You are not allowed to change the admin", 403));
        }

        if (!chat.members.map(m => m.toString()).includes(newAdminId)) {
            return next(new ErrorHandler("User not found in the chat members", 400));
        }

        // Update the admin of the chat
        chat.creator = newAdminId; // Assuming chat model has an 'admin' field

        await chat.save();

        const newAdminDetails = await User.findById(newAdminId, 'name');
        const newAdminName = newAdminDetails ? newAdminDetails.name : 'Unknown Member';

        // Emit event to new admin
        emitEvent(req, ALERT, [newAdminId], {
            message: `${newAdminName}, you are the new admin of the group`,
            chatId
        });

        // Notify all members about the new admin
        emitEvent(
            req,
            REFETCH_CHATS,
            chat.members,
            `Member ${newAdminName} has been assigned as the new group Admin.`
        );

        return res.status(200).json({
            success: true,
            chat,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};


export const leaveGroup = async (req, res, next) => {
    try {
        const chatId = req.params.id;
        const chat = await Chat.findById(chatId);

        if (!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }

        const remainingMembers = chat.members.filter(member => member.toString() !== req.user.toString());

        let newAdminAssigned = false;
        let newCreator = null;

        if (chat.creator.toString() === req.user.toString() && remainingMembers.length > 0) {
            const randomIndex = Math.floor(Math.random() * remainingMembers.length);
            newCreator = remainingMembers[randomIndex];
            chat.creator = newCreator;
            newAdminAssigned = true;
        }

        chat.members = remainingMembers;
        await chat.save();

        // Notify the whole group if there's a new admin assigned
        if (newAdminAssigned) {
            emitEvent(
                req,
                ALERT,
                chat.members,
                `The admin has left the group. ${newCreator} is now the new admin.`
            );

            // Notify the new admin of their new role
            emitEvent(
                req,
                ALERT,
                [newCreator],
                `You have been assigned as the new admin of ${chat.name}.`
            );
        }

        // Emit an event to update members of the user's departure
        emitEvent(
            req,
            REFETCH_CHATS,
            chat.members,
            `${req.user.name} has left the group.`
        );

        return res.status(200).json({
            success: true,
            message: "You have left the group successfully.",
            chat,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};
export const sendAttachments = async (req, res, next) => {
    try {
        const { chatId } = req.body;
        const files = req.files || [];



        if (files.length < 1) {
            return next(new ErrorHandler("Please Upload attachments", 400))
        }

        if (files.length > 5) {
            return next(new ErrorHandler("Files Can't be more than 5", 400))
        }

        const [chat, me] = await Promise.all([
            Chat.findById(chatId),
            User.findById(req.user, "name")
        ]);


        if (!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }
        const results = await uploadFilesToCloudinary(files);
        const attachments = results.map(result => ({
            public_id: result.public_id,
            url: result.secure_url,
        }));


        const messageForRealTime = {
            content: "", // No content as it's specifically for attachments
            _id: uuid(), // Unique ID for real-time tracking
            sender: { _id: me._id, name: me.name }, // Sender details from `me`
            chat: chatId,
            attachments, // Attachments array from upload results
            createdAt: new Date().toISOString(),
        };



        const messageForDatabase = {
            content: "",
            attachments,
            sender: me._id,
            chat: chatId
        }

        const message = await Message.create(messageForDatabase)

        emitEvent(req, NEW_MESSAGE, chat.members, {
            message: messageForRealTime,
            chatId,
        })

        emitEvent(req, NEW_MESSAGE_ALERT, chat.members, {
            chatId,
        })
        return res.status(200).json({
            success: true,
            message
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

export const getChatDetails = async (req, res, next) => {
    try {
        if (req.query.populate === 'true') {
            const chat = await Chat.findById(req.params.id)
                .populate("members", "name avatar bio userName")
                .lean();

            if (!chat) return next(new ErrorHandler("Chat not found", 404));
            chat.members = chat.members.map(({ _id, name, avatar }) => ({
                _id,
                name,
                avatar
            }))
            return res.status(200).json({
                success: true,
                chat
            });
        } else {
            const chat = await Chat.findById(req.params.id)
                .populate("members", "name avatar bio userName")
            if (!chat) return next(new ErrorHandler("Chat not found", 404));
            return res.status(200).json({
                success: true,
                chat
            });
        }
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
}

export const renameGroup = async (req, res, next) => {
    try {
        const chatId = req.params.id;
        const { name } = req.body
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }

        if (chat.creator.toString() !== req.user.toString()) {
            return next(new ErrorHandler("You are not allowed to rename this group", 403));
        }

        const oldName = chat.name;
        chat.name = name;
        await chat.save();

        emitEvent(
            req,
            ALERT,
            chat.members,
            `The group name has been changed from "${oldName}" to "${name}"`
        );

        return res.status(200).json({
            success: true,
            message: `Group name has been updated to ${name}`,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const deleteChat = async (req, res, next) => {
    try {
        const chatId = req.params.id;
        const chat = await Chat.findById(chatId);
        if (!chat) {
            return next(new ErrorHandler("Chat not found", 404));
        }
        const members = chat.members
        if (chat.groupChat && chat.creator.toString() !== req.user.toString()) {
            return next(new ErrorHandler("You are not allowed to delete this group", 403));
        }

        if (!chat.groupChat && !chat.members.includes(req.user.toString())) {
            return next(new ErrorHandler("You are not allowed to delete this chat", 403));
        }

        const messagesWithAttachments = await Message.find({
            chat: chatId,
            attachments: { $exists: true, $ne: [] },
        })

        const public_ids = [];

        messagesWithAttachments.forEach(({ attachments }) =>
            attachments.forEach(({ public_id }) =>
                public_ids.push(public_id))
        );

        await Promise.all([
            deleteFilesFromCloudinary(public_ids),
            chat.deleteOne(),
            Message.deleteMany({ chat: chatId }),
        ])

        emitEvent(req, REFETCH_CHATS, members)

        return res.status(200).json({
            success: true,
            message: `Chat deleted succesfully`,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

export const getMessages = async (req, res, next) => {
    try {
        const chatId = req.params.chatId;
        const { page = 1 } = req.query;
        const limit = 20;
        const skip = (page - 1) * limit;

        const chat = await Chat.findById(chatId);

        if (!chat) return next(new ErrorHandler("Chat not found", 404));

        if (!chat.members.includes(req.user.toString()))
            return next(new ErrorHandler("You are not allowed to acces this chat", 404));

        const [message, totalMessagesCount] = await Promise.all([Message.find({ chat: chatId })
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit)
            .populate("sender", "name avatar")
            .lean(),
        Message.countDocuments({ chat: chatId }),
        ])

        const totalPages = Math.ceil(totalMessagesCount / limit) || 0

        return res.status(200).json({
            success: true,
            message: message.reverse(),
            totalPages
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};

// export const reactToMessage = async (req, res, next) => {
//     try {
//         const { messageId, reaction } = req.body;
//         const userId = req.user._id;
//         let existingReaction = await message.findOne({ messageId, userId });

//         if (existingReaction) {
//             // Update the existing reaction if it already exists
//             existingReaction.reaction = reaction;
//             await existingReaction.save();
//             return res.status(200).json({ message: 'Reaction updated successfully' });
//         }

//         // Create a new reaction if it doesn't exist
//         const newReaction = new Reaction({
//             messageId,
//             userId,
//             reaction,
//         });

//         await newReaction.save();
//         return res.status(201).json({ message: 'Reaction added successfully' });

//     } catch (error) {

//     }
// }

export const getAvailableUsersForGroup = async (req, res, next) => {
    try {
        const { chatId } = req.params;

        // Find the group chat by its ID
        const groupChat = await Chat.findById(chatId);
        if (!groupChat) {
            return next(new ErrorHandler("Chat not found", 404));
        }
        const groupMemberIds = new Set(groupChat.members.map(member => member.toString()));

        const otherChats = await Chat.find({
            _id: { $ne: chatId }, // Exclude the current group chat
        });
        const availableUserIds = new Set();

        otherChats.forEach(chat => {
            chat.members.forEach(memberId => {
                // Only add the member if they are not already in the current group
                if (!groupMemberIds.has(memberId.toString())) {
                    availableUserIds.add(memberId.toString());
                }
            });
        });

        const availableUsersDetails = await User.find({
            '_id': { $in: [...availableUserIds] }  // Find users whose IDs are in availableUserIds
        }).select('name avatar userId');

        // Convert the Set to an array for the response
        return res.status(200).json({
            success: true,
            availableUsers: availableUsersDetails // List of user IDs not in the current group
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};
;




