import { Layout } from "@/components/Layout";
import { useAdminUsers, useApproveUser, useResetGame, useGameStatus, useToggleGame } from "@/hooks/use-admin";
import { UserWithTopic } from "@shared/schema";
import { api } from "@shared/routes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Check, X, RotateCcw, Loader2, Play, Square, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AdminPage() {
  const { data: users, isLoading } = useAdminUsers();
  const { mutate: approveUser, isPending: isApproving } = useApproveUser();
  const { mutate: resetGame, isPending: isResetting } = useResetGame();
  const { data: gameStatus } = useGameStatus();
  const { mutate: toggleGame, isPending: isToggling } = useToggleGame();
  const { toast } = useToast();

  const handleApprove = (id: number, approved: boolean) => {
    approveUser({ id, approved }, {
      onSuccess: () => {
        toast({
          title: approved ? "Utilisateur approuvé" : "Accès révoqué",
          className: approved ? "bg-green-50" : "bg-red-50",
        });
      },
    });
  };

  const handleReset = () => {
    resetGame(undefined, {
      onSuccess: () => {
        toast({
          title: "Jeu réinitialisé",
          description: "Tous les sujets sont à nouveau disponibles.",
        });
      },
    });
  };

  const handleDownloadReport = () => {
    window.location.href = api.admin.downloadReport.path;
  };

  return (
    <Layout>
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b pb-6">
          <div>
            <h1 className="text-3xl font-display font-bold text-foreground">Administration</h1>
            <p className="text-muted-foreground">Gérez les accès et l'état du jeu.</p>
          </div>
          
          <div className="flex gap-2">
            <Button 
              variant={gameStatus?.isStarted ? "outline" : "default"}
              className="gap-2"
              onClick={() => toggleGame(!gameStatus?.isStarted)}
              disabled={isToggling}
            >
              {gameStatus?.isStarted ? (
                <><Square className="w-4 h-4" /> Arrêter le Jeu</>
              ) : (
                <><Play className="w-4 h-4" /> Lancer le Jeu</>
              )}
            </Button>

            <Button variant="outline" className="gap-2" onClick={handleDownloadReport}>
              <Download className="w-4 h-4" />
              Rapport
            </Button>

            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                  <RotateCcw className="w-4 h-4" />
                  Réinitialiser
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr ?</AlertDialogTitle>
                  <AlertDialogDescription>
                    Cette action va désassigner tous les sujets. Les groupes devront choisir à nouveau.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleReset} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                    {isResetting ? "Réinitialisation..." : "Confirmer"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
          <div className="p-6 border-b bg-muted/30">
            <h2 className="font-bold text-xl">Utilisateurs Inscrits</h2>
          </div>
          
          {isLoading ? (
            <div className="p-8 flex justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Membres du groupe (Chef précisé)</TableHead>
                  <TableHead>Groupe</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Sujet</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(users as UserWithTopic[])?.filter(u => !u.isAdmin).map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      <div className="flex flex-col">
                        <span className="font-bold text-primary">Chef: {user.username}</span>
                        <span className="text-xs text-muted-foreground">Membres: {user.groupMembers}</span>
                      </div>
                    </TableCell>
                    <TableCell>{user.groupName}</TableCell>
                    <TableCell>
                      {user.isApproved ? (
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-100 border-green-200">Approuvé</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-100 border-orange-200">En attente</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {user.topicTitle ? (
                        <Badge variant="outline" className="border-primary/30 text-primary font-medium">
                          {user.topicTitle}
                        </Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">Aucun sujet choisi</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {user.isApproved ? (
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleApprove(user.id, false)}
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          disabled={isApproving}
                        >
                          <X className="w-4 h-4 mr-1" />
                          Révoquer
                        </Button>
                      ) : (
                        <Button 
                          size="sm" 
                          onClick={() => handleApprove(user.id, true)}
                          className="bg-green-600 hover:bg-green-700 text-white"
                          disabled={isApproving}
                        >
                          <Check className="w-4 h-4 mr-1" />
                          Approuver
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
                {users?.filter(u => !u.isAdmin).length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                      Aucun groupe inscrit pour le moment.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </div>
      </div>
    </Layout>
  );
}
