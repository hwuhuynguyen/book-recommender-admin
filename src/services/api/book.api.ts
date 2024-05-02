import instance from './../config'

const getBooks = (page?: number, per_page?: number) => {
  return instance.get('/links', {
    params: {
      page,
      per_page
    }
  })
}

const getBookById = (id: string) => {
  return instance.get(`/links/${id}`)
}

export const BookApi = {
  getBooks,
  getBookById
}
