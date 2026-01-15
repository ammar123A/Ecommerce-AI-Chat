const DashboardPage = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard title="Active Chats" value="12" change="+3 from yesterday" />
        <StatCard title="Avg Response Time" value="2.5m" change="-15% from last week" />
        <StatCard title="AI Accuracy" value="94%" change="+2% from last week" />
        <StatCard title="Customer Satisfaction" value="4.8/5" change="+0.2 from last month" />
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Conversations</h2>
        <p className="text-gray-600">Conversation list will appear here...</p>
      </div>
    </div>
  )
}

const StatCard = ({ title, value, change }: { title: string; value: string; change: string }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-sm font-medium text-gray-600 mb-2">{title}</h3>
    <p className="text-3xl font-bold text-gray-800 mb-1">{value}</p>
    <p className="text-sm text-green-600">{change}</p>
  </div>
)

export default DashboardPage
