import React from 'react'
import { Button, Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText } from '@mui/material'
import styles from './CommonDeleteDialog.module.css'

interface CommonDeleteProps {
  onOpen: boolean
  onClose: () => void
  onDelete: (rowData?: { [key: string]: any }) => void
  title?: string
  message: string
  deleteBtnText?: string
  rowData?: { [key: string]: any }
}

export function CommonDeleteDialog({ onOpen, onClose, onDelete, title, message, deleteBtnText }: CommonDeleteProps) {
  const handleClose = () => {
    onClose()
  }

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      handleClose()
    }
  }

  return (
    <Dialog open={onOpen} onClose={onClose} onClick={handleClickOutside}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContentText className={styles['delete-content']} dangerouslySetInnerHTML={{ __html: message }} />
      <DialogContent>
        <DialogActions className={styles['group-btn']}>
          <Button
            variant="outlined"
            onClick={handleClose}
            color="inherit"
            style={{
              border: '1px solid #aaaaaa'
            }}
          >
            Cancel
          </Button>
          <Button style={{ marginLeft: '12px' }} variant="contained" onClick={onDelete} color="error">
            {deleteBtnText}
          </Button>
        </DialogActions>
      </DialogContent>
    </Dialog>
  )
}
