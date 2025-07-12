import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/ui/navigation";
import SwapCard from "@/components/ui/swap-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function MySwaps() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('recent');
  const [activeTab, setActiveTab] = useState('active');

  useEffect(() => {
    if (!user) {
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
  }, [user, toast]);

  const { data: swaps, isLoading } = useQuery({
    queryKey: ['/api/swaps', { status: activeTab !== 'all' ? activeTab : undefined }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (activeTab !== 'all') {
        params.append('status', activeTab);
      }
      
      const response = await fetch(`/api/swaps?${params}`);
      if (!response.ok) throw new Error('Failed to fetch swaps');
      return response.json();
    },
    enabled: !!user,
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
      toast({
        title: "Error",
        description: "Failed to load swaps",
        variant: "destructive",
      });
    },
  });

  const { data: userStats } = useQuery({
    queryKey: ['/api/users', user?.id, 'stats'],
    queryFn: async () => {
      if (!user?.id) return null;
      const response = await fetch(`/api/users/${user.id}/stats`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      return response.json();
    },
    enabled: !!user?.id,
  });

  const updateSwapMutation = useMutation({
    mutationFn: async ({ swapId, data }: { swapId: number; data: any }) => {
      return await apiRequest('PUT', `/api/swaps/${swapId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/swaps'] });
      toast({
        title: "Success",
        description: "Swap updated successfully",
      });
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
      toast({
        title: "Error",
        description: "Failed to update swap",
        variant: "destructive",
      });
    },
  });

  const handleMessage = (swapId: number) => {
    // TODO: Implement messaging modal
    toast({
      title: "Coming Soon",
      description: "Messaging functionality will be implemented soon!",
    });
  };

  const handleJoinSession = (swapId: number) => {
    // TODO: Implement session joining
    toast({
      title: "Coming Soon",
      description: "Session joining will be implemented soon!",
    });
  };

  const handleReschedule = (swapId: number) => {
    // TODO: Implement rescheduling modal
    toast({
      title: "Coming Soon",
      description: "Rescheduling functionality will be implemented soon!",
    });
  };

  const handleMarkComplete = (swapId: number) => {
    updateSwapMutation.mutate({
      swapId,
      data: { status: 'completed' }
    });
  };

  const getSwapCounts = () => {
    if (!swaps) return { active: 0, pending: 0, completed: 0, total: 0 };
    
    return {
      active: swaps.filter((s: any) => s.status === 'in-progress').length,
      pending: swaps.filter((s: any) => s.status === 'pending').length,
      completed: swaps.filter((s: any) => s.status === 'completed').length,
      total: swaps.length
    };
  };

  const filteredSwaps = swaps?.filter((swap: any) => {
    const otherUser = swap.requesterId === user?.id ? swap.provider : swap.requester;
    const otherUserName = `${otherUser.firstName || ''} ${otherUser.lastName || ''}`.toLowerCase();
    const skillName = swap.skill.name.toLowerCase();
    
    return otherUserName.includes(searchTerm.toLowerCase()) || 
           skillName.includes(searchTerm.toLowerCase());
  }) || [];

  const counts = getSwapCounts();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-8">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 items-center">
            <div>
              <h1 className="text-5xl font-bold mb-4 font-mono">
                My <span className="text-turquoise-400">Swaps</span>
              </h1>
              <div className="flex items-center gap-4 text-lg mb-4">
                <span className="text-turquoise-400 font-semibold">{counts.active} Active</span>
                <span className="text-gray-400">|</span>
                <span className="text-turquoise-400 font-semibold">{counts.completed} Completed</span>
                <span className="text-gray-400">|</span>
                <span className="text-turquoise-400 font-semibold">
                  {userStats?.averageRating?.toFixed(1) || 'N/A'}★ Rating
                </span>
              </div>
              <p className="text-xl text-gray-300">
                Manage your skill exchanges in one place
              </p>
            </div>
            <div className="flex justify-center">
              <img 
                src="https://illustrations.popsy.co/amber/digital-nomad.svg" 
                alt="People exchanging skills" 
                className="w-64 h-64 opacity-80"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Tabs and Search */}
      <section className="pb-8">
        <div className="container mx-auto px-4">
          <Card className="glass-effect mb-6">
            <CardContent className="p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="grid w-full grid-cols-4 glass-effect">
                  <TabsTrigger value="active" className="data-[state=active]:bg-turquoise-500">
                    Active <Badge variant="secondary" className="ml-2">{counts.active}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="pending" className="data-[state=active]:bg-turquoise-500">
                    Pending <Badge variant="secondary" className="ml-2">{counts.pending}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="completed" className="data-[state=active]:bg-turquoise-500">
                    Completed <Badge variant="secondary" className="ml-2">{counts.completed}</Badge>
                  </TabsTrigger>
                  <TabsTrigger value="all" className="data-[state=active]:bg-turquoise-500">
                    All
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </CardContent>
          </Card>

          {/* Search and Filter */}
          <Card className="glass-effect mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                  <Input
                    placeholder="Search swaps..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-gray-400 whitespace-nowrap">Sort by:</span>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40 bg-white/10 border-white/20 text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="recent">Recent</SelectItem>
                      <SelectItem value="priority">Priority</SelectItem>
                      <SelectItem value="alphabetical">Alphabetical</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Swaps List */}
      <section className="pb-16">
        <div className="container mx-auto px-4">
          {isLoading ? (
            <div className="space-y-6">
              {[...Array(3)].map((_, i) => (
                <Card key={i} className="glass-effect">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="flex items-center space-x-4 mb-4">
                        <div className="w-16 h-16 bg-gray-600 rounded-full"></div>
                        <div className="space-y-2">
                          <div className="h-4 bg-gray-600 rounded w-48"></div>
                          <div className="h-3 bg-gray-600 rounded w-32"></div>
                        </div>
                      </div>
                      <div className="h-2 bg-gray-600 rounded w-full mb-4"></div>
                      <div className="flex gap-3">
                        <div className="h-9 bg-gray-600 rounded flex-1"></div>
                        <div className="h-9 bg-gray-600 rounded flex-1"></div>
                        <div className="h-9 bg-gray-600 rounded flex-1"></div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : filteredSwaps.length > 0 ? (
            <div className="space-y-6">
              {filteredSwaps.map((swap: any) => (
                <SwapCard
                  key={swap.id}
                  swap={swap}
                  currentUserId={user?.id || ''}
                  onMessage={handleMessage}
                  onJoinSession={handleJoinSession}
                  onReschedule={handleReschedule}
                  onMarkComplete={handleMarkComplete}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <img 
                src="https://illustrations.popsy.co/amber/reading-list.svg" 
                alt="No swaps yet" 
                className="w-48 h-48 mx-auto mb-6 opacity-50"
              />
              <h3 className="text-2xl font-semibold mb-4 text-white">No swaps yet!</h3>
              <p className="text-gray-400 mb-6">Start by browsing skills or adding your own to offer</p>
              <div className="flex gap-4 justify-center">
                <Button asChild className="bg-turquoise-500 hover:bg-turquoise-600">
                  <a href="/browse-skills">Browse Skills</a>
                </Button>
                <Button variant="outline" className="glass-effect hover:bg-white/20">
                  <i className="fas fa-play mr-2"></i>
                  How It Works
                </Button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Performance Metrics */}
      {userStats && (
        <section className="pb-16">
          <div className="container mx-auto px-4">
            <Card className="glass-effect">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-6 text-turquoise-400 flex items-center">
                  <i className="fas fa-chart-line mr-2"></i>
                  Your Swap Performance
                </h3>
                <div className="grid grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono">
                      {userStats.totalSwaps > 0 ? Math.round((userStats.completedSwaps / userStats.totalSwaps) * 100) : 0}%
                    </div>
                    <div className="text-gray-400">Success Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono">
                      {userStats.averageRating?.toFixed(1) || 'N/A'}
                    </div>
                    <div className="text-gray-400">Avg. Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono">
                      {userStats.totalHours || 0}
                    </div>
                    <div className="text-gray-400">Total Hours</div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <Button variant="outline" className="glass-effect hover:bg-white/20">
                    <i className="fas fa-download mr-2"></i>
                    Download Swap History
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      )}

      {/* Floating Action Button (Mobile) */}
      <Button className="fixed bottom-6 right-6 w-14 h-14 bg-turquoise-500 text-white rounded-full shadow-lg hover:bg-turquoise-600 z-50 md:hidden">
        <i className="fas fa-plus"></i>
      </Button>
    </div>
  );
}
