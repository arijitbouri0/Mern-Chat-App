import { Grid, Skeleton, Stack } from '@mui/material'
import React from 'react'
import { BouncingSkeleton } from '../styles/StyledComponents'

const LayoutLoaders = () => {
    return (
        <Grid container height={"calc(100vh - 4rem)"} spacing={'1rem'}>
            <Grid
                item
                sm={4}
                md={3}
                sx={{
                    display: { xs: 'none', sm: 'block' }
                }}>
                <Skeleton variant='rectangular' height={'100vh'} />
            </Grid>
            <Grid
                item
                xs={12}
                sm={8} md={5} lg={6} height={"100%"}
            >
                <Stack spacing={'1rem'}>
                    {Array.from({ length: 10 }).map((_, index) => (
                        <Skeleton key={index} variant='rounded' height={'5rem'} />
                    ))}
                </Stack>

            </Grid>
            <Grid item lg={3} md={4} height={"100%"}
                sx={{
                    display: { xs: 'none', md: 'block' },
                }}>
                <Skeleton variant='rectangular' height={'100vh'} />
            </Grid>
        </Grid>
    )
}



const TypingLoader = () => {
    return (
      <Stack
        spacing={"0.5rem"}
        direction={"row"}
        padding={'1rem'}
        justifyContent={'center'}
        sx={{ '@media (max-width:600px)': { padding: '0.5rem' } }} // Responsive padding for smaller screens
      >
        <BouncingSkeleton
          variant="circular"
          width={20}
          height={20}
          sx={{
            animationDelay: '0.1s',
            '@media (max-width:600px)': { width: 12, height: 12 }, // Smaller size on mobile
          }}
        />
        <BouncingSkeleton
          variant="circular"
          width={20}
          height={20}
          sx={{
            animationDelay: '0.2s',
            '@media (max-width:600px)': { width: 12, height: 12 }, // Smaller size on mobile
          }}
        />
        <BouncingSkeleton
          variant="circular"
          width={20}
          height={20}
          sx={{
            animationDelay: '0.4s',
            '@media (max-width:600px)': { width: 12, height: 12 }, // Smaller size on mobile
          }}
        />
        <BouncingSkeleton
          variant="circular"
          width={20}
          height={20}
          sx={{
            animationDelay: '0.6s',
            '@media (max-width:600px)': { width: 12, height: 12 }, // Smaller size on mobile
          }}
        />
      </Stack>
    );
  };


export { TypingLoader, LayoutLoaders }