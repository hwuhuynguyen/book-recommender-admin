import Box from '@mui/material/Box'
import withBaseLogic from '../../hoc/withBaseLogic'
import ReusableTable from '../../components/Table'
import Input from '../../components/Input'
import { useCallback, useRef, useState } from 'react'
import { useEffect } from 'react'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import { Typography } from '@mui/material'
import { CommonDeleteDialog } from '../../components/Dialog/DeleteDialog/CommonDeleteDialog'
import { IBook } from '../../types'
import { BookApi, DashboardApi } from '../../services'
import dayjs from 'dayjs'
import { convertDateFormat, removeEmptyFields } from '../../utils/function'
import { toast } from 'react-toastify'

const BookLayout = ({ navigate, location }: any) => {
  const columns = [
    {
      id: 'Id',
      sortTable: false,
      label: 'No.',
      left: false,
      style: {
        filed: 'Id',
        width: '70px'
      }
    },
    {
      id: 'title',
      sortTable: true,
      label: 'Title',
      sortBy: 'title',
      left: false,
      style: {
        filed: 'title',
        width: '200px'
      }
    },
    {
      id: 'author',
      sortTable: false,
      label: 'Author',
      sortBy: 'author',
      left: false,
      style: {
        filed: 'author',
        width: '150px'
      }
    },
    {
      id: 'releaseDate',
      sortTable: false,
      label: 'Release date',
      sortBy: 'releaseDate',
      left: false,
      style: {
        filed: 'releaseDate',
        width: '150px'
      }
    },
    {
      id: 'source',
      sortTable: false,
      label: 'Source',
      sortBy: 'source',
      left: false,
      style: {
        filed: 'source',
        width: '150px'
      }
    }
  ]

  const [params] = useSearchParams()
  const pageURL = Number(params.get('page'))
  const [currentPage, setCurrentPage] = useState<number>(pageURL | 1)

  const [searchText, setSearchText] = useState<string | ''>('')
  const [sortType, setSortType] = useState<'asc' | 'desc' | ''>('')
  const [sortValue, setSortValue] = useState<string | ''>('')

  const [books, setBooks] = useState<IBook[]>([])
  const [totalBooks, setTotalBooks] = useState<number>(0)

  const [totalItemsOnCurrentPage, setTotalItemsOnCurrentPage] = useState<number>(0)

  const [loading, setLoading] = useState<boolean>(true)
  const [update, setUpdate] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState(false)

  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  const [warningMessage, setWarningMessage] = useState('')
  const [deleteRowData, setDeleteRowData] = useState<{ [key: string]: any }>()

  const [latestDate, setLatestDate] = useState('')

  const isSetPageURL = useRef(false)

  const getAll = useCallback(async (parameter: any) => {
    const response = await BookApi.getBooks(parameter)

    if (response?.data.data && response?.data.data.length !== 0) {
      const formattedData = response?.data?.data.map((e: IBook) => {
        return {
          ...e,
          author: e.authors?.map((element: any) => element?.author?.name),
          releaseDate: e.releaseDate ? dayjs(e.releaseDate).format('DD/MM/YYYY') : '',
          source: e.source ? e.source.name : ''
        }
      })
      setBooks(formattedData)
      setTotalItemsOnCurrentPage(formattedData.length)
    } else {
      setBooks([])
      setTotalItemsOnCurrentPage(0)
    }
    setTotalBooks(response.data.meta.total)
    setLoading(false)
  }, [])

  const pageSearch = (value: number) => {
    setCurrentPage(() => value)
    isSetPageURL.current = false
    setUpdate((prev) => !prev)
  }

  // Delay the execution of search
  const debounceSearch = useDebounce({
    value: searchText,
    ms: 800
  })

  const handleEdit = useCallback((rowData: { [key: string]: any }) => {}, [])

  const handleDelete = useCallback(async (rowData: { [key: string]: any }) => {
    const { title } = rowData
    setWarningMessage(
      `Are you sure you want to delete the book with the title 
        <span style="font-weight: 600">'${title}'</span>?`
    )
    try {
      setIsDeleteDialogOpen(true)
      setDeleteRowData(rowData)
    } catch (err: any) {
      toast.error(err?.message)
    }
  }, [])

  const deleteBook = useCallback(
    async (rowData?: { [key: string]: any }) => {
      try {
        if (rowData) {
          const { id } = rowData
          await BookApi.deleteBookById(id)
          toast.success('A book is deleted successfully!')
          if (totalItemsOnCurrentPage === 1 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1)
          }
          setUpdate((prev) => !prev)
          setIsDeleteDialogOpen(false)
        }
      } catch (err: any) {
        toast.error(err?.message)
      }
    },
    [totalItemsOnCurrentPage, currentPage]
  )

  const handleColumnSort = useCallback((idColumm: any, sortType: 'asc' | 'desc' | '') => {
    setSortType(sortType)
    setSortValue(idColumm)
    setUpdate((prev) => !prev)
  }, [])

  useEffect(() => {
    if (isSetPageURL.current === false) {
      setCurrentPage(() => pageURL)
      isSetPageURL.current = true
    }
  }, [pageURL])

  useEffect(() => {
    setLoading(true)
    const params = {
      page: currentPage,
      search: searchText,
      order: sortType && sortValue ? `${sortValue}:${sortType}` : ''
    }

    removeEmptyFields(params)

    navigate({
      pathname: location.pathname,
      search: createSearchParams(JSON.parse(JSON.stringify(params))).toString()
    })

    getAll({ ...params })
    setIsAdded(false)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch, navigate, location.pathname, update])

  useEffect(() => {
    const getStatistics = async () => {
      try {
        const response = await DashboardApi.getCardStatistics()
        const updatedCrawledDates = {
          bookCrossing: response.data.crawledDays['Book Crossing'][0],
          goodreads: response.data.crawledDays['GoodReads'][0],
          thriftBooks: response.data.crawledDays['Thrift Books'][0]
        }
        setLatestDate(convertDateFormat(updatedCrawledDates.goodreads))
      } catch (err) {
        console.log(err)
      }
    }
    getStatistics()
  }, [])

  return (
    <>
      <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', marginTop: '1rem' }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '0.25rem',
            flexWrap: 'wrap'
          }}
        >
          <Box sx={{ alignSelf: 'flex-start', marginBottom: '10px' }}>
            <Box sx={{ textAlign: 'center', paddingTop: '1rem', display: 'flex', alignItems: 'center' }}>
              <Typography variant="caption" paddingLeft={'1rem'}>
                Last updated on {latestDate.length > 0 ? latestDate : ''}.
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignSelf: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
            <Input
              label="Search"
              id="outlined-search"
              placeholder="Search here..."
              handleChange={(e) => {
                setCurrentPage(1)
                setSearchText(e.target.value)
              }}
              value={searchText}
            />
          </Box>
        </Box>
        <CommonDeleteDialog
          onOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false)
          }}
          onDelete={() => deleteBook(deleteRowData)}
          title={'Delete book'}
          message={warningMessage}
          deleteBtnText="Yes, delete"
        />

        <ReusableTable
          columns={columns}
          rows={books}
          onEdit={handleEdit}
          onDelete={handleDelete}
          handleColumnSort={handleColumnSort}
          total={totalBooks}
          handlePageSearch={pageSearch}
          totalItemsOnCurrentPage={totalItemsOnCurrentPage}
          loading={loading}
          isAdded={isAdded}
        />
      </Box>
    </>
  )
}

export default withBaseLogic(BookLayout)
