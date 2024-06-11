import {
  Box,
  Paper,
  Rating,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow
} from '@mui/material'
import { IColumnTypes } from '../../../types'

interface DashboardTableProps {
  columns: IColumnTypes[]
  rows: { [key: string]: any }[]
  loading?: boolean
}

function DashboardTable({ columns, rows, loading }: DashboardTableProps) {
  const TableRowsLoader = ({ rowsNum }: any) => {
    return (
      <>
        {[...Array(rowsNum)].map((row, index) => (
          <TableRow key={index}>
            {columns.map((item, index) => (
              <TableCell component="th" scope="row" key={index}>
                <Skeleton animation="wave" variant="text" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </>
    )
  }
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            {columns?.map((column) => (
              <TableCell
                key={column.id}
                style={{ width: `${column.id === column.style?.filed && column.style.width}` }}
              >
                {column.label}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {loading ? (
            <TableRowsLoader rowsNum={5} />
          ) : (
            rows?.map((row, rowIndex) => (
              <TableRow
                key={rowIndex}
                sx={{
                  '&:nth-of-type(even)': {
                    backgroundColor: '#f9fafd'
                  }
                }}
              >
                {columns?.map((column, colIndex) => (
                  <TableCell key={colIndex} component="td" scope="row">
                    {Object.values(column).indexOf('Id') > -1 ? (
                      rowIndex + 1
                    ) : Object.values(column).indexOf('averageRating') > -1 ? (
                      <Box sx={{ alignItems: 'center', display: 'flex' }}>
                        <Rating readOnly defaultValue={row[column.id]} precision={0.1} max={10} />({row[column.id]})
                      </Box>
                    ) : (
                      row[column.id]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default DashboardTable
