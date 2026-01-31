import { z } from "zod";
import { insertUserSchema, users, topics, loginSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
  }),
  unauthorized: z.object({
    message: z.string(),
  }),
  forbidden: z.object({
    message: z.string(),
  }),
};

export const api = {
  auth: {
    register: {
      method: "POST" as const,
      path: "/api/register",
      input: insertUserSchema,
      responses: {
        201: z.custom<typeof users.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    login: {
      method: "POST" as const,
      path: "/api/login",
      input: loginSchema,
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
        403: errorSchemas.forbidden, // Pour compte non approuvé
      },
    },
    logout: {
      method: "POST" as const,
      path: "/api/logout",
      responses: {
        200: z.object({ message: z.string() }),
      },
    },
    me: {
      method: "GET" as const,
      path: "/api/me",
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  admin: {
    listUsers: {
      method: "GET" as const,
      path: "/api/admin/users",
      responses: {
        200: z.array(z.custom<typeof users.$inferSelect>()),
        403: errorSchemas.forbidden,
      },
    },
    approveUser: {
      method: "PATCH" as const,
      path: "/api/admin/users/:id/approve",
      input: z.object({ approved: z.boolean() }),
      responses: {
        200: z.custom<typeof users.$inferSelect>(),
        403: errorSchemas.forbidden,
      },
    },
    resetGame: {
      method: "POST" as const,
      path: "/api/admin/reset",
      responses: {
        200: z.object({ message: z.string() }),
        403: errorSchemas.forbidden,
      },
    },
    toggleGame: {
      method: "POST" as const,
      path: "/api/admin/toggle-game",
      input: z.object({ isStarted: z.boolean() }),
      responses: {
        200: z.object({ isStarted: z.boolean() }),
        403: errorSchemas.forbidden,
      },
    },
    getGameStatus: {
      method: "GET" as const,
      path: "/api/admin/game-status",
      responses: {
        200: z.object({ isStarted: z.boolean() }),
      },
    },
    downloadReport: {
      method: "GET" as const,
      path: "/api/admin/report",
      responses: {
        200: z.any(),
        403: errorSchemas.forbidden,
      },
    },
  },
  topics: {
    list: {
      method: "GET" as const,
      path: "/api/topics",
      responses: {
        200: z.array(z.custom<typeof topics.$inferSelect & { assignedUser?: typeof users.$inferSelect | null }>()),
      },
    },
    choose: {
      method: "POST" as const,
      path: "/api/topics/:id/choose",
      responses: {
        200: z.custom<typeof topics.$inferSelect>(),
        400: errorSchemas.validation, // Déjà pris
        403: errorSchemas.forbidden, // Pas le droit (déjà choisi un autre, etc)
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
