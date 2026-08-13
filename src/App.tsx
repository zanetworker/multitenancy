import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import { Layout } from './components/Layout'
import { Dashboard } from './pages/Dashboard'
import { CreateTenant } from './pages/CreateTenant'
import { TenantPortal } from './pages/TenantPortal'
import { TenantAdmin } from './pages/TenantAdmin'

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateTenant />} />
            <Route path="/tenant/:id/portal" element={<TenantPortal />} />
            <Route path="/tenant/:id/admin" element={<TenantAdmin />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AppProvider>
  )
}
