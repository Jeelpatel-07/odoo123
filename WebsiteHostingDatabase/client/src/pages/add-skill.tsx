import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { insertSkillSchema } from "@shared/schema";
import { z } from "zod";
import { apiRequest } from "@/lib/queryClient";
import Navigation from "@/components/ui/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";

const skillFormSchema = insertSkillSchema.extend({
  wantsToLearnInput: z.string().optional(),
});

type SkillFormData = z.infer<typeof skillFormSchema>;

const categories = [
  { id: 'tech', name: 'Tech', icon: 'fas fa-code' },
  { id: 'languages', name: 'Languages', icon: 'fas fa-language' },
  { id: 'creative', name: 'Creative', icon: 'fas fa-paint-brush' },
  { id: 'business', name: 'Business', icon: 'fas fa-briefcase' },
  { id: 'lifestyle', name: 'Lifestyle', icon: 'fas fa-heart' },
  { id: 'other', name: 'Other', icon: 'fas fa-ellipsis-h' },
];

const skillLevels = [
  { value: 'beginner', label: 'Beginner' },
  { value: 'intermediate', label: 'Intermediate' },
  { value: 'advanced', label: 'Advanced' },
  { value: 'expert', label: 'Expert' },
];

const timeSlots = [
  'Weekday mornings',
  'Weekday afternoons', 
  'Weekday evenings',
  'Weekend mornings',
  'Weekend afternoons',
  'Weekend evenings',
  'Flexible'
];

export default function AddSkill() {
  const { user } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [wantsToLearn, setWantsToLearn] = useState<string[]>([]);
  const [selectedTimes, setSelectedTimes] = useState<string[]>([]);
  const [isDraft, setIsDraft] = useState(false);

  const form = useForm<SkillFormData>({
    resolver: zodResolver(skillFormSchema),
    defaultValues: {
      name: '',
      category: 'tech',
      description: '',
      level: 'intermediate',
      isPublic: true,
      location: '',
      wantsToLearn: [],
      priority: 'medium',
      certifications: '',
      mediaUrls: [],
      availability: {
        type: 'ongoing',
        times: [],
        location: 'online'
      },
      verificationBadges: {},
    },
  });

  const createSkillMutation = useMutation({
    mutationFn: async (data: SkillFormData) => {
      const skillData = {
        ...data,
        wantsToLearn,
        availability: {
          ...data.availability,
          times: selectedTimes,
        },
      };
      delete skillData.wantsToLearnInput;
      
      return await apiRequest('POST', '/api/skills', skillData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/skills'] });
      toast({
        title: "Success!",
        description: isDraft ? "Skill saved as draft" : "Skill published successfully",
      });
      form.reset();
      setWantsToLearn([]);
      setSelectedTimes([]);
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
        description: "Failed to save skill",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: SkillFormData) => {
    createSkillMutation.mutate(data);
  };

  const handleAddWantToLearn = (value: string) => {
    if (value.trim() && !wantsToLearn.includes(value.trim())) {
      setWantsToLearn([...wantsToLearn, value.trim()]);
    }
  };

  const handleRemoveWantToLearn = (index: number) => {
    setWantsToLearn(wantsToLearn.filter((_, i) => i !== index));
  };

  const handleTimeSlotToggle = (time: string) => {
    setSelectedTimes(prev => 
      prev.includes(time) 
        ? prev.filter(t => t !== time)
        : [...prev, time]
    );
  };

  const watchedValues = form.watch();

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 font-mono">
              Share Your <span className="text-turquoise-400">Skills</span>
            </h1>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Offer what you know and discover what you want to learn through meaningful exchanges.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Form Column */}
            <Card className="glass-effect">
              <CardContent className="p-8">
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    {/* Skill Details */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-turquoise-400 flex items-center">
                        <i className="fas fa-pencil-alt mr-2"></i>
                        Skill Details
                      </h2>
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="name"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skill Name</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="What skill can you offer? (e.g., Spanish Tutoring, Web Development)" 
                                  {...field}
                                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="category"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Category</FormLabel>
                              <div className="grid grid-cols-3 gap-2">
                                {categories.map((category) => (
                                  <Button
                                    key={category.id}
                                    type="button"
                                    variant={field.value === category.id ? "default" : "outline"}
                                    className={`p-3 ${field.value === category.id 
                                      ? 'bg-turquoise-500 text-white' 
                                      : 'glass-effect hover:bg-white/20'}`}
                                    onClick={() => field.onChange(category.id)}
                                  >
                                    <i className={`${category.icon} mb-1 block`}></i>
                                    {category.name}
                                  </Button>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="level"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Skill Level</FormLabel>
                              <div className="grid grid-cols-2 gap-2">
                                {skillLevels.map((level) => (
                                  <Button
                                    key={level.value}
                                    type="button"
                                    variant={field.value === level.value ? "default" : "outline"}
                                    className={field.value === level.value 
                                      ? 'bg-turquoise-500 text-white' 
                                      : 'glass-effect hover:bg-white/20'}
                                    onClick={() => field.onChange(level.value)}
                                  >
                                    {level.label}
                                  </Button>
                                ))}
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="description"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Describe your skill, experience, and teaching style..."
                                  className="bg-white/10 border-white/20 text-white placeholder-gray-400 resize-none"
                                  rows={4}
                                  {...field}
                                />
                              </FormControl>
                              <p className="text-sm text-gray-400">Minimum 50 characters</p>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Availability */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-turquoise-400 flex items-center">
                        <i className="far fa-calendar-alt mr-2"></i>
                        Availability
                      </h2>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Preferred Times</Label>
                          <div className="grid grid-cols-2 gap-2 mt-2">
                            {timeSlots.map((time) => (
                              <Button
                                key={time}
                                type="button"
                                variant={selectedTimes.includes(time) ? "default" : "outline"}
                                size="sm"
                                className={selectedTimes.includes(time)
                                  ? 'bg-turquoise-500 text-white'
                                  : 'glass-effect hover:bg-white/20'}
                                onClick={() => handleTimeSlotToggle(time)}
                              >
                                {time}
                              </Button>
                            ))}
                          </div>
                        </div>

                        <FormField
                          control={form.control}
                          name="location"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Location (for in-person)</FormLabel>
                              <FormControl>
                                <Input 
                                  placeholder="Your location"
                                  {...field}
                                  className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* What You Want in Return */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-turquoise-400 flex items-center">
                        <i className="fas fa-exchange-alt mr-2"></i>
                        What You Want in Return
                      </h2>
                      
                      <div className="space-y-4">
                        <div>
                          <Label>Skills You Want to Learn</Label>
                          <div className="flex flex-wrap gap-2 mb-2">
                            {wantsToLearn.map((skill, index) => (
                              <Badge key={index} variant="secondary" className="bg-purple-500/20 text-purple-300">
                                {skill}
                                <button
                                  type="button"
                                  onClick={() => handleRemoveWantToLearn(index)}
                                  className="ml-2 hover:text-red-400"
                                >
                                  ×
                                </button>
                              </Badge>
                            ))}
                          </div>
                          <Input
                            placeholder="Add skills..."
                            className="bg-white/10 border-white/20 text-white placeholder-gray-400"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddWantToLearn(e.currentTarget.value);
                                e.currentTarget.value = '';
                              }
                            }}
                          />
                          <p className="text-sm text-gray-400 mt-1">Press Enter to add</p>
                        </div>

                        <FormField
                          control={form.control}
                          name="priority"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Priority Level</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger className="bg-white/10 border-white/20 text-white">
                                    <SelectValue placeholder="Select priority" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="low">Low priority</SelectItem>
                                  <SelectItem value="medium">Medium priority</SelectItem>
                                  <SelectItem value="high">High priority</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Privacy */}
                    <div>
                      <h2 className="text-xl font-semibold mb-4 text-turquoise-400 flex items-center">
                        <i className="fas fa-lock mr-2"></i>
                        Privacy & Visibility
                      </h2>
                      
                      <div className="space-y-4">
                        <FormField
                          control={form.control}
                          name="isPublic"
                          render={({ field }) => (
                            <FormItem className="flex items-center justify-between">
                              <div>
                                <FormLabel>Make this skill public</FormLabel>
                                <p className="text-sm text-gray-400">
                                  Public skills are visible to everyone. Private skills are only shown to potential matches.
                                </p>
                              </div>
                              <FormControl>
                                <Switch
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    {/* Form Actions */}
                    <div className="flex gap-4">
                      <Button
                        type="button"
                        variant="outline"
                        className="flex-1 glass-effect hover:bg-white/20"
                        onClick={() => {
                          setIsDraft(true);
                          form.handleSubmit(onSubmit)();
                        }}
                        disabled={createSkillMutation.isPending}
                      >
                        Save Draft
                      </Button>
                      <Button
                        type="submit"
                        className="flex-1 bg-turquoise-500 hover:bg-turquoise-600"
                        disabled={createSkillMutation.isPending}
                        onClick={() => setIsDraft(false)}
                      >
                        {createSkillMutation.isPending ? (
                          <div className="loading-dots">
                            <div className="dot"></div>
                            <div className="dot"></div>
                            <div className="dot"></div>
                          </div>
                        ) : (
                          <>
                            Publish Skill <i className="fas fa-magic ml-2"></i>
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>

            {/* Preview Column */}
            <div className="space-y-6">
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4 text-turquoise-400">Live Preview</h3>
                  
                  <div className="skill-card glass-effect p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-turquoise-500 rounded-full flex items-center justify-center">
                          {user?.profileImageUrl ? (
                            <img src={user.profileImageUrl} alt="User" className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <i className="fas fa-user text-white"></i>
                          )}
                        </div>
                        <div>
                          <h4 className="font-semibold text-white">
                            {user?.firstName && user?.lastName 
                              ? `${user.firstName} ${user.lastName}`
                              : user?.firstName || 'Your Name'}
                          </h4>
                          <p className="text-sm text-gray-400">
                            {watchedValues.location || 'Your Location'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1 text-yellow-400">
                        <i className="fas fa-star"></i>
                        <span className="text-sm">New</span>
                      </div>
                    </div>
                    
                    <div className="mb-3">
                      <h5 className="font-semibold mb-1 text-white">
                        {watchedValues.name || 'Your Skill Name'}
                      </h5>
                      <p className="text-gray-300 text-sm mb-2">
                        {watchedValues.description || 'Your description will appear here...'}
                      </p>
                      {watchedValues.category && (
                        <Badge variant="secondary" className="text-xs">
                          {categories.find(c => c.id === watchedValues.category)?.name}
                        </Badge>
                      )}
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-400 mb-1">Wants to learn:</p>
                        <div className="flex flex-wrap gap-1">
                          {wantsToLearn.slice(0, 2).map((skill, index) => (
                            <Badge key={index} variant="outline" className="text-xs bg-purple-500/20 text-purple-300">
                              {skill}
                            </Badge>
                          ))}
                          {wantsToLearn.length === 0 && (
                            <Badge variant="outline" className="text-xs bg-purple-500/20 text-purple-300">
                              Your interests
                            </Badge>
                          )}
                        </div>
                      </div>
                      <Button size="sm" className="bg-turquoise-500 hover:bg-turquoise-600">
                        Request Swap
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="glass-effect">
                <CardContent className="p-6">
                  <h4 className="font-semibold mb-3 text-turquoise-400 flex items-center">
                    <i className="fas fa-question-circle mr-2"></i>
                    Tips for a Great Listing
                  </h4>
                  <ul className="space-y-2 text-sm text-gray-400">
                    <li className="flex items-start">
                      <i className="fas fa-check text-turquoise-400 mr-2 mt-0.5"></i>
                      Be specific about what you can teach
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-turquoise-400 mr-2 mt-0.5"></i>
                      Mention your experience level
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-turquoise-400 mr-2 mt-0.5"></i>
                      Add clear availability
                    </li>
                    <li className="flex items-start">
                      <i className="fas fa-check text-turquoise-400 mr-2 mt-0.5"></i>
                      List skills you genuinely want to learn
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
