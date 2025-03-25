import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  Activity, 
  Users, 
  Server, 
  BookOpen, 
  MessageSquare,
  Cpu
} from 'lucide-react';

interface SystemStatus {
  api: 'healthy' | 'degraded' | 'down';
  database: 'healthy' | 'degraded' | 'down';
  openai: 'healthy' | 'degraded' | 'down';
}

interface MetricCard {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  status?: 'success' | 'warning' | 'error';
}

const AdminDashboard = () => {
  const [activeUsers, setActiveUsers] = React.useState<number>(0);
  const [systemStatus, setSystemStatus] = React.useState<SystemStatus>({
    api: 'healthy',
    database: 'healthy',
    openai: 'healthy'
  });
  const [recentSuggestions, setRecentSuggestions] = React.useState<any[]>([]);
  const [recentFeedback, setRecentFeedback] = React.useState<any[]>([]);
  const [serverMetrics, setServerMetrics] = React.useState({
    cpu: 0,
    memory: 0,
    requests: 0
  });

  // Fetch initial data
  React.useEffect(() => {
    fetchDashboardData();
    // Set up polling for real-time updates
    const interval = setInterval(fetchDashboardData, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const adminFetch = async (endpoint: string) => {
    const response = await fetch(`/api/admin/${endpoint}`, {
      headers: {
        'x-admin-token': 'vishalsadminrole'
      }
    });
    if (!response.ok) {
      throw new Error(`Admin API error: ${response.statusText}`);
    }
    return response.json();
  };

  const fetchDashboardData = async () => {
    try {
      // Fetch active users
      const usersData = await adminFetch('metrics/active-users');
      setActiveUsers(usersData.count);

      // Fetch system status
      const statusData = await adminFetch('system/status');
      setSystemStatus(statusData);

      // Fetch recent book suggestions
      const suggestionsData = await adminFetch('book-suggestions/recent');
      setRecentSuggestions(suggestionsData);

      // Fetch recent feedback
      const feedbackData = await adminFetch('feedback/recent');
      setRecentFeedback(feedbackData);

      // Fetch server metrics
      const metricsData = await adminFetch('metrics/server');
      setServerMetrics(metricsData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  };

  const mapHealthToStatus = (health: 'healthy' | 'degraded' | 'down'): 'success' | 'warning' | 'error' => {
    switch (health) {
      case 'healthy': return 'success';
      case 'degraded': return 'warning';
      case 'down': return 'error';
      default: return 'error';
    }
  };

  const getStatusColor = (status: 'success' | 'warning' | 'error') => {
    switch (status) {
      case 'success': return 'text-green-500';
      case 'warning': return 'text-yellow-500';
      case 'error': return 'text-red-500';
      default: return 'text-gray-500';
    }
  };

  const MetricCard: React.FC<MetricCard> = ({ title, value, icon, status }) => (
    <Card className="p-6 flex items-center space-x-4">
      <div className={`p-3 rounded-full ${status ? getStatusColor(status) : 'text-blue-500'} bg-blue-50`}>
        {icon}
      </div>
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </Card>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Admin Dashboard</h1>
        
        {/* Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <MetricCard
            title="Active Users"
            value={activeUsers}
            icon={<Users className="h-6 w-6" />}
          />
          <MetricCard
            title="API Status"
            value={systemStatus.api}
            icon={<Server className="h-6 w-6" />}
            status={mapHealthToStatus(systemStatus.api)}
          />
          <MetricCard
            title="OpenAI Status"
            value={systemStatus.openai}
            icon={<Activity className="h-6 w-6" />}
            status={mapHealthToStatus(systemStatus.openai)}
          />
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Book Suggestions */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <BookOpen className="h-5 w-5 mr-2" />
              Recent Book Suggestions
            </h2>
            <div className="space-y-4">
              {recentSuggestions.map((suggestion, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{suggestion.title}</p>
                    <p className="text-sm text-gray-500">{suggestion.votes} votes</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(suggestion.submittedAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Recent Feedback */}
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <MessageSquare className="h-5 w-5 mr-2" />
              Recent Feedback
            </h2>
            <div className="space-y-4">
              {recentFeedback.map((feedback, index) => (
                <div key={index} className="flex items-center justify-between border-b pb-2">
                  <div>
                    <p className="font-medium">{feedback.message}</p>
                    <p className="text-sm text-gray-500">{feedback.type}</p>
                  </div>
                  <span className="text-xs text-gray-400">
                    {new Date(feedback.createdAt).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>

        {/* Server Metrics */}
        <div className="mt-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Cpu className="h-5 w-5 mr-2" />
              Server Metrics
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">CPU Usage</p>
                <p className="text-2xl font-bold">{serverMetrics.cpu}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Memory Usage</p>
                <p className="text-2xl font-bold">{serverMetrics.memory}%</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600">Requests/min</p>
                <p className="text-2xl font-bold">{serverMetrics.requests}</p>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard; 