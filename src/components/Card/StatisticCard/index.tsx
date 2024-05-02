import { Box, Card, Divider, Icon, Typography } from '@mui/material'
import React from 'react'

interface StatisticCardProps {
  title: string
  data: number
  trend: number
}

const StatisticCard = ({ title, data, trend }: StatisticCardProps) => {
  return (
    <Card sx={{ borderRadius: '1rem' }}>
      <Box display="flex" justifyContent="space-between" pt={1} px={2}>
        <Box
          bgcolor={'white'}
          color={'white'}
          borderRadius="xl"
          display="flex"
          justifyContent="center"
          alignItems="center"
          // width="4rem"
          width="30%"
          height="4rem"
          mt={-3}
        >
          <Icon fontSize="medium" color="inherit"></Icon>
        </Box>
        <Box textAlign="right" lineHeight={1.25}>
          <Typography variant="button" fontWeight="light" color="text">
            {title}
          </Typography>
          <Typography variant="h4">{data}</Typography>
        </Box>
      </Box>
      <Divider />
      <Box pb={2} px={2}>
        <Typography component="p" variant="button" color="text" display="flex">
          <Typography component="span" variant="button" fontWeight="bold" color={'green'}>
            {'+' + trend + '%'}
          </Typography>
          &nbsp;{'than last month'}
        </Typography>
      </Box>
    </Card>
  )
}

export default StatisticCard
