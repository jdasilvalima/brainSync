import { Outlet } from 'react-router-dom'
import Menu from '../components/Menu'

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Menu />
      <main className="flex-grow container mx-auto">
        <Outlet />
      </main>
    </div>
  )
}