import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent, Switch, Typography } from '@mui/material'
import React, { useMemo, useState } from 'react'
import { crawlOptions, getMonthValue, timeOptions, weekValue } from '../../constants'

const SettingLayout = () => {
  const [type, setType] = useState('week')
  const [autoCrawl, setAutoCrawl] = useState(true)
  const [timeValue] = useState(() => timeOptions('00:00', '23:59', 60))

  const options = useMemo(() => {
    if (type === 'week') {
      return weekValue
    } else {
      return getMonthValue()
    }
  }, [type])

  return (
    <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', marginTop: '1rem' }}>
      <Box display={'flex'} alignItems={'center'}>
        <Switch
          checked={autoCrawl}
          onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
            setAutoCrawl(event.target.checked)
          }}
        />
        <Typography variant="body1">Auto crawl</Typography>
      </Box>
      <Typography mt={3} variant="body1">
        Data crawling schedule
      </Typography>
      <Box display={'flex'} gap={'1rem'}>
        <FormControl sx={{ width: '50%' }}>
          <Select
            defaultValue={'week'}
            disabled={!autoCrawl}
            onChange={(event: SelectChangeEvent<unknown>) => setType(event.target.value as string)}
          >
            {crawlOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: '50%' }}>
          <Typography variant="body1"></Typography>
          <Select disabled={!autoCrawl} value={type === 'week' ? 0 : 1}>
            {options.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Box my={5} display={'flex'} gap={'1rem'}>
        <FormControl sx={{ width: '50%' }}>
          <Typography variant="body1">Crawl data on: </Typography>
          <Select disabled={!autoCrawl} defaultValue={'00:00'}>
            {timeValue.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
      <Button
        variant="contained"
        style={{
          background: 'linear-gradient(195deg, rgb(102, 187, 106), rgb(67, 160, 71))',
          color: 'white'
        }}
      >
        Save
      </Button>
    </Box>
  )
}

export default SettingLayout
