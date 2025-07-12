import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Calendar, MessageCircle, Video, MapPin } from "lucide-react";

interface SwapCardProps {
  swap: {
    id: number;
    status: string;
    progress?: any;
    nextSessionAt?: string;
    sessionDetails?: any;
    requester: {
      id: string;
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string;
    };
    provider: {
      id: string;
      firstName?: string;
      lastName?: string;
      profileImageUrl?: string;
    };
    skill: {
      name: string;
      category: string;
    };
  };
  currentUserId: string;
  onMessage?: (swapId: number) => void;
  onJoinSession?: (swapId: number) => void;
  onReschedule?: (swapId: number) => void;
  onMarkComplete?: (swapId: number) => void;
}

export default function SwapCard({ 
  swap, 
  currentUserId, 
  onMessage, 
  onJoinSession, 
  onReschedule, 
  onMarkComplete 
}: SwapCardProps) {
  const isRequester = swap.requester.id === currentUserId;
  const otherUser = isRequester ? swap.provider : swap.requester;
  const otherUserName = otherUser.firstName && otherUser.lastName 
    ? `${otherUser.firstName} ${otherUser.lastName}`
    : otherUser.firstName || "Anonymous";

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300';
      case 'accepted':
      case 'in-progress':
        return 'bg-green-500/20 text-green-300';
      case 'completed':
        return 'bg-blue-500/20 text-blue-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300';
      default:
        return 'bg-gray-500/20 text-gray-300';
    }
  };

  const progressPercentage = swap.progress 
    ? (swap.progress.currentSession / swap.progress.totalSessions) * 100 
    : 0;

  return (
    <Card className="glass-effect">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-turquoise-500 flex items-center justify-center">
              {otherUser.profileImageUrl ? (
                <img 
                  src={otherUser.profileImageUrl} 
                  alt={otherUserName} 
                  className="w-full h-full object-cover"
                />
              ) : (
                <i className="fas fa-user text-white"></i>
              )}
            </div>
            <div>
              <h3 className="text-xl font-semibold text-white">{otherUserName}</h3>
              <p className="text-gray-400">{swap.skill.name}</p>
              <Badge className={getStatusColor(swap.status)}>
                {swap.status.charAt(0).toUpperCase() + swap.status.slice(1).replace('-', ' ')}
              </Badge>
            </div>
          </div>
          
          {swap.nextSessionAt && (
            <div className="text-right">
              <p className="text-sm text-gray-400">Next Session:</p>
              <p className="font-semibold text-white">
                {new Date(swap.nextSessionAt).toLocaleDateString()} at{' '}
                {new Date(swap.nextSessionAt).toLocaleTimeString([], { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
              </p>
            </div>
          )}
        </div>

        {swap.progress && (
          <div className="mb-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium text-white">Progress</span>
              <span className="text-sm text-gray-400">
                Session {swap.progress.currentSession}/{swap.progress.totalSessions}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
            {swap.progress.milestones && (
              <div className="flex justify-between mt-1 text-xs text-gray-400">
                {swap.progress.milestones.map((milestone: string, index: number) => (
                  <span key={index}>{milestone}</span>
                ))}
              </div>
            )}
          </div>
        )}

        <div className="flex gap-3">
          {swap.status === 'in-progress' && (
            <Button 
              onClick={() => onJoinSession?.(swap.id)}
              className="flex-1 bg-turquoise-500 hover:bg-turquoise-600 text-white"
            >
              {swap.sessionDetails?.type === 'online' ? (
                <Video className="w-4 h-4 mr-2" />
              ) : (
                <MapPin className="w-4 h-4 mr-2" />
              )}
              {swap.sessionDetails?.type === 'online' ? 'Join Session' : 'View Location'}
            </Button>
          )}
          
          <Button 
            onClick={() => onMessage?.(swap.id)}
            variant="outline"
            className="flex-1 glass-effect hover:bg-white/20"
          >
            <MessageCircle className="w-4 h-4 mr-2" />
            Message
          </Button>
          
          {swap.status === 'in-progress' && (
            <>
              <Button 
                onClick={() => onReschedule?.(swap.id)}
                variant="outline"
                className="flex-1 glass-effect hover:bg-white/20"
              >
                <Calendar className="w-4 h-4 mr-2" />
                Reschedule
              </Button>
              
              <Button 
                onClick={() => onMarkComplete?.(swap.id)}
                variant="outline"
                className="flex-1 glass-effect hover:bg-white/20"
              >
                <i className="fas fa-check-circle mr-2"></i>
                Complete
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
