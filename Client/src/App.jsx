import React, { lazy, Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectRouter from './components/auth/ProtectRouter';
import { LayoutLoaders } from './components/layout/Loaders';
import axios from 'axios';
import { server } from './constants/confing';
import { useDispatch, useSelector } from 'react-redux';
import { userExist, userNotExists } from './Redux/reducers/auth';
import { Toaster } from 'react-hot-toast';
import { SocketProvider } from './utils/Socket';  // Import SocketProvider

const Home = lazy(() => import("./pages/Home"));
const Login = lazy(() => import("./pages/Login"));
const Chat = lazy(() => import("./pages/Chat"));
const GroupChats = lazy(() => import("./pages/GroupChats"));
const NotFound = lazy(() => import("./pages/NotFound"));

const App = () => {
  const dispatch = useDispatch();
  const { user, loader } = useSelector((state) => state.auth);

  useEffect(() => {
    axios
      .get(`${server}/api/user/me`, { withCredentials: true })
      .then(({ data }) => {
        dispatch(userExist(data.data));
      })
      .catch(() => dispatch(userNotExists()));
  }, [dispatch]);

  return (
    <BrowserRouter>
      <Suspense fallback={<LayoutLoaders />}>
        <Routes>
          {/* Protect routes with SocketProvider only if user is authenticated */}
          <Route element={<ProtectRouter user={user} />}>
            <Route
              path="/"
              element={
                user ? (
                  <SocketProvider>  {/* Wrap protected routes in SocketProvider */}
                    <Home />
                  </SocketProvider>
                ) : (
                  <Home />
                )
              }
            />
            <Route
              path="/chat/:chatId"
              element={
                user ? (
                  <SocketProvider>  {/* Wrap protected routes in SocketProvider */}
                    <Chat />
                  </SocketProvider>
                ) : (
                  <Chat />
                )
              }
            />
            <Route
              path="/group-chats"
              element={
                user ? (
                  <SocketProvider>  {/* Wrap protected routes in SocketProvider */}
                    <GroupChats />
                  </SocketProvider>
                ) : (
                  <GroupChats />
                )
              }
            />
          </Route>

          {/* Login route */}
          <Route
            path="/login"
            element={
              <ProtectRouter user={!user} redirect="/">
                <Login/>
              </ProtectRouter>
            }
          />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
      <Toaster position="top-center" />
    </BrowserRouter>
  );
};

export default App;
