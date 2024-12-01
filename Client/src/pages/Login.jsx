import React, { useState } from 'react';
import { Avatar, IconButton, Button, Container, Paper, TextField, Typography, Stack, CircularProgress } from '@mui/material';
import { CameraAlt, Visibility, VisibilityOff, ChatBubbleOutline } from '@mui/icons-material';
import { useInputValidation, useStrongPassword, useFileHandler } from '6pp';
import { UsernameValidation } from '../lib/UsernameValidation';
import axios from 'axios';
import { useDispatch } from 'react-redux';
import { server } from '../constants/confing';
import { userExist } from '../Redux/reducers/auth';
import toast from 'react-hot-toast';
import { Security, Speed } from '@mui/icons-material';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
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
    <Stack
      direction={{ xs: 'column-reverse', md: 'row' }}
      sx={{
        justifyContent: 'center',
        alignItems: 'center',
        gap: { xs: 2, sm: 6 },
        p: { xs: 2, sm: 4 },
        m: 'auto',
        height: { xs: 'auto', md: '100vh' },
      }}
    >
      <Stack
        direction="column"
        alignItems="center"
        sx={{
          textAlign: 'center',
          padding: { xs: 3, sm: 5 },
          marginLeft: { md: '30rem', xs: 0 },
        }}
      >
        {/* Main Icon */}
        <ChatBubbleOutline sx={{ fontSize: 110, mb: 2, color: '#5E3F8B' }} /> {/* Dark Purple */}

        {/* Title with Shadow */}
        <Typography
          variant="h2"
          sx={{
            fontWeight: 'bold',
            fontSize: { xs: '3rem', sm: '6.5rem', md: '7.5rem' },
            textShadow: '2px 2px 6px rgba(0, 0, 0, 0.7)', // Enhanced Text shadow for contrast
            mt: 2,
            mb: 3,
            color: '#4B2E83', // Dark Purple for a bold title
          }}
        >
          Welcome to ChatterBox
        </Typography>

        {/* Subtitle */}
        <Typography
          variant="h6"
          sx={{
            mt: 2,
            color: '#A0A0A0', // Light Gray for subtleness
            fontSize: { xs: '1.2rem', sm: '1.4rem', md: '1.6rem' },
            fontWeight: 'lighter',
          }}
        >
          Connect with your friends and the world around you.
        </Typography>

        {/* Feature Section */}
        <Stack
          direction="column"
          alignItems="flex-start"
          spacing={4} // Increased spacing for better readability
          sx={{
            mt: 5, // More space between sections
            maxWidth: 700, // Restricts content width
            mx: 'auto', // Centers content horizontally
          }}
        >
          {/* Feature 1: Real-Time Messaging */}
          <Stack direction="row" spacing={4} alignItems="center">
            <Speed sx={{ color: '#4CAF50', fontSize: 50 }} /> {/* Green for Speed */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                color: '#333333', // Dark Gray for contrast
              }}
            >
              Real-Time Messaging
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              ml: 5,
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: '#757575', // Light Gray for descriptions
              fontWeight: 'normal',
            }}
          >
            Instantly send and receive messages without delays.
          </Typography>

          {/* Feature 2: Secure Conversations */}
          <Stack direction="row" spacing={4} alignItems="center">
            <Security sx={{ color: '#4CAF50', fontSize: 50 }} /> {/* Green for Security */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                color: '#333333', // Dark Gray for feature title
              }}
            >
              Secure Conversations
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              ml: 5,
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: '#757575', // Light Gray for descriptions
              fontWeight: 'normal',
            }}
          >
            Your chats are end-to-end encrypted for maximum privacy.
          </Typography>

          {/* Feature 3: Fast and Reliable */}
          <Stack direction="row" spacing={4} alignItems="center">
            <Speed sx={{ color: '#4CAF50', fontSize: 50 }} /> {/* Green for Speed */}
            <Typography
              variant="h6"
              sx={{
                fontWeight: 'bold',
                fontSize: { xs: '1.25rem', sm: '1.5rem' },
                color: '#333333', // Dark Gray for feature title
              }}
            >
              Fast and Reliable
            </Typography>
          </Stack>
          <Typography
            variant="body1"
            sx={{
              ml: 5,
              fontSize: { xs: '1rem', sm: '1.2rem' },
              color: '#757575', // Light Gray for descriptions
              fontWeight: 'normal',
            }}
          >
            Experience lightning-fast connections with no interruptions.
          </Typography>
        </Stack>
      </Stack>

      <Container
        component="main"
        maxWidth="lg"
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: { xs: 3, sm: 6 }, // Increased padding for more space
        }}
      >
        <Paper
          elevation={3}
          sx={{
            padding: { xs: 3, sm: 6 }, // Increased padding for more space
            width: { xs: '100%', sm: '80%', md: '60%' }, // Wider form
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            backgroundColor: 'rgba(255, 255, 255, 0.75)', // Semi-transparent white
            borderRadius: 4,
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
            backdropFilter: 'blur(9px)', // Adds the blur for the glass effect
            border: '1px solid rgba(255, 255, 255, 0.2)', // Optional border for emphasis
          }}
        >
          {isLogin ? (
            <>
              <Typography variant="h5" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem' } }}>Login</Typography>
              <form
                style={{
                  width: '100%',
                  marginTop: '1.5rem', // More space on top of the form
                }}
                onSubmit={handleLogin}
              >
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={Username.value}
                  onChange={Username.changeHandler}
                  sx={{
                    fontSize: { xs: '1.125rem', sm: '1.375rem' }, // Slightly larger font size
                    marginBottom: 2, // Increased margin bottom for spacing between fields
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  variant="outlined"
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
                    ),
                  }}
                  sx={{
                    fontSize: { xs: '1.125rem', sm: '1.375rem' },
                    marginBottom: 2,
                  }}
                />
                <Button
                  sx={{ marginTop: '1.5rem', fontSize: { xs: '1.125rem', sm: '1.375rem' } }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                   {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Login '}
                </Button>
                <Typography sx={{ textAlign: 'center', m: '1.5rem', fontSize: { xs: '1.125rem', sm: '1.375rem' } }}>
                  Don't have an account? <span onClick={() => setIsLogin(false)} style={{ color: 'blue', cursor: 'pointer' }}>Sign Up</span>
                </Typography>
              </form>
            </>
          ) : (
            <>
              <Typography variant="h5" sx={{ fontSize: { xs: '1.75rem', sm: '2.25rem' } }}>Sign Up</Typography>
              <div style={{ position: 'relative', marginBottom: '1.5rem' }}>
                <Avatar
                  alt="Profile Picture"
                  sx={{ width: 120, height: 120 }} // Slightly bigger avatar
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
                <Typography color="error" variant="caption">
                  {avatar.error}
                </Typography>
              )}
              <form
                style={{
                  width: '100%',
                  marginTop: '1.5rem', // More space on top of the form
                }}
                onSubmit={handleRegister}
              >
                <TextField
                  required
                  fullWidth
                  label="Full Name"
                  margin="normal"
                  variant="outlined"
                  value={Name.value}
                  onChange={Name.changeHandler}
                  sx={{
                    fontSize: { xs: '1.125rem', sm: '1.375rem' },
                    marginBottom: 2,
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Username"
                  margin="normal"
                  variant="outlined"
                  value={Username.value}
                  onChange={Username.changeHandler}
                  sx={{
                    fontSize: { xs: '1.125rem', sm: '1.375rem' },
                    marginBottom: 2,
                  }}
                />
                {Username.error && (
                  <Typography color='error' variant='caption'>
                    {Username.error}
                  </Typography>
                )}
                <TextField
                  required
                  fullWidth
                  label="Bio"
                  margin="normal"
                  variant="outlined"
                  value={Bio.value}
                  onChange={Bio.changeHandler}
                  sx={{
                    fontSize: { xs: '1.125rem', sm: '1.375rem' },
                    marginBottom: 2,
                  }}
                />
                <TextField
                  required
                  fullWidth
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  margin="normal"
                  variant="outlined"
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
                    ),
                  }}
                  sx={{
                    fontSize: { xs: '1.125rem', sm: '1.375rem' },
                    marginBottom: 2,
                  }}
                />
                {Password.error && (
                  <Typography color='error' variant='caption'>
                    {Password.error}
                  </Typography>
                )}

                <Button
                  sx={{ marginTop: '1.5rem', fontSize: { xs: '1.125rem', sm: '1.375rem' } }}
                  variant="contained"
                  color="primary"
                  type="submit"
                  fullWidth
                  disabled={isLoading}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Sign Up'}
                </Button>
                <Typography sx={{ textAlign: 'center', m: '1.5rem', fontSize: { xs: '1.125rem', sm: '1.375rem' } }}>
                  Already have an account? <span onClick={() => setIsLogin(true)} style={{ color: 'blue', cursor: 'pointer' }}>Login</span>
                </Typography>
              </form>
            </>
          )}
        </Paper>
      </Container>

    </Stack>
  );
};

export default Login;
