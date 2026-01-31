import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";

export function useAdminUsers() {
  return useQuery({
    queryKey: [api.admin.listUsers.path],
    queryFn: async () => {
      const res = await fetch(api.admin.listUsers.path);
      if (!res.ok) throw new Error("Failed to fetch users");
      return api.admin.listUsers.responses[200].parse(await res.json());
    },
  });
}

export function useApproveUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, approved }: { id: number; approved: boolean }) => {
      const url = buildUrl(api.admin.approveUser.path, { id });
      const res = await fetch(url, {
        method: api.admin.approveUser.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ approved }),
      });

      if (!res.ok) throw new Error("Failed to update user status");
      return api.admin.approveUser.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.admin.listUsers.path] });
    },
  });
}

export function useResetGame() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async () => {
      const res = await fetch(api.admin.resetGame.path, {
        method: api.admin.resetGame.method,
      });

      if (!res.ok) throw new Error("Failed to reset game");
      return api.admin.resetGame.responses[200].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.topics.list.path] });
    },
  });
}
