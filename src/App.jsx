//App.jsx
import { Routes, Route } from 'react-router-dom'
import LoginPage from '@/pages/auth/LoginPage'
import ContainersPage from './pages/containers/ContainersPage'
import JobCardsPage from '@/pages/job-cards/JobCardsPage'
import JobCardDetailsPage from '@/pages/job-cards/JobCardDetailsPage'
import SelectedOperationPage from './pages/job-cards/SelectedOperationPage'

import CustomersPage from '@/pages/customers/CustomersPage'
import DashboardPage from './pages/dashboard/Dashboard'
import OperationTypesPage from './pages/operations/OperationTypesPage'
import DriversPage from './pages/drivers/DriversPage'
import FleetPage from './pages/fleet/FleetPage'
import ProtectedRoute from '@/components/layout/ProtectedRoute'
import RootRedirect from '@/components/layout/RootRedirect'

export default function App() {
  return (
    <Routes>
      <Route
  path="/"
  element={<RootRedirect />}
/>
      {/* Public Route */}
      <Route path="/login" element={<LoginPage />} />

      {/* Protected Dashboard Route */}
      <Route
        path="/containers"
        element={
          <ProtectedRoute>
            <ContainersPage />
          </ProtectedRoute>
        }
      />

     <Route
  path="/dashboard"
  element={
    <ProtectedRoute>
      <DashboardPage />
    </ProtectedRoute>
  }
/>
      {/* Protected Job Cards List Route */}
      <Route
        path="/job-cards"
        element={
          <ProtectedRoute>
            <JobCardsPage />
          </ProtectedRoute>
        }
      />

      {/* Protected Job Card Details Route */}
      <Route
        path="/job-cards/:id"
        element={
          <ProtectedRoute>
            <JobCardDetailsPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/job-cards/:id/operations"
        element={
          <ProtectedRoute>
            <SelectedOperationPage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/drivers"
        element={
          <ProtectedRoute>
            <DriversPage />
          </ProtectedRoute>
        }
      />

      <Route
  path="/operations"
  element={<ProtectedRoute><OperationTypesPage /></ProtectedRoute>}
/>

      {/* Protected Customers Route */}
      <Route
        path="/customers"
        element={
          <ProtectedRoute>
            <CustomersPage />
          </ProtectedRoute>
        }
      />

     <Route
  path="/fleet"
  element={
    <ProtectedRoute>
      <FleetPage />
    </ProtectedRoute>
  }
/>
    </Routes>
  )
}