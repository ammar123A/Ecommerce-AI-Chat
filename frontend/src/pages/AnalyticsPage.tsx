const AnalyticsPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Analytics</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Conversations Over Time</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart will be rendered here
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Sentiment Distribution</h2>
          <div className="h-64 flex items-center justify-center text-gray-500">
            Chart will be rendered here
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">AI Performance</h2>
          <div className="space-y-4">
            <MetricRow label="Auto-Resolution Rate" value="76%" />
            <MetricRow label="Average Confidence" value="92%" />
            <MetricRow label="Manual Interventions" value="24%" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Top Categories</h2>
          <div className="space-y-3">
            <CategoryBar label="Shipping" value={45} />
            <CategoryBar label="Returns" value={30} />
            <CategoryBar label="Product Info" value={25} />
          </div>
        </div>
      </div>
    </div>
  )
}

const MetricRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-gray-600">{label}</span>
    <span className="text-xl font-semibold text-gray-800">{value}</span>
  </div>
)

const CategoryBar = ({ label, value }: { label: string; value: number }) => (
  <div>
    <div className="flex justify-between text-sm mb-1">
      <span className="text-gray-700">{label}</span>
      <span className="text-gray-600">{value}%</span>
    </div>
    <div className="w-full bg-gray-200 rounded-full h-2">
      <div 
        className="bg-primary-500 h-2 rounded-full" 
        style={{ width: `${value}%` }}
      />
    </div>
  </div>
)

export default AnalyticsPage
