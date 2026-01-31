import { useUser } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useEffect } from "react";

interface ProtectedRouteProps {
  component: React.ComponentType;
  adminOnly?: boolean;
}

export function ProtectedRoute({ component: Component, adminOnly = false }: ProtectedRouteProps) {
  const { user, isLoading } = useUser();
  const [, setLocation] = useLocation();

  useEffect(() => {
    if (!isLoading && !user) {
      setLocation("/");
    }
    
    if (!isLoading && user && !user.isApproved && !user.isAdmin) {
      // Redirect unapproved users to waiting area, unless they are already there or admin
      // Note: Logic handled inside specific pages usually, but good to have safeguard
    }
  }, [user, isLoading, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect in effect
  }

  if (adminOnly && !user.isAdmin) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center">
        <h1 className="text-4xl font-display font-bold text-destructive mb-4">Accès Interdit</h1>
        <p className="text-muted-foreground mb-8">Cette page est réservée à l'administrateur.</p>
        <button 
          onClick={() => setLocation("/game")}
          className="px-6 py-2 bg-primary text-white rounded-lg hover:bg-primary/90"
        >
          Retour au jeu
        </button>
      </div>
    );
  }

  return <Component />;
}
