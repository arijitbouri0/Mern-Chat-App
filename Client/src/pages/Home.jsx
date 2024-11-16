import React from 'react'
import AppLayout from '../components/layout/AppLayout'
import { Typography } from '@mui/material'

const Home = () => {
  return (
    <Typography variant='h5' p={'2rem'} textAlign={'center'}>
      Select a friend to chat
    </Typography>
  )
}

export default AppLayout()(Home)
