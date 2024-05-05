import Box from '@mui/material/Box'
import withBaseLogic from '../../hoc/withBaseLogic'
import ReusableTable from '../../components/Table'
import Input from '../../components/Input'
import { useCallback, useRef, useState } from 'react'
import { useEffect } from 'react'
import { createSearchParams, useSearchParams } from 'react-router-dom'
import useDebounce from '../../hooks/useDebounce'
import { toast } from 'react-toastify'
import { DialogAddUser } from '../../components/Dialog/User/AddUser'
import dayjs from 'dayjs'
import { CommonDeleteDialog } from '../../components/Dialog/DeleteDialog/CommonDeleteDialog'
import { removeEmptyFields } from '../../utils/function'
import { UserApi } from '../../services'
import { DialogEditUser } from '../../components/Dialog/User/EditUser'
import { IUser } from '../../types'

const UserLayout = ({ navigate, location }: any) => {
  const columns = [
    {
      id: 'Id',
      sortTable: false,
      sortBy: 'Id',
      label: 'No.',
      left: false,
      style: {
        filed: 'Id',
        width: '70px'
      }
    },
    {
      id: 'name',
      sortTable: true,
      label: 'Name',
      sortBy: 'name',
      left: false,
      style: {
        filed: 'name',
        width: '500px'
      }
    },
    {
      id: 'gender',
      sortTable: false,
      label: 'Gender',
      sortBy: 'gender',
      left: false,
      style: {
        filed: 'gender',
        width: '500px'
      }
    },
    {
      id: 'email',
      sortTable: true,
      label: 'Email',
      sortBy: 'email',
      left: false,
      style: {
        filed: 'email',
        width: '500px'
      }
    },
    {
      id: 'dateOfBirth',
      sortTable: false,
      label: 'Date of birth',
      sortBy: 'dateOfBirth',
      left: false,
      style: {
        filed: 'dateOfBirth',
        width: '300px'
      }
    }
  ]

  const [params] = useSearchParams()
  const pageURL = Number(params.get('page'))
  const [currentPage, setCurrentPage] = useState<number>(pageURL | 1)

  const [searchText, setSearchText] = useState<string | ''>('')
  const [sortType, setSortType] = useState<'asc' | 'desc' | ''>('')
  const [sortValue, setSortValue] = useState<string | ''>('')

  const [users, setUsers] = useState<IUser[]>([])
  const [totalUsers, setTotalUsers] = useState<number>(0)

  const [totalItemsOnCurrentPage, setTotalItemsOnCurrentPage] = useState<number>(0)

  const [loading, setLoading] = useState<boolean>(true)
  const [update, setUpdate] = useState<boolean>(false)
  const [isAdded, setIsAdded] = useState(false)

  const [isEditDialogOpen, setIsEditDialogOpen] = useState<boolean>(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState<boolean>(false)

  const [selectedUser, setSelectedUser] = useState<IUser>()
  const [warningMessage, setWarningMessage] = useState('')
  const [deleteRowData, setDeleteRowData] = useState<{ [key: string]: any }>()

  const isSetPageURL = useRef(false)

  const getAll = useCallback(async (parameter: any) => {
    const response = await UserApi.getUsers(parameter)

    if (response?.data.data && response?.data.data.length !== 0) {
      const formattedData = response?.data?.data.map((e: IUser) => {
        return {
          ...e,
          dateOfBirth: e.dob ? dayjs(e.dob).format('DD/MM/YYYY') : ''
        }
      })
      setUsers(formattedData)
      setTotalItemsOnCurrentPage(formattedData.length)
    } else {
      setUsers([])
      setTotalItemsOnCurrentPage(0)
    }
    setTotalUsers(response.data.meta.total)
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

  const handleEdit = useCallback(async (rowData: { [key: string]: any }) => {
    try {
      setSelectedUser(rowData)
      setIsEditDialogOpen(true)
    } catch (err) {
      console.error('Error fetching user', err)
    }
  }, [])

  const handleDelete = useCallback((rowData: { [key: string]: any }) => {
    const { name, email } = rowData
    setWarningMessage(
      `Are you sure you want to delete the
         user with the name <span style="font-weight: 600">'${name}</span> 
         (<span style="font-weight: 600">${email}</span>)<span style="font-weight: 
         600">'</span>?`
    )
    try {
      setIsDeleteDialogOpen(true)
      setDeleteRowData(rowData)
    } catch (err: any) {
      toast.error(err?.message)
    }
  }, [])

  const deleteUser = useCallback(
    async (rowData?: { [key: string]: any }) => {
      try {
        if (rowData) {
          const { id } = rowData
          await UserApi.deleteUserById(id)
          toast.success('An user is deleted successfully!')
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
  }, [currentPage, debounceSearch, sortType, sortValue, update, pageURL])

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
          <DialogAddUser
            onAdd={() => {
              setIsAdded(true)
              setSortType('')
              setSearchText('')
              setCurrentPage(1)
              setUpdate((prev) => !prev)
            }}
          />
        </Box>
        <Box sx={{ alignSelf: 'flex-end' }}>
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
      <DialogEditUser
        selectedUser={selectedUser}
        onOpen={isEditDialogOpen}
        onClose={() => {
          setIsEditDialogOpen(false)
        }}
        onUpdate={() => {
          setUpdate((prev) => !prev)
        }}
      />
      <CommonDeleteDialog
        onOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
        }}
        onDelete={() => deleteUser(deleteRowData)}
        title={'Delete user'}
        message={warningMessage}
        deleteBtnText="Yes, delete"
      />
      <ReusableTable
        columns={columns}
        rows={users}
        onEdit={handleEdit}
        onDelete={handleDelete}
        handleColumnSort={handleColumnSort}
        total={totalUsers}
        handlePageSearch={pageSearch}
        totalItemsOnCurrentPage={totalItemsOnCurrentPage}
        loading={loading}
        isAdded={isAdded}
      />
    </Box>
  )
}

export default withBaseLogic(UserLayout)
