//DashboardStats.jsx
import { useEffect, useState } from 'react'

import {
  Container,
  ClipboardList,
  Truck,
  DollarSign,
} from 'lucide-react'

import StatCard from './StatCard'
import ContainerStatusChart from './ContainerStatusChart'
import OperationsSummary from './OperationsSummary'
import RecentJobCards from './RecentJobCards'
import UpcomingDeliveries from './UpcomingDeliveriesPickups'
import OperationsTrendChart from './OperationsTrendChart'
import {
  getAllContainers,
} from '@/services/containerService'
import { getJobCards } from '@/services/jobCardService'
import {
  getAllOperationTypes,
  getOperationRecords,
} from '@/services/operationTypeService'
import {
  getSalesInvoices,
  getSalesInvoiceDetails,
} from '@/services/salesInvoiceService'

export default function DashboardStats() {
  const [stats, setStats] = useState({
    containers: 0,
    totalJobCards: 0,
    operations: 0,
    invoices: 0,
  })

  const [containers, setContainers] =
    useState([])

  const [operationSummary, setOperationSummary] =
    useState([])

  const [operationsTrend, setOperationsTrend] =
  useState([])

  useEffect(() => {
    loadDashboardStats()
  }, [])

  const loadDashboardStats = async () => {
    const operationTypes =
      await getAllOperationTypes()

    const operationCounts = []
    const allOperationRecords = []

    for (const op of operationTypes) {
      const records =
        await getOperationRecords(
          op.name,
          1000
        )

      operationCounts.push({
        name: op.name,
        count: records.length,
      })

      records.forEach((record) => {
        allOperationRecords.push(record)
      })
    }
    const monthlyTrend = {}

    allOperationRecords.forEach(
      (record) => {
        if (!record.creation) return

        const date = new Date(
          record.creation
        )

        const monthKey =
          date.toLocaleString('en-US', {
            month: 'short',
          })

        monthlyTrend[monthKey] =
          (monthlyTrend[monthKey] || 0) + 1
      }
    )

    const trendData = Object.entries(
      monthlyTrend
    ).map(([month, count]) => ({
      month,
      count,
    }))

    setOperationsTrend(trendData)

    const totalOperations =
      operationCounts.reduce(
        (total, operation) =>
          total + operation.count,
        0
      )

    setOperationSummary(
      operationCounts
    )
    try {
      const [
        containers,
        jobCards,
        salesInvoices,
      ] = await Promise.all([
        getAllContainers(),
        getJobCards(),
        getSalesInvoices(),
      ])

      const now = new Date()

      const currentMonthRevenue =
        salesInvoices.reduce(
          (total, invoice) => {
            if (!invoice.posting_date) {
              return total
            }

            const invoiceDate = new Date(
              invoice.posting_date
            )

            const isCurrentMonth =
              invoiceDate.getMonth() ===
              now.getMonth() &&
              invoiceDate.getFullYear() ===
              now.getFullYear()

            if (isCurrentMonth) {
              return (
                total +
                Number(
                  invoice.grand_total || 0
                )
              )
            }

            return total
          },
          0
        )

      console.log(
        'Current Month Revenue:',
        currentMonthRevenue
      )
      console.log(
        'Dashboard Sales Invoices:',
        salesInvoices
      )

      console.log(
        'Dashboard Containers:',
        containers
      )

      console.log(
        'Dashboard Job Cards:',
        jobCards
      )

      setContainers(containers)
      setStats({
        containers:
          containers.length,

        totalJobCards:
          jobCards.length,

        operations: totalOperations,
        invoices: currentMonthRevenue,
      })
    } catch (err) {
      console.error(err)
    }
  }

  return (
    /* FIXED: Using a unified flex column container with consistent gap-6 */
    <div className="flex flex-col gap-6">

      {/* KPI Cards */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Containers"
          value={stats.containers}
          icon={Container}
          iconBg="bg-blue-100"
          iconColor="text-blue-600"
        />

        <StatCard
          title="Total Job Cards"
          value={stats.totalJobCards}
          icon={ClipboardList}
          iconBg="bg-green-100"
          iconColor="text-green-600"
        />

        <StatCard
          title="Operations "
          value={stats.operations}
          icon={Truck}
          iconBg="bg-purple-100"
          iconColor="text-purple-600"
        />

        <StatCard
          title="Invoice Revenue (This Month)"
          value={`PGK ${stats.invoices.toLocaleString()}`}
          icon={DollarSign}
          iconBg="bg-orange-100"
          iconColor="text-orange-600"
        />
      </div>

      {/* Row 2 */}
      {/* FIXED: Removed internal child heights and added items-stretch to align card heights naturally */}
      <div className="grid grid-cols-1 gap-6 items-stretch xl:grid-cols-3">
        <div className="min-h-[320px] flex flex-col">
          <ContainerStatusChart containers={containers} />
        </div>

        <div className="min-h-[320px] flex flex-col">
          <OperationsSummary data={operationSummary} />
        </div>

        <div className="min-h-[320px] flex flex-col">
          <RecentJobCards />
        </div>
      </div>

      {/* Row 3 */}
      {/* FIXED: Standardized row spacing to match the rest of the layout */}
      <div className="grid grid-cols-1 gap-6 items-stretch xl:grid-cols-2">
        <div className="min-h-[340px] flex flex-col">
          <UpcomingDeliveries />
        </div>

        <div className="min-h-[340px] flex flex-col">
          <OperationsTrendChart data={operationsTrend} />
        </div>
      </div>

    </div>
  )
}