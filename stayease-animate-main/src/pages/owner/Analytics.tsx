import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, Download, Activity, PieChart } from "lucide-react";
import { useEffect, useState } from "react";
import { BookingsAPI, Booking } from "@/lib/api";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ComposedChart
} from 'recharts';

interface AnalyticsData {
  totalProperties: number;
  activeBookings: number;
  totalGuests: number;
  totalRevenue: string;
  occupancyRate: string;
  recentBookings: Booking[];
}

interface ChartDataPoint {
  month: string;
  revenue: number;
  bookings: number;
  guests: number;
  occupancy: number;
  target: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
    payload?: {
      name: string;
      percentage?: number;
      [key: string]: string | number | undefined;
    };
  }>;
  label?: string;
}

const Analytics = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalProperties: 0,
    activeBookings: 0,
    totalGuests: 0,
    totalRevenue: "0.00",
    occupancyRate: "0",
    recentBookings: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await BookingsAPI.getOwnerDashboardStats();

        if (response.success && response.data) {
          setAnalyticsData(response.data);

          // Generate sample chart data based on real analytics
          const generatedChartData = generateChartData(response.data);
          setChartData(generatedChartData);
        } else {
          setError("Failed to fetch analytics data");
        }
      } catch (err) {
        console.error("Error fetching analytics:", err);
        setError("Failed to load analytics data");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  // Generate sample chart data based on analytics
  const generateChartData = (data: AnalyticsData) => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const totalRevenue = parseFloat(data.totalRevenue);

    return months.map((month, index) => {
      const baseRevenue = (totalRevenue / 12) * (0.8 + Math.random() * 0.4); // Random variation
      const bookings = Math.floor(data.activeBookings * (0.7 + Math.random() * 0.6));
      const guests = Math.floor(data.totalGuests * (0.6 + Math.random() * 0.8) / 12);

      return {
        month,
        revenue: Math.round(baseRevenue),
        bookings,
        guests,
        occupancy: Math.round(parseFloat(data.occupancyRate) * (0.9 + Math.random() * 0.2)),
        target: Math.round(baseRevenue * 1.1)
      };
    });
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  // Colors for charts
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#00ff00'];

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.dataKey === 'revenue' || entry.dataKey === 'target' ? formatCurrency(entry.value) : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Custom tooltip for pie chart
  const PieTooltip = ({ active, payload }: TooltipProps) => {
    if (active && payload && payload.length) {
      const data = payload[0];
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{data.payload?.name || 'Unknown'}</p>
          <p className="text-sm text-gray-600">
            {`Revenue: ${formatCurrency(data.value)}`}
          </p>
          <p className="text-sm text-gray-600">
            {`Percentage: ${data.payload?.percentage || 0}%`}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <DashboardLayout userRole="hotel-owner">
      {/* Floating Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-40 right-20 w-96 h-96 bg-gradient-to-r from-violet-400/15 to-purple-400/15 rounded-full blur-3xl animate-float-delayed"></div>
        <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-gradient-to-r from-pink-400/10 to-purple-400/10 rounded-full blur-3xl animate-float"></div>
      </div>

      <div className="relative p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-3 mb-2">
              <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
                <BarChart3 className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
                Analytics
              </h1>
            </div>
            <p className="text-slate-600">Track your hotel performance and insights</p>
          </div>
          <Button className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-0 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
        </div>

        {/* Error Message */}
        {error && (
          <Card className="p-4 bg-red-50 border-red-200">
            <p className="text-red-600">{error}</p>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />

            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <DollarSign className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {loading ? "..." : formatCurrency(analyticsData.totalRevenue)}
                  </p>
                  <p className="text-sm text-slate-600">Total Revenue</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />

            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <Users className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {loading ? "..." : analyticsData.totalGuests.toLocaleString()}
                  </p>
                  <p className="text-sm text-slate-600">Total Guests</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />

            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {loading ? "..." : `${analyticsData.occupancyRate}%`}
                  </p>
                  <p className="text-sm text-slate-600">Occupancy Rate</p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            {/* Floating gradient orbs */}
            <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />

            <div className="p-6 relative z-10">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                    <BarChart3 className="w-6 h-6 text-white" />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-slate-900">
                    {loading ? "..." : analyticsData.activeBookings}
                  </p>
                  <p className="text-sm text-slate-600">Active Bookings</p>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Revenue Details Card */}
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Revenue Overview</h3>
              <p className="text-slate-600">Detailed breakdown of your hotel revenue</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">{loading ? "..." : formatCurrency(analyticsData.totalRevenue)}</p>
              <p className="text-sm text-slate-500">Total Revenue</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Revenue per Guest</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {loading || analyticsData.totalGuests === 0 ? "..." :
                      formatCurrency((parseFloat(analyticsData.totalRevenue) / analyticsData.totalGuests).toFixed(2))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Avg. Revenue per Property</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {loading || analyticsData.totalProperties === 0 ? "..." :
                      formatCurrency((parseFloat(analyticsData.totalRevenue) / analyticsData.totalProperties).toFixed(2))}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-sm text-slate-600">Properties Count</p>
                  <p className="text-lg font-semibold text-slate-900">
                    {loading ? "..." : analyticsData.totalProperties}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>

        {/* Modern Interactive Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Revenue Trend Chart */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-lg">
                <Activity className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Revenue Trend</h3>
                <p className="text-sm text-slate-600">Monthly revenue performance</p>
              </div>
            </div>

            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                      tickFormatter={(value) => `$${value}`}
                    />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Area
                      type="monotone"
                      dataKey="revenue"
                      stackId="1"
                      stroke="#10b981"
                      fill="url(#revenueGradient)"
                      strokeWidth={3}
                      name="Revenue"
                    />
                    <Line
                      type="monotone"
                      dataKey="target"
                      stroke="#ef4444"
                      strokeWidth={2}
                      strokeDasharray="5 5"
                      name="Target"
                      dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
                    />
                    <defs>
                      <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>

          {/* Bookings and Occupancy Chart */}
          <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
            <div className="flex items-center space-x-3 mb-6">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg">
                <BarChart3 className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Bookings & Occupancy</h3>
                <p className="text-sm text-slate-600">Monthly booking trends and occupancy rates</p>
              </div>
            </div>

            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <ComposedChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="month"
                      stroke="#666"
                      fontSize={12}
                      tickLine={false}
                    />
                    <YAxis yAxisId="left" orientation="left" stroke="#666" fontSize={12} tickLine={false} />
                    <YAxis yAxisId="right" orientation="right" stroke="#666" fontSize={12} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Legend />
                    <Bar
                      yAxisId="left"
                      dataKey="bookings"
                      fill="url(#bookingsGradient)"
                      name="Bookings"
                      radius={[4, 4, 0, 0]}
                    />
                    <Line
                      yAxisId="right"
                      type="monotone"
                      dataKey="occupancy"
                      stroke="#8b5cf6"
                      strokeWidth={3}
                      name="Occupancy %"
                      dot={{ fill: '#8b5cf6', strokeWidth: 2, r: 5 }}
                    />
                    <defs>
                      <linearGradient id="bookingsGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      </linearGradient>
                    </defs>
                  </ComposedChart>
                </ResponsiveContainer>
              )}
            </div>
          </Card>
        </div>

        {/* Revenue Distribution Pie Chart */}
        <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <PieChart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Revenue Distribution</h3>
              <p className="text-sm text-slate-600">Breakdown by key metrics</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="h-80">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500"></div>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={[
                        { name: 'Revenue', value: parseFloat(analyticsData.totalRevenue), color: '#10b981' },
                        { name: 'Target Gap', value: Math.max(0, parseFloat(analyticsData.totalRevenue) * 0.2), color: '#ef4444' },
                        { name: 'Growth Potential', value: parseFloat(analyticsData.totalRevenue) * 0.3, color: '#8b5cf6' }
                      ]}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={120}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {[0, 1, 2].map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={['#10b981', '#ef4444', '#8b5cf6'][index]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Current Revenue</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {loading ? "..." : formatCurrency(analyticsData.totalRevenue)}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-red-50 to-pink-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Target Gap</span>
                </div>
                <span className="text-lg font-bold text-red-600">
                  {loading ? "..." : formatCurrency(Math.max(0, parseFloat(analyticsData.totalRevenue) * 0.2))}
                </span>
              </div>

              <div className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-4 h-4 bg-purple-500 rounded-full"></div>
                  <span className="text-slate-700 font-medium">Growth Potential</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {loading ? "..." : formatCurrency(parseFloat(analyticsData.totalRevenue) * 0.3)}
                </span>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
};export default Analytics;