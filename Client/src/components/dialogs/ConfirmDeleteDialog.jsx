import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toggleDeleteMenu } from '../../Redux/reducers/misc'

const ConfirmDeleteDialog = ({ deleteHandler }) => {
    const { isDeleteMenu } = useSelector((state) => state.misc)
    const dispatch = useDispatch()
    return (
        <Dialog
            open={isDeleteMenu}
            onClose={() => dispatch(toggleDeleteMenu(false))}
            PaperProps={{
                sx: {
                    bgcolor: 'black',  // Adding black background
                    color: 'white',
                    border: '2px solid #333',
                }
            }}
        >
            <DialogTitle>Confirm Delete</DialogTitle>
            <DialogContent>
                <DialogContentText sx={{color:'white'}}>Are you sure you want to delete ?</DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={() => dispatch(toggleDeleteMenu(false))}>Cancel</Button>
                <Button color='error' onClick={deleteHandler}>Yes</Button>
            </DialogActions>
        </Dialog>
    )
}

export default ConfirmDeleteDialog
