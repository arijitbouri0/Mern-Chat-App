import { body, check, validationResult } from 'express-validator'
import { ErrorHandler } from '../utils/utility.js';


const validate = (req, res, next) => {
    const errors = validationResult(req);

    const errorMessage = errors
        .array()
        .map((error) => error.msg)
        .join(", ");

    if (errors.isEmpty()) return next()
    else next(new ErrorHandler(errorMessage, 400))
}

const registerValidator = () => [
    body("name", "enter your name").notEmpty(),
    body("userName", "enter your userName").notEmpty(),
    body("password", "enter your password").notEmpty(),
    body("bio", "enter your bio").notEmpty(),
]


const loginValidator = () => [
    body("userName", "enter your userName").notEmpty(),
    body("password", "enter your password").notEmpty(),
]

const newGroupValidator = () => [
    body("name", "Please enter Name").notEmpty(),
    body("members")
        .notEmpty()
        .withMessage("Please add Members")
        .isArray({ min: 2, max: 100 })
        .withMessage("Members must be 2-100"),
]
const addMembersValidator = () => [
    body("chatId", "Please enter Chat ID ").notEmpty(),
    body("members")
        .notEmpty()
        .withMessage("Please add Members")
        .isArray({ min: 1, max: 97 })
        .withMessage("Members must be 1-97"),
]

const removeMembersValidator = () => [
    body("chatId", "Please enter Chat ID ").notEmpty(),
    body("userId", "Please enter User ID ").notEmpty(),
]


const acceptRequestValidator = () => [
    body("requestId", "Please Enter Request ID").notEmpty(),
    body("accept", "Please Add Accept")
        .notEmpty()
        .withMessage("Please Add Accept")
        .isBoolean()
        .withMessage("Accept must be a boolean")
]


export {
    registerValidator,
    validate,
    loginValidator,
    newGroupValidator,
    addMembersValidator,
    removeMembersValidator,
    acceptRequestValidator,
}