import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Filter, TrendingUp, TrendingDown, Calendar, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { BookingsAPI, PropertiesAPI, type Review, type PropertyWithStats } from "@/lib/api";

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<{ average: number; total: number; counts?: Record<number, number> }>({ average: 0, total: 0 });
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [reviewCountFilter, setReviewCountFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");
  const [animatedReviews, setAnimatedReviews] = useState<Set<string>>(new Set());

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const [reviewsRes, summaryRes] = await Promise.all([
          BookingsAPI.getOwnerReviews(),
          BookingsAPI.ownerRatingsSummary()
        ]);

        if (reviewsRes && reviewsRes.success && reviewsRes.data) {
          setReviews(reviewsRes.data);
          setFilteredReviews(reviewsRes.data);
        }

        if (summaryRes && summaryRes.success && summaryRes.data) {
          const avg = summaryRes.data.averageRating || 0;
          const tot = summaryRes.data.totalReviews || 0;
          setSummary({ average: avg, total: tot, counts: summaryRes.data.counts });

          if (tot === 0) {
            try {
              const propsRes = await PropertiesAPI.listMineWithStats();
              if (propsRes && propsRes.success && propsRes.data) {
                const props: PropertyWithStats[] = propsRes.data;
                let totalReviewsFromProps = 0;
                let weighted = 0;
                props.forEach((p) => {
                  const tr = p.totalReviews || 0;
                  const ar = p.averageRating || 0;
                  totalReviewsFromProps += tr;
                  weighted += ar * tr;
                });
                if (totalReviewsFromProps > 0) {
                  const fallbackAvg = weighted / totalReviewsFromProps;
                  setSummary({ average: fallbackAvg, total: totalReviewsFromProps });
                }
              }
            } catch (err) {
              console.error('Properties fallback error:', err);
            }
          }
        } else {
          setSummary({ average: 0, total: 0 });
        }
      } catch (error) {
        console.error("Failed to fetch reviews:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, []);

  useEffect(() => {
    let filtered = [...reviews];

    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.review.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (ratingFilter !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    if (reviewCountFilter !== "all") {
      switch (reviewCountFilter) {
        case "first_time":
          filtered = filtered.filter(review => review.customerReviewCount === 1);
          break;
        case "few_reviews":
          filtered = filtered.filter(review => review.customerReviewCount >= 2 && review.customerReviewCount <= 5);
          break;
        case "many_reviews":
          filtered = filtered.filter(review => review.customerReviewCount > 5);
          break;
      }
    }

    switch (sortBy) {
      case "newest":
        filtered.sort((a, b) => new Date(b.reviewedAt).getTime() - new Date(a.reviewedAt).getTime());
        break;
      case "oldest":
        filtered.sort((a, b) => new Date(a.reviewedAt).getTime() - new Date(b.reviewedAt).getTime());
        break;
      case "highest":
        filtered.sort((a, b) => b.rating - a.rating);
        break;
      case "lowest":
        filtered.sort((a, b) => a.rating - b.rating);
        break;
      case "most_reviews":
        filtered.sort((a, b) => b.customerReviewCount - a.customerReviewCount);
        break;
      case "least_reviews":
        filtered.sort((a, b) => a.customerReviewCount - b.customerReviewCount);
        break;
    }

    setFilteredReviews(filtered);
    
    // Animate reviews when filtered
    const timer = setTimeout(() => {
      const newAnimatedReviews = new Set(filtered.map(review => review.id));
      setAnimatedReviews(newAnimatedReviews);
    }, 100);
    
    return () => clearTimeout(timer);
  }, [reviews, searchTerm, ratingFilter, reviewCountFilter, sortBy]);

  const getRatingStats = () => {
    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
    const localDistribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
      percentage: total > 0 ? (reviews.filter(r => r.rating === rating).length / total) * 100 : 0
    }));

    if (summary && summary.total > 0 && summary.counts) {
      const counts: Record<number, number> = summary.counts;
      const totalS = summary.total;
      const distribution = [5,4,3,2,1].map(r => ({ 
        rating: r, 
        count: counts[r] || 0, 
        percentage: totalS > 0 ? ((counts[r] || 0) / totalS) * 100 : 0 
      }));
      return { total: totalS, average: summary.average, distribution };
    }

    return { total, average, distribution: localDistribution };
  };

  const stats = getRatingStats();
  const displayedAverage = summary.total > 0 ? summary.average : stats.average;
  const displayedTotal = summary.total > 0 ? summary.total : stats.total;

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800 border-green-200";
    if (rating >= 3) return "bg-yellow-100 text-yellow-800 border-yellow-200";
    return "bg-red-100 text-red-800 border-red-200";
  };

  const getRatingIcon = (rating: number) => {
    if (rating >= 4) return <ThumbsUp className="w-3 h-3" />;
    if (rating >= 3) return <MessageSquare className="w-3 h-3" />;
    return <ThumbsDown className="w-3 h-3" />;
  };

  const AnimatedStarRating = ({ rating, reviewId }: { rating: number, reviewId: string }) => {
    const [animated, setAnimated] = useState(false);
    
    useEffect(() => {
      if (animatedReviews.has(reviewId)) {
        setAnimated(true);
      }
    }, [animatedReviews, reviewId]);

    return (
      <div className="flex items-center space-x-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <Star
            key={i}
            className={`w-3.5 h-3.5 transition-all duration-300 ${
              i < rating
                ? 'fill-amber-400 text-amber-400'
                : 'text-slate-300'
            } ${animated ? 'scale-110' : 'scale-100'}`}
            style={{ 
              transitionDelay: animated ? `${i * 80}ms` : '0ms'
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <DashboardLayout userRole="hotel-owner">
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 overflow-hidden relative">
        {/* Floating Background Elements */}
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-amber-400/20 to-orange-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute top-1/2 -left-40 w-80 h-80 bg-gradient-to-br from-yellow-400/20 to-red-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '2s'}} />
          <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full blur-3xl animate-pulse" style={{animationDelay: '4s'}} />
        </div>

        <div className="p-6 space-y-8 relative z-10">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-slate-900 mb-2">
                All
                <span className="block bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 bg-clip-text text-transparent">
                  Reviews
                </span>
              </h1>
              <p className="text-slate-600">Comprehensive view of all guest feedback</p>
            </div>
            <Button className="bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all">
              <Star className="w-5 h-5 mr-2" />
              Export Reviews
            </Button>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="group bg-gradient-to-r from-amber-50 to-orange-50 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-500/30 to-orange-500/30 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{displayedAverage.toFixed(1)}</p>
                    <p className="text-sm text-slate-600">Average Rating</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(displayedAverage)
                            ? 'fill-amber-400 text-amber-400'
                            : i < displayedAverage
                            ? 'fill-amber-400/50 text-amber-400'
                            : 'text-slate-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">{displayedTotal}</p>
                    <p className="text-sm text-slate-600">Total Reviews</p>
                  </div>
                  <MessageSquare className="w-8 h-8 text-blue-600" />
                </div>
              </div>
            </Card>

            <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">
                      {stats.distribution.filter(d => d.rating >= 4).reduce((sum, d) => sum + d.count, 0)}
                    </p>
                    <p className="text-sm text-slate-600">Positive Reviews</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-600" />
                </div>
              </div>
            </Card>

            <Card className="group bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
              <div className="p-6 relative z-10">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-3xl font-bold text-slate-900">
                      {stats.distribution.filter(d => d.rating < 3).reduce((sum, d) => sum + d.count, 0)}
                    </p>
                    <p className="text-sm text-slate-600">Needs Improvement</p>
                  </div>
                  <TrendingDown className="w-8 h-8 text-red-600" />
                </div>
              </div>
            </Card>
          </div>

          {/* Rating Distribution Chart */}
          <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-900 mb-6">Rating Distribution</h3>
            <div className="grid grid-cols-5 gap-6">
              {stats.distribution.map((item) => (
                <div key={item.rating} className="text-center">
                  <div className="flex items-center justify-center space-x-2 mb-3">
                    <span className="text-lg font-bold text-slate-900">{item.rating}</span>
                    <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-3 mb-2">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-orange-400 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${item.percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-sm text-slate-600">
                    {item.count} ({item.percentage.toFixed(1)}%)
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Filters */}
          <Card className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 items-center flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search reviews, customers, or properties..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={ratingFilter} onValueChange={setRatingFilter}>
                  <SelectTrigger className="w-40">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Ratings" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ratings</SelectItem>
                    <SelectItem value="5">5 Stars</SelectItem>
                    <SelectItem value="4">4 Stars</SelectItem>
                    <SelectItem value="3">3 Stars</SelectItem>
                    <SelectItem value="2">2 Stars</SelectItem>
                    <SelectItem value="1">1 Star</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={reviewCountFilter} onValueChange={setReviewCountFilter}>
                  <SelectTrigger className="w-44">
                    <SelectValue placeholder="All Reviewers" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Reviewers</SelectItem>
                    <SelectItem value="first_time">First Time Reviewers</SelectItem>
                    <SelectItem value="few_reviews">2-5 Reviews</SelectItem>
                    <SelectItem value="many_reviews">6+ Reviews</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Rating</SelectItem>
                    <SelectItem value="lowest">Lowest Rating</SelectItem>
                    <SelectItem value="most_reviews">Most Reviews</SelectItem>
                    <SelectItem value="least_reviews">Least Reviews</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="text-sm text-slate-600">
                Showing {filteredReviews.length} of {reviews.length} reviews
              </div>
            </div>
          </Card>

          {/* Reviews List */}
          {loading ? (
            <div className="space-y-4">
              {Array.from({ length: 6 }, (_, i) => (
                <Card key={i} className="p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl">
                  <div className="animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-10 h-10 bg-slate-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-slate-200 rounded w-1/4 mb-2"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/3"></div>
                      </div>
                      <div className="flex space-x-1">
                        {Array.from({ length: 5 }, (_, j) => (
                          <div key={j} className="w-4 h-4 bg-slate-200 rounded"></div>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 bg-slate-200 rounded"></div>
                      <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : filteredReviews.length === 0 ? (
            <Card className="p-12 text-center bg-white/95 backdrop-blur-md border-0 shadow-xl">
              <div className="text-6xl mb-4">⭐</div>
              <h3 className="text-2xl font-semibold text-slate-900 mb-2">No Reviews Found</h3>
              <p className="text-slate-600">
                {reviews.length === 0
                  ? "No reviews have been submitted yet."
                  : "No reviews match your current filters."
                }
              </p>
            </Card>
          ) : (
            <div className="space-y-3">
              {filteredReviews.map((review) => (
                <Card 
                  key={review.id} 
                  className="group p-4 bg-white/95 backdrop-blur-md border-0 shadow-lg hover:shadow-xl transform transition-all duration-300 overflow-hidden relative"
                >
                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {review.customerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h4 className="font-semibold text-slate-900 text-sm truncate">{review.customerName}</h4>
                            <Badge variant="outline" className="text-xs bg-blue-50 text-blue-600 border-blue-200 px-2 py-0.5">
                              {review.customerReviewCount} {review.customerReviewCount === 1 ? 'review' : 'reviews'}
                            </Badge>
                          </div>
                          <p className="text-xs text-slate-500 truncate">{review.propertyName}</p>
                          <div className="flex items-center space-x-1 mt-1">
                            <Calendar className="w-3 h-3 text-slate-400" />
                            <span className="text-xs text-slate-500">
                              {new Date(review.reviewedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-1 ml-2">
                        <AnimatedStarRating rating={review.rating} reviewId={review.id} />
                        <Badge className={`${getRatingColor(review.rating)} px-2 py-0.5 text-xs font-medium flex items-center space-x-1 border`}>
                          {getRatingIcon(review.rating)}
                          <span>{review.rating} Stars</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                      <p className="text-slate-700 text-sm leading-relaxed line-clamp-2">"{review.review}"</p>
                    </div>

                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span>ID: {review.id.slice(-6)}</span>
                      <div className="flex items-center space-x-2">
                        <span className="hidden sm:inline">Property: {review.propertyName}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Reviews;