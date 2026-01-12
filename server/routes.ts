import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, registerAuthRoutes } from "./replit_integrations/auth";
import { api } from "@shared/routes";
import { z } from "zod";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // Setup Auth
  await setupAuth(app);
  registerAuthRoutes(app);

  // Client Routes
  app.get(api.clients.list.path, async (req: any, res) => {
    try {
      const trainerId = req.user.claims.sub;
      const clients = await storage.getClients(trainerId);
      res.json(clients);
    } catch (err) {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  app.post(api.clients.create.path, async (req: any, res) => {
    try {
      const trainerId = req.user.claims.sub;
      const input = api.clients.create.input.parse(req.body);
      const client = await storage.createClient(trainerId, input);
      res.status(201).json(client);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  app.patch(api.clients.update.path, async (req: any, res) => {
    try {
      const id = Number(req.params.id);
      const input = api.clients.update.input.parse(req.body);
      const client = await storage.updateClient(id, input);
      if (!client) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.json(client);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(400).json({ message: "Invalid request" });
    }
  });

  app.delete(api.clients.delete.path, async (req: any, res) => {
    try {
      const id = Number(req.params.id);
      const deleted = await storage.deleteClient(id);
      if (!deleted) {
        return res.status(404).json({ message: "Client not found" });
      }
      res.status(204).send();
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  // Session Routes
  app.get(api.sessions.list.path, async (req: any, res) => {
    try {
      const trainerId = req.user.claims.sub;
      const sessions = await storage.getSessions(trainerId);
      res.json(sessions);
    } catch (err) {
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  app.post(api.sessions.create.path, async (req: any, res) => {
    try {
      const trainerId = req.user.claims.sub;
      const input = api.sessions.create.input.parse(req.body);
      const session = await storage.createSession(trainerId, input);
      res.status(201).json(session);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({ message: err.errors[0].message });
      }
      res.status(401).json({ message: "Unauthorized" });
    }
  });

  app.patch(api.sessions.updatePaid.path, async (req: any, res) => {
    try {
      const id = Number(req.params.id);
      const { paid } = api.sessions.updatePaid.input.parse(req.body);
      const session = await storage.updateSessionPaid(id, paid);
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      res.json(session);
    } catch (err) {
      res.status(400).json({ message: "Invalid request" });
    }
  });

  return httpServer;
}
