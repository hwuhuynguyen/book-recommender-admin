import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import Header from '../components/Header/Header'
import { useState } from 'react'
import withTokenCheck from '../hoc/withTokenCheck'
import styles from './Template.module.css'

function BaseTemplate() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed)
  }

  return (
    <Box className={styles['main-container']}>
      <Box>
        <Sidebar onToggleCollapse={handleSidebarToggle} />
      </Box>
      <Box className={styles['main-content']} sx={{ paddingLeft: `${sidebarCollapsed ? '8rem' : '18.5rem'}` }}>
        <Header />
        <Outlet />
      </Box>
    </Box>
  )
}

export default withTokenCheck(BaseTemplate)
