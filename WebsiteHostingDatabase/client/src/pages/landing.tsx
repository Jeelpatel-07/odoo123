import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowRight, Play } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Glass Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="text-2xl font-bold">
                Skill<span className="text-purple-400">Swap</span>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                className="text-white hover:bg-white/10"
                onClick={() => window.location.href = '/api/login'}
              >
                Log In
              </Button>
              <Button
                className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
                onClick={() => window.location.href = '/api/login'}
              >
                Sign Up
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl font-bold leading-tight">
                <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                  Exchange Skills
                </span>
                <br />
                <span className="text-white">
                  Without Exchanging Money
                </span>
              </h1>
              <p className="text-xl text-gray-300 max-w-2xl">
                Connect with people who have the skills you need and share what you know in return.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
                  onClick={() => window.location.href = '/api/login'}
                >
                  Get Started
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-purple-400 text-purple-400 hover:bg-purple-400/10"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Watch Demo
                </Button>
              </div>
            </div>
            
            {/* Floating Skill Cards */}
            <div className="relative">
              <div className="floating-cards space-y-6">
                {/* Card 1 */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4 animate-float">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src="https://randomuser.me/api/portraits/women/44.jpg" 
                        alt="Sarah K." 
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-white">Sarah K.</h4>
                        <p className="text-sm text-gray-300">Graphic Designer</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300">Photoshop</span>
                        <span className="px-2 py-1 bg-purple-500/20 rounded text-xs text-purple-300">Illustrator</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-400">Wants to learn:</span> <span className="text-pink-300">Spanish</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 2 */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4 animate-float delay-1000 ml-8">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src="https://randomuser.me/api/portraits/men/32.jpg" 
                        alt="Michael T." 
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-white">Michael T.</h4>
                        <p className="text-sm text-gray-300">Photographer</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">Portrait Photography</span>
                        <span className="px-2 py-1 bg-blue-500/20 rounded text-xs text-blue-300">Lightroom</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-400">Wants to learn:</span> <span className="text-pink-300">Web Development</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>

                {/* Card 3 */}
                <Card className="bg-white/10 backdrop-blur-lg border-white/20 p-4 animate-float delay-2000">
                  <CardContent className="p-0">
                    <div className="flex items-center space-x-3 mb-3">
                      <img 
                        src="https://randomuser.me/api/portraits/women/68.jpg" 
                        alt="Jessica L." 
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <h4 className="font-semibold text-white">Jessica L.</h4>
                        <p className="text-sm text-gray-300">Spanish Tutor</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex flex-wrap gap-1">
                        <span className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-300">Spanish</span>
                        <span className="px-2 py-1 bg-green-500/20 rounded text-xs text-green-300">French</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        <span className="text-gray-400">Wants to learn:</span> <span className="text-pink-300">Graphic Design</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-purple-600/20 to-pink-600/20 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold mb-2 text-white">25K+</div>
              <div className="text-gray-300">Active Users</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-white">15K+</div>
              <div className="text-gray-300">Skills Shared</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-white">8K+</div>
              <div className="text-gray-300">Successful Swaps</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2 text-white">98%</div>
              <div className="text-gray-300">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center text-white mb-12">
            How SkillSwap Works
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-purple-500/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-plus text-purple-400 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Share Your Skills</h3>
                <p className="text-gray-300">
                  List the skills you can teach and what you'd like to learn
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-search text-blue-400 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Find Matches</h3>
                <p className="text-gray-300">
                  Connect with others who have complementary skills
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-green-500/20 rounded-full flex items-center justify-center">
                  <i className="fas fa-handshake text-green-400 text-xl"></i>
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Start Learning</h3>
                <p className="text-gray-300">
                  Exchange knowledge through sessions and grow together
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-6">
            Ready to Start Your Skill Exchange Journey?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Join thousands of learners and teachers in our community
          </p>
          <Button
            size="lg"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-3"
            onClick={() => window.location.href = '/api/login'}
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>
    </div>
  );
}
