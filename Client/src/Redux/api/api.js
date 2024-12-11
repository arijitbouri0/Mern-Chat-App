import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { server } from '../../constants/confing';

const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({ baseUrl: `${server}/api/` }),
  tagTypes: ['Chat', 'User', 'Notification', 'Message','ReceiverChat'],
  endpoints: (builder) => ({
    myChats: builder.query({
      query: () => ({
        url: 'chat/my',
        credentials: 'include',
      }),
      providesTags: ['Chat'],
    }),
    searchUser: builder.query({
      query: (name) => ({
        url: `user/search?name=${name}`,
        credentials: 'include',
      }),
      providesTags: ['User'], // Cache the results under 'User' tag
    }),
    sentFriendRequest: builder.mutation({
      query: (data) => ({
        url: `user/sendRequest`,
        method: "PUT",
        credentials: 'include',
        body: data
      }),
      invalidatesTags: ['User', 'Notification'],
    }),
    getMyNotification: builder.query({
      query: () => ({
        url: `user/notification`,
        credentials: 'include',
      }),
      providesTags: ['Notification'],
      keepUnusedDataFor: 0,
    }),
    acceptFriendRequest: builder.mutation({
      query: (data) => ({
        url: `user/acceptRequest`,
        method: "PUT",
        credentials: 'include',
        body: data
      }),
      invalidatesTags: ["Chat", "Notification"],
    }),
    chatDetails: builder.query({
      query: ({ chatId, populate = false }) => {
        let url = `chat/${chatId}`;
        if (populate) url += "?populate=true";
        return {
          url,
          credentials: 'include',
        };
      },
      providesTags: ["Chat"]
    }),
    getMessages: builder.query({
      query: ({ chatId, page }) => ({
        url: `chat/message/${chatId}?page=${page}`,  // Adjust to match backend route
        credentials: 'include',
      }),
      keepUnusedDataFor: 0
    }),
    sendAttachement: builder.mutation({
      query: (data) => ({
        url: `/chat/message`,
        method: "POST",
        credentials: 'include',
        body: data
      }),
    }),
    myGroups: builder.query({
      query: (name) => ({
        url: `chat/my/groups`,
        credentials: 'include',
      }),
      providesTags: ['Chat'], // Cache the results under 'User' tag
    }),
    availableFriends: builder.query({
      query: (chatId) => {
        let url = `user/myfriends`;
        if (chatId) url += `?chatId=${chatId}`;
        return {
          url,
          credentials: 'include',
        };
      },
      providesTags:["Chat"]
    }),
    sendAttachement: builder.mutation({
      query: (data) => ({
        url: `/chat/message`,
        method: "POST",
        credentials: 'include',
        body: data
      }),
    }),
    newGroup: builder.mutation({
      query: ({name,members}) => ({
        url: `chat/new`,
        method:"POST",
        credentials: 'include',
        body:{name,members},
      }),
      invalidatesTags: ['Chat'], // Cache the results under 'User' tag
    }),
    renameGroup: builder.mutation({
      query: ({chatId,name}) => ({
        url: `chat/${chatId}`,
        method:"PUT",
        credentials: 'include',
        body:{name,chatId},
      }),
      invalidatesTags: ['Chat'], // Cache the results under 'User' tag
    }),
    removeGroupMember: builder.mutation({
      query: ({chatId,userId}) => ({
        url: `chat/removeMembers`,
        method:"PUT",
        credentials: 'include',
        body:{chatId,userId},
      }),
      invalidatesTags: ['Chat'], // Cache the results under 'User' tag
    }),
    addGroupMember: builder.mutation({
      query: ({chatId,members}) => ({
        url: `chat/addMembers`,
        method:"PUT",
        credentials: 'include',
        body:{chatId,members},
      }),
      invalidatesTags: ['Chat'], // Cache the results under 'User' tag
    }),
    getAvailableMembers: builder.query({
      query: ({chatId}) => ({
        url: `chat/${chatId}/availableMembers`,
        method: 'GET',
        credentials: 'include',
      }),
      providesTags: ['Chat'], // Adjust the tag if needed to trigger invalidation on relevant queries
    }),
    deleteChat: builder.mutation({
      query: ({id}) => ({
        url: `chat/${id}`,
        method:"DELETE",
        credentials: 'include',
      }),
      invalidatesTags: ['Chat'], // Cache the results under 'User' tag
    }),
    leaveGroup: builder.mutation({
      query: ({id}) => ({
        url: `chat/leave/${id}`,
        method:"DELETE",
        credentials: 'include',
      }),
      invalidatesTags: ['Chat'], // Cache the results under 'User' tag
    }),
    updadteUser: builder.mutation({
      query: (data) => ({
        url: `/user/edit`,
        method: "POST",
        credentials: 'include',
        body: data
      }),
      invalidatesTags: ['User'],
    }),
    changeGroupAdmin: builder.mutation({
      query: ({chatId,newAdminId}) => ({
        url: `chat/changeAdmin`,
        method:"PUT",
        credentials: 'include',
        body:{chatId,newAdminId},
      }),
      invalidatesTags: ['Chat'], // Cache the results under 'User' tag
    }),
  }),
});

export const {
  useMyChatsQuery,
  useLazySearchUserQuery,
  useSentFriendRequestMutation,
  useGetMyNotificationQuery,
  useAcceptFriendRequestMutation,
  useChatDetailsQuery,
  useGetMessagesQuery,
  useSendAttachementMutation,
  useMyGroupsQuery,
  useAvailableFriendsQuery,
  useNewGroupMutation,
  useRenameGroupMutation,
  useRemoveGroupMemberMutation,
  useAddGroupMemberMutation,
  useGetAvailableMembersQuery,
  useDeleteChatMutation,
  useLeaveGroupMutation,
  useUpdadteUserMutation,
  useChangeGroupAdminMutation
} = api;
export default api;
