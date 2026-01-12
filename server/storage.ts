import { db } from "./db";
import {
  users,
  clients,
  sessions_data,
  type User,
  type Client,
  type Session,
  type CreateClientRequest,
  type CreateSessionRequest,
} from "@shared/schema";
import { eq } from "drizzle-orm";
import { authStorage, type IAuthStorage } from "./replit_integrations/auth/storage";

export interface IStorage extends IAuthStorage {
  getClients(trainerId: string): Promise<Client[]>;
  getClient(id: number): Promise<Client | undefined>;
  createClient(trainerId: string, client: CreateClientRequest): Promise<Client>;
  updateClient(id: number, updates: Partial<CreateClientRequest>): Promise<Client | undefined>;
  deleteClient(id: number): Promise<boolean>;
  getSessions(trainerId: string): Promise<Session[]>;
  createSession(trainerId: string, session: CreateSessionRequest): Promise<Session>;
  updateSessionPaid(id: number, paid: boolean): Promise<Session | undefined>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string) { return authStorage.getUser(id); }
  async upsertUser(user: any) { return authStorage.upsertUser(user); }

  async getClients(trainerId: string): Promise<Client[]> {
    return await db.select().from(clients).where(eq(clients.trainerId, trainerId));
  }

  async getClient(id: number): Promise<Client | undefined> {
    const [client] = await db.select().from(clients).where(eq(clients.id, id));
    return client;
  }

  async createClient(trainerId: string, client: CreateClientRequest): Promise<Client> {
    const [newClient] = await db.insert(clients).values({ ...client, trainerId }).returning();
    return newClient;
  }

  async updateClient(id: number, updates: Partial<CreateClientRequest>): Promise<Client | undefined> {
    const [updated] = await db.update(clients).set(updates).where(eq(clients.id, id)).returning();
    return updated;
  }

  async deleteClient(id: number): Promise<boolean> {
    const result = await db.delete(clients).where(eq(clients.id, id)).returning();
    return result.length > 0;
  }

  async getSessions(trainerId: string): Promise<Session[]> {
    return await db.select().from(sessions_data).where(eq(sessions_data.trainerId, trainerId));
  }

  async createSession(trainerId: string, session: CreateSessionRequest): Promise<Session> {
    const [newSession] = await db.insert(sessions_data).values({ ...session, trainerId }).returning();
    return newSession;
  }

  async updateSessionPaid(id: number, paid: boolean): Promise<Session | undefined> {
    const [updated] = await db.update(sessions_data).set({ paid }).where(eq(sessions_data.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
