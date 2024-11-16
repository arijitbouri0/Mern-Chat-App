import jwt from 'jsonwebtoken';
import { v2 as cloudinary } from 'cloudinary'
import { v4 as uuid } from 'uuid'
import { getBase64, getSockets } from '../lib/helper.js';

const cookieOption = {
    maxAge: 15 * 24 * 60 * 60 * 1000,
    sameSite: "none",
    httpOnly: true,
    secure: true,
}
const sendtoken = (res, user, code, message) => {
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

    return res
        .status(code)
        .cookie("chat-app", token, cookieOption)
        .json({
            success: true,
            token,
            message,
            user
        })
}

const emitEvent = (req, event, users, data) => {
    const io=req.app.get("io")
    const userSockets = getSockets(users);
    io.to(userSockets).emit(event, data);
}


const uploadFilesToCloudinary = async (files = []) => {
    const uploadPromises = files.map((file) => {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.upload(
                getBase64(file), {
                resource_type: "auto",
                public_id: uuid()
            }, (error, result) => {
                if (error) {
                    return reject(error);
                }
                resolve(result);
            });
        });
    });
    try {
        const uploadResults = await Promise.all(uploadPromises);
        return uploadResults;
    } catch (error) {
        throw new Error("Error uploading files:", error);;
    }
};

const deleteFilesFromCloudinary = async (public_id) => {

}


export { sendtoken, cookieOption, emitEvent, deleteFilesFromCloudinary, uploadFilesToCloudinary };