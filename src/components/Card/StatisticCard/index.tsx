import { Box, Card, Divider, Typography } from '@mui/material'
import React from 'react'

interface StatisticCardProps {
  title: string
  data: number
  trend: number
}

const StatisticCard = ({ title, data, trend }: StatisticCardProps) => {
  return (
    <Card sx={{ borderRadius: '1rem' }}>
      <Box display="flex" justifyContent="flex-end" pt={1} px={2}>
        <Box textAlign="right" lineHeight={1.25}>
          <Typography variant="button" fontWeight="light" color="text">
            {title}
          </Typography>
          <Typography variant="h4">{title.startsWith('CTR') ? (data * 100).toFixed(2) + '%' : data}</Typography>
        </Box>
      </Box>
      <Divider />
    </Card>
  )
}

export default StatisticCard
