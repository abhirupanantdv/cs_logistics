//ContainerStatusChart.jsx
import Chart from 'react-apexcharts'

export default function ContainerStatusChart({
  containers = [],
}) {
  const statusCounts = {}

  containers.forEach((container) => {
    const status =
      container.status || 'Unknown'

    statusCounts[status] =
      (statusCounts[status] || 0) + 1
  })

  const labels =
    Object.keys(statusCounts)

  const series =
    Object.values(statusCounts)

  const total = series.reduce(
    (sum, val) => sum + val,
    0
  )

  const options = {
    labels,

    legend: {
      position: 'bottom',
      fontSize: '11px',
      offsetY: 0, // FIXED: Pulls or stabilizes the legend position
      itemMargin: {
        horizontal: 8,
        vertical: 2,
      },
    },

    dataLabels: {
      enabled: false,
    },

    /* FIXED: Adjusted grid padding to pull up the bottom layout area */
    grid: {
      padding: {
        bottom: 0,
      },
    },

    plotOptions: {
      pie: {
        donut: {
          size: '65%',
          labels: {
            show: true,
            total: {
              show: true,
              label: 'Containers',
              fontSize: '10px',
              formatter: () => total,
            },
          },
        },
      },
    },

    colors: [
      '#22c55e', // Available
      '#3b82f6', // In Transit
      '#f97316', // In Yard
      '#eab308', // Rent
      '#14b8a6', // Delivered
      '#ec4899', // Picked Up
      '#94a3b8', // Other
    ],
  }

  return (
    /* FIXED: Added 'flex flex-col' to the main card container */
    <div className="h-full flex flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-2">
        <h3 className="text-sm font-semibold text-slate-900">
          Container Status Overview
        </h3>
      </div>

      {/* FIXED: Wrapped the chart in a flexible container to vertically center everything perfectly */}
      <div className="flex-1 flex flex-col justify-center min-h-0">
        <Chart
          options={options}
          series={series}
          type="donut"
          height="100%" 
        />
      </div>
    </div>
  )
}