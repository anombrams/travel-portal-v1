import type { Express } from "express";
import { createServer, type Server } from "http";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./auth";
import {
  insertTicketSchema,
  insertTripBuddySchema,
  insertSeaLogPostSchema,
  insertCoralAdoptionSchema,
  insertLocationStampSchema,
} from "@shared/schema";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "Nama depan wajib diisi").max(50, "Nama depan terlalu panjang").optional(),
  lastName: z.string().min(1, "Nama belakang wajib diisi").max(50, "Nama belakang terlalu panjang").optional(),
}).refine(data => data.firstName !== undefined || data.lastName !== undefined, {
  message: "Minimal satu field harus diisi",
});

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Password saat ini wajib diisi"),
  newPassword: z.string().min(6, "Password baru minimal 6 karakter"),
  confirmPassword: z.string().min(1, "Konfirmasi password wajib diisi"),
}).refine(data => data.newPassword === data.confirmPassword, {
  message: "Password baru tidak cocok dengan konfirmasi",
  path: ["confirmPassword"],
});

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {
  // =====================
  // AUTH SETUP - Email/Password
  // =====================
  await setupAuth(app);

  // =====================
  // LOCATIONS API
  // =====================
  
  // Get all locations
  app.get("/api/locations", async (req, res) => {
    const locations = await storage.getLocations();
    res.json(locations);
  });

  // Get single location
  app.get("/api/locations/:id", async (req, res) => {
    const location = await storage.getLocation(req.params.id);
    if (!location) {
      return res.status(404).json({ error: "Location not found" });
    }
    res.json(location);
  });

  // =====================
  // USER API
  // =====================

  // Get demo user or authenticated user
  app.get("/api/user/me", async (req: any, res) => {
    const userId = req.user?.id || "demo-user";
    const user = await storage.getUser(userId);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    const { password: _, ...userWithoutPassword } = user;
    res.json(userWithoutPassword);
  });

  // Update user profile
  app.patch("/api/user/me", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Tidak terautentikasi" });
      }

      const result = updateProfileSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0]?.message || "Data tidak valid";
        return res.status(400).json({ error: firstError });
      }

      const { firstName, lastName } = result.data;
      const updateData: { firstName?: string; lastName?: string } = {};
      
      if (firstName !== undefined) updateData.firstName = firstName.trim();
      if (lastName !== undefined) updateData.lastName = lastName.trim();

      const user = await storage.updateUser(userId, updateData);
      if (!user) {
        return res.status(404).json({ error: "User tidak ditemukan" });
      }

      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({ error: "Gagal memperbarui profil" });
    }
  });

  // Change password
  app.post("/api/user/change-password", isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user?.id;
      if (!userId) {
        return res.status(401).json({ error: "Tidak terautentikasi" });
      }

      const result = changePasswordSchema.safeParse(req.body);
      if (!result.success) {
        const firstError = result.error.errors[0]?.message || "Data tidak valid";
        return res.status(400).json({ error: firstError });
      }

      const { currentPassword, newPassword } = result.data;

      // Get user with password
      const user = await storage.getUser(userId);
      if (!user || !user.password) {
        return res.status(404).json({ error: "User tidak ditemukan" });
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password);
      if (!isValidPassword) {
        return res.status(400).json({ error: "Password saat ini salah" });
      }

      // Hash new password
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      // Update password
      const updatedUser = await storage.updateUser(userId, { password: hashedPassword });
      if (!updatedUser) {
        return res.status(500).json({ error: "Gagal mengubah password" });
      }

      res.json({ message: "Password berhasil diubah" });
    } catch (error) {
      console.error("Change password error:", error);
      res.status(500).json({ error: "Gagal mengubah password" });
    }
  });

  // =====================
  // TICKETS API
  // =====================

  // Get user tickets
  app.get("/api/tickets", async (req, res) => {
    const tickets = await storage.getTicketsByUser("demo-user");
    res.json(tickets);
  });

  // Get single ticket
  app.get("/api/tickets/:id", async (req, res) => {
    const ticket = await storage.getTicket(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(ticket);
  });

  // Create ticket
  app.post("/api/tickets", async (req, res) => {
    const result = insertTicketSchema.safeParse({ ...req.body, userId: "demo-user" });
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    
    // Check if location has available slots
    const location = await storage.getLocation(result.data.locationId);
    if (!location) {
      return res.status(404).json({ error: "Lokasi tidak ditemukan" });
    }
    
    const participants = result.data.participants ?? 1;
    if ((location.availableSlots ?? 0) < participants) {
      return res.status(400).json({ error: "Slot tidak mencukupi" });
    }
    
    // Set payment deadline to 7 hours from now
    const paymentDeadline = new Date();
    paymentDeadline.setHours(paymentDeadline.getHours() + 7);
    
    // Create ticket with pending payment status
    const ticket = await storage.createTicketWithPayment({
      ...result.data,
      paymentDeadline,
    });
    
    // Decrement slots (reserved)
    await storage.decrementLocationSlots(result.data.locationId, participants);
    
    res.status(201).json(ticket);
  });

  // Confirm payment
  app.patch("/api/tickets/:id/confirm-payment", async (req, res) => {
    const ticket = await storage.getTicket(req.params.id);
    if (!ticket) {
      return res.status(404).json({ error: "Tiket tidak ditemukan" });
    }
    
    // Check if payment deadline has passed
    if (ticket.paymentDeadline && new Date() > new Date(ticket.paymentDeadline)) {
      return res.status(400).json({ error: "Waktu pembayaran telah habis" });
    }
    
    const updatedTicket = await storage.confirmPayment(req.params.id);
    if (!updatedTicket) {
      return res.status(404).json({ error: "Gagal mengkonfirmasi pembayaran" });
    }
    res.json(updatedTicket);
  });

  // Update ticket status
  app.patch("/api/tickets/:id/status", async (req, res) => {
    const { status } = req.body;
    if (!status) {
      return res.status(400).json({ error: "Status is required" });
    }
    const ticket = await storage.updateTicketStatus(req.params.id, status);
    if (!ticket) {
      return res.status(404).json({ error: "Ticket not found" });
    }
    res.json(ticket);
  });

  // =====================
  // TRIP BUDDY API
  // =====================

  // Get all trip buddies
  app.get("/api/trip-buddies", async (req, res) => {
    const trips = await storage.getTripBuddies();
    res.json(trips);
  });

  // Get single trip
  app.get("/api/trip-buddies/:id", async (req, res) => {
    const trip = await storage.getTripBuddy(req.params.id);
    if (!trip) {
      return res.status(404).json({ error: "Trip not found" });
    }
    res.json(trip);
  });

  // Create trip
  app.post("/api/trip-buddies", async (req: any, res) => {
    const userId = req.user?.id || "demo-user";
    const result = insertTripBuddySchema.safeParse({ ...req.body, userId });
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const trip = await storage.createTripBuddy(result.data);
    res.status(201).json(trip);
  });

  // Join trip
  app.post("/api/trip-buddies/:id/join", async (req, res) => {
    const trip = await storage.joinTripBuddy(req.params.id);
    if (!trip) {
      return res.status(400).json({ error: "Cannot join trip (not found or full)" });
    }
    res.json(trip);
  });

  // =====================
  // SEA-LOG POSTS API
  // =====================

  // Get all posts
  app.get("/api/sea-log", async (req, res) => {
    const posts = await storage.getSeaLogPosts();
    res.json(posts);
  });

  // Get single post
  app.get("/api/sea-log/:id", async (req, res) => {
    const post = await storage.getSeaLogPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  });

  // Create post
  app.post("/api/sea-log", async (req, res) => {
    const result = insertSeaLogPostSchema.safeParse({ ...req.body, userId: "demo-user" });
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const post = await storage.createSeaLogPost(result.data);
    res.status(201).json(post);
  });

  // Like post
  app.post("/api/sea-log/:id/like", async (req, res) => {
    const post = await storage.likeSeaLogPost(req.params.id);
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }
    res.json(post);
  });

  // =====================
  // EVENTS API
  // =====================

  // Get all events
  app.get("/api/events", async (req, res) => {
    const events = await storage.getEvents();
    res.json(events);
  });

  // Get single event
  app.get("/api/events/:id", async (req, res) => {
    const event = await storage.getEvent(req.params.id);
    if (!event) {
      return res.status(404).json({ error: "Event not found" });
    }
    res.json(event);
  });

  // Register for event
  app.post("/api/events/:id/register", async (req, res) => {
    const event = await storage.registerForEvent(req.params.id);
    if (!event) {
      return res.status(400).json({ error: "Cannot register (not found or full)" });
    }
    res.json(event);
  });

  // =====================
  // CORAL ADOPTIONS API
  // =====================

  // Get all coral adoptions
  app.get("/api/corals", async (req, res) => {
    const corals = await storage.getCoralAdoptions();
    res.json(corals);
  });

  // Get user's coral adoptions
  app.get("/api/corals/me", async (req, res) => {
    const corals = await storage.getCoralAdoptionsByUser("demo-user");
    res.json(corals);
  });

  // Adopt coral
  app.post("/api/corals", async (req, res) => {
    const result = insertCoralAdoptionSchema.safeParse({ ...req.body, userId: "demo-user" });
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const coral = await storage.createCoralAdoption(result.data);
    res.status(201).json(coral);
  });

  // =====================
  // LOCATION STAMPS API
  // =====================

  // Get user's stamps
  app.get("/api/stamps", async (req, res) => {
    const stamps = await storage.getStampsByUser("demo-user");
    res.json(stamps);
  });

  // Create stamp
  app.post("/api/stamps", async (req, res) => {
    const result = insertLocationStampSchema.safeParse({ ...req.body, userId: "demo-user" });
    if (!result.success) {
      return res.status(400).json({ error: result.error.errors });
    }
    const stamp = await storage.createStamp(result.data);
    res.status(201).json(stamp);
  });

  // =====================
  // IMPACT STATS API
  // =====================

  // Get impact statistics
  app.get("/api/impact", async (req, res) => {
    const stats = await storage.getImpactStats();
    res.json(stats);
  });

  // =====================
  // LIVE TICKER API
  // =====================

  // Get live ticker data
  app.get("/api/ticker", async (req, res) => {
    const tickerItems = [
      { id: 1, text: "Total PNBP Hari Ini: Rp 15.400.000 (Mendanai 3 Patroli di Laut Sawu)", icon: "shield" },
      { id: 2, text: "12 Karang Baru Diadopsi Minggu Ini", icon: "waves" },
      { id: 3, text: "Raja Ampat: Sisa 24 Slot Selam Hari Ini", icon: "anchor" },
      { id: 4, text: "Total Wisatawan Bulan Ini: 2,847 Pelancong Sadar Lingkungan", icon: "waves" },
    ];
    res.json(tickerItems);
  });

  // =====================
  // SPOTLIGHT API
  // =====================

  // Get spotlight items
  app.get("/api/spotlight", async (req, res) => {
    const spotlightItems = [
      {
        id: 1,
        image: "/raja-ampat.png",
        title: "Guardian of the Month",
        subtitle: "Ibu Siti, penjaga terumbu karang Raja Ampat selama 15 tahun",
        badge: "Featured",
      },
      {
        id: 2,
        image: "/banda.png",
        title: "Best Shot by User",
        subtitle: "Foto oleh @diver_andi: Sunrise di Gunung Api Banda",
        badge: "Community",
      },
      {
        id: 3,
        image: "/gili.png",
        title: "Event Terdekat",
        subtitle: "Beach Cleanup Gili Matra - 20 Des 2024",
        badge: "Upcoming",
      },
    ];
    res.json(spotlightItems);
  });

  // =====================
  // FUND ALLOCATION API
  // =====================

  // Get fund allocation data
  app.get("/api/fund-allocation", async (req, res) => {
    const allocation = [
      { category: "Patroli Laut", percentage: 35, amount: "Rp 840 Juta" },
      { category: "Restorasi Karang", percentage: 25, amount: "Rp 600 Juta" },
      { category: "Riset & Monitoring", percentage: 20, amount: "Rp 480 Juta" },
      { category: "Edukasi Masyarakat", percentage: 15, amount: "Rp 360 Juta" },
      { category: "Operasional", percentage: 5, amount: "Rp 120 Juta" },
    ];
    res.json(allocation);
  });

  // =====================
  // RESEARCH HIGHLIGHTS API
  // =====================

  // Get research highlights
  app.get("/api/research", async (req, res) => {
    const research = [
      {
        id: "research-1",
        title: "Populasi Pari Manta Raja Ampat",
        summary: "Peningkatan 12% populasi pari manta dalam 2 tahun terakhir berkat pembatasan wisatawan.",
        stat: "+12%",
        statLabel: "Populasi",
      },
      {
        id: "research-2",
        title: "Kesehatan Terumbu Karang Banda",
        summary: "78% terumbu karang dalam kondisi sehat, meningkat dari 65% di tahun 2022.",
        stat: "78%",
        statLabel: "Sehat",
      },
      {
        id: "research-3",
        title: "Migrasi Cetacea Laut Sawu",
        summary: "23 spesies cetacea teridentifikasi, termasuk 5 spesies langka.",
        stat: "23",
        statLabel: "Spesies",
      },
    ];
    res.json(research);
  });

  return httpServer;
}
