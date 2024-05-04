export interface IUserData {
  id: string
  avatar?: string
  email: string
  name: string
  dob?: string
  country?: string
  gender?: string
  loginType: string
  role: {
    type: string
  }
}
