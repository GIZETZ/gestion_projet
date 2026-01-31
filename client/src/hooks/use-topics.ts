import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useTopics() {
  return useQuery({
    queryKey: [api.topics.list.path],
    queryFn: async () => {
      const res = await fetch(api.topics.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch topics");
      return api.topics.list.responses[200].parse(await res.json());
    },
    refetchInterval: 1000, // Poll every second for real-time updates
  });
}

export function useChooseTopic() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (topicId: number) => {
      const url = buildUrl(api.topics.choose.path, { id: topicId });
      const res = await fetch(url, {
        method: api.topics.choose.method,
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!res.ok) {
        if (res.status === 400) throw new Error("Ce sujet est déjà pris !");
        if (res.status === 403) throw new Error("Vous avez déjà choisi un sujet ou n'avez pas les droits.");
        throw new Error("Impossible de choisir ce sujet");
      }

      return api.topics.choose.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      // Invalidate immediately to update UI
      queryClient.invalidateQueries({ queryKey: [api.topics.list.path] });
    },
  });
}
