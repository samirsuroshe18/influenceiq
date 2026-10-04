import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

const NotFound = () => {
  return (
    <>
        <Navbar />
        <div className='container mx-auto px-4'>
            <div className='flex flex-col justify-center items-center gap-6 h-[80vh] text-center'>
                <h1 className='text-4xl font-bold text-white'>404 | Page Not Found</h1>
                <Link to="/" className="bg-purple-600 hover:bg-purple-700 transition-colors px-6 py-3 rounded-full text-white font-medium">
                  Back to the start
                </Link>
            </div>
        </div>
        <Footer/>
    </>
  )
}

export default NotFound
