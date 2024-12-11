import express from 'express';
import { addMembers, changeAdmin, deleteChat, getAvailableUsersForGroup, getChatDetails, getMessages, getMyChats, getMyGroups, leaveGroup, newGroupChat, removeMembers, renameGroup, sendAttachments } from '../controller/chat.controller.js';
import { addMembersValidator, newGroupValidator, removeMembersValidator, validate } from '../lib/validators.js';
import { authenticate } from '../middlewares/auth.js';
import { attachmentMulter, singleAvatar } from '../middlewares/multer.js';

const app = express.Router();


app.use(authenticate);

app.post("/new",newGroupValidator(),validate,newGroupChat);


app.get("/my",getMyChats);

app.get("/my/groups",getMyGroups);

app.put("/addMembers",addMembersValidator(),validate,addMembers);

app.get("/:chatId/availableMembers",getAvailableUsersForGroup)

app.put("/removeMembers",removeMembersValidator(),validate,removeMembers);
app.put("/changeAdmin",validate,changeAdmin);
app.delete("/leave/:id",leaveGroup);

app.post("/message",attachmentMulter,sendAttachments)
app.get("/message/:chatId",getMessages)

app.route("/:id",).get(getChatDetails).put(renameGroup).delete(deleteChat)

export default app;