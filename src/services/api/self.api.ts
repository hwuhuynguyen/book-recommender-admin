import instance from './../config'

interface IPassword {
  password: string
  newPassword: string
  confirmedPassword: string
  action: string
}

const getMe = () => {
  return instance.get('/self/my-profile')
}

const changePassword = (data: IPassword) => {
  return instance.patch('/users', data)
}

export const SelfApi = {
  getMe,
  changePassword
}
