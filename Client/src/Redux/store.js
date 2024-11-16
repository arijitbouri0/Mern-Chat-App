import { configureStore } from '@reduxjs/toolkit';
import authReducer from './reducers/auth';
import api from './api/api';
import miscSlice from './reducers/misc'
import chatSlice from './reducers/chat';

const store = configureStore({
    reducer: {
        auth: authReducer,
        api:api.reducer,
        misc:miscSlice.reducer,
        [chatSlice.name]:chatSlice.reducer
    },
    middleware: (getDefaultMiddleware) => [...getDefaultMiddleware(),api.middleware]
});

export default store;
