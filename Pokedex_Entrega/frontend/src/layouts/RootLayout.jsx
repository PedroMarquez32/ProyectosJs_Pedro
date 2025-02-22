import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { Outlet } from 'react-router-dom'

const RootLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-800">
      <Navbar className="sticky top-0 w-full z-50" />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer className="sticky bottom-0 w-full z-50" />
    </div>
  )
}

export default RootLayout