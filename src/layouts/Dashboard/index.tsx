import { Box, Grid, Typography } from '@mui/material'
import React from 'react'
import { BarChart } from '../../components/Chart'
import reportsBarChartData from '../../data/reportsBarChartData'
import StatisticCard from '../../components/Card/StatisticCard'
import DashboardTable from '../../components/Table/DashboardTable'

const DashboardLayout = () => {
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
      left: true,
      style: {
        filed: 'title',
        width: '700px'
      }
    },
    {
      id: 'publisher',
      sortTable: true,
      label: 'Publisher',
      sortBy: 'publisher',
      left: true,
      style: {
        filed: 'publisher',
        width: '400px'
      }
    },
    {
      id: 'rating',
      sortTable: true,
      label: 'Rating score',
      sortBy: 'rating',
      left: true,
      style: {
        filed: 'rating',
        width: '200px'
      }
    },
    {
      id: 'ratingCount',
      sortTable: true,
      label: 'Rating count',
      sortBy: 'ratingCount',
      left: true,
      style: {
        filed: 'ratingCount',
        width: '200px'
      }
    }
  ]
  const books = [
    {
      id: 1,
      title: 'The Hobbit',
      rating: 5,
      ratingCount: 941,
      publisher: 'George Allen & Unwin'
    },
    {
      id: 2,
      title: 'Brave New World',
      rating: 4.7,
      ratingCount: 823,
      publisher: 'Chatto & Windus'
    },
    {
      id: 3,
      title: 'Jane Eyre',
      rating: 4.3,
      ratingCount: 452,
      publisher: 'Smith, Elder & Co.'
    },
    {
      id: 4,
      title: 'The Lord of the Rings',
      rating: 3.9,
      ratingCount: 841,
      publisher: 'Allen & Unwin'
    },
    {
      id: 5,
      title: 'The Catcher in the Rye',
      rating: 3.5,
      ratingCount: 127,
      publisher: 'Little, Brown and Company'
    }
  ]
  return (
    <>
      <Grid container spacing={3} my={0}>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticCard title="Books from Tiki" data={6324} trend={15} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticCard title="Books from ThriftBooks" data={8421} trend={9} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticCard title="Books from Amazon" data={3020} trend={12} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticCard title="Users" data={92} trend={3} />
        </Grid>
      </Grid>
      <Grid container spacing={3} my={0}>
        <Grid item xs={12} md={6} lg={4}>
          <Box>
            <BarChart
              color="dark"
              background={'linear-gradient(195deg, #49a3f1, #1A73E8)'}
              title="Tiki"
              description="Number of books crawled from Tiki"
              date="updated 2 days ago"
              chart={reportsBarChartData}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Box>
            <BarChart
              color="dark"
              background={'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))'}
              title="ThriftBooks"
              description="Number of books crawled from ThriftBooks"
              date="updated 2 days ago"
              chart={reportsBarChartData}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <Box>
            <BarChart
              color="dark"
              background={'linear-gradient(195deg, #42424a, #191919)'}
              title="Amazon"
              description="Number of books crawled from Amazon"
              date="updated 2 days ago"
              chart={reportsBarChartData}
            />
          </Box>
        </Grid>
      </Grid>

      <Grid container spacing={3} my={0}>
        <Grid item md={12}>
          <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem' }}>
            <Typography variant="button" mb={0.5}>
              Top 5 books with the highest ratings
            </Typography>
            <DashboardTable columns={columns} rows={books} />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default DashboardLayout
