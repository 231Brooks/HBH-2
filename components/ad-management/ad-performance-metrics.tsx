interface AdPerformanceMetricsProps {
  analytics: any
}

export function AdPerformanceMetrics({ analytics }: AdPerformanceMetricsProps) {
  if (!analytics) {
    return (
      <>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
          <p className="text-2xl font-bold">--</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">CTR</h3>
          <p className="text-2xl font-bold">--</p>
        </div>
      </>
    )
  }

  return (
    <>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Impressions</h3>
        <p className="text-2xl font-bold">{analytics.impressions.toLocaleString()}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">Clicks</h3>
        <p className="text-2xl font-bold">{analytics.clicks.toLocaleString()}</p>
      </div>
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-sm font-medium text-gray-500">CTR</h3>
        <p className="text-2xl font-bold">{analytics.ctr.toFixed(2)}%</p>
      </div>
    </>
  )
}
