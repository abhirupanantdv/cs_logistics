import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts'

export default function OperationsTrendChart({
  data = [],
}) {
  return (
    <div
      className="
        h-full
        rounded-2xl
        border
        border-slate-200
        bg-white
        p-4
        shadow-sm
      "
    >
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-slate-900">
          Operations Trend
        </h3>

        <p className="mt-1 text-xs text-slate-500">
          Monthly operations activity
        </p>
      </div>

      <div className="h-[240px]">
        <ResponsiveContainer
          width="100%"
          height="100%"
        >
          <AreaChart data={data}>
            <defs>
              <linearGradient
                id="operationsGradient"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop
                  offset="5%"
                  stopColor="#2563eb"
                  stopOpacity={0.3}
                />

                <stop
                  offset="95%"
                  stopColor="#2563eb"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
            />

            <XAxis
              dataKey="month"
              tick={{
                fontSize: 11,
              }}
            />

            <YAxis
              tick={{
                fontSize: 11,
              }}
            />

            <Tooltip />

            <Area
              type="monotone"
              dataKey="count"
              stroke="#2563eb"
              strokeWidth={3}
              fill="url(#operationsGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}