//Dashboard.jsx
import AppLayout from '@/components/layout/AppLayout'
import DashboardStats from '@/components/dashboard/DashboardStats'

export default function Dashboard() {
  return (
    <AppLayout
      title="Dashboard"
      description="Overview of your logistics operations."
    >
      <div className="space-y-6">
        <DashboardStats />
      </div>
    </AppLayout>
  )
}