import React, { useState } from 'react';
import { Avatar, IconButton, Button, Container, Paper, TextField, Typography } from '@mui/material';
import { CameraAlt, Visibility, VisibilityOff } from '@mui/icons-material';
import { useInputValidation, useStrongPassword, useFileHandler } from '6pp';
import { UsernameValidation } from '../lib/UsernameValidation';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { server } from '../constants/confing';
import { userExist } from '../Redux/reducers/auth';
import toast from 'react-hot-toast';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const Name = useInputValidation('');
  const Username = useInputValidation('', UsernameValidation);
  const Bio = useInputValidation('');
  const Password = useStrongPassword();
  const avatar = useFileHandler('single');
  const dispatch = useDispatch();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data } = await axios.post(`${server}/api/user/login`, {
        userName: Username.value,
        password: Password.value,
      }, {
        withCredentials: true,
        headers: {
          "Content-Type": "application/json"
        }
      });
      dispatch(userExist(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();
    formData.append('name', Name.value);
    formData.append('userName', Username.value);
    formData.append('bio', Bio.value);
    formData.append('password', Password.value);
    formData.append('avatar', avatar.file);

    try {
      const { data } = await axios.post(`${server}/api/user/register`,
        formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      dispatch(userExist(data.user));
      toast.success(data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container component={"main"} maxWidth="xs"
      sx={{
        height: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Paper
        elevation={3}
        sx={{
          padding: 4,
          display: 'flex',
          flexDirection: 'column',
          alignItems: "center",
        }}
      >
        {isLogin ? (
          <>
            <Typography variant='h5'>Login</Typography>
            <form
              style={{
                width: '100%',
                marginTop: '1rem'
              }}
              onSubmit={handleLogin}
            >
              <TextField
                required
                fullWidth
                label="Username"
                margin="normal"
                variant='outlined'
                value={Username.value}
                onChange={Username.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'} // Toggle password visibility
                margin="normal"
                variant='outlined'
                value={Password.value}
                onChange={Password.changeHandler}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />
              <Button
                sx={{
                  marginTop: '1rem'
                }}
                variant="contained"
                color='primary'
                type='submit'
                fullWidth
                disabled={isLoading}
              >
                Login
              </Button>
              <Typography sx={{ textAlign: 'center', m: '1rem' }}>OR</Typography>
              <Button
                variant="text"
                onClick={() => setIsLogin(false)}
                fullWidth
              >
                Don't Have an Account?
              </Button>
            </form>
          </>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <Typography variant='h5' gutterBottom>Sign Up</Typography>

            <div style={{ position: 'relative', marginBottom: '1rem' }}>
              <Avatar
                alt="Profile Picture"
                sx={{ width: 100, height: 100 }}
                src={avatar.preview}
              />
              <IconButton
                component="label"
                sx={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: 'white',
                  boxShadow: 1,
                  '&:hover': { backgroundColor: 'lightgray' },
                }}
              >
                <CameraAlt />
                <input
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={avatar.changeHandler}
                />
              </IconButton>
            </div>
            {avatar.error && (
              <Typography color='error' variant='caption'>
                {avatar.error}
              </Typography>
            )}

            <form style={{ width: '100%', maxWidth: 400 }} onSubmit={handleRegister}>
              <TextField
                fullWidth
                label="Name"
                margin="normal"
                variant='outlined'
                value={Name.value}
                onChange={Name.changeHandler}
              />
              <TextField
                fullWidth
                label="Username"
                margin="normal"
                variant='outlined'
                value={Username.value}
                onChange={Username.changeHandler}
              />
              {Username.error && (
                <Typography color='error' variant='caption'>
                  {Username.error}
                </Typography>
              )}
              <TextField
                fullWidth
                label="Bio"
                margin="normal"
                variant='outlined'
                value={Bio.value}
                onChange={Bio.changeHandler}
              />
              <TextField
                required
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                margin="normal"
                variant='outlined'
                value={Password.value}
                onChange={Password.changeHandler}
                InputProps={{
                  endAdornment: (
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  )
                }}
              />
              {Password.error && (
                <Typography color='error' variant='caption'>
                  {Password.error}
                </Typography>
              )}
              <Button
                sx={{ marginTop: '1rem' }}
                variant="contained"
                color='primary'
                type='submit'
                fullWidth
                disabled={isLoading}
              >
                Sign Up
              </Button>

              <Typography sx={{ textAlign: 'center', m: '1rem' }}>OR</Typography>

              <Button
                variant="text"
                onClick={() => setIsLogin(true)}
                fullWidth
              >
                Already have an account?
              </Button>
            </form>
          </div>
        )}
      </Paper>
    </Container>
  );
};

export default Login;


