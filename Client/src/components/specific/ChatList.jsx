import React from 'react'
import { Stack } from '@mui/material'
import ChatItem from '../shared/ChatItem'

const ChatList = (
    {
        w = "100%",
        chats = [],
        chatId,
        onlineUser = [],
        newMessagesAlert = [],
        handleDeleteChat,
    }
) => {
    return (
        <Stack width={w} direction={'column'} >
            {chats.map(data => {
                const { avatar, _id, name, groupChat, members } = data;

                const newMessageAlert = newMessagesAlert.find(alert => alert.chatId === _id)

                const isOnline = members?.some((member) => onlineUser.includes(member));
                return <ChatItem
                    newMessageAlert={newMessageAlert}
                    isOnline={isOnline}
                    avatar={avatar}
                    name={name}
                    _id={_id}
                    key={_id}
                    groupChat={groupChat}
                    samesender={chatId === _id}
                    handleDeleteChat={handleDeleteChat}
                />
            })}
        </Stack>
    )
}

export default ChatList 



