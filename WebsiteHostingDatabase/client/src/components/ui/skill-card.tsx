import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Star, MapPin, Clock, Laptop, Users } from "lucide-react";

interface SkillCardProps {
  skill: {
    id: number;
    name: string;
    description: string;
    category: string;
    level: string;
    location?: string;
    availability?: any;
    wantsToLearn?: string[];
    user: {
      id: string;
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string;
    };
  };
  onRequestSwap?: (skillId: number) => void;
  isRecommended?: boolean;
}

export default function SkillCard({ skill, onRequestSwap, isRecommended }: SkillCardProps) {
  const userName = skill.user.firstName && skill.user.lastName 
    ? `${skill.user.firstName} ${skill.user.lastName}`
    : skill.user.firstName || "Anonymous";

  return (
    <Card className={`skill-card glass-effect hover:shadow-2xl transition-all duration-300 ${isRecommended ? 'relative overflow-hidden' : ''}`}>
      {isRecommended && (
        <div className="absolute top-0 right-0 bg-gradient-to-r from-turquoise-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
          AI Recommended
        </div>
      )}
      
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 rounded-full overflow-hidden bg-turquoise-500 flex items-center justify-center">
              {skill.user.profileImageUrl ? (
                <img 
                  src={skill.user.profileImageUrl} 
                  alt={userName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-white"></i>
              )}
            </div>
            <div>
              <h3 className="font-semibold text-white">{userName}</h3>
              <p className="text-sm text-gray-400 flex items-center">
                <MapPin className="w-3 h-3 mr-1" />
                {skill.location || "Location not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-1 text-yellow-400">
            <Star className="w-4 h-4 fill-current" />
            <span className="text-sm">New</span>
          </div>
        </div>
        
        <div className="mb-4">
          <h4 className="text-lg font-semibold mb-2 text-white">{skill.name}</h4>
          <p className="text-gray-300 text-sm mb-3 line-clamp-2">{skill.description}</p>
          
          <div className="flex items-center space-x-4 text-sm text-gray-400 mb-3">
            <span className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              {skill.availability?.times?.[0] || "Flexible"}
            </span>
            <span className="flex items-center">
              {skill.availability?.location === 'online' ? (
                <Laptop className="w-3 h-3 mr-1" />
              ) : (
                <Users className="w-3 h-3 mr-1" />
              )}
              {skill.availability?.location || "Online"}
            </span>
          </div>
          
          <Badge variant="secondary" className="text-xs">
            {skill.category}
          </Badge>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400 mb-1">Wants to learn:</p>
            <div className="flex flex-wrap gap-1">
              {skill.wantsToLearn?.slice(0, 2).map((want, index) => (
                <Badge key={index} variant="outline" className="text-xs bg-purple-500/20 text-purple-300 border-purple-500/30">
                  {want}
                </Badge>
              ))}
            </div>
          </div>
          <Button 
            onClick={() => onRequestSwap?.(skill.id)}
            className="bg-turquoise-500 hover:bg-turquoise-600 text-white"
          >
            Request Swap
          </Button>
        </div>
        
        {isRecommended && (
          <div className="mt-4 p-3 bg-turquoise-500/20 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-white">AI Match Score</span>
              <span className="text-turquoise-400 font-bold">95%</span>
            </div>
            <div className="match-bar mt-2">
              <div className="match-fill" style={{ width: '95%' }}></div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
