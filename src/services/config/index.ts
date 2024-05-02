import axios, { AxiosResponse } from 'axios'

const baseURL = `https://pbl7-book-recommender-backend.onrender.com/v1`

const instance = axios.create({
  baseURL: baseURL,
  headers: {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  }
})

const handleSuccessResponse = (response: AxiosResponse<any, any>) => {
  return response
}

const handleErrorResponse = (error: any) => {
  try {
    return Promise.reject(error.response.data)
  } catch (e) {
    return Promise.reject({ message: 'Network Error' })
  }
}

export const setHeaderConfigAxios = (token?: string) => {
  if (token) {
    instance.defaults.headers.common['Authorization'] = token ? 'Bearer ' + token : ''
  } else {
    delete instance.defaults.headers.common['Authorization']
  }
}

instance.interceptors.response.use(handleSuccessResponse, handleErrorResponse)

export default instance
