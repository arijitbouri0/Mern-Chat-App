import bcrypt from 'bcrypt';
import { NEW_REQUEST, REFETCH_CHATS } from '../constants/event.js';
import { getOtherMember } from '../lib/helper.js';
import { Chat } from '../model/chat.model.js';
import { Request } from '../model/request.model.js';
import { User } from '../model/user.model.js';
import { cookieOption, emitEvent, sendtoken, uploadFilesToCloudinary } from '../utils/feature.js';
import { ErrorHandler } from '../utils/utility.js';
import { userSocketIDs } from '../index.js';

export const register = async (req, res, next) => {


    const { name, userName, bio, password } = req.body;
    const file = req.file
    if (!file) return next(new ErrorHandler("Please Upload Avatar", 400))

    const result = await uploadFilesToCloudinary([file]);
    const avatar = {
        public_id: result[0].public_id,
        url: result[0].url
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
        name,
        userName,
        password: hashedPassword,
        bio,
        avatar
    })
    sendtoken(res, user, 201, "user created successfully")
};

export const login = async (req, res, next) => {
    const { userName, password } = req.body;
    const user = await User.findOne({ userName }).select('+password');
    if (!user) return next(new ErrorHandler("Invalid UserName or Password", 404));
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return next(new ErrorHandler("Invalid Password", 404));
    sendtoken(res, user, 201, `Welcome Back , ${user.name}`);
};

export const getMyProfile = async (req, res, next) => {
    if (!req.user) {
        return next(new ErrorHandler("Please Login ", 404))
    }
    const user = await User.findById(req.user).select("-password")
    res.status(200).json({
        success: true,
        data: user,
    })
}

export const updateUserProfile = async (req, res) => {
    const { name, bio } = req.body;
    const avatar = req.file ? { public_id: req.file.filename, url: req.file.path } : null;

    try {
        const user = await User.findById(req.user.id);

        if (name) user.name = name;
        if (bio) user.bio = bio;
        if (avatar) user.avatar = avatar;

        await user.save();

        res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

export const logout = async (req, res) => {
    res.status(200).cookie("chat-app", "", { ...cookieOption, maxAge: 0 })
        .json({
            success: true,
            message: "Logged out succesfully"
        })
}


export const searchUser = async (req, res) => {
    const { name } = req.query;

    // Fetch all private (one-to-one) chats that include the current user
    const myChats = await Chat.find({ groupChat: false, members: req.user });

    // Get all user IDs from the chats the current user is involved in
    const allUsersFromMyChats = myChats.flatMap((chat) => chat.members);

    // Add the current user's ID to the list of IDs to exclude
    allUsersFromMyChats.push(req.user);

    // Find users who are not in the current user's chats and match the search name
    const allUsersExceptMeAndFriends = await User.find({
        _id: { $nin: allUsersFromMyChats },
        name: { $regex: name, $options: "i" },
    });

    // Map the users to return only specific fields
    const users = allUsersExceptMeAndFriends.map(({ _id, name, avatar }) => ({
        _id,
        name,
        avatar: avatar.url
    }));

    res.status(200).json({
        success: true,
        users
    });
};



// export const sendRequest = async (req, res, next) => {
//     const { receiverId } = req.body;

//     if (receiverId === req.user.toString()) {
//         return next(new ErrorHandler("You cannot send a friend request to yourself", 400));
//     }

//     const request = await Request.findOne({
//         $or: [
//             { sender: req.user, receiver: receiverId },
//             { sender: receiverId, receiver: req.user }
//         ]
//     });

//     if (request) {
//         return next(new ErrorHandler("Request already accepted", 400));
//     }

//     // Create the friend request
//     const request = await Request.create({
//         sender: req.user,
//         receiver: receiverId
//     });

//     console.log(request);

//     const io = req.app.get("io");
//     const receiverSocket = userSocketIDs.get(receiverId); // Get the receiver's socket ID
//     if (receiverSocket) {
//         io.to(receiverSocket).emit(NEW_REQUEST, {
//             senderId: req.user,
//             requestId: request._id,
//             message: "You have a new friend request."
//         });
//     }

//     res.status(200).json({
//         success: true,
//         message: "Friend Request Sent"
//     });
// };



export const sendRequest = async (req, res, next) => {
    const { receiverId } = req.body;

    if (receiverId === req.user.toString()) {
        return next(new ErrorHandler("You cannot send a friend request to yourself", 400));
    }

    const existingRequest = await Request.findOne({
        $or: [
            { sender: req.user, receiver: receiverId },
            { sender: receiverId, receiver: req.user }
        ]
    });

    if (existingRequest) {
        return next(new ErrorHandler("Request already accepted", 400));
    }

    // Create the friend request
    const request = await Request.create({
        sender: req.user,
        receiver: receiverId
    });

    // Emit the NEW_REQUEST event to the receiver
    const io = req.app.get("io");
    const receiverSocket = userSocketIDs.get(receiverId); // Get the receiver's socket ID

    if (receiverSocket) {
        io.to(receiverSocket).emit(NEW_REQUEST, {
            senderId: req.user,
            requestId: request._id,
            message: "You have a new friend request."
        });
    }

    res.status(200).json({
        success: true,
        message: "Friend Request Sent"
    });
};


export const acceptRequest = async (req, res, next) => {
     const { requestId, accept } = req.body;
   
    const request = await Request.findById(requestId.toString())
        .populate("sender", "name")
        .populate("receiver", "name");

    if (!request) return next(new ErrorHandler("Request not found", 404));

    if (request.receiver._id.toString() !== req.user.toString()) {
        return next(new ErrorHandler("You are not authorized to accept this request", 401));
    }

    if (!accept) {
        await request.deleteOne();
        return res.status(200).json({
            success: true,
            message: "Friend Request Rejected"
        });
    }

    const members = [request.sender._id, request.receiver._id];
    await Promise.all([
        Chat.create({
            members,
            name: `${request.sender.name}-${request.receiver.name}`
        }),
        request.deleteOne()
    ]);

    emitEvent(req, REFETCH_CHATS, members);

    res.status(200).json({
        success: true,
        message: "Friend Request Accepted",
        senderId: request.sender._id
    });
};



export const getMyNotification = async (req, res, next) => {
    try {
        const requests = await Request.find({ receiver: req.user })
            .populate("sender", "name avatar");

        const allRequest = requests.map(({ _id, sender }) => ({
            _id,
            name: sender.name,
            avatar: sender.avatar.url
        }));

        res.status(200).json({
            success: true,
            message: "Friend Request Notifications",
            allRequest
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};



export const getMyFriends = async (req, res, next) => {
    try {
        const chatId = req.query.chatId;
        const chats = await Chat.find({
            members: req.user,
            groupChat: false,
        }).populate("members", "name avatar");

        const friends = chats.map((chat) => {
            const otherUser = getOtherMember(chat.members, req.user);
            return {
                _id: otherUser._id,
                name: otherUser.name,
                avatar: otherUser.avatar.url,
            };
        });

        if (chatId) {
            const chat = await Chat.findById(chatId);
            const availableFriends = friends.filter((friend) => !chat.members.includes(friend._id));

            return res.status(200).json({
                success: true,
                availableFriends,
            });
        }

        return res.status(200).json({
            success: true,
            friends,
        });
    } catch (error) {
        return next(new ErrorHandler(error.message, 500));
    }
};
