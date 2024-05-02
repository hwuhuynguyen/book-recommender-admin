import instance from './../config'

type LoginType = {
  email: string
  password: string
  deviceId: string
}

interface LoginResponse {
  access_token: string
  refresh_token: string
}

const login = (data: LoginType) => {
  console.log(data)
  return instance.post<LoginResponse>('/login/local', data)
}

export const AuthApi = {
  login
}
