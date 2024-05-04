import { useState } from 'react'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemText from '@mui/material/ListItemText'
import ListItemIcon from '@mui/material/ListItemIcon'
import ReorderIcon from '@mui/icons-material/Reorder'
import SortIcon from '@mui/icons-material/Sort'
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks'
import GroupIcon from '@mui/icons-material/Group'
import { Link } from 'react-router-dom'
import { useLocation } from 'react-router-dom'
import { IconButton } from '@mui/material'
import styles from './Sidebar.module.css'
import { Dashboard, Settings } from '@mui/icons-material'

type SidebarProps = {
  onToggleCollapse: () => void
}

function Sidebar({ onToggleCollapse }: SidebarProps) {
  const location = useLocation()
  const [collapsed, setCollapsed] = useState(false)

  const handleToggleCollapse = () => {
    setCollapsed(!collapsed)
    onToggleCollapse()
  }

  return (
    <Box className={`${styles.sidebar} ${collapsed && styles['sidebar-collapsed']}`}>
      <Box className={`${styles['sidebar-header']} ${collapsed && styles['sidebar-collapsed']}`}>
        <Box>
          {!collapsed && (
            <>
              <Box className={styles['logo-container']}>
                <Box>
                  <IconButton sx={{ fontSize: 30, color: 'white' }} onClick={handleToggleCollapse}>
                    <ReorderIcon sx={{ fontSize: 30 }} />
                  </IconButton>
                </Box>
                <Typography className={styles['custom-typography']}>PBL7: BRS</Typography>
              </Box>
            </>
          )}
          {collapsed && (
            <Box>
              <IconButton onClick={handleToggleCollapse}>
                <SortIcon sx={{ fontSize: 30, color: 'white' }} />
              </IconButton>
            </Box>
          )}
        </Box>
      </Box>
      <hr className={styles['hr-line']} />
      <Box>
        <List
          sx={{
            color: '#fff'
          }}
        >
          <Link to={{ pathname: '/dashboard' }}>
            <ListItem
              className={styles['list-item']}
              button
              selected={location.pathname === '/dashboard'}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'black'
                  },
                  '&:hover': {
                    opacity: 0.9,
                    backgroundColor: 'white'
                  }
                },
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <Dashboard />
              </ListItemIcon>
              {!collapsed && <ListItemText className={styles['text-menu']} primary="Dashboard" />}
            </ListItem>
          </Link>

          <Link to={{ pathname: '/user', search: '?page=1' }}>
            <ListItem
              className={styles['list-item']}
              button
              selected={location.pathname === '/user'}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'black'
                  },
                  '&:hover': {
                    opacity: 0.9,
                    backgroundColor: 'white'
                  }
                },
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <GroupIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText className={styles['text-menu']} primary="User" />}
            </ListItem>
          </Link>

          <Link to={{ pathname: '/book', search: '?page=1' }}>
            <ListItem
              className={styles['list-item']}
              button
              selected={location.pathname === '/book'}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'black'
                  },
                  '&:hover': {
                    opacity: 0.9,
                    backgroundColor: 'white'
                  }
                },
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <LibraryBooksIcon />
              </ListItemIcon>
              {!collapsed && <ListItemText className={styles['text-menu']} primary="Book" />}
            </ListItem>
          </Link>

          <Link to={{ pathname: '/setting' }}>
            <ListItem
              className={styles['list-item']}
              button
              selected={location.pathname === '/setting'}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'white',
                  borderRadius: '10px',
                  '& .MuiListItemIcon-root, & .MuiListItemText-primary': {
                    color: 'black'
                  },
                  '&:hover': {
                    opacity: 0.9,
                    backgroundColor: 'white'
                  }
                },
                '&:hover': {
                  opacity: 0.7
                }
              }}
            >
              <ListItemIcon sx={{ color: 'white' }}>
                <Settings />
              </ListItemIcon>
              {!collapsed && <ListItemText className={styles['text-menu']} primary="Setting" />}
            </ListItem>
          </Link>
        </List>
      </Box>
    </Box>
  )
}

export default Sidebar
