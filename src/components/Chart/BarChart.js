import { Box, Card, Divider, Typography } from '@mui/material'
import React, { useMemo } from 'react'
import { Bar } from 'react-chartjs-2'
import configs from './configs'
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js'
import PropTypes from 'prop-types'
import { AccessTime } from '@mui/icons-material'

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend)

function BarChart({ color, background, title, description, date, chart }) {
  const { data, options } = configs(chart.labels || [], chart.datasets || {})

  return (
    <Card sx={{ height: '100%', borderRadius: '1rem' }}>
      <Box padding="1rem">
        {useMemo(
          () => (
            <Box
              // variant="gradient"
              // coloredShadow={color}
              py={2}
              pr={0.5}
              // mt={-5}
              height="12.5rem"
              sx={{
                background: background,
                borderRadius: '1rem'
              }}
            >
              <Bar data={data} options={options} />
            </Box>
          ),
          [data, options, background]
        )}
        <Box pt={3} pb={1} px={1}>
          <Typography variant="h6" fontWeight={'500'}>
            {title}
          </Typography>
          <Typography component="div" variant="button" color="text" fontWeight="light">
            {description}
          </Typography>
          <Divider />
          <Box display="flex" alignItems="center">
            <Typography variant="button" color="text" lineHeight={1} sx={{ mt: 0.15, mr: 0.5 }}>
              <AccessTime></AccessTime>
            </Typography>
            <Typography variant="button" color="text" fontWeight="light">
              {date}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Card>
  )
}

BarChart.defaultProps = {
  color: 'info',
  description: ''
}

BarChart.propTypes = {
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'success', 'warning', 'error', 'dark']),
  background: PropTypes.string,
  title: PropTypes.string.isRequired,
  description: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  date: PropTypes.string.isRequired,
  chart: PropTypes.objectOf(PropTypes.oneOfType([PropTypes.array, PropTypes.object])).isRequired
}

export default BarChart
