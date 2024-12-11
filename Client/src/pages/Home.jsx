import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Box, Typography } from '@mui/material'

const Home = () => {
  return (
    <Box sx={{
      display: "flex",
      height: 'calc(100vh - 30px)',
      flexDirection: "column",
      color:'white'
    }} >
      <Typography variant='h5' p={'2rem'} textAlign={'center'}>
        Select a friend to chat
      </Typography>
    </Box >
  )
}

export default AppLayout()(Home)
