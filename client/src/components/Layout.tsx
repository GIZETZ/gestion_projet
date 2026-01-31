import { ReactNode } from "react";
import { Link, useLocation } from "wouter";
import { useUser, useLogout } from "@/hooks/use-auth";
import { LogOut, LayoutGrid, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Layout({ children }: { children: ReactNode }) {
  const { user } = useUser();
  const { mutate: logout } = useLogout();
  const [location] = useLocation();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href={user ? (user.isAdmin ? "/ithiel" : "/game") : "/"} className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold font-display shadow-lg shadow-primary/30">
              P
            </div>
            <span className="font-display font-bold text-xl hidden sm:inline-block">
              Gestion de Projet
            </span>
          </Link>

          {user && (
            <div className="flex items-center gap-4">
              <div className="hidden md:flex flex-col items-end mr-2">
                <span className="text-sm font-bold text-foreground">{user.groupName}</span>
                <span className="text-xs text-muted-foreground font-hand">{user.username}</span>
              </div>
              
              {user.isAdmin && (
                <Link href="/ithiel">
                  <Button variant={location === "/ithiel" ? "default" : "ghost"} size="sm" className="gap-2">
                    <ShieldCheck className="w-4 h-4" />
                    <span className="hidden sm:inline">Admin</span>
                  </Button>
                </Link>
              )}
              
              {!user.isAdmin && (
                 <Link href="/game">
                 <Button variant={location === "/game" ? "default" : "ghost"} size="sm" className="gap-2">
                   <LayoutGrid className="w-4 h-4" />
                   <span className="hidden sm:inline">Jeu</span>
                 </Button>
               </Link>
              )}

              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => logout()}
                className="gap-2 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/50"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Déconnexion</span>
              </Button>
            </div>
          )}
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>
      
      <footer className="py-6 text-center text-muted-foreground text-sm font-hand">
        <p>Bonne chance pour vos exposés !</p>
      </footer>
    </div>
  );
}
