import { useState } from "react";
import { DashboardLayout } from "@/components/layout/DashboardLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Send, Search, Phone, Video, MoreVertical, Paperclip, Smile, MessageSquare } from "lucide-react";

const Messages = () => {
  const [selectedChat, setSelectedChat] = useState(1);
  const [newMessage, setNewMessage] = useState("");

  const conversations = [
    {
      id: 1,
      name: "Royal Palace Hotel",
      type: "hotel",
      lastMessage: "Your room is ready for early check-in!",
      timestamp: "2 min ago",
      unread: 2,
      online: true,
      avatar: "🏨"
    },
    {
      id: 2,
      name: "StayEase Support",
      type: "support",
      lastMessage: "How can I help you today?",
      timestamp: "1 hour ago",
      unread: 0,
      online: true,
      avatar: "🤖"
    },
    {
      id: 3,
      name: "Maldives Beach Resort",
      type: "hotel",
      lastMessage: "Thanks for your booking! We're excited to host you.",
      timestamp: "Yesterday",
      unread: 0,
      online: false,
      avatar: "🏖️"
    },
    {
      id: 4,
      name: "Tokyo Business Hotel",
      type: "hotel",
      lastMessage: "Your stay review has been received. Thank you!",
      timestamp: "2 days ago",
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