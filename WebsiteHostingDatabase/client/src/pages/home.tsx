import { useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Navigation from "@/components/ui/navigation";
import SkillCard from "@/components/ui/skill-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";

export default function Home() {
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: recentSkills, isLoading } = useQuery({
    queryKey: ['/api/skills'],
    queryFn: async () => {
      const response = await fetch('/api/skills?limit=6');
      if (!response.ok) throw new Error('Failed to fetch skills');
      return response.json();
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
        description: "Failed to load skills",
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

  const handleRequestSwap = (skillId: number) => {
    // TODO: Implement swap request modal
    toast({
      title: "Coming Soon",
      description: "Swap request functionality will be implemented soon!",
    });
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold mb-6 font-mono">
              Welcome back, <span className="text-turquoise-400">{user?.firstName || 'Learner'}</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Continue your skill exchange journey and discover new opportunities to learn and teach.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono">
                  {userStats?.totalSwaps || 0}
                </div>
                <div className="text-gray-400">Total Swaps</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono">
                  {userStats?.completedSwaps || 0}
                </div>
                <div className="text-gray-400">Completed</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono">
                  {userStats?.averageRating?.toFixed(1) || 'N/A'}
                </div>
                <div className="text-gray-400">Rating</div>
              </CardContent>
            </Card>
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="text-3xl font-bold text-turquoise-400 mb-2 font-mono">
                  {userStats?.totalHours || 0}
                </div>
                <div className="text-gray-400">Hours</div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-turquoise-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-plus text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Add New Skill</h3>
                <p className="text-gray-400 mb-4">Share what you know with the community</p>
                <Button asChild className="bg-turquoise-500 hover:bg-turquoise-600">
                  <Link href="/add-skill">Add Skill</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-search text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">Browse Skills</h3>
                <p className="text-gray-400 mb-4">Find skills you want to learn</p>
                <Button asChild variant="outline" className="glass-effect hover:bg-white/20">
                  <Link href="/browse-skills">Browse Now</Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="glass-effect">
              <CardContent className="p-6 text-center">
                <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="fas fa-exchange-alt text-white text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-white">My Swaps</h3>
                <p className="text-gray-400 mb-4">Manage your ongoing exchanges</p>
                <Button asChild variant="outline" className="glass-effect hover:bg-white/20">
                  <Link href="/my-swaps">View Swaps</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Skills */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold font-mono">Recent <span className="text-turquoise-400">Skills</span></h2>
            <Button asChild variant="outline" className="glass-effect hover:bg-white/20">
              <Link href="/browse-skills">View All</Link>
            </Button>
          </div>
          
          {isLoading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <Card key={i} className="glass-effect">
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-12 w-12 bg-gray-600 rounded-full mb-4"></div>
                      <div className="h-4 bg-gray-600 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-600 rounded w-full mb-4"></div>
                      <div className="h-8 bg-gray-600 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {recentSkills?.skills?.map((skill: any, index: number) => (
                <SkillCard
                  key={skill.id}
                  skill={skill}
                  onRequestSwap={handleRequestSwap}
                  isRecommended={index === 0}
                />
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
