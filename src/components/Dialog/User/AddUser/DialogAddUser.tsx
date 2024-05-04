import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextField
} from '@mui/material'
import { useFormik } from 'formik'
import React, { useState } from 'react'
import { toast } from 'react-toastify'
import styles from './DialogAddUser.module.css'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs from 'dayjs'
import { AddCircle } from '@mui/icons-material'
import { UserApi } from '../../../../services'

interface DialogAddUserProps {
  onAdd: () => void
}

const DialogAddUser = ({ onAdd }: DialogAddUserProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [open, setOpen] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])

  const handleClickOpen = () => {
    setErrors([])
    formik.resetForm()
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const formik = useFormik({
    initialValues: {
      name: '',
      gender: '',
      email: '',
      country: '',
      dob: null
    },
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setIsSaving(true)
        const newUserData = {
          name: values.name.trim(),
          gender: values.gender.trim(),
          email: values.email.trim(),
          country: values.country.trim(),
          password: `${process.env.REACT_APP_DEFAULT_USER_PASSWORD}`,
          roleId: parseInt(`${process.env.REACT_APP_DEFAULT_USER_ROLE}`, 10),
          dob: values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : undefined
        }
        await UserApi.addNewUser(newUserData)

        onAdd()
        setErrors([])
        toast.success('An user is created successfully!')
        handleClose()
      } catch (error: any) {
        setErrors(error?.message)
        toast.error('An error occurred while adding new user!')
      } finally {
        setIsSaving(false)
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

  const disableToday = (date: any) => {
    return dayjs(date).isSame(dayjs().startOf('day'))
  }

  return (
    <Box sx={{ textAlign: 'center', paddingTop: '1rem' }}>
      <Button
        variant="contained"
        onClick={handleClickOpen}
        style={{
          background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
          color: 'white'
        }}
        endIcon={<AddCircle />}
      >
        Add new
      </Button>
      <Dialog onClick={handleClickOutside} onClose={handleClose} open={open}>
        <DialogTitle className={styles['dialog-title']}>Create User</DialogTitle>
        {errors.length > 0 && (
          <Alert className={styles['alert-message']} severity="error">
            {errors?.map((error, index) => (
              <div key={index}>{error}</div>
            ))}
          </Alert>
        )}
        <DialogContent>
          <form onSubmit={formik.handleSubmit} className={styles['organizer-form']}>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Name <span className={styles['required-marked']}>*</span>
              </Box>
              <TextField
                fullWidth
                value={formik.values.name}
                id="name"
                name="name"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  formik.handleChange(value)
                }}
              />
            </Stack>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Gender <span className={styles['required-marked']}>*</span>
              </Box>
              <Select
                fullWidth
                value={formik.values.gender}
                id="gender"
                name="gender"
                onBlur={formik.handleBlur}
                onChange={(event) => {
                  formik.setFieldValue('gender', event.target.value)
                }}
                displayEmpty
              >
                <MenuItem value="" disabled>
                  Select your gender
                </MenuItem>
                <MenuItem value="MALE">Male</MenuItem>
                <MenuItem value="FEMALE">Female</MenuItem>
                <MenuItem value="OTHER">Other</MenuItem>
              </Select>
            </Stack>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Email <span className={styles['required-marked']}>*</span>
              </Box>
              <TextField
                fullWidth
                value={formik.values.email}
                id="email"
                name="email"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  formik.handleChange(value)
                }}
              />
            </Stack>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Country <span className={styles['required-marked']}>*</span>
              </Box>
              <TextField
                fullWidth
                value={formik.values.country}
                id="country"
                name="country"
                onBlur={formik.handleBlur}
                onChange={(value) => {
                  formik.handleChange(value)
                }}
              />
            </Stack>
            <Stack>
              <Box component="label" sx={{ fontWeight: '500' }}>
                Date of birth
              </Box>
              <DatePicker
                format="DD/MM/YYYY"
                disableFuture
                shouldDisableDate={disableToday}
                value={formik.values.dob || null}
                onChange={(date: any) => {
                  formik.setFieldValue('dob', date)
                }}
                slotProps={{
                  textField: {
                    onBlur: formik.handleBlur
                  }
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
              <Button style={{ marginLeft: '12px' }} variant="contained" type="submit" disabled={isSaving}>
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  )
}

export { DialogAddUser }
