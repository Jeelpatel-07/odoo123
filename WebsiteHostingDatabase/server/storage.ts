import {
  users,
  skills,
  swaps,
  messages,
  reviews,
  files,
  type User,
  type UpsertUser,
  type InsertSkill,
  type Skill,
  type InsertSwap,
  type Swap,
  type InsertMessage,
  type Message,
  type InsertReview,
  type Review,
  type InsertFile,
  type File,
} from "@shared/schema";
import { db } from "./db";
import { eq, and, or, ilike, desc, asc, count, avg } from "drizzle-orm";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Skill operations
  getSkills(filters?: {
    category?: string;
    search?: string;
    location?: string;
    userId?: string;
    isPublic?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ skills: (Skill & { user: User })[], total: number }>;
  getSkill(id: number): Promise<(Skill & { user: User }) | undefined>;
  createSkill(skill: InsertSkill & { userId: string }): Promise<Skill>;
  updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill>;
  deleteSkill(id: number): Promise<void>;
  
  // Swap operations
  getSwaps(userId?: string, status?: string): Promise<(Swap & { 
    requester: User; 
    provider: User; 
    skill: Skill & { user: User };
  })[]>;
  getSwap(id: number): Promise<(Swap & { 
    requester: User; 
    provider: User; 
    skill: Skill & { user: User };
  }) | undefined>;
  createSwap(swap: InsertSwap): Promise<Swap>;
  updateSwap(id: number, swap: Partial<InsertSwap>): Promise<Swap>;
  
  // Message operations
  getMessages(swapId: number): Promise<(Message & { sender: User })[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  
  // Review operations
  getReviews(userId?: string, swapId?: number): Promise<(Review & { reviewer: User; reviewee: User })[]>;
  createReview(review: InsertReview): Promise<Review>;
  getUserStats(userId: string): Promise<{
    totalSwaps: number;
    completedSwaps: number;
    averageRating: number;
    totalHours: number;
  }>;
  
  // File operations
  createFile(file: InsertFile & { userId: string }): Promise<File>;
  getFile(id: number): Promise<File | undefined>;
  deleteFile(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Skill operations
  async getSkills(filters?: {
    category?: string;
    search?: string;
    location?: string;
    userId?: string;
    isPublic?: boolean;
    limit?: number;
    offset?: number;
  }): Promise<{ skills: (Skill & { user: User })[], total: number }> {
    const conditions = [];
    
    if (filters?.category) {
      conditions.push(eq(skills.category, filters.category));
    }
    
    if (filters?.search) {
      conditions.push(
        or(
          ilike(skills.name, `%${filters.search}%`),
          ilike(skills.description, `%${filters.search}%`)
        )
      );
    }
    
    if (filters?.location) {
      conditions.push(ilike(skills.location, `%${filters.location}%`));
    }
    
    if (filters?.userId) {
      conditions.push(eq(skills.userId, filters.userId));
    }
    
    if (filters?.isPublic !== undefined) {
      conditions.push(eq(skills.isPublic, filters.isPublic));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const [skillsResult, totalResult] = await Promise.all([
      db
        .select()
        .from(skills)
        .innerJoin(users, eq(skills.userId, users.id))
        .where(whereClause)
        .orderBy(desc(skills.createdAt))
        .limit(filters?.limit || 20)
        .offset(filters?.offset || 0),
      db
        .select({ count: count() })
        .from(skills)
        .innerJoin(users, eq(skills.userId, users.id))
        .where(whereClause)
    ]);

    return {
      skills: skillsResult.map(row => ({ ...row.skills, user: row.users })),
      total: totalResult[0].count
    };
  }

  async getSkill(id: number): Promise<(Skill & { user: User }) | undefined> {
    const [result] = await db
      .select()
      .from(skills)
      .innerJoin(users, eq(skills.userId, users.id))
      .where(eq(skills.id, id));
    
    return result ? { ...result.skills, user: result.users } : undefined;
  }

  async createSkill(skill: InsertSkill & { userId: string }): Promise<Skill> {
    const [newSkill] = await db
      .insert(skills)
      .values(skill)
      .returning();
    return newSkill;
  }

  async updateSkill(id: number, skill: Partial<InsertSkill>): Promise<Skill> {
    const [updatedSkill] = await db
      .update(skills)
      .set({ ...skill, updatedAt: new Date() })
      .where(eq(skills.id, id))
      .returning();
    return updatedSkill;
  }

  async deleteSkill(id: number): Promise<void> {
    await db.delete(skills).where(eq(skills.id, id));
  }

  // Swap operations
  async getSwaps(userId?: string, status?: string): Promise<(Swap & { 
    requester: User; 
    provider: User; 
    skill: Skill & { user: User };
  })[]> {
    const conditions = [];
    
    if (userId) {
      conditions.push(
        or(
          eq(swaps.requesterId, userId),
          eq(swaps.providerId, userId)
        )
      );
    }
    
    if (status) {
      conditions.push(eq(swaps.status, status));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const result = await db
      .select()
      .from(swaps)
      .innerJoin(users, eq(swaps.requesterId, users.id))
      .innerJoin(users, eq(swaps.providerId, users.id))
      .innerJoin(skills, eq(swaps.skillId, skills.id))
      .innerJoin(users, eq(skills.userId, users.id))
      .where(whereClause)
      .orderBy(desc(swaps.createdAt));

    // This is a simplified version - in production you'd need proper joins
    return result.map(row => ({
      ...row.swaps,
      requester: row.users,
      provider: row.users,
      skill: { ...row.skills, user: row.users }
    }));
  }

  async getSwap(id: number): Promise<(Swap & { 
    requester: User; 
    provider: User; 
    skill: Skill & { user: User };
  }) | undefined> {
    // Simplified - in production you'd need proper joins
    const [result] = await db
      .select()
      .from(swaps)
      .where(eq(swaps.id, id));
    
    if (!result) return undefined;
    
    const [requester, provider, skill] = await Promise.all([
      this.getUser(result.requesterId),
      this.getUser(result.providerId),
      this.getSkill(result.skillId)
    ]);

    return {
      ...result,
      requester: requester!,
      provider: provider!,
      skill: skill!
    };
  }

  async createSwap(swap: InsertSwap): Promise<Swap> {
    const [newSwap] = await db
      .insert(swaps)
      .values(swap)
      .returning();
    return newSwap;
  }

  async updateSwap(id: number, swap: Partial<InsertSwap>): Promise<Swap> {
    const [updatedSwap] = await db
      .update(swaps)
      .set({ ...swap, updatedAt: new Date() })
      .where(eq(swaps.id, id))
      .returning();
    return updatedSwap;
  }

  // Message operations
  async getMessages(swapId: number): Promise<(Message & { sender: User })[]> {
    const result = await db
      .select()
      .from(messages)
      .innerJoin(users, eq(messages.senderId, users.id))
      .where(eq(messages.swapId, swapId))
      .orderBy(asc(messages.createdAt));

    return result.map(row => ({ ...row.messages, sender: row.users }));
  }

  async createMessage(message: InsertMessage): Promise<Message> {
    const [newMessage] = await db
      .insert(messages)
      .values(message)
      .returning();
    return newMessage;
  }

  // Review operations
  async getReviews(userId?: string, swapId?: number): Promise<(Review & { reviewer: User; reviewee: User })[]> {
    const conditions = [];
    
    if (userId) {
      conditions.push(eq(reviews.revieweeId, userId));
    }
    
    if (swapId) {
      conditions.push(eq(reviews.swapId, swapId));
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    
    const result = await db
      .select()
      .from(reviews)
      .innerJoin(users, eq(reviews.reviewerId, users.id))
      .innerJoin(users, eq(reviews.revieweeId, users.id))
      .where(whereClause)
      .orderBy(desc(reviews.createdAt));

    return result.map(row => ({
      ...row.reviews,
      reviewer: row.users,
      reviewee: row.users
    }));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [newReview] = await db
      .insert(reviews)
      .values(review)
      .returning();
    return newReview;
  }

  async getUserStats(userId: string): Promise<{
    totalSwaps: number;
    completedSwaps: number;
    averageRating: number;
    totalHours: number;
  }> {
    const [swapStats] = await db
      .select({
        total: count(),
        completed: count(eq(swaps.status, 'completed'))
      })
      .from(swaps)
      .where(
        or(
          eq(swaps.requesterId, userId),
          eq(swaps.providerId, userId)
        )
      );

    const [ratingStats] = await db
      .select({
        average: avg(reviews.rating)
      })
      .from(reviews)
      .where(eq(reviews.revieweeId, userId));

    return {
      totalSwaps: swapStats.total,
      completedSwaps: swapStats.completed,
      averageRating: Number(ratingStats.average) || 0,
      totalHours: 0 // This would need to be calculated based on session data
    };
  }

  // File operations
  async createFile(file: InsertFile & { userId: string }): Promise<File> {
    const [newFile] = await db
      .insert(files)
      .values(file)
      .returning();
    return newFile;
  }

  async getFile(id: number): Promise<File | undefined> {
    const [file] = await db
      .select()
      .from(files)
      .where(eq(files.id, id));
    return file;
  }

  async deleteFile(id: number): Promise<void> {
    await db.delete(files).where(eq(files.id, id));
  }
}

export const storage = new DatabaseStorage();
