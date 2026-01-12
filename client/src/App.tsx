import { Switch, Route, Redirect, Link, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/use-auth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Clients from "@/pages/clients";
import Sessions from "@/pages/sessions";
import { Home, Users, Calendar, LogOut, Dumbbell } from "lucide-react";

function BottomNav() {
  const [location] = useLocation();
  
  const navItems = [
    { href: "/", icon: Home, label: "Home" },
    { href: "/clients", icon: Users, label: "Clients" },
    { href: "/sessions", icon: Calendar, label: "Sessions" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-lg border-t border-border/50 z-50 safe-area-bottom">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.href} href={item.href}>
              <div 
                className={`flex flex-col items-center gap-0.5 px-6 py-2 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? "text-primary" 
                    : "text-muted-foreground hover:text-foreground"
                }`} 
                data-testid={`nav-${item.label.toLowerCase()}`}
              >
                <div className={`p-1.5 rounded-xl transition-all duration-200 ${isActive ? "bg-primary/10" : ""}`}>
                  <item.icon className={`w-5 h-5 transition-transform duration-200 ${isActive ? "scale-110" : ""}`} />
                </div>
                <span className={`text-xs font-medium transition-all duration-200 ${isActive ? "font-semibold" : ""}`}>
                  {item.label}
                </span>
              </div>
            </Link>
          );
        })}
        <a 
          href="/api/logout" 
          className="flex flex-col items-center gap-0.5 px-6 py-2 text-muted-foreground hover:text-foreground rounded-xl transition-all duration-200" 
          data-testid="nav-logout"
        >
          <div className="p-1.5 rounded-xl">
            <LogOut className="w-5 h-5" />
          </div>
          <span className="text-xs font-medium">Logout</span>
        </a>
      </div>
    </nav>
  );
}

function Router() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center animate-pulse">
            <Dumbbell className="w-6 h-6 text-primary" />
          </div>
          <p className="text-muted-foreground text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <Switch>
        <Route path="/">
          <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-6">
            <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
              <Dumbbell className="w-10 h-10 text-primary" />
            </div>
            <h1 className="text-4xl font-bold mb-2 text-center">FitTrack Pro</h1>
            <p className="text-lg mb-8 text-muted-foreground text-center max-w-sm">
              The modern way to manage your personal training business
            </p>
            <a 
              href="/api/login" 
              className="px-8 py-3.5 bg-primary text-primary-foreground rounded-xl font-semibold shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
              data-testid="button-login"
            >
              Get Started
            </a>
          </div>
        </Route>
        <Route>
          <Redirect to="/" />
        </Route>
      </Switch>
    );
  }

  return (
    <div className="min-h-screen bg-background pb-20 overflow-x-hidden">
      <header className="sticky top-0 bg-card/95 backdrop-blur-lg border-b border-border/50 z-40">
        <div className="flex items-center justify-between px-4 py-3 max-w-4xl mx-auto w-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
              <Dumbbell className="w-4 h-4 text-primary" />
            </div>
            <span className="text-lg font-bold">FitTrack</span>
          </div>
          <span className="text-sm text-muted-foreground">Hey, {user.username}</span>
        </div>
      </header>
      <main className="px-4 py-6 max-w-4xl mx-auto w-full overflow-hidden">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/clients" component={Clients} />
          <Route path="/sessions" component={Sessions} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <BottomNav />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Router />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
