import { Avatar, AvatarGroup, Box, Stack } from '@mui/material'
import React from 'react'
import {transformImage} from '../../lib/features'

const AvatrCard = ({ avatar = [], max = 4 }) => {
    return (
        <Stack direction={'row'} spacing={0.5} >
            <AvatarGroup max={max}>
                <Box width={'5rem'} height={'5rem'} position='relative'>
                    {avatar.map((src, index) => (
                        <Avatar
                            key={Math.random()*100}
                            src={transformImage(src)}
                            alt={`Avatr ${index}`}
                            sx={{
                                width: '5rem',
                                height: '5rem',
                                position:'absolute',
                                left:{
                                    xs:`${0.5+index}rem`,
                                    sm:`${index}rem`
                                },
                            }}
                        />
                    ))}
                </Box>
            </AvatarGroup>
        </Stack>
    )
}

export default AvatrCard
