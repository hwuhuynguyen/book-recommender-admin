import React, { useRef } from 'react'
import Box from '@mui/material/Box'
import withBaseLogic from '../../hoc/withBaseLogic'
import ReusableTable from '../../components/Table'
import Input from '../../components/Input'
import { useCallback, useEffect, useState } from 'react'
import { APIRes, CommonAPIRes, ParamApi } from '../../types/common'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import {
  apiDeleteCategory,
  getAllCategories,
  addCategory,
  apiEditCategory,
  getTotalTournamentsByCategory
} from '../../apis/axios/categories/category'
import useDebounce from '../../hooks/useDebounce'
import { toast } from 'react-toastify'
import { useDispatch, useSelector } from 'react-redux'
import { setCategories, setSelectedCategory } from '../../redux/reducers/categories/categories.reducer'
import { mockDataCategory } from '../../data/category'
import { Categories } from '../../types/category'
import { CommonDeleteDialog } from '../../components/Dialog/DeleteDialog'
import { DialogAddCategory } from '../../components/Dialog/Category/AddCategory'
import { DialogEditCategory } from '../../components/Dialog/Category/EditCategory'

const CategoryLayout = ({ navigate, location }: any) => {
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
      id: 'categoryName',
      sortTable: true,
      label: 'Name',
      sortBy: 'categoryName',
      left: true,
      style: {
        filed: 'name',
        width: '1000px'
      }
    }
  ]

  const dispatch = useDispatch()
  const [searchText, setSearchText] = useState<string | ''>('')
  const [sortType, setSortType] = useState<'asc' | 'desc' | ''>('')
  // const categories = useSelector((state: any) => state.category.categories)
  const [totalCategories, setTotalCategories] = useState<number>(0)
  const [params] = useSearchParams()
  const pageURL = Number(params.get('page'))
  const [currentPage, setCurrentPage] = useState<number>(pageURL | 1)
  const [update, setUpdate] = useState<boolean>(false)
  const [totalCurrentPage, setTotalCurrentPage] = useState<number>(0)
  const [loading, setLoading] = useState<boolean>(true)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)
  const [warningMessage, setWarningMessage] = useState('')
  const [deleteRowData, setDeleteRowData] = useState<{ [key: string]: any }>()
  const [categoryName, setCategoryName] = useState('')
  const [isAdded, setIsAdded] = useState(false)
  const isSetPageURL = useRef(false)

  const [value, setValue] = useState<string | ''>('')
  const [categories, setCategories] = useState<Categories[] | []>([])

  // get all category from DB
  const getAll = async (param: ParamApi) => {
    // const getCategories = (await getAllCategories(param)) as APIRes
    // if (getCategories?.data?.length !== 0) {
    //   dispatch(setCategories([...getCategories.data]))
    // } else {
    //   dispatch(setCategories([]))
    // }
    // setTotalCurrentPage(getCategories?.total)
    // setTotalCategories(getCategories?.additionalData?.totalCategories)
    // setLoading(false)
    const start = 10 * (currentPage - 1)
    const end = start + 10
    let getCategories: Categories[] | [] = []
    if (param.keyword !== '') {
      getCategories = mockDataCategory.filter((team: Categories) =>
        team.categoryName.toLowerCase().includes(searchText.toLowerCase())
      )
    } else {
      getCategories = mockDataCategory
    }

    setCategories(
      getCategories.slice(start, end).sort((a: Categories, b: Categories) => {
        if (param.sortType === 'asc' && a.categoryName < b.categoryName) return -1
        if (param.sortType === 'desc' && a.categoryName > b.categoryName) return 1
        if (param.sortType === '' && a.categoryId > b.categoryId) return 1
        return 0
      })
    )
    setTotalCurrentPage((prev) => (prev = Math.ceil(getCategories.length / 10)))
    setTotalCategories(getCategories.length)
  }

  const pageSearch = (value: number) => {
    setCurrentPage(() => value)
    setUpdate((prev) => !prev)
  }

  //delaying the execution of function search
  const debouceSearch = useDebounce({
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
    if (debouceSearch) {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ keyword: searchText, sortType: sortType, page: String(currentPage) }).toString()
      })
    } else if (sortType !== '') {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ sortType: sortType, page: String(currentPage) }).toString()
      })
    } else {
      navigate({
        pathname: location.pathname,
        search: createSearchParams({ page: String(currentPage) }).toString()
      })
    }

    const param: ParamApi = {
      sortType: sortType,
      page: currentPage,
      keyword: searchText
    }
    getAll({ ...param })
    setLoading(false)
    setIsAdded(false)
  }, [debouceSearch, update])

  const handleEdit = useCallback(
    (rowData: { [key: string]: any }) => {
      dispatch(setSelectedCategory(rowData))
      setCategoryName(rowData.categoryName)
      setIsEditDialogOpen(true)
    },
    [dispatch]
  )

  const handleDelete = useCallback(
    async (rowData: { [key: string]: any }) => {
      const { categoryId, categoryName } = rowData //get categoryId
      try {
        setWarningMessage(
          `<p style="margin-top: 0">Deleting <span style="font-weight: 600">'${categoryName}'</span> category will delete <span style="color: rgb(220, 72, 72); font-weight: 500">${10} books</span> currently associated with it.</p> Are you sure you want to proceed?`
        )
        setIsDeleteDialogOpen(true)
        setDeleteRowData(rowData)
      } catch (err) {
        console.log(err)
      }
    },
    [totalCurrentPage, currentPage, deleteRowData]
  )

  const handleDeleteCategory = useCallback(
    async (rowData?: { [key: string]: any }) => {
      if (rowData) {
        const { categoryId } = rowData //get categoryId
        const res = (await apiDeleteCategory(categoryId)) as APIRes
        if (res.success) {
          toast.success('A category is successfully deleted!')
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
    setUpdate((prev) => !prev)
  }, [])

  return (
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
          <DialogAddCategory
            addCategory={addCategory}
            onAdd={() => {
              setIsAdded(true)
              setSortType('')
              setSearchText('')
              setCurrentPage(1)
              setUpdate((prev) => !prev)
            }}
          />
        </Box>
        <DialogEditCategory
          editCategory={apiEditCategory}
          categories={categories}
          onOpen={isEditDialogOpen}
          onClose={() => setIsEditDialogOpen(false)}
          categoryName={categoryName}
        />
        <CommonDeleteDialog
          onOpen={isDeleteDialogOpen}
          onClose={() => {
            setIsDeleteDialogOpen(false)
          }}
          onDelete={() => handleDeleteCategory(deleteRowData)}
          title={'Delete Category'}
          message={warningMessage}
          deleteBtnText="Yes, delete"
        />

        <Box sx={{ alignSelf: 'flex-end' }}>
          <Input
            label="Search"
            id="outlined-search"
            placeholder="Search here..."
            handleChange={(e) => {
              setCurrentPage(1)
              setSearchText(e.target.value)
              setValue(e.target.value)
            }}
            value={searchText}
          />
        </Box>
      </Box>

      <ReusableTable
        columns={columns}
        rows={categories}
        onEdit={handleEdit}
        onDelete={handleDelete}
        handleColumnSort={handleColumnSort}
        total={totalCategories}
        handlePageSearch={pageSearch}
        totalCurrentPage={totalCurrentPage}
        loading={loading}
        isAdded={isAdded}
      />
    </Box>
  )
}

export default withBaseLogic(CategoryLayout)
