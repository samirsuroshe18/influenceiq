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
          <HeroSection  />
        </div>
        <FeaturesSection />
        <Footer />
    </>
  )
}

export default Home