import React from 'react'
import Home from './pages/Home'
import Preloader from './components/Preloader'
import Footer from './components/Footer'

const App = () => {
  return (
    <>
    <Preloader/>
    <Home/> 
    <Footer/>
    </>
  )
}

export default App