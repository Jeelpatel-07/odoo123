import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";

export default function Navigation() {
  const { user, isAuthenticated } = useAuth();
  const [location] = useLocation();

  const isActive = (path: string) => {
    return location === path ? "active" : "";
  };

  return (
    <nav className="glass-effect fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold font-mono">
              Skill<span className="text-turquoise-400">Swap</span>
            </Link>
            
            {isAuthenticated && (
              <div className="hidden md:flex space-x-6">
                <Link href="/" className={`nav-link px-3 py-2 text-sm font-medium ${isActive("/")}`}>
                  Home
                </Link>
                <Link href="/browse-skills" className={`nav-link px-3 py-2 text-sm font-medium ${isActive("/browse-skills")}`}>
                  Browse Skills
                </Link>
                <Link href="/add-skill" className={`nav-link px-3 py-2 text-sm font-medium ${isActive("/add-skill")}`}>
                  Add Skill
                </Link>
                <Link href="/my-swaps" className={`nav-link px-3 py-2 text-sm font-medium ${isActive("/my-swaps")}`}>
                  My Swaps
                </Link>
                <Link href="/community" className={`nav-link px-3 py-2 text-sm font-medium ${isActive("/community")}`}>
                  Community
                </Link>
              </div>
            )}
          </div>
          
          <div className="hidden md:flex items-center space-x-4">
            {!isAuthenticated ? (
              <>
                <a 
                  href="/api/login" 
                  className="px-4 py-2 text-sm font-medium text-turquoise-400 border border-turquoise-400 rounded-lg hover:bg-turquoise-400 hover:text-white transition-colors"
                >
                  Login
                </a>
                <a 
                  href="/api/login" 
                  className="px-4 py-2 text-sm font-medium bg-turquoise-500 text-white rounded-lg hover:bg-turquoise-600 transition-colors"
                >
                  Sign Up
                </a>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <a 
                  href="/api/logout" 
                  className="px-4 py-2 text-sm font-medium text-gray-300 hover:text-white transition-colors"
                >
                  Logout
                </a>
                <div className="w-8 h-8 rounded-full bg-turquoise-500 flex items-center justify-center overflow-hidden">
                  {user?.profileImageUrl ? (
                    <img 
                      src={user.profileImageUrl} 
                      alt={user.firstName || "User"} 
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <i className="fas fa-user text-white text-sm"></i>
                  )}
                </div>
              </div>
            )}
          </div>
          
          <button className="md:hidden p-2">
            <i className="fas fa-bars text-white"></i>
          </button>
        </div>
      </div>
    </nav>
  );
}
