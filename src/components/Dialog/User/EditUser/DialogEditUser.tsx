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
import React, { useCallback, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import styles from './DialogEditUser.module.css'
import { DatePicker } from '@mui/x-date-pickers'
import dayjs, { Dayjs } from 'dayjs'
import { IUser } from '../../../../types'
import { UserApi } from '../../../../services'

interface DialogEditUserProps {
  onOpen: boolean
  onClose: () => void
  onUpdate: () => void
  selectedUser?: IUser
}

const DialogEditUser = ({ onOpen, onClose, onUpdate, selectedUser }: DialogEditUserProps) => {
  const [isSaving, setIsSaving] = useState<boolean>(false)
  const [errors, setErrors] = useState<string[]>([])

  const formik = useFormik({
    initialValues: {
      name: '',
      gender: '',
      email: '',
      country: '',
      dob: null as Dayjs | null
    },
    validateOnChange: false,
    onSubmit: async (values) => {
      try {
        setIsSaving(true)
        const currentUserData = {
          name: values.name.trim(),
          gender: values.gender.trim(),
          email: values.email.trim(),
          country: values.country.trim(),
          dob: values.dob ? dayjs(values.dob).format('YYYY-MM-DD') : undefined,
          avatar: selectedUser?.avatar,
          roleId: selectedUser?.role === 'ADMIN' ? 1 : 2
        }
        await UserApi.updateUserById(selectedUser?.id ? selectedUser.id : '-1', currentUserData)
        toast.success('An user is updated successfully!')
        onClose()
        onUpdate()
      } catch (error: any) {
        setErrors(error?.message)
        toast.error('An error occurred while updating user!')
      } finally {
        setIsSaving(false)
      }
    }
  })

  useEffect(() => {
    if (onOpen) {
      setErrors([])
      formik.resetForm()
      formik.setValues({
        name: selectedUser?.name || '',
        gender: selectedUser?.gender || '',
        email: selectedUser?.email || '',
        country: selectedUser?.country || '',
        dob: selectedUser?.dob ? dayjs(selectedUser?.dob) : null
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [onOpen])

  const handleClickOutside = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (event.target === event.currentTarget) {
      if (formik.isValid) {
        onClose()
      }
    }
  }

  const disableToday = useCallback((date: any) => {
    return dayjs(date).isSame(dayjs().startOf('day'))
  }, [])

  return (
    <Dialog onClick={handleClickOutside} onClose={onClose} open={onOpen}>
      <DialogTitle className={styles['dialog-title']}>Edit User</DialogTitle>
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
              value={formik.values?.dob || null}
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
              onClick={onClose}
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
  )
}

export { DialogEditUser }
