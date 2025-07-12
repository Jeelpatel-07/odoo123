import type { Express } from "express";
import { createServer, type Server } from "http";
import express from "express";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertSkillSchema, insertSwapSchema, insertMessageSchema, insertReviewSchema } from "@shared/schema";
import { z } from "zod";
import multer from "multer";
import path from "path";

const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 25 * 1024 * 1024, // 25MB
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'video/mp4'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'));
    }
  }
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Skills routes
  app.get('/api/skills', async (req, res) => {
    try {
      const { category, search, location, userId, isPublic, limit, offset } = req.query;
      
      const filters = {
        category: category as string,
        search: search as string,
        location: location as string,
        userId: userId as string,
        isPublic: isPublic === 'true' ? true : isPublic === 'false' ? false : undefined,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      };

      const result = await storage.getSkills(filters);
      res.json(result);
    } catch (error) {
      console.error("Error fetching skills:", error);
      res.status(500).json({ message: "Failed to fetch skills" });
    }
  });

  app.get('/api/skills/:id', async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const skill = await storage.getSkill(id);
      
      if (!skill) {
        return res.status(404).json({ message: "Skill not found" });
      }
      
      res.json(skill);
    } catch (error) {
      console.error("Error fetching skill:", error);
      res.status(500).json({ message: "Failed to fetch skill" });
    }
  });

  app.post('/api/skills', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const skillData = insertSkillSchema.parse(req.body);
      
      const skill = await storage.createSkill({ ...skillData, userId });
      res.status(201).json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid skill data", errors: error.errors });
      }
      console.error("Error creating skill:", error);
      res.status(500).json({ message: "Failed to create skill" });
    }
  });

  app.put('/api/skills/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user owns the skill
      const existingSkill = await storage.getSkill(id);
      if (!existingSkill || existingSkill.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this skill" });
      }
      
      const skillData = insertSkillSchema.partial().parse(req.body);
      const skill = await storage.updateSkill(id, skillData);
      res.json(skill);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid skill data", errors: error.errors });
      }
      console.error("Error updating skill:", error);
      res.status(500).json({ message: "Failed to update skill" });
    }
  });

  app.delete('/api/skills/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user owns the skill
      const existingSkill = await storage.getSkill(id);
      if (!existingSkill || existingSkill.userId !== userId) {
        return res.status(403).json({ message: "Not authorized to delete this skill" });
      }
      
      await storage.deleteSkill(id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting skill:", error);
      res.status(500).json({ message: "Failed to delete skill" });
    }
  });

  // Swaps routes
  app.get('/api/swaps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const { status } = req.query;
      
      const swaps = await storage.getSwaps(userId, status as string);
      res.json(swaps);
    } catch (error) {
      console.error("Error fetching swaps:", error);
      res.status(500).json({ message: "Failed to fetch swaps" });
    }
  });

  app.get('/api/swaps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      const swap = await storage.getSwap(id);
      if (!swap) {
        return res.status(404).json({ message: "Swap not found" });
      }
      
      // Check if user is part of the swap
      if (swap.requesterId !== userId && swap.providerId !== userId) {
        return res.status(403).json({ message: "Not authorized to view this swap" });
      }
      
      res.json(swap);
    } catch (error) {
      console.error("Error fetching swap:", error);
      res.status(500).json({ message: "Failed to fetch swap" });
    }
  });

  app.post('/api/swaps', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const swapData = insertSwapSchema.parse({ ...req.body, requesterId: userId });
      
      const swap = await storage.createSwap(swapData);
      res.status(201).json(swap);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid swap data", errors: error.errors });
      }
      console.error("Error creating swap:", error);
      res.status(500).json({ message: "Failed to create swap" });
    }
  });

  app.put('/api/swaps/:id', isAuthenticated, async (req: any, res) => {
    try {
      const id = parseInt(req.params.id);
      const userId = req.user.claims.sub;
      
      // Check if user is part of the swap
      const existingSwap = await storage.getSwap(id);
      if (!existingSwap || (existingSwap.requesterId !== userId && existingSwap.providerId !== userId)) {
        return res.status(403).json({ message: "Not authorized to update this swap" });
      }
      
      const swapData = insertSwapSchema.partial().parse(req.body);
      const swap = await storage.updateSwap(id, swapData);
      res.json(swap);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid swap data", errors: error.errors });
      }
      console.error("Error updating swap:", error);
      res.status(500).json({ message: "Failed to update swap" });
    }
  });

  // Messages routes
  app.get('/api/swaps/:swapId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const swapId = parseInt(req.params.swapId);
      const userId = req.user.claims.sub;
      
      // Check if user is part of the swap
      const swap = await storage.getSwap(swapId);
      if (!swap || (swap.requesterId !== userId && swap.providerId !== userId)) {
        return res.status(403).json({ message: "Not authorized to view messages for this swap" });
      }
      
      const messages = await storage.getMessages(swapId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/swaps/:swapId/messages', isAuthenticated, async (req: any, res) => {
    try {
      const swapId = parseInt(req.params.swapId);
      const userId = req.user.claims.sub;
      
      // Check if user is part of the swap
      const swap = await storage.getSwap(swapId);
      if (!swap || (swap.requesterId !== userId && swap.providerId !== userId)) {
        return res.status(403).json({ message: "Not authorized to send messages for this swap" });
      }
      
      const messageData = insertMessageSchema.parse({
        ...req.body,
        swapId,
        senderId: userId
      });
      
      const message = await storage.createMessage(messageData);
      res.status(201).json(message);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid message data", errors: error.errors });
      }
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Reviews routes
  app.get('/api/reviews', async (req, res) => {
    try {
      const { userId, swapId } = req.query;
      
      const reviews = await storage.getReviews(
        userId as string,
        swapId ? parseInt(swapId as string) : undefined
      );
      res.json(reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      res.status(500).json({ message: "Failed to fetch reviews" });
    }
  });

  app.post('/api/reviews', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const reviewData = insertReviewSchema.parse({ ...req.body, reviewerId: userId });
      
      const review = await storage.createReview(reviewData);
      res.status(201).json(review);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid review data", errors: error.errors });
      }
      console.error("Error creating review:", error);
      res.status(500).json({ message: "Failed to create review" });
    }
  });

  // User stats route
  app.get('/api/users/:userId/stats', async (req, res) => {
    try {
      const userId = req.params.userId;
      const stats = await storage.getUserStats(userId);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // File upload route
  app.post('/api/upload', isAuthenticated, upload.single('file'), async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const file = req.file;
      
      if (!file) {
        return res.status(400).json({ message: "No file uploaded" });
      }
      
      const fileData = {
        userId,
        filename: file.filename,
        originalName: file.originalname,
        mimeType: file.mimetype,
        size: file.size,
        url: `/uploads/${file.filename}`
      };
      
      const savedFile = await storage.createFile(fileData);
      res.status(201).json(savedFile);
    } catch (error) {
      console.error("Error uploading file:", error);
      res.status(500).json({ message: "Failed to upload file" });
    }
  });

  // Serve uploaded files
  app.use('/uploads', express.static('uploads'));

  const httpServer = createServer(app);
  return httpServer;
}
