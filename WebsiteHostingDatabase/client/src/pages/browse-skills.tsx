import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import Navigation from "@/components/ui/navigation";
import SkillCard from "@/components/ui/skill-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

const categories = [
  { id: 'all', name: 'All', icon: 'fas fa-th' },
  { id: 'tech', name: 'Tech', icon: 'fas fa-code' },
  { id: 'languages', name: 'Languages', icon: 'fas fa-language' },
  { id: 'creative', name: 'Creative', icon: 'fas fa-paint-brush' },
  { id: 'business', name: 'Business', icon: 'fas fa-briefcase' },
  { id: 'lifestyle', name: 'Lifestyle', icon: 'fas fa-heart' },
];

export default function BrowseSkills() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [page, setPage] = useState(0);
  const limit = 12;

  const { data: skillsData, isLoading, error } = useQuery({
    queryKey: ['/api/skills', { 
      search: searchTerm, 
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      limit, 
      offset: page * limit 
    }],
    queryFn: async () => {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: (page * limit).toString(),
      });
      
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      
      const response = await fetch(`/api/skills?${params}`);
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

  const handleRequestSwap = (skillId: number) => {
    // TODO: Implement swap request modal
    toast({
      title: "Coming Soon",
      description: "Swap request functionality will be implemented soon!",
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <section className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-mono">
              Find Skills to <span className="text-turquoise-400">Swap</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Discover professionals offering skills you want to learn, and connect for mutual growth.
            </p>
          </div>

          {/* Search and Filter */}
          <Card className="glass-effect mb-8">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row gap-4 items-center">
                <div className="flex-1 relative">
                  <form onSubmit={handleSearch} className="flex gap-2">
                    <div className="relative flex-1">
                      <i className="fas fa-search absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"></i>
                      <Input
                        type="text"
                        placeholder="Search skills (e.g., 'Python', 'Photography', 'Spanish')"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-12 bg-white/10 border-white/20 text-white placeholder-gray-400"
                      />
                    </div>
                    <Button type="submit" className="bg-turquoise-500 hover:bg-turquoise-600">
                      Search
                    </Button>
                  </form>
                </div>
                
                <div className="flex gap-2 flex-wrap">
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      variant={selectedCategory === category.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        setSelectedCategory(category.id);
                        setPage(0);
                      }}
                      className={selectedCategory === category.id 
                        ? "bg-turquoise-500 hover:bg-turquoise-600" 
                        : "glass-effect hover:bg-white/20"}
                    >
                      <i className={`${category.icon} mr-2`}></i>
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Skills Grid */}
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
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Failed to load skills. Please try again.</p>
            </div>
          ) : skillsData?.skills?.length > 0 ? (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {skillsData.skills.map((skill: any, index: number) => (
                  <SkillCard
                    key={skill.id}
                    skill={skill}
                    onRequestSwap={handleRequestSwap}
                    isRecommended={index === 0 && page === 0}
                  />
                ))}
              </div>
              
              {/* Pagination */}
              <div className="flex justify-center mt-8 gap-2">
                <Button
                  variant="outline"
                  onClick={() => setPage(Math.max(0, page - 1))}
                  disabled={page === 0}
                  className="glass-effect hover:bg-white/20"
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setPage(page + 1)}
                  disabled={skillsData.skills.length < limit}
                  className="glass-effect hover:bg-white/20"
                >
                  Next
                </Button>
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <img 
                src="https://illustrations.popsy.co/amber/reading-list.svg" 
                alt="No skills found" 
                className="w-48 h-48 mx-auto mb-6 opacity-50"
              />
              <h3 className="text-2xl font-semibold mb-4 text-white">No skills found</h3>
              <p className="text-gray-400 mb-6">Try adjusting your search or browse different categories</p>
              <Button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('all');
                  setPage(0);
                }}
                className="bg-turquoise-500 hover:bg-turquoise-600"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
