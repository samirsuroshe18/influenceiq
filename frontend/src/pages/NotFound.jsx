import React from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const NotFound = () => {
  return (
    <>
        <Navbar />
        <div className='container mx-auto px-4'>
            <div className='flex justify-center items-center h-[80vh]'>
                <h1 className='text-4xl font-bold text-white'>404 | Page Not Found</h1>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default NotFound