import { z } from "zod";
import { insertClientSchema } from "./schema";

export const errorSchemas = {
  validation: z.object({ message: z.string(), field: z.string().optional() }),
  notFound: z.object({ message: z.string() }),
  unauthorized: z.object({ message: z.string() }),
};

const sessionInputSchema = z.object({
  clientId: z.coerce.number(),
  date: z.coerce.date(),
  notes: z.string().nullable().optional(),
  duration: z.coerce.number().default(60),
});

export const api = {
  auth: {
    me: {
      method: "GET" as const,
      path: "/api/me",
      responses: {
        200: z.any(),
        401: errorSchemas.unauthorized,
      },
    },
  },
  clients: {
    list: {
      method: "GET" as const,
      path: "/api/clients",
      responses: { 200: z.array(z.any()) },
    },
    create: {
      method: "POST" as const,
      path: "/api/clients",
      input: insertClientSchema,
      responses: { 201: z.any(), 400: errorSchemas.validation },
    },
    update: {
      method: "PATCH" as const,
      path: "/api/clients/:id",
      input: insertClientSchema.partial(),
      responses: { 200: z.any(), 404: errorSchemas.notFound },
    },
    delete: {
      method: "DELETE" as const,
      path: "/api/clients/:id",
      responses: { 204: z.void(), 404: errorSchemas.notFound },
    },
  },
  sessions: {
    list: {
      method: "GET" as const,
      path: "/api/sessions",
      responses: { 200: z.array(z.any()) },
    },
    create: {
      method: "POST" as const,
      path: "/api/sessions",
      input: sessionInputSchema,
      responses: { 201: z.any(), 400: errorSchemas.validation },
    },
    updatePaid: {
      method: "PATCH" as const,
      path: "/api/sessions/:id/paid",
      input: z.object({ paid: z.boolean() }),
      responses: { 200: z.any(), 404: errorSchemas.notFound },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url = url.replace(`:${key}`, String(value));
    });
  }
  return url;
}
