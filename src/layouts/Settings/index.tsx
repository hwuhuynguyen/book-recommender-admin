import { Box, Button, FormControl, MenuItem, Select, SelectChangeEvent, Switch, Typography } from '@mui/material'
import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { crawlOptions, getMonthValue, timeOptions, weekValue } from '../../constants'
import { SettingsApi } from '../../services'
import { toast } from 'react-toastify'

const SettingLayout = () => {
  const [autoCrawl, setAutoCrawl] = useState<boolean>(false)
  const [crawlType, setCrawlType] = useState<string>('')
  const [crawlDate, setCrawlDate] = useState<string>('')
  const [crawlTime, setCrawlTime] = useState<string>('')
  const [timeValue] = useState(() => timeOptions('00:00', '23:59', 60))
  const [loading, setLoading] = useState<boolean>(false)

  const getCrawlSetting = useCallback(async () => {
    try {
      const response = await SettingsApi.getCrawlSetting()
      if (response.data) {
        setAutoCrawl(true)
        setCrawlType(response.data.periodType)
        setCrawlDate(response.data.value)
        setCrawlTime(response.data.time)
      } else {
        setAutoCrawl(false)
      }
    } catch (err: any) {
      toast.error(err?.message)
    }
  }, [])

  const handleUpdateSettings = useCallback(() => {
    const updateCrawlSettings = async () => {
      setLoading(true)
      try {
        const newCrawlSettings = {
          isAutoCrawl: autoCrawl,
          periodType: crawlType,
          value: crawlDate,
          time: crawlTime
        }
        await SettingsApi.updateCrawlSetting(newCrawlSettings)
        toast.success('Settings have been updated successfully.')
      } catch (err: any) {
        toast.error(err?.message)
      } finally {
        setLoading(false)
      }
    }
    updateCrawlSettings()
  }, [autoCrawl, crawlDate, crawlTime, crawlType])

  useEffect(() => {
    getCrawlSetting()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const options = useMemo(() => {
    if (crawlType === 'WEEK') {
      return weekValue
    } else {
      return getMonthValue()
    }
  }, [crawlType])

  return (
    <Box sx={{ backgroundColor: 'white', padding: '1rem', borderRadius: '1rem', marginTop: '1rem' }}>
      <Box display={'flex'} alignItems={'center'}>
        <Switch
          disabled={true}
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
            // disabled={!autoCrawl}
            disabled={true}
            displayEmpty
            defaultValue=""
            onChange={(event: SelectChangeEvent<string>) => {
              if (event.target.value === 'WEEK') {
                setCrawlDate('MONDAY')
              } else {
                setCrawlDate('1')
              }
              setCrawlType(event.target.value)
            }}
            value={crawlType}
          >
            <MenuItem value="" disabled>
              Select your crawl type
            </MenuItem>
            {crawlOptions.map((option, index) => (
              <MenuItem key={index} value={option.value}>
                {option.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl sx={{ width: '50%' }}>
          <Typography variant="body1"></Typography>
          <Select
            defaultValue={''}
            // disabled={!autoCrawl}
            disabled={true}
            displayEmpty
            onChange={(event: SelectChangeEvent<string>) => setCrawlDate(event.target.value)}
            value={crawlDate}
          >
            <MenuItem value="" disabled>
              Select your crawl date
            </MenuItem>
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
          <Select
            defaultValue=""
            // disabled={!autoCrawl}
            disabled={true}
            displayEmpty
            onChange={(event: SelectChangeEvent<string>) => setCrawlTime(event.target.value)}
            value={crawlTime}
          >
            <MenuItem value="" disabled>
              Select your crawl time
            </MenuItem>
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
        onClick={handleUpdateSettings}
        disabled={loading}
      >
        Save
      </Button>
    </Box>
  )
}

export default SettingLayout
