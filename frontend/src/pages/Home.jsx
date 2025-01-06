import React from 'react'
import Sidebar from '../components/Sidebar'
import HeroSection from '../components/HeroSection'
import FeaturesSection from '../components/FeaturesSection'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const Home = () => {
  return (
    <>
        <div className=''>
          <Navbar />
          <div className="flex ml-28">
  <span className="inline-flex items-center px-3 py-1 bg-blue-500 text-white text-sm font-medium rounded-full shadow-md">
    
    Powered by AI
  </span>
</div>

          <HeroSection  />
          
        </div>
        <FeaturesSection />
        <Footer />
    </>
  )
}

export default Home