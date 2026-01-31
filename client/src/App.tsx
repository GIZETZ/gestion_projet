import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/AuthPage";
import GamePage from "@/pages/GamePage";
import AdminPage from "@/pages/AdminPage";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { useUser } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";

// Wrapper to handle redirect if already logged in on home page
function HomeRoute() {
  const { user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (user) {
    // If logged in, redirect based on role
    if (user.isAdmin) {
      setLocation("/ithiel");
    } else {
      setLocation("/game");
    }
    return null;
  }

  return <AuthPage />;
}

function Router() {
  return (
    <Switch>
      <Route path="/" component={HomeRoute} />
      
      <Route path="/game">
        <ProtectedRoute component={GamePage} />
      </Route>
      
      <Route path="/ithiel">
        <ProtectedRoute component={AdminPage} adminOnly />
      </Route>
      
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
