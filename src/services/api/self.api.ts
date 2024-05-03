import instance from './../config'

const getMe = () => {
  return instance.get('/self/my-profile')
}

export const SelfApi = {
  getMe
}
