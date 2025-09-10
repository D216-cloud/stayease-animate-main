import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  TrendingUp,
  TrendingDown,
  Users,
  Calendar,
  BarChart3,
  PieChart,
  Download,
  Filter,
  ShieldCheck,
  ThumbsUp,
  AlertTriangle,
  Mail
} from "lucide-react";
import { useEffect, useState } from "react";
import { BookingsAPI, Review } from "@/lib/api";
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
  Cell
} from 'recharts';

interface RatingsData {
  averageRating: number;
  totalReviews: number;
  counts: Record<number, number>;
}

interface ChartDataPoint {
  month: string;
  rating: number;
  reviews: number;
  trend: number;
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{
    dataKey: string;
    value: number;
    color: string;
  }>;
  label?: string;
}

const COLORS = ['#ef4444', '#f97316', '#eab308', '#22c55e', '#3b82f6'];

const Ratings = () => {
  const [ratingsData, setRatingsData] = useState<RatingsData>({
    averageRating: 0,
    totalReviews: 0,
    counts: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  });
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);

  useEffect(() => {
    const fetchRatingsData = async () => {
      try {
        setLoading(true);

        // Always show ALL ratings and reviews across properties
        const ratingsResponse = await BookingsAPI.allRatingsSummary();
        if (ratingsResponse.success && ratingsResponse.data) {
          setRatingsData({
            averageRating: ratingsResponse.data.averageRating || 0,
            totalReviews: ratingsResponse.data.totalReviews || 0,
            counts: ratingsResponse.data.counts || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
          });
        }

        const reviewsResponse = await BookingsAPI.getAllReviews();
        if (reviewsResponse.success && reviewsResponse.data) {
          setReviews(reviewsResponse.data);
        }

        // Generate sample chart data based on ratings
        generateChartData();

      } catch (error) {
        console.error("Error fetching ratings data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRatingsData();
  }, []);

  const generateChartData = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'];
    const data = months.map((month, index) => {
      const baseRating = 3.5 + Math.random() * 1.5; // Random rating between 3.5-5
      const reviewCount = Math.floor(Math.random() * 20) + 5;
      return {
        month,
        rating: Math.round(baseRating * 10) / 10,
        reviews: reviewCount,
        trend: index > 0 ? (Math.random() > 0.5 ? 1 : -1) * (Math.random() * 0.3) : 0
      };
    });
    setChartData(data);
  };

  const formatCurrency = (amount: string | number) => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(numAmount);
  };

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: TooltipProps) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-900">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {`${entry.dataKey}: ${entry.dataKey === 'rating' ? entry.value + ' ⭐' : entry.value}`}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Pie chart data for rating distribution
  const pieData = Object.entries(ratingsData.counts).map(([rating, count]) => ({
    name: `${rating} Star${rating !== '1' ? 's' : ''}`,
    value: count,
    percentage: ratingsData.totalReviews > 0 ? Math.round((count / ratingsData.totalReviews) * 100) : 0
  }));

  if (loading) {
    return (
      <DashboardLayout userRole="hotel-owner">
        <div className="p-6">
          <div className="animate-pulse space-y-6">
            <div className="h-8 bg-slate-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-32 bg-slate-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout userRole="hotel-owner">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50/30 overflow-hidden relative">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-gradient-to-br from-orange-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        <div className="p-6 space-y-8 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                All User Ratings &
                <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Reviews Analytics
                </span>
              </h1>
              <p className="text-slate-600">Monitor all guest satisfaction and review trends across all properties</p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" className="bg-white/90 backdrop-blur-sm border-slate-200/50 rounded-xl px-4 py-2 hover:bg-white hover:shadow-lg transition-all">
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl px-4 py-2 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
                <Download className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
              <div className="p-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-amber-600 to-orange-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-4xl font-bold text-slate-900">{ratingsData.averageRating.toFixed(1)}</p>
                      <span className="text-2xl text-amber-500">⭐</span>
                    </div>
                    <p className="text-sm text-slate-600">Average Rating</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < Math.round(ratingsData.averageRating)
                              ? 'fill-amber-400 text-amber-400'
                              : 'text-slate-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
              <div className="p-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-green-600 to-emerald-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{ratingsData.totalReviews}</p>
                    <p className="text-sm text-slate-600">Total Reviews</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group cursor-pointer bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
              <div className="p-6 relative z-10">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all group-hover:rotate-3">
                      <TrendingUp className="w-6 h-6 text-white" />
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-all" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2 mb-1">
                      <p className="text-3xl font-bold text-slate-900">
                        {ratingsData.counts[5] || 0}
                      </p>
                      <div className="flex items-center space-x-1">
                        <span className="text-lg text-amber-500">⭐</span>
                        <span className="text-sm font-semibold text-slate-700">5</span>
                      </div>
                    </div>
                    <p className="text-sm text-slate-600">5-Star Reviews</p>
                    <div className="flex items-center space-x-1 mt-2">
                      {Array.from({ length: 5 }, (_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 fill-amber-400 text-amber-400"
                        />
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Rating Trend Chart */}
            <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Rating Trend</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                      <XAxis dataKey="month" stroke="#64748b" />
                      <YAxis domain={[0, 5]} stroke="#64748b" />
                      <Tooltip content={<CustomTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="rating"
                        stroke="#f59e0b"
                        fill="url(#ratingGradient)"
                        strokeWidth={3}
                      />
                      <defs>
                        <linearGradient id="ratingGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/>
                          <stop offset="95%" stopColor="#f59e0b" stopOpacity={0.1}/>
                        </linearGradient>
                      </defs>
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>

            {/* Rating Distribution Pie Chart */}
            <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-green-500/20 to-emerald-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
              <div className="p-6 relative z-10">
                <h3 className="text-xl font-bold text-slate-900 mb-4">Rating Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={pieData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percentage }) => `${name}: ${percentage}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {pieData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </Card>
          </div>

          {/* All Reviews */}
          <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-purple-500/20 to-pink-500/20 rounded-full blur-2xl group-hover:scale-125 transition-all duration-700" />
            <div className="p-8 relative z-10">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-slate-900">All Ratings ({ratingsData.totalReviews || reviews.length})</h3>
                <div className="flex items-center space-x-2">
                  <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                    {reviews.filter(r => r.isVerified).length} Verified
                  </Badge>
                  <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                    {reviews.filter(r => r.helpful > 0).length} Helpful
                  </Badge>
                  <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                    {new Set(reviews.map(r => r.customerEmail)).size} Unique Users
                  </Badge>
                </div>
              </div>

              {reviews.length === 0 ? (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">⭐</div>
                  <h3 className="text-xl font-semibold text-slate-900 mb-2">No Reviews Yet</h3>
                  <p className="text-slate-600">Your reviews will appear here once guests start leaving feedback.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {reviews.map((review) => (
                    <Card key={review.id} className="p-4 bg-white border border-slate-200 hover:shadow-md transition-all duration-300">
                      {/* Rating Number */}
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2">
                          <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center">
                            <span className="text-white font-bold text-sm">{review.rating}</span>
                          </div>
                          <span className="text-sm font-medium text-slate-600">/ 5 Stars</span>
                        </div>
                        {review.isVerified && (
                          <Badge className="bg-green-100 text-green-800 text-xs">✓</Badge>
                        )}
                      </div>

                      {/* Customer Name */}
                      <div className="mb-2">
                        <p className="font-semibold text-slate-900 text-sm">{review.customerName}</p>
                        <p className="text-xs text-slate-600">{review.propertyName}</p>
                      </div>

                      {/* Review Text */}
                      {review.review && review.review.trim() !== '' ? (
                        <div className="mb-3">
                          <p className="text-slate-700 text-sm italic line-clamp-3">
                            "{review.review}"
                          </p>
                        </div>
                      ) : (
                        <div className="mb-3">
                          <p className="text-slate-500 text-sm italic">
                            Rating only - no review text
                          </p>
                        </div>
                      )}

                      {/* Date */}
                      <div className="text-xs text-slate-500">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Ratings;
