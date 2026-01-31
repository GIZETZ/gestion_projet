import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLogin, useRegister } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Loader2, ArrowRight } from "lucide-react";

export default function AuthPage() {
  const { toast } = useToast();
  const { mutate: login, isPending: isLoginPending } = useLogin();
  const { mutate: register, isPending: isRegisterPending } = useRegister();
  const [activeTab, setActiveTab] = useState("login");

  // Login Form
  const loginForm = useForm({
    defaultValues: { username: "", password: "" },
  });

  const onLogin = (data: any) => {
    login(data, {
      onError: (err) => {
        toast({
          title: "Erreur de connexion",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  // Register Form
  const registerForm = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: { username: "", groupName: "", groupMembers: "", password: "" },
  });

  const onRegister = (data: any) => {
    register(data, {
      onSuccess: () => {
        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé. En attente d'approbation.",
        });
        // Optionally switch to login or handle redirect in hook
      },
      onError: (err) => {
        toast({
          title: "Erreur d'inscription",
          description: err.message,
          variant: "destructive",
        });
      },
    });
  };

  return (
    <Layout>
      <div className="flex min-h-[80vh] items-center justify-center">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-display font-bold text-primary mb-2">Choix de Sujet</h1>
            <p className="text-muted-foreground font-hand text-lg">
              Inscrivez votre groupe et tentez votre chance !
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-4 h-12">
              <TabsTrigger value="login" className="text-base font-medium">Connexion</TabsTrigger>
              <TabsTrigger value="register" className="text-base font-medium">Inscription</TabsTrigger>
            </TabsList>
            
            <TabsContent value="login">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Connexion Chef de Groupe</CardTitle>
                  <CardDescription>Entrez vos identifiants pour accéder au tableau.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...loginForm}>
                    <form onSubmit={loginForm.handleSubmit(onLogin)} className="space-y-4">
                      <FormField
                        control={loginForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du Chef</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Kouamé Soro Atta" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={loginForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className="w-full mt-2 font-bold" type="submit" disabled={isLoginPending}>
                        {isLoginPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                        Se Connecter
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="register">
              <Card className="border-2 shadow-lg">
                <CardHeader>
                  <CardTitle>Nouveau Groupe</CardTitle>
                  <CardDescription>Enregistrez votre équipe pour participer.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...registerForm}>
                    <form onSubmit={registerForm.handleSubmit(onRegister)} className="space-y-4">
                      <FormField
                        control={registerForm.control}
                        name="username"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du Chef</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Marie Curie" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="groupName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nom du Groupe</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Les Tchaipos" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="groupMembers"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Membres du groupe</FormLabel>
                            <FormControl>
                              <Input placeholder="Ex: Jean, Marc, Sophie" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={registerForm.control}
                        name="password"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Mot de passe</FormLabel>
                            <FormControl>
                              <Input type="password" placeholder="••••••" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button className="w-full mt-2 font-bold bg-secondary hover:bg-secondary/90 text-secondary-foreground" type="submit" disabled={isRegisterPending}>
                        {isRegisterPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                        S'inscrire
                      </Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </Layout>
  );
}
