import React, { useEffect, useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'
import { ToastContainer } from 'react-toastify'
import { Suspense } from 'react'
import { Box, ThemeProvider } from '@mui/material'
import { GlobalStyle } from './styles/GlobalStyle'
import 'react-toastify/dist/ReactToastify.css'
import Theme from './theme'
import { store } from './redux/store'
import { setHeaderConfigAxios } from './services/config'

function App() {
  const [loading, setLoading] = useState(true)
  const accessToken = store.getState().auth.accessToken

  useEffect(() => {
    if (accessToken) {
      setHeaderConfigAxios(accessToken)
    }
    setLoading(false)
  }, [accessToken])

  if (loading) return <></>

  return (
    <Box>
      <Suspense fallback={<>Loading...</>}>
        <ThemeProvider theme={Theme}>
          <GlobalStyle>
            <ToastContainer style={{ fontSize: '15px' }} autoClose={2000} draggable />
            <RouterProvider router={router}></RouterProvider>
          </GlobalStyle>
        </ThemeProvider>
      </Suspense>
    </Box>
  )
}

export default App
