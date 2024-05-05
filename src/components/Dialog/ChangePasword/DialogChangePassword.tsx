import { useState } from 'react'
import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import DialogActions from '@mui/material/DialogActions'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Box, Stack } from '@mui/system'
import styles from './DialogChangePassword.module.css'
import { useFormik } from 'formik'
import { Alert, IconButton, InputAdornment } from '@mui/material'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { toast } from 'react-toastify'
import { SelfApi } from '../../../services'

interface ChangePasswordProps {
  open: boolean
  setOpen: (value: boolean) => void
}

const DialogChangePassword = ({ open, setOpen }: ChangePasswordProps) => {
  const [error, setError] = useState<string>()
  const [loading, setLoading] = useState<boolean>(false)

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false)
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false)

  const handleClose = () => {
    setOpen(false)
    formik.resetForm()
    setError('')
    setShowOldPassword(false)
    setShowNewPassword(false)
    setShowConfirmPassword(false)
  }
  const formik = useFormik({
    initialValues: {
      password: '',
      newPassword: '',
      confirmedPassword: ''
    },
    onSubmit: async (values) => {
      try {
        setLoading(true)
        const passwordData = {
          ...values,
          action: 'CHANGE_PASSWORD'
        }
        await SelfApi.changePassword(passwordData)

        setError('')
        toast.success('Password is updated successfully!')
        handleClose()
      } catch (error: any) {
        setError(error?.message)
        toast.error('An error occurred while changing password!')
      } finally {
        setLoading(false)
      }
    }
  })

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      if (formik.isValid) {
        handleClose()
      }
    }
  }
  const handleToggleOldPassword = () => {
    setShowOldPassword((showPassword) => !showPassword)
  }

  const handleToggleNewPasswordVisibility = () => {
    setShowNewPassword((showPassword) => !showPassword)
  }

  const handleToggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword((showPassword) => !showPassword)
  }

  return (
    <Dialog open={open} onClose={handleClose} onClick={handleClickOutside}>
      <DialogTitle>Change Password</DialogTitle>
      {error && (
        <Alert className={styles['alert-message']} severity="error">
          {error}
        </Alert>
      )}
      <DialogContent>
        <form onSubmit={formik.handleSubmit} className={styles['changepassword-form']}>
          <Stack>
            <Box component="label" sx={{ fontWeight: '500' }}>
              Old Password <span className={styles['required-marked']}>*</span>
            </Box>
            <TextField
              id="password"
              name="password"
              value={formik.values.password}
              margin="dense"
              fullWidth
              type={showOldPassword ? 'text' : 'password'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password && Boolean(formik.errors.password)}
              helperText={
                formik.touched.password && typeof formik.errors.password === 'string' ? formik.errors.password : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleOldPassword}>
                      {showOldPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
          <Stack>
            <Box component="label" sx={{ fontWeight: '500' }}>
              New Password <span className={styles['required-marked']}>*</span>
            </Box>
            <TextField
              id="newPassword"
              name="newPassword"
              value={formik.values.newPassword}
              margin="dense"
              fullWidth
              type={showNewPassword ? 'text' : 'password'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.newPassword && Boolean(formik.errors.newPassword)}
              helperText={
                formik.touched.newPassword && typeof formik.errors.newPassword === 'string'
                  ? formik.errors.newPassword
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleNewPasswordVisibility}>
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
          <Stack>
            <Box component="label" sx={{ fontWeight: '500' }}>
              Confirm Password <span className={styles['required-marked']}>*</span>
            </Box>
            <TextField
              id="confirmedPassword"
              name="confirmedPassword"
              value={formik.values.confirmedPassword}
              margin="dense"
              fullWidth
              type={showConfirmPassword ? 'text' : 'password'}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.confirmedPassword && Boolean(formik.errors.confirmedPassword)}
              helperText={
                formik.touched.confirmedPassword && typeof formik.errors.confirmedPassword === 'string'
                  ? formik.errors.confirmedPassword
                  : ''
              }
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleToggleConfirmPasswordVisibility}>
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
          </Stack>
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
            <Button style={{ marginLeft: '12px' }} variant="contained" type="submit" disabled={loading}>
              Save
            </Button>
          </DialogActions>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { DialogChangePassword }
