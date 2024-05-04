import instance from './../config'

type BookSearchType = {
  page: number
  perPage: number
  search?: string
  languages?: string
  price?: string
  averageRating?: string
  order?: string
}

const getBooks = (params: BookSearchType) => {
  return instance.get('/books', {
    params: params
  })
}

const getBookById = (id: string) => {
  return instance.get(`/books/${id}`)
}

const deleteBookById = (id: string) => {
  return instance.delete(`/books/${id}`)
}

export const BookApi = {
  getBooks,
  getBookById,
  deleteBookById
}
