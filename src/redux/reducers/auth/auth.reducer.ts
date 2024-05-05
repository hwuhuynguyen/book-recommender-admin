import { createSlice } from '@reduxjs/toolkit'
import { IUserData } from '../../../types'

export type AuthState = {
  isLoggedIn: boolean
  accessToken?: string
  refreshToken?: string
  userInfo?: IUserData
  userRole: string | null
}

const initialState: AuthState = {
  isLoggedIn: false,
  userRole: null
}

const authSlice = createSlice({
  name: 'auth',
  initialState: initialState,
  reducers: {
    setCredentials: (state: AuthState, action) => {
      state.isLoggedIn = true
      state.accessToken = action.payload.access_token
      state.refreshToken = action.payload.refresh_token
    },
    setUserInfo: (state: AuthState, action) => {
      state.userInfo = action.payload
      state.userRole = action.payload.role?.type
    },
    logout: (state: AuthState) => {
      state.isLoggedIn = false
      state.accessToken = undefined
      state.refreshToken = undefined
      state.userInfo = undefined
    }
  }
})

export const { setCredentials, setUserInfo, logout } = authSlice.actions

export default authSlice.reducer
