import { Box, Grid, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import StatisticCard from '../../components/Card/StatisticCard'
import DashboardTable from '../../components/Table/DashboardTable'
import { BookApi, DashboardApi } from '../../services'
import { IBook } from '../../types'
import dayjs from 'dayjs'
import { Bar, Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from 'chart.js'

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend, ArcElement)

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
        width: '1000px'
      }
    },
    {
      id: 'author',
      sortTable: true,
      label: 'Author',
      sortBy: 'author',
      left: true,
      style: {
        filed: 'author',
        width: '200px'
      }
    },
    {
      id: 'averageRating',
      sortTable: true,
      label: 'Rating score',
      sortBy: 'averageRating',
      left: true,
      style: {
        filed: 'averageRating',
        width: '500px'
      }
    },
    {
      id: 'numberOfRatings',
      sortTable: true,
      label: 'Number of ratings',
      sortBy: 'numberOfRatings',
      left: true,
      style: {
        filed: 'numberOfRatings',
        width: '200px'
      }
    }
  ]

  const [topRatedBooks, setTopRatedBooks] = useState([])
  const [mostRatedBooks, setMostRatedBooks] = useState([])
  const [numberOfBooks, setNumberOfBooks] = useState({
    bookCrossing: 0,
    goodreads: 0,
    thriftBooks: 0
  })
  const [numberOfGenders, setNumberOfGenders] = useState({
    male: 0,
    female: 0,
    other: 0
  })
  const [ctrIndexes, setCtrIndexes] = useState({
    contentBased: 0,
    collaborative: 0
  })
  const [clicksImpressions, setClicksImpressions] = useState({
    clicksContentBased: 0,
    clicksCollaborative: 0,
    impressionsContentBased: 0,
    impressionsCollaborative: 0
  })
  const [numberOfUsers, setNumberOfUsers] = useState<number>(0)
  const [crawlData, setCrawlData] = useState<number[]>([])
  const [loading, setLoading] = useState({
    topRatedBooks: false,
    mostRatedBooks: false
  })

  useEffect(() => {
    const getTopRatedBooks = async () => {
      setLoading((prevState) => ({ ...prevState, topRatedBooks: true }))
      try {
        const response = await BookApi.getBooks({
          page: 1,
          perPage: 5,
          order: 'averageRating:desc'
        })
        if (response?.data.data && response?.data.data.length !== 0) {
          const formattedData = response?.data?.data.map((e: IBook) => {
            return {
              ...e,
              author: e.authors?.map((element: any) => element?.author?.name),
              releaseDate: e.releaseDate ? dayjs(e.releaseDate).format('DD/MM/YYYY') : '',
              source: e.source ? e.source.name : ''
            }
          })
          setTopRatedBooks(formattedData)
        }
      } catch (err) {
        setTopRatedBooks([])
      } finally {
        setLoading((prevState) => ({ ...prevState, topRatedBooks: false }))
      }
    }
    const getMostRatedBooks = async () => {
      setLoading((prevState) => ({ ...prevState, mostRatedBooks: true }))

      try {
        const response = await BookApi.getBooks({
          page: 1,
          perPage: 5,
          order: 'numberOfRatings:desc'
        })
        if (response?.data.data && response?.data.data.length !== 0) {
          const formattedData = response?.data?.data.map((e: IBook) => {
            return {
              ...e,
              author: e.authors?.map((element: any) => element?.author?.name),
              releaseDate: e.releaseDate ? dayjs(e.releaseDate).format('DD/MM/YYYY') : '',
              source: e.source ? e.source.name : ''
            }
          })
          setMostRatedBooks(formattedData)
        }
      } catch (err) {
        setMostRatedBooks([])
      } finally {
        setLoading((prevState) => ({ ...prevState, mostRatedBooks: false }))
      }
    }
    const getStatistics = async () => {
      try {
        const response = await DashboardApi.getCardStatistics()
        const updatedNumberOfBooks = {
          bookCrossing: response.data.sources.find((item: any) => item.name === 'Book Crossing')?.numberOfBooks || 0,
          goodreads: response.data.sources.find((item: any) => item.name === 'GoodReads')?.numberOfBooks || 0,
          thriftBooks: response.data.sources.find((item: any) => item.name === 'Thrift Books')?.numberOfBooks || 0
        }

        setNumberOfBooks(updatedNumberOfBooks)
        setNumberOfUsers(response.data.numberOfUsers)
      } catch (err) {
        setNumberOfBooks({
          bookCrossing: 0,
          goodreads: 0,
          thriftBooks: 0
        })
        setNumberOfUsers(0)
      }
    }
    const getGenderDistribution = async () => {
      try {
        const response = await DashboardApi.getUserStatistics()
        const updatedNumberOfGenders = {
          male: response.data.find((item: any) => item.gender === 'MALE')?.count || 0,
          female: response.data.find((item: any) => item.gender === 'FEMALE')?.count || 0,
          other: response.data.find((item: any) => item.gender === 'OTHER')?.count || 0
        }
        setNumberOfGenders(updatedNumberOfGenders)
      } catch (err) {
        setNumberOfGenders({
          male: 0,
          female: 0,
          other: 0
        })
      }
    }
    const getCrawlDistribution = async () => {
      try {
        const response = await DashboardApi.getCrawlStatistics()
        let resultArray = new Array(12).fill(0)
        response.data.data.forEach((item: any) => {
          let monthIndex = parseInt(item.month) - 1
          resultArray[monthIndex] = item.bookCount
        })
        setCrawlData(resultArray)
      } catch (err) {
        console.log(err)
      }
    }
    const getCTRIndexes = async () => {
      try {
        const response = await DashboardApi.getCTR()

        const updatedCTRIndexes = {
          contentBased: response.data.CTR_CONTENT_BASED || 0,
          collaborative: response.data.CTR_COLLABORATIVE || 0
        }
        const updatedClicksImpressions = {
          clicksContentBased: response.data.totalContentBasedClicks,
          clicksCollaborative: response.data.totalCollaborativeClicks,
          impressionsContentBased: response.data.totalContentBasedImpressions,
          impressionsCollaborative: response.data.totalCollaborativeImpressions
        }
        setCtrIndexes(updatedCTRIndexes)
        setClicksImpressions(updatedClicksImpressions)
      } catch (err) {
        setCtrIndexes({
          contentBased: 0,
          collaborative: 0
        })
        setClicksImpressions({
          clicksContentBased: 0,
          clicksCollaborative: 0,
          impressionsContentBased: 0,
          impressionsCollaborative: 0
        })
      }
    }
    getCTRIndexes()
    getStatistics()
    getGenderDistribution()
    getTopRatedBooks()
    getMostRatedBooks()
    getCrawlDistribution()
  }, [])

  const crawledData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [
      {
        label: 'Total books crawled',
        data: crawlData,
        borderColor: 'rgb(53, 162, 235)',
        backgroundColor: 'rgba(53, 162, 235, 0.5)'
      }
    ]
  }

  return (
    <>
      <Grid container spacing={3} my={0}>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticCard
            title="Total books"
            data={numberOfBooks.bookCrossing + numberOfBooks.thriftBooks + numberOfBooks.goodreads}
            trend={9}
          />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticCard title="Total users" data={numberOfUsers} trend={3} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticCard title="CTR for Content-based model" data={ctrIndexes.contentBased} trend={3} />
        </Grid>
        <Grid item xs={12} md={6} lg={3}>
          <StatisticCard title="CTR for Collaborative model" data={ctrIndexes.collaborative} trend={3} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <StatisticCard title="Books from BookCrossing" data={numberOfBooks.bookCrossing} trend={12} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <StatisticCard title="Books from ThriftBooks" data={numberOfBooks.thriftBooks} trend={9} />
        </Grid>
        <Grid item xs={12} md={6} lg={4}>
          <StatisticCard title="Books from Goodreads" data={numberOfBooks.goodreads} trend={9} />
        </Grid>
      </Grid>
      <Grid container spacing={3} my={0}>
        <Grid item xs={12} md={6} lg={6}>
          <Box>
            <Typography variant="body1" mb={0.5} textAlign={'center'}>
              Total books crawled by months
            </Typography>
            <Bar
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const
                  }
                }
              }}
              data={crawledData}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={6}>
          <Box>
            <Typography variant="body1" mb={0.5} textAlign={'center'}>
              Clicks and Impressions by models
            </Typography>
            <Bar
              className=""
              options={{
                responsive: true,
                plugins: {
                  legend: {
                    position: 'top' as const
                  }
                },
                interaction: {
                  intersect: false
                },
                scales: {
                  x: {
                    stacked: true
                  },
                  y: {
                    stacked: true
                  }
                }
              }}
              data={{
                labels: ['Content-based model', 'Collaborative model'],
                datasets: [
                  {
                    label: 'Clicks',
                    data: [clicksImpressions.clicksContentBased, clicksImpressions.clicksCollaborative],
                    backgroundColor: '#DD761C',
                    stack: 'Stack 0'
                  },

                  {
                    label: 'Impressions',
                    data: [clicksImpressions.impressionsContentBased, clicksImpressions.impressionsCollaborative],
                    backgroundColor: '#6DC5D1',
                    stack: 'Stack 1'
                  }
                ]
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={2}></Grid>
        <Grid item xs={12} md={6} lg={3}>
          <Box>
            <Typography variant="body1" mb={0.5} textAlign={'center'}>
              Book Distribution by sources
            </Typography>
            <Pie
              className=""
              data={{
                labels: ['Book Crossing', 'Thrift Books', 'Goodreads'],
                datasets: [
                  {
                    label: 'Total: ',
                    data: [numberOfBooks.bookCrossing, numberOfBooks.thriftBooks, numberOfBooks.goodreads],
                    backgroundColor: ['#5C88C4', '#6FDCE3', '#FFFDB5'],
                    borderWidth: 0,
                    hoverBackgroundColor: ['#5C88C4', '#6FDCE3', '#FFFDB5']
                  }
                ]
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={6} lg={2}></Grid>

        <Grid item xs={12} md={6} lg={3}>
          <Box>
            <Typography variant="body1" mb={0.5} textAlign={'center'}>
              User Distribution by genders
            </Typography>
            <Pie
              className=""
              data={{
                labels: ['Male', 'Female', 'Other'],
                datasets: [
                  {
                    label: 'Total: ',
                    data: [numberOfGenders.male, numberOfGenders.female, numberOfGenders.other],
                    backgroundColor: ['#78ABA8', '#EF9C66', '#C8CFA0'],
                    borderWidth: 0,
                    hoverBackgroundColor: ['#78ABA8', '#EF9C66', '#C8CFA0']
                  }
                ]
              }}
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
            <DashboardTable columns={columns} rows={topRatedBooks} loading={loading.topRatedBooks} />
          </Box>
        </Grid>
        <Grid item md={12}>
          <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem' }}>
            <Typography variant="button" mb={0.5}>
              Top 5 books with the most ratings
            </Typography>
            <DashboardTable columns={columns} rows={mostRatedBooks} loading={loading.mostRatedBooks} />
          </Box>
        </Grid>
      </Grid>
    </>
  )
}

export default DashboardLayout
