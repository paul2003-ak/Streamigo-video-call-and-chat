import React from 'react'
import { LoaderIcon } from 'react-hot-toast'
import { useThemestore } from '../store/useTheme'


const Pageloading = () => {
  const {theme}=useThemestore()
  return (
    <div className='min-h-screen flex items-center justify-center' data-theme={theme}>
        <LoaderIcon className='animate-spin size-10  text-primary'/>
    </div>
  )
}

export default Pageloading