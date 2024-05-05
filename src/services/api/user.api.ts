import { IUser } from '../../types'
import instance from './../config'

type UserSearchType = {
  page: number
  perPage: number
  search?: string
  genders?: string
  roleIds?: string
  order?: string
}

const getUsers = (params: UserSearchType) => {
  return instance.get('/users', {
    params: params
  })
}

const getUserById = (id: string) => {
  return instance.get(`/users/${id}`)
}

const addNewUser = (userData: IUser) => {
  return instance.post('/users', userData)
}

const updateUserById = (id: string, updatedUserData: IUser) => {
  return instance.put(`/users/${id}`, updatedUserData)
}

const deleteUserById = (id: string) => {
  return instance.delete(`/users/${id}`)
}

export const UserApi = {
  getUsers,
  getUserById,
  addNewUser,
  updateUserById,
  deleteUserById
}
