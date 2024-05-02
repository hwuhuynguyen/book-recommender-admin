import Box from '@mui/material/Box'
import withBaseLogic from '../../hoc/withBaseLogic'
import ReusableTable from '../../components/Table'
import Input from '../../components/Input'
import { ChangeEvent, useCallback, useRef, useState } from 'react'
import React, { useEffect } from 'react'
import { ParamApi, TournamentAPIRes } from '../../types/common'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import { toast } from 'react-toastify'
import { Button, Grid, Typography } from '@mui/material'
import { MenuItem, TextField } from '@mui/material'
// import { tournamentStatuses } from '../../constants/status'
import { addNewBook, deleteBookById, getBooks } from '../../apis/axios/book'
// import { removeEmptyFields } from '../../utils/function'
// import { convertTournament } from '../../utils/tournament'
import { useDispatch, useSelector } from 'react-redux'
import { categoriesSelector } from '../../redux/reducers/categories/categories.selectors'
import { setTournaments } from '../../redux/reducers/tournaments/tournaments.reducer'
// import DialogAddTournament from '../../components/Dialog/Tournament/AddTournament/DialogAddTournament'
import { AddCircle } from '@mui/icons-material'
import { getCategories } from '../../redux/reducers/categories/categories.slice'
import { ThunkDispatch } from '@reduxjs/toolkit'
import { CommonDeleteDialog } from '../../components/Dialog/DeleteDialog/CommonDeleteDialog'
import StatisticCard from '../../components/Card/StatisticCard'
import { mockDataBooks } from '../../data/book'

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
        filed: 'name',
        width: '200px'
      }
    },
    {
      id: 'category',
      sortTable: true,
      label: 'Category',
      sortBy: 'category',
      left: false,
      style: {
        filed: 'name',
        width: '150px'
      }
    },
    {
      id: 'publisher',
      sortTable: false,
      label: 'Publisher',
      sortBy: 'publisher',
      left: false,
      style: {
        filed: 'name',
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
        filed: 'name',
        width: '150px'
      }
    },
    {
      id: 'createdAt',
      sortTable: true,
      label: 'Created at',
      sortBy: 'createdAt',
      left: false,
      style: {
        filed: 'name',
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
        filed: 'name',
        width: '150px'
      }
    }
  ]

  const [open, setOpen] = useState(false)
  const handleClickOpen = () => {
    setOpen(true)
  }

  const [params] = useSearchParams()
  const pageURL = Number(params.get('page'))
  const [searchText, setSearchText] = useState<string | ''>('')
  const [sortType, setSortType] = useState<'asc' | 'desc' | ''>('')
  const [sortValue, setSortValue] = useState<string | ''>('')
  const [filterStatus, setFilterStatus] = useState<string | ''>('All')
  const [filterCategory, setFilterCategory] = useState<string | ''>('All')
  const tournaments = useSelector((state: any) => state.tournament.tournaments)
  const [totalTournaments, setTotalTournaments] = useState<number>(0)
  const [currentPage, setCurrentPage] = useState<number>(pageURL | 1)
  const [totalCurrentPage, setTotalCurrentPage] = useState<number>(0)
  const [update, setUpdate] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [isAdded, setIsAdded] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [deleteRowData, setDeleteRowData] = useState<{ [key: string]: any }>()
  const { listCategory } = useSelector(categoriesSelector)
  const dispatch = useDispatch()
  const isSetPageURL = useRef(false)

  const dispatchCategory = useDispatch<ThunkDispatch<any, any, any>>()
  useEffect(() => {
    dispatchCategory(getCategories())
  }, [dispatchCategory])

  const getAll = useCallback(async (param: ParamApi) => {
    const getTournaments = (await getBooks(param)) as TournamentAPIRes

    if (getTournaments && getTournaments.data && getTournaments?.data?.length !== 0) {
      const convertedData = []
      for (const tournament of getTournaments.data) {
        // convertedData.push(convertTournament(tournament))
        convertedData.push(tournament)
      }
      dispatch(setTournaments([...convertedData]))
      setTotalTournaments(getTournaments?.additionalData?.totalTournament)
      setTotalCurrentPage(convertedData.length)
    } else {
      dispatch(setTournaments([...mockDataBooks]))
      setTotalTournaments(0)
      setTotalCurrentPage(0)
    }
    setLoading(false)
    setIsAdded(false)
  }, [])

  const pageSearch = (value: number) => {
    setCurrentPage(() => value)
    isSetPageURL.current = false
    setUpdate((prev) => !prev)
  }

  const debounceSearch = useDebounce({
    value: searchText,
    ms: 800
  })

  useEffect(() => {
    if (pageURL > 0 && isSetPageURL.current === false) {
      setCurrentPage(() => pageURL)
      isSetPageURL.current = true
    }
  }, [pageURL])

  useEffect(() => {
    const currentParams = {
      page: String(currentPage),
      keyword: searchText,
      sortType: sortType,
      sortValue: sortType && sortValue,
      filterStatus: filterStatus !== 'All' ? filterStatus : '',
      filterCategory: filterCategory !== 'All' ? filterCategory : ''
    }
    // removeEmptyFields(currentParams)
    navigate({
      pathname: location.pathname,
      search: createSearchParams(currentParams).toString()
    })
    const param: ParamApi = {
      page: currentPage,
      keyword: searchText,
      sortType: sortType,
      sortValue: sortType && sortValue,
      filterStatus: filterStatus !== 'All' ? filterStatus : '',
      filterCategory: filterCategory !== 'All' ? filterCategory : ''
    }
    // removeEmptyFields(param)
    getAll({ ...param })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceSearch, navigate, location.pathname, update])

  const handleEdit = useCallback((rowData: { [key: string]: any }) => {
    navigate(`/tournament/${rowData.id}/general`)
  }, [])

  const handleDelete = useCallback(
    async (rowData: { [key: string]: any }) => {
      const { title } = rowData //get categoryId
      setWarningMessage(
        `Are you sure you want to delete the tournament with the title <span style="font-weight: 600">'${title}'</span>?`
      )
      try {
        setIsDeleteDialogOpen(true)
        setDeleteRowData(rowData)
      } catch (err) {
        console.log(err)
      }
    },
    [totalCurrentPage, currentPage, deleteRowData]
  )

  const handleDeleteTournament = useCallback(
    async (rowData?: { [key: string]: any }) => {
      if (rowData) {
        const { id } = rowData //get categoryId
        const res = (await deleteBookById(id)) as TournamentAPIRes
        if (res.success) {
          toast.success('A tournament is deleted successfully!')
          if (totalCurrentPage === 1 && currentPage > 1) {
            setCurrentPage((prevPage) => prevPage - 1)
          }
          setUpdate((prev) => !prev)
        } else {
          toast.error(res.message)
        }
        setIsDeleteDialogOpen(false)
      }
    },
    [totalCurrentPage, currentPage]
  )

  const handleColumnSort = useCallback((idColumm: any, sortType: 'asc' | 'desc' | '') => {
    setSortType(sortType)
    setSortValue(idColumm)
    setUpdate((prev) => !prev)
  }, [])

  const handleChangeFilterStatus = useCallback((event: ChangeEvent<{ value: string }>) => {
    setCurrentPage(1)
    setFilterStatus(event.target.value)
    setUpdate((prev) => !prev)
  }, [])

  const handleChangeFilterCategory = useCallback((event: ChangeEvent<{ value: string }>) => {
    setCurrentPage(1)
    setFilterCategory(event.target.value)
    setUpdate((prev) => !prev)
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
              <Button
                variant="contained"
                onClick={handleClickOpen}
                style={{
                  background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
                  color: 'white'
                }}
                // endIcon={<AddCircle />}
              >
                Crawl data
              </Button>
              <Typography variant="caption" paddingLeft={'1rem'}>
                Last updated on April 10, 2024.
              </Typography>
              {/* {open && (
              <DialogAddTournament
                addTournament={createTournament}
                open={open}
                setOpen={setOpen}
                onAdd={() => {
                  setIsAdded(true)
                  setSortType('')
                  setSortValue('')
                  setSearchText('')
                  setFilterStatus('All')
                  setFilterCategory('All')
                  setCurrentPage(1)
                  setUpdate((prev) => !prev)
                }}
              />
            )} */}
            </Box>
          </Box>
          <Box sx={{ display: 'flex', alignSelf: 'flex-end', gap: '0.5rem', flexWrap: 'wrap' }}>
            <TextField
              id="filter"
              label="Category"
              defaultValue="All"
              variant="outlined"
              select
              size="small"
              sx={{
                width: '200px',
                '& .MuiInputBase-input': {
                  padding: '8.5px 14px !important'
                },
                '&.MuiTextField-root': {
                  marginTop: '0 !important'
                }
              }}
              onChange={handleChangeFilterCategory}
              value={filterCategory}
            >
              <MenuItem value="All">All</MenuItem>
              {listCategory?.map((option: any) => (
                <MenuItem key={option.categoryId} value={option.categoryId}>
                  {option.categoryName}
                </MenuItem>
              ))}
            </TextField>
            {/* <TextField
            id="filter"
            label="Status"
            defaultValue="All"
            variant="outlined"
            select
            size="small"
            sx={{
              width: '200px',
              '& .MuiInputBase-input': {
                padding: '8.5px 14px !important'
              },
              '&.MuiTextField-root': {
                marginTop: '0 !important'
              }
            }}
            onChange={handleChangeFilterStatus}
            value={filterStatus}
          >
            {tournamentStatuses.map((option: any) => (
              <MenuItem key={option.value} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </TextField> */}
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
          onDelete={() => handleDeleteTournament(deleteRowData)}
          title={'Delete Tournament'}
          message={warningMessage}
          deleteBtnText="Yes, delete"
        />

        <ReusableTable
          columns={columns}
          rows={tournaments}
          onEdit={handleEdit}
          onDelete={handleDelete}
          handleColumnSort={handleColumnSort}
          total={totalTournaments}
          handlePageSearch={pageSearch}
          totalCurrentPage={totalCurrentPage}
          loading={loading}
          isAdded={isAdded}
        />
      </Box>
    </>
  )
}

export default withBaseLogic(BookLayout)
