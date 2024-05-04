export interface IBook {
  id?: string
  title?: string
  description?: string
  bookCover?: string
  language?: string
  imageUrl?: string
  releaseDate?: string
  publisher?: string
  numberOfPages?: number
  price?: number
  averageRating?: number
  numberOfRatings?: number
  numberOfReviews?: number
  source?: {
    id?: string
    name?: string
  }
  authors?: { author: IAuthor }[]
}

interface IAuthor {
  id?: string
  name?: string
  avatar?: string
}
