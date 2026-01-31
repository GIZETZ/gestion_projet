import { useEffect } from "react";
import { Layout } from "@/components/Layout";
import { useTopics, useChooseTopic } from "@/hooks/use-topics";
import { useUser } from "@/hooks/use-auth";
import { useGameStatus } from "@/hooks/use-admin";
import { TopicCard } from "@/components/TopicCard";
import { useToast } from "@/hooks/use-toast";
import confetti from "canvas-confetti";
import { Loader2, AlertCircle, PlayCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function GamePage() {
  const { data: topics, isLoading, error } = useTopics();
  const { mutate: chooseTopic, isPending: isChoosing } = useChooseTopic();
  const { user } = useUser();
  const { data: gameStatus } = useGameStatus();
  const { toast } = useToast();

  const handleSelect = (id: number) => {
    if (!gameStatus?.isStarted) {
      toast({
        title: "Action impossible",
        description: "Le jeu n'a pas encore été lancé par l'administrateur.",
        variant: "destructive",
      });
      return;
    }
    chooseTopic(id, {
      onSuccess: () => {
        // Trigger confetti
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#8B5CF6', '#F97316', '#14B8A6']
        });
        
        toast({
          title: "Sujet Attribué !",
          description: "Félicitations, vous avez obtenu votre sujet.",
          className: "bg-green-50 border-green-200 text-green-900",
        });
      },
      onError: (err) => {
        toast({
          title: "Impossible de choisir",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  // Check approval status
  if (user && !user.isApproved && !user.isAdmin) {
    return (
      <Layout>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center max-w-md mx-auto">
          <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mb-6">
            <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
          </div>
          <h1 className="text-3xl font-display font-bold text-foreground mb-4">En attente d'approbation</h1>
          <p className="text-muted-foreground font-hand text-lg">
            Bonjour <span className="font-bold text-primary">{user.username}</span> ! L'administrateur doit valider l'inscription de votre groupe <span className="font-bold text-secondary">{user.groupName}</span> avant que vous puissiez jouer.
          </p>
          <div className="mt-8 p-4 bg-blue-50 text-blue-800 rounded-lg text-sm">
            Cette page se rafraîchit automatiquement...
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-primary tracking-tight">
            Tableau des Sujets
          </h1>
          <p className="text-lg text-muted-foreground font-hand">
            Cliquez sur une carte pour révéler et réserver votre sujet d'exposé.
          </p>
          {!gameStatus?.isStarted && (
            <div className="mt-4 flex items-center justify-center gap-2 text-orange-600 font-bold bg-orange-50 p-2 rounded-full max-w-sm mx-auto">
              <PlayCircle className="w-5 h-5" />
              Le jeu est actuellement en pause
            </div>
          )}
        </div>

        {error && (
          <Alert variant="destructive" className="max-w-2xl mx-auto">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Erreur</AlertTitle>
            <AlertDescription>Impossible de charger les sujets. Vérifiez votre connexion.</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto px-4 pb-12">
            {topics?.map((topic) => (
              <TopicCard
                key={topic.id}
                topic={topic}
                onSelect={handleSelect}
                isPending={isChoosing}
                currentUser={user}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
