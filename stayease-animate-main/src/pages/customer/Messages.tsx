import { useEffect, useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Search, Filter, TrendingUp, TrendingDown, Calendar, MessageSquare, ThumbsUp, ThumbsDown } from "lucide-react";
import { BookingsAPI, type Review } from "@/lib/api";

const Reviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [filteredReviews, setFilteredReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [ratingFilter, setRatingFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<string>("newest");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await BookingsAPI.getOwnerReviews();
        if (response.success && response.data) {
          setReviews(response.data);
          setFilteredReviews(response.data);
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

    // Apply search filter
    if (searchTerm) {
      filtered = filtered.filter(review =>
        review.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.propertyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        review.review.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply rating filter
    if (ratingFilter !== "all") {
      filtered = filtered.filter(review => review.rating === parseInt(ratingFilter));
    }

    // Apply sorting
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
    }

    setFilteredReviews(filtered);
  }, [reviews, searchTerm, ratingFilter, sortBy]);

  const getRatingStats = () => {
    const total = reviews.length;
    const average = total > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / total : 0;
    const distribution = [5, 4, 3, 2, 1].map(rating => ({
      rating,
      count: reviews.filter(r => r.rating === rating).length,
      percentage: total > 0 ? (reviews.filter(r => r.rating === rating).length / total) * 100 : 0
    }));

    return { total, average, distribution };
  };

  const stats = getRatingStats();

  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "bg-green-100 text-green-800";
    if (rating >= 3) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  const getRatingIcon = (rating: number) => {
    if (rating >= 4) return <ThumbsUp className="w-4 h-4" />;
    if (rating >= 3) return <MessageSquare className="w-4 h-4" />;
    return <ThumbsDown className="w-4 h-4" />;
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
                    <p className="text-3xl font-bold text-slate-900">{stats.average.toFixed(1)}</p>
                    <p className="text-sm text-slate-600">Average Rating</p>
                  </div>
                  <div className="flex items-center space-x-1">
                    {Array.from({ length: 5 }, (_, i) => (
                      <Star
                        key={i}
                        className={`w-6 h-6 ${
                          i < Math.floor(stats.average)
                            ? 'fill-amber-400 text-amber-400'
                            : i < stats.average
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
                    <p className="text-3xl font-bold text-slate-900">{stats.total}</p>
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

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest First</SelectItem>
                    <SelectItem value="oldest">Oldest First</SelectItem>
                    <SelectItem value="highest">Highest Rating</SelectItem>
                    <SelectItem value="lowest">Lowest Rating</SelectItem>
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
            <div className="space-y-4">
              {filteredReviews.map((review) => (
                <Card key={review.id} className="group p-6 bg-white/95 backdrop-blur-md border-0 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-500 overflow-hidden relative">
                  {/* Floating gradient orbs */}
                  <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-full blur-xl group-hover:scale-125 transition-all duration-700" />

                  <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-amber-600 to-orange-600 rounded-full flex items-center justify-center shadow-lg">
                          <span className="text-white font-bold text-lg">
                            {review.customerName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 text-lg">{review.customerName}</h4>
                          <p className="text-sm text-slate-600">{review.propertyName}</p>
                          <div className="flex items-center space-x-2 mt-1">
                            <Calendar className="w-4 h-4 text-slate-400" />
                            <span className="text-xs text-slate-500">
                              {new Date(review.reviewedAt).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: 5 }, (_, i) => (
                            <Star
                              key={i}
                              className={`w-5 h-5 ${
                                i < review.rating
                                  ? 'fill-amber-400 text-amber-400'
                                  : 'text-slate-300'
                              }`}
                            />
                          ))}
                        </div>
                        <Badge className={`${getRatingColor(review.rating)} px-3 py-1 text-sm font-medium flex items-center space-x-1`}>
                          {getRatingIcon(review.rating)}
                          <span>{review.rating} Stars</span>
                        </Badge>
                      </div>
                    </div>

                    <div className="bg-slate-50 rounded-lg p-4 mb-4">
                      <p className="text-slate-700 leading-relaxed">"{review.review}"</p>
                    </div>

                    <div className="flex items-center justify-between text-sm text-slate-500">
                      <div className="flex items-center space-x-4">
                        <span>Review ID: {review.id.slice(-8)}</span>
                        <span>•</span>
                        <span>Property: {review.propertyName}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm" className="text-xs">
                          Reply
                        </Button>
                        <Button variant="outline" size="sm" className="text-xs">
                          Mark as Read
                        </Button>
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
      unread: 0,
      online: false,
      avatar: "🏢"
    }
  ];

  const messages = [
    {
      id: 1,
      sender: "hotel",
      content: "Hello! Welcome to Royal Palace Hotel. How can I assist you today?",
      timestamp: "10:30 AM",
      type: "text"
    },
    {
      id: 2,
      sender: "user",
      content: "Hi! I have a booking for tonight. Is early check-in possible?",
      timestamp: "10:32 AM",
      type: "text"
    },
    {
      id: 3,
      sender: "hotel",
      content: "Let me check availability for you. What's your booking reference?",
      timestamp: "10:33 AM",
      type: "text"
    },
    {
      id: 4,
      sender: "user",
      content: "It's RPH001234",
      timestamp: "10:34 AM",
      type: "text"
    },
    {
      id: 5,
      sender: "hotel",
      content: "Perfect! I can see your reservation. Your room is ready for early check-in!",
      timestamp: "10:35 AM",
      type: "text"
    },
    {
      id: 6,
      sender: "hotel",
      content: "You can check in anytime after 12:00 PM today instead of the usual 3:00 PM.",
      timestamp: "Just now",
      type: "text"
    }
  ];

  const selectedConversation = conversations.find(conv => conv.id === selectedChat);

  const sendMessage = () => {
    if (newMessage.trim()) {
      // Add message logic here
      setNewMessage("");
    }
  };

  return (
    <DashboardLayout userRole="customer">
      <div className="p-4 md:p-6 h-[calc(100vh-8rem)] space-y-6">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center space-x-3 mb-2">
            <div className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg">
              <MessageSquare className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 via-pink-600 to-violet-600 bg-clip-text text-transparent">
              Messages
            </h1>
          </div>
          <p className="text-slate-600 text-sm md:text-base">
            Connect with hotels and get instant support for your bookings
          </p>
        </div>

        <div className="flex flex-col lg:flex-row h-full space-y-6 lg:space-y-0 lg:space-x-6">
          {/* Conversations List */}
          <div className="w-full lg:w-1/3">
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl h-full flex flex-col">
              {/* Header */}
              <div className="p-4 md:p-6 border-b border-slate-200">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-lg md:text-xl font-semibold text-slate-900">Messages</h2>
                  <Badge variant="secondary" className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0">
                    {conversations.filter(c => c.unread > 0).length}
                  </Badge>
                </div>
                
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10 bg-slate-50 border-slate-200 focus:border-purple-400"
                  />
                </div>
              </div>
              
              {/* Conversations */}
              <div className="flex-1 overflow-auto">
                {conversations.map((conversation) => (
                  <div
                    key={conversation.id}
                    className={`p-3 md:p-4 border-b border-slate-100 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-300 group ${
                      selectedChat === conversation.id ? 'bg-gradient-to-r from-purple-100 to-pink-100' : ''
                    }`}
                    onClick={() => setSelectedChat(conversation.id)}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="relative">
                        <Avatar className="w-10 h-10 md:w-12 md:h-12 ring-2 ring-slate-200 group-hover:ring-purple-300 transition-all duration-300">
                          <AvatarFallback className="text-base md:text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {conversation.avatar}
                          </AvatarFallback>
                        </Avatar>
                        {conversation.online && (
                          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 md:w-3 md:h-3 bg-green-400 rounded-full border-2 border-white"></div>
                        )}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <h3 className="font-medium text-slate-900 truncate group-hover:text-purple-700 transition-colors text-sm md:text-base">
                            {conversation.name}
                          </h3>
                          <span className="text-xs text-slate-500">{conversation.timestamp}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <p className="text-xs md:text-sm text-slate-600 truncate">{conversation.lastMessage}</p>
                          {conversation.unread > 0 && (
                            <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white border-0 text-xs ml-2">
                              {conversation.unread}
                            </Badge>
                          )}
                        </div>
                        
                        {conversation.type === 'support' && (
                          <Badge variant="outline" className="text-xs mt-1 border-purple-300 text-purple-600 bg-purple-50">
                            AI Support
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
          
          {/* Chat Area */}
          <div className="flex-1">
            <Card className="bg-white/95 backdrop-blur-md border-0 shadow-xl h-full flex flex-col">
              {selectedConversation && (
                <>
                  {/* Chat Header */}
                  <div className="p-4 md:p-6 border-b border-slate-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-8 h-8 md:w-10 md:h-10 ring-2 ring-slate-200">
                          <AvatarFallback className="text-base md:text-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                            {selectedConversation.avatar}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-slate-900 text-sm md:text-base">{selectedConversation.name}</h3>
                          <p className="text-xs md:text-sm text-slate-500">
                            {selectedConversation.online ? 'Online now' : 'Last seen 2 hours ago'}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                          <Video className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                          <MoreVertical className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  {/* Messages */}
                  <div className="flex-1 overflow-auto p-4 md:p-6 space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                      >
                        <div
                          className={`max-w-[70%] p-3 rounded-lg ${
                            message.sender === 'user'
                              ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-lg'
                              : 'bg-slate-100 text-slate-900 border border-slate-200'
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p className={`text-xs mt-1 ${
                            message.sender === 'user' 
                              ? 'text-white/70' 
                              : 'text-slate-500'
                          }`}>
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {/* Message Input */}
                  <div className="p-4 md:p-6 border-t border-slate-200">
                    <div className="flex items-center space-x-2">
                      <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-700 hover:bg-slate-100">
                        <Paperclip className="w-4 h-4" />
                      </Button>
                      
                      <div className="flex-1 relative">
                        <Input
                          placeholder="Type your message..."
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                          className="pr-10 bg-slate-50 border-slate-200 focus:border-purple-400"
                        />
                        <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                          <Smile className="w-4 h-4" />
                        </Button>
                      </div>
                      
                      <Button
                        onClick={sendMessage}
                        disabled={!newMessage.trim()}
                        className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white border-0 shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        <Send className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Messages;