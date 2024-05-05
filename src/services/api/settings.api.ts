import { ISettings } from '../../types'
import instance from '../config'

const getCrawlSetting = () => {
  return instance.get<ISettings>('/setting-crawl')
}

const updateCrawlSetting = (settings: ISettings) => {
  return instance.put('/setting-crawl', settings)
}

export const SettingsApi = {
  getCrawlSetting,
  updateCrawlSetting
}
