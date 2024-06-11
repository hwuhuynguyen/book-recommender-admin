import instance from './../config'

const getCardStatistics = () => {
  return instance.get('/dashboard/summary-statistics')
}

const getUserStatistics = () => {
  return instance.get('/dashboard/gender-users')
}

const getCrawlStatistics = () => {
  return instance.get('/dashboard/monthly-crawl-statistics')
}

export const DashboardApi = {
  getCardStatistics,
  getUserStatistics,
  getCrawlStatistics
}
