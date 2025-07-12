import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const categoryStats = [
  { name: 'Developers', count: 3200, color: 'bg-blue-500' },
  { name: 'Designers', count: 2100, color: 'bg-purple-500' },
  { name: 'Teachers', count: 1800, color: 'bg-green-500' },
  { name: 'Others', count: 5747, color: 'bg-gray-500' },
];

const recentActivities = [
  {
    id: 1,
    type: 'swap_completed',
    icon: 'fas fa-handshake',
    color: 'bg-green-500',
    message: 'Sarah & Michael completed a swap',
    time: '2 hours ago'
  },
  {
    id: 2,
    type: 'skill_added',
    icon: 'fas fa-plus',
    color: 'bg-blue-500',
    message: 'New skill: Blockchain Development',
    time: '4 hours ago'
  },
  {
    id: 3,
    type: 'rating_received',
    icon: 'fas fa-star',
    color: 'bg-purple-500',
    message: 'Emma received a 5-star rating',
    time: '6 hours ago'
  },
  {
    id: 4,
    type: 'user_joined',
    icon: 'fas fa-user-plus',
    color: 'bg-turquoise-500',
    message: 'Alex joined the community',
    time: '8 hours ago'
  }
];

const upcomingEvents = [
  {
    id: 1,
    title: 'AI & Creativity Workshop',
    date: 'June 15, 2024',
    time: '10:00 AM PST',
    type: 'Virtual',
    attending: 1200,
    typeColor: 'bg-turquoise-500/20 text-turquoise-300'
  },
  {
    id: 2,
    title: 'Web Dev Meetup',
    date: 'June 18, 2024',
    time: '6:00 PM PST',
    type: 'In-Person',
    attending: 89,
    typeColor: 'bg-blue-500/20 text-blue-300'
  },
  {
    id: 3,
    title: 'Design Thinking Session',
    date: 'June 20, 2024',
    time: '2:00 PM PST',
    type: 'Hybrid',
    attending: 156,
    typeColor: 'bg-purple-500/20 text-purple-300'
  }
];

export default function Community() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [searchTerm, setSearchTerm] = useState('');

  const { data: communityStats } = useQuery({
    queryKey: ['/api/community/stats'],
    queryFn: async () => {
      // Since we don't have a specific community stats endpoint, we'll use user stats as a fallback
      // In a real implementation, this would fetch community-wide statistics
      return {
        totalMembers: 12847,
        activeSwaps: 892,
        skillsShared: 3562,
        successRate: 98
      };
    },
    onError: (error: Error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
    },
  });

  const { data: topMembers } = useQuery({
    queryKey: ['/api/community/top-members'],
    queryFn: async () => {
      // Mock data for top members - in real implementation this would be an API call
      return [
        {
          id: '1',
          firstName: 'Sarah',
          lastName: 'Johnson',
          profileImageUrl: 'https://images.unsplash.com/photo-1494790108755-2616b612b5b0?w=150&h=150&fit=crop&crop=face',
          skillsShared: 12,
          rating: 4.9,
          completedSwaps: 25
        },
        {
          id: '2',
          firstName: 'Michael',
          lastName: 'Chen',
          profileImageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
          skillsShared: 8,
          rating: 4.8,
          completedSwaps: 19
        },
        {
          id: '3',
          firstName: 'Emma',
          lastName: 'Rodriguez',
          profileImageUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
          skillsShared: 15,
          rating: 4.9,
          completedSwaps: 32
        }
      ];
    },
  });

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-mono">
              Join Our <span className="text-turquoise-400">Community</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Connect with like-minded professionals and discover new opportunities for growth.
            </p>
          </div>

          {/* Community Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono stats-counter">
                  {communityStats?.totalMembers?.toLocaleString() || '12,847'}
                </div>
                <div className="text-gray-400">Active Members</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono stats-counter">
                  {communityStats?.skillsShared?.toLocaleString() || '3,562'}
                </div>
                <div className="text-gray-400">Skills Shared</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono stats-counter">
                  {communityStats?.activeSwaps?.toLocaleString() || '892'}
                </div>
                <div className="text-gray-400">Active Swaps</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono stats-counter">
                  {communityStats?.successRate || '98'}%
                </div>
                <div className="text-gray-400">Success Rate</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tabs Section */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 glass-effect mb-8">
              <TabsTrigger value="overview" className="data-[state=active]:bg-turquoise-500">
                Overview
              </TabsTrigger>
              <TabsTrigger value="members" className="data-[state=active]:bg-turquoise-500">
                Members
              </TabsTrigger>
              <TabsTrigger value="events" className="data-[state=active]:bg-turquoise-500">
                Events
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="data-[state=active]:bg-turquoise-500">
                Leaderboard
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              <div className="grid lg:grid-cols-3 gap-8">
                {/* Community Stats by Category */}
                <Card className="glass-effect">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-turquoise-400">Member Categories</h3>
                    <div className="space-y-4">
                      {categoryStats.map((category) => (
                        <div key={category.name} className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className={`w-3 h-3 rounded-full ${category.color}`}></div>
                            <span className="text-white">{category.name}</span>
                          </div>
                          <span className="text-gray-400">{category.count.toLocaleString()}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Recent Activity */}
                <Card className="glass-effect">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-turquoise-400">Recent Activity</h3>
                    <div className="space-y-4">
                      {recentActivities.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className={`w-8 h-8 ${activity.color} rounded-full flex items-center justify-center flex-shrink-0`}>
                            <i className={`${activity.icon} text-white text-xs`}></i>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">{activity.message}</p>
                            <p className="text-xs text-gray-400">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card className="glass-effect">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4 text-turquoise-400">Upcoming Events</h3>
                    <div className="space-y-4">
                      {upcomingEvents.map((event) => (
                        <div key={event.id} className="border border-white/20 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-semibold text-sm text-white">{event.title}</h4>
                            <Badge className={event.typeColor}>
                              {event.type}
                            </Badge>
                          </div>
                          <p className="text-xs text-gray-400 mb-1">
                            {event.date} • {event.time}
                          </p>
                          <p className="text-xs text-gray-300">
                            {event.attending.toLocaleString()} attending
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="members" className="space-y-6">
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                      <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <Input
                        placeholder="Search community members..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <Button className="bg-turquoise-500 hover:bg-turquoise-600">
                      <i className="fas fa-filter mr-2"></i>
                      Filters
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {topMembers?.map((member) => (
                      <div key={member.id} className="glass-effect rounded-lg p-4">
                        <div className="flex items-center space-x-3 mb-3">
                          <img
                            src={member.profileImageUrl}
                            alt={`${member.firstName} ${member.lastName}`}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                          <div>
                            <h4 className="font-semibold text-white">
                              {member.firstName} {member.lastName}
                            </h4>
                            <div className="flex items-center text-yellow-400">
                              <i className="fas fa-star mr-1"></i>
                              <span className="text-sm">{member.rating}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-sm text-gray-400 space-y-1">
                          <p>{member.skillsShared} skills shared</p>
                          <p>{member.completedSwaps} swaps completed</p>
                        </div>
                        <Button size="sm" className="w-full mt-3 bg-turquoise-500 hover:bg-turquoise-600">
                          View Profile
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="events" className="space-y-6">
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-turquoise-400">Community Events</h3>
                    <Button className="bg-turquoise-500 hover:bg-turquoise-600">
                      <i className="fas fa-plus mr-2"></i>
                      Create Event
                    </Button>
                  </div>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    {upcomingEvents.map((event) => (
                      <Card key={event.id} className="glass-effect">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-lg font-semibold text-white">{event.title}</h4>
                            <Badge className={event.typeColor}>
                              {event.type}
                            </Badge>
                          </div>
                          <div className="space-y-2 text-gray-400 mb-4">
                            <p className="flex items-center">
                              <i className="fas fa-calendar mr-2"></i>
                              {event.date}
                            </p>
                            <p className="flex items-center">
                              <i className="fas fa-clock mr-2"></i>
                              {event.time}
                            </p>
                            <p className="flex items-center">
                              <i className="fas fa-users mr-2"></i>
                              {event.attending.toLocaleString()} attending
                            </p>
                          </div>
                          <Button className="w-full bg-turquoise-500 hover:bg-turquoise-600">
                            Join Event
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="leaderboard" className="space-y-6">
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-6 text-turquoise-400">Top Contributors</h3>
                  
                  <div className="space-y-4">
                    {topMembers?.map((member, index) => (
                      <div key={member.id} className="flex items-center space-x-4 p-4 glass-effect rounded-lg">
                        <div className="w-8 h-8 bg-turquoise-500 rounded-full flex items-center justify-center font-bold text-white">
                          {index + 1}
                        </div>
                        <img
                          src={member.profileImageUrl}
                          alt={`${member.firstName} ${member.lastName}`}
                          className="w-12 h-12 rounded-full object-cover"
                        />
                        <div className="flex-1">
                          <h4 className="font-semibold text-white">
                            {member.firstName} {member.lastName}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {member.completedSwaps} completed swaps
                          </p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center text-yellow-400 mb-1">
                            <i className="fas fa-star mr-1"></i>
                            <span className="font-semibold">{member.rating}</span>
                          </div>
                          <p className="text-sm text-gray-400">{member.skillsShared} skills</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Join Community CTA */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          <Card className="glass-effect">
            <CardContent className="p-8 text-center">
              <h3 className="text-2xl font-bold mb-4 text-white">
                Ready to Join Our Community?
              </h3>
              <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
                Start sharing your skills and connecting with amazing people today. 
                Your next learning opportunity is just a swap away!
              </p>
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-turquoise-500 hover:bg-turquoise-600">
                  <a href="/add-skill">Share a Skill</a>
                </Button>
                <Button asChild variant="outline" className="glass-effect hover:bg-white/20">
                  <a href="/browse-skills">Find Skills</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
