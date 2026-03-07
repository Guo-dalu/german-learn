import { Outlet } from 'react-router-dom'
import AppHeader from './AppHeader'

export default function Layout() {
  return (
    <div className="bg-bg min-h-screen">
      <AppHeader />
      <main>
        <Outlet />
      </main>
    </div>
  )
}
