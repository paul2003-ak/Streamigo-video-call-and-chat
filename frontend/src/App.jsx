import React from 'react'
import { Navigate, Route, Routes } from 'react-router'
import { Toaster } from 'react-hot-toast'

import Home from './pages/Home'
import Signup from './pages/Signup'
import Login from './pages/Login'
import Onboarding from './pages/Onboarding'
import Notification from './pages/Notification'
import Callpage from './pages/Callpage'
import Chatpage from './pages/Chatpage'

import Pageloading from './component/Pageloading'
import Useauthuser from './hooks/Useauthuser'
import Layout from './component/Layout'
import { useThemestore } from './store/useTheme'


const App  = () => {
  const {theme}=useThemestore()

  //tanstack query
  const { isLoading, authuser } = Useauthuser()

  const isAuthenticate = Boolean(authuser)
  const isonboarded = authuser?.isonboarded

  if (isLoading) return <Pageloading />

  return (
    <div className='h-screen' data-theme={theme}>

      <Routes>
        <Route path='/' element={isAuthenticate && isonboarded ? (
          <Layout showSidebar={true}>
            <Home />
          </Layout>
        ) : (
          <Navigate to={!isAuthenticate ? '/Login' : "/onboarding"} />
        )} />


        <Route path='/signup' element={!isAuthenticate ? <Signup /> : <Navigate to={isonboarded ? '/' : '/onboarding'} />} />
        <Route path='/Login' element={!isAuthenticate ? <Login /> : <Navigate to={isonboarded ? '/' : '/onboarding'} />} />

        <Route path='/onboarding' element={isAuthenticate ? (
          !isonboarded ? (<Onboarding />) : (<Navigate to='/' />)
        ) : (
          <Navigate to='/Login' />
        )} />

        <Route path='/notification' element={isAuthenticate && isonboarded ? (
          <Layout showSidebar={true}>
             <Notification /> 
          </Layout>
        ) : (<Navigate to={!isAuthenticate ? '/login' : '/onboarding'} /> )} />


        <Route path='/callpage/:id' element={isAuthenticate && isonboarded ? (
         
             <Callpage /> 
         
        ) : (<Navigate to={!isAuthenticate ? '/login' : '/onboarding'} /> )} />

        <Route path='/chatpage/:id' element={isAuthenticate && isonboarded ? (
          <Layout showSidebar={false}>
             <Chatpage /> 
          </Layout>
        ) : (<Navigate to={!isAuthenticate ? '/login' : '/onboarding'} /> )} />


      </Routes>

      <Toaster />
    </div>
  )
}

export default App