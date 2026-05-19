import {
  users,
  locations,
  tickets,
  tripBuddies,
  seaLogPosts,
  events,
  coralAdoptions,
  locationStamps,
  impactStats,
  type User,
  type UpsertUser,
  type Location,
  type Ticket,
  type TripBuddy,
  type SeaLogPost,
  type Event,
  type CoralAdoption,
  type LocationStamp,
  type ImpactStats,
  type InsertTicket as SchemaInsertTicket,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

type InsertTicket = SchemaInsertTicket;
type InsertTripBuddy = Omit<TripBuddy, 'id'>;
type InsertSeaLogPost = Omit<SeaLogPost, 'id' | 'likes' | 'comments' | 'timeAgo'>;
type InsertCoralAdoption = Omit<CoralAdoption, 'id'>;
type InsertLocationStamp = Omit<LocationStamp, 'id'>;

export interface IStorage {
  // Users
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  getUserByResetToken(token: string): Promise<User | undefined>;
  createUser(user: { email: string; password: string; firstName?: string | null; lastName?: string | null }): Promise<User>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUser(id: string, data: Partial<User>): Promise<User | undefined>;
  updateUserPassword(id: string, hashedPassword: string): Promise<User | undefined>;
  setResetToken(id: string, token: string, expiry: Date): Promise<void>;
  clearResetToken(id: string): Promise<void>;

  // Locations
  getLocations(): Promise<Location[]>;
  getLocation(id: string): Promise<Location | undefined>;

  // Tickets
  getTicketsByUser(userId: string): Promise<Ticket[]>;
  getTicket(id: string): Promise<Ticket | undefined>;
  createTicket(ticket: InsertTicket): Promise<Ticket>;
  createTicketWithPayment(ticket: InsertTicket & { paymentDeadline: Date }): Promise<Ticket>;
  updateTicketStatus(id: string, status: string): Promise<Ticket | undefined>;
  confirmPayment(id: string): Promise<Ticket | undefined>;

  // Trip Buddies
  getTripBuddies(): Promise<TripBuddy[]>;
  getTripBuddy(id: string): Promise<TripBuddy | undefined>;
  createTripBuddy(trip: InsertTripBuddy): Promise<TripBuddy>;
  joinTripBuddy(id: string): Promise<TripBuddy | undefined>;

  // Sea-Log Posts
  getSeaLogPosts(): Promise<SeaLogPost[]>;
  getSeaLogPost(id: string): Promise<SeaLogPost | undefined>;
  createSeaLogPost(post: InsertSeaLogPost): Promise<SeaLogPost>;
  likeSeaLogPost(id: string): Promise<SeaLogPost | undefined>;

  // Events
  getEvents(): Promise<Event[]>;
  getEvent(id: string): Promise<Event | undefined>;
  registerForEvent(id: string): Promise<Event | undefined>;

  // Coral Adoptions
  getCoralAdoptions(): Promise<CoralAdoption[]>;
  getCoralAdoptionsByUser(userId: string): Promise<CoralAdoption[]>;
  createCoralAdoption(coral: InsertCoralAdoption): Promise<CoralAdoption>;

  // Location Stamps
  getStampsByUser(userId: string): Promise<LocationStamp[]>;
  createStamp(stamp: InsertLocationStamp): Promise<LocationStamp>;

  // Impact Stats
  getImpactStats(): Promise<ImpactStats>;

  // Seeding
  seedData(): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  // Users
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user || undefined;
  }

  async createUser(userData: { email: string; password: string; firstName?: string | null; lastName?: string | null }): Promise<User> {
    const [user] = await db.insert(users).values({
      email: userData.email,
      password: userData.password,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
    }).returning();
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

  async updateUser(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async getUserByResetToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.resetToken, token));
    return user || undefined;
  }

  async updateUserPassword(id: string, hashedPassword: string): Promise<User | undefined> {
    const [user] = await db.update(users).set({ password: hashedPassword, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user || undefined;
  }

  async setResetToken(id: string, token: string, expiry: Date): Promise<void> {
    await db.update(users).set({ resetToken: token, resetTokenExpiry: expiry }).where(eq(users.id, id));
  }

  async clearResetToken(id: string): Promise<void> {
    await db.update(users).set({ resetToken: null, resetTokenExpiry: null }).where(eq(users.id, id));
  }

  // Locations
  async getLocations(): Promise<Location[]> {
    return db.select().from(locations);
  }

  async getLocation(id: string): Promise<Location | undefined> {
    const [location] = await db.select().from(locations).where(eq(locations.id, id));
    return location || undefined;
  }

  async decrementLocationSlots(locationId: string, count: number = 1): Promise<Location | undefined> {
    const location = await this.getLocation(locationId);
    if (!location) return undefined;
    
    const currentSlots = location.availableSlots ?? 0;
    const newSlots = Math.max(0, currentSlots - count);
    
    const [updated] = await db.update(locations)
      .set({ availableSlots: newSlots })
      .where(eq(locations.id, locationId))
      .returning();
    return updated || undefined;
  }

  // Tickets
  async getTicketsByUser(userId: string): Promise<Ticket[]> {
    return db.select().from(tickets).where(eq(tickets.userId, userId)).orderBy(desc(tickets.createdAt));
  }

  async getTicket(id: string): Promise<Ticket | undefined> {
    const [ticket] = await db.select().from(tickets).where(eq(tickets.id, id));
    return ticket || undefined;
  }

  async createTicket(ticket: InsertTicket): Promise<Ticket> {
    const qrCode = `SEAPARK-${ticket.locationId.toUpperCase().slice(0, 2)}-${Date.now()}`;
    const [newTicket] = await db.insert(tickets).values({
      ...ticket,
      qrCode,
      participants: ticket.participants ?? 1,
      status: ticket.status ?? "active",
    }).returning();
    return newTicket;
  }

  async createTicketWithPayment(ticket: InsertTicket & { paymentDeadline: Date }): Promise<Ticket> {
    const qrCode = `SEAPARK-${ticket.locationId.toUpperCase().slice(0, 2)}-${Date.now()}`;
    const [newTicket] = await db.insert(tickets).values({
      userId: ticket.userId,
      locationId: ticket.locationId,
      locationName: ticket.locationName,
      region: ticket.region,
      date: ticket.date,
      time: ticket.time,
      ticketType: ticket.ticketType,
      participants: ticket.participants ?? 1,
      status: "active",
      qrCode,
      paymentMethod: ticket.paymentMethod ?? "qris",
      paymentStatus: "pending",
      paymentDeadline: ticket.paymentDeadline,
      totalPrice: ticket.totalPrice ?? 0,
    }).returning();
    return newTicket;
  }

  async confirmPayment(id: string): Promise<Ticket | undefined> {
    const [ticket] = await db.update(tickets)
      .set({ paymentStatus: "paid" })
      .where(eq(tickets.id, id))
      .returning();
    return ticket || undefined;
  }

  async updateTicketStatus(id: string, status: string): Promise<Ticket | undefined> {
    const [ticket] = await db.update(tickets).set({ status }).where(eq(tickets.id, id)).returning();
    return ticket || undefined;
  }

  // Trip Buddies
  async getTripBuddies(): Promise<TripBuddy[]> {
    return db.select().from(tripBuddies);
  }

  async getTripBuddy(id: string): Promise<TripBuddy | undefined> {
    const [trip] = await db.select().from(tripBuddies).where(eq(tripBuddies.id, id));
    return trip || undefined;
  }

  async createTripBuddy(trip: InsertTripBuddy): Promise<TripBuddy> {
    const [newTrip] = await db.insert(tripBuddies).values({
      ...trip,
      participants: trip.participants ?? 1,
      maxParticipants: trip.maxParticipants ?? 6,
    }).returning();
    return newTrip;
  }

  async joinTripBuddy(id: string): Promise<TripBuddy | undefined> {
    const trip = await this.getTripBuddy(id);
    if (!trip || (trip.participants ?? 0) >= (trip.maxParticipants ?? 6)) return undefined;
    const [updated] = await db.update(tripBuddies)
      .set({ participants: (trip.participants ?? 0) + 1 })
      .where(eq(tripBuddies.id, id))
      .returning();
    return updated || undefined;
  }

  // Sea-Log Posts
  async getSeaLogPosts(): Promise<SeaLogPost[]> {
    return db.select().from(seaLogPosts);
  }

  async getSeaLogPost(id: string): Promise<SeaLogPost | undefined> {
    const [post] = await db.select().from(seaLogPosts).where(eq(seaLogPosts.id, id));
    return post || undefined;
  }

  async createSeaLogPost(post: InsertSeaLogPost): Promise<SeaLogPost> {
    const [newPost] = await db.insert(seaLogPosts).values({
      ...post,
      likes: 0,
      comments: 0,
      timeAgo: "Baru saja",
    }).returning();
    return newPost;
  }

  async likeSeaLogPost(id: string): Promise<SeaLogPost | undefined> {
    const post = await this.getSeaLogPost(id);
    if (!post) return undefined;
    const [updated] = await db.update(seaLogPosts)
      .set({ likes: (post.likes ?? 0) + 1 })
      .where(eq(seaLogPosts.id, id))
      .returning();
    return updated || undefined;
  }

  // Events
  async getEvents(): Promise<Event[]> {
    return db.select().from(events);
  }

  async getEvent(id: string): Promise<Event | undefined> {
    const [event] = await db.select().from(events).where(eq(events.id, id));
    return event || undefined;
  }

  async registerForEvent(id: string): Promise<Event | undefined> {
    const event = await this.getEvent(id);
    if (!event) return undefined;
    if (event.maxParticipants && (event.participants ?? 0) >= event.maxParticipants) return undefined;
    const [updated] = await db.update(events)
      .set({ participants: (event.participants ?? 0) + 1 })
      .where(eq(events.id, id))
      .returning();
    return updated || undefined;
  }

  // Coral Adoptions
  async getCoralAdoptions(): Promise<CoralAdoption[]> {
    return db.select().from(coralAdoptions);
  }

  async getCoralAdoptionsByUser(userId: string): Promise<CoralAdoption[]> {
    return db.select().from(coralAdoptions).where(eq(coralAdoptions.userId, userId));
  }

  async createCoralAdoption(coral: InsertCoralAdoption): Promise<CoralAdoption> {
    const [newCoral] = await db.insert(coralAdoptions).values({
      ...coral,
      status: coral.status ?? "growing",
    }).returning();
    return newCoral;
  }

  // Location Stamps
  async getStampsByUser(userId: string): Promise<LocationStamp[]> {
    return db.select().from(locationStamps).where(eq(locationStamps.userId, userId));
  }

  async createStamp(stamp: InsertLocationStamp): Promise<LocationStamp> {
    const [newStamp] = await db.insert(locationStamps).values(stamp).returning();
    return newStamp;
  }

  // Impact Stats
  async getImpactStats(): Promise<ImpactStats> {
    const [stats] = await db.select().from(impactStats).where(eq(impactStats.id, "main"));
    if (stats) return stats;
    
    // Create default stats if not exists
    const [newStats] = await db.insert(impactStats).values({
      id: "main",
      totalPnbp: "Rp 2.4 Miliar",
      totalPnbpChange: "+18%",
      coralsAdopted: 1247,
      coralsChange: "+42 bulan ini",
      patrolsFunded: 342,
      patrolsChange: "+28 bulan ini",
      consciousTourists: 24893,
      touristsChange: "+2,847 bulan ini",
    }).returning();
    return newStats;
  }

  // Seed initial data
  async seedData(): Promise<void> {
    // Upsert all 20 locations - insert new ones, skip existing ones to preserve their slot counts
    const allLocations = [
      {
        id: "banda",
        name: "TWP Laut Banda",
        shortName: "Banda",
        region: "Maluku",
        description: "Kepulauan rempah bersejarah dengan terumbu karang yang masih perawan dan peninggalan kolonial.",
        uniqueFeature: "Time Travel Slider: Sejarah vs Alam",
        image: "/banda.png",
        availableSlots: 45,
        ticketPrice: 150000,
        features: ["Sejarah", "Diving", "Snorkeling"],
      },
      {
        id: "sawu",
        name: "TNP Laut Sawu",
        shortName: "Sawu",
        region: "Nusa Tenggara Timur",
        description: "Koridor migrasi paus dan lumba-lumba terbesar di Indonesia.",
        uniqueFeature: "Cetacean Symphony: Suara Paus",
        image: "/sawu.png",
        availableSlots: 30,
        ticketPrice: 175000,
        features: ["Paus", "Dolphin", "Penelitian"],
      },
      {
        id: "raja-ampat",
        name: "TWP Raja Ampat",
        shortName: "Raja Ampat",
        region: "Papua Barat",
        description: "Pusat keanekaragaman hayati laut dunia dengan lebih dari 1.500 spesies ikan.",
        uniqueFeature: "Scarcity Barometer: Kuota Harian",
        image: "/raja-ampat.png",
        availableSlots: 24,
        ticketPrice: 500000,
        features: ["Diving", "Karang", "Biodiversitas"],
      },
      {
        id: "gili-matra",
        name: "TWP Gili Matra",
        shortName: "Gili",
        region: "Nusa Tenggara Barat",
        description: "Tiga pulau surga dengan pantai pasir putih dan habitat penyu.",
        uniqueFeature: "Live Cam Penyu",
        image: "/gili.png",
        availableSlots: 100,
        ticketPrice: 100000,
        features: ["Penyu", "Pantai", "Snorkeling"],
      },
      {
        id: "wakatobi",
        name: "TNP Wakatobi",
        shortName: "Wakatobi",
        region: "Sulawesi Tenggara",
        description: "Taman nasional dengan keanekaragaman terumbu karang tertinggi di dunia dan 750 spesies karang.",
        uniqueFeature: "Coral Triangle Center: Pusat Segitiga Karang",
        image: "/wakatobi.png",
        availableSlots: 60,
        ticketPrice: 250000,
        features: ["Diving", "Snorkeling", "Karang"],
      },
      {
        id: "komodo",
        name: "TNP Komodo",
        shortName: "Komodo",
        region: "Nusa Tenggara Timur",
        description: "Rumah komodo dan surga diving dengan manta ray dan arus kuat untuk drift diving.",
        uniqueFeature: "Manta Point: Titik Manta",
        image: "/komodo.png",
        availableSlots: 40,
        ticketPrice: 350000,
        features: ["Manta", "Diving", "Komodo"],
      },
      {
        id: "bunaken",
        name: "TNP Bunaken",
        shortName: "Bunaken",
        region: "Sulawesi Utara",
        description: "Wall diving spektakuler dengan dinding terumbu tegak lurus hingga kedalaman 1.300 meter.",
        uniqueFeature: "Wall Diving: Dinding Vertikal",
        image: "/bunaken.png",
        availableSlots: 55,
        ticketPrice: 200000,
        features: ["Wall Dive", "Penyu", "Terumbu"],
      },
      {
        id: "derawan",
        name: "TWP Derawan",
        shortName: "Derawan",
        region: "Kalimantan Timur",
        description: "Kepulauan eksotis dengan danau ubur-ubur tak menyengat dan habitat penyu hijau terbesar.",
        uniqueFeature: "Jellyfish Lake: Danau Ubur-ubur",
        image: "/derawan.png",
        availableSlots: 35,
        ticketPrice: 275000,
        features: ["Ubur-ubur", "Penyu", "Pulau"],
      },
      {
        id: "karimunjawa",
        name: "TN Karimunjawa",
        shortName: "Karimunjawa",
        region: "Jawa Tengah",
        description: "Kepulauan tropis dengan 27 pulau, terumbu karang cantik dan habitat penyu hijau.",
        uniqueFeature: "Shark Pool: Kolam Hiu Alami",
        image: "/karimunjawa.png",
        availableSlots: 80,
        ticketPrice: 200000,
        features: ["Snorkeling", "Island Hopping", "Penyu"],
      },
      {
        id: "togian",
        name: "TN Kepulauan Togian",
        shortName: "Togian",
        region: "Sulawesi Tengah",
        description: "Surga tersembunyi dengan 3 jenis terumbu karang dalam satu kawasan: fringing, barrier, dan atol.",
        uniqueFeature: "Ubur-ubur Tak Menyengat",
        image: "/togian.png",
        availableSlots: 45,
        ticketPrice: 275000,
        features: ["Diving", "Jellyfish Lake", "Coral Garden"],
      },
      {
        id: "takabonerate",
        name: "TN Taka Bonerate",
        shortName: "Taka Bonerate",
        region: "Sulawesi Selatan",
        description: "Atol terbesar ketiga di dunia dengan keanekaragaman hayati laut yang luar biasa.",
        uniqueFeature: "Atol Raksasa 220.000 Ha",
        image: "/takabonerate.png",
        availableSlots: 35,
        ticketPrice: 300000,
        features: ["Atol", "Diving", "Snorkeling"],
      },
      {
        id: "morotai",
        name: "TWP Pulau Morotai",
        shortName: "Morotai",
        region: "Maluku Utara",
        description: "Pulau bersejarah PD II dengan bangkai pesawat dan kapal selam di bawah laut.",
        uniqueFeature: "Wreck Diving PD II",
        image: "/morotai.png",
        availableSlots: 40,
        ticketPrice: 325000,
        features: ["Wreck Diving", "Sejarah", "Surfing"],
      },
      {
        id: "weh",
        name: "TWP Pulau Weh",
        shortName: "Pulau Weh",
        region: "Aceh",
        description: "Titik paling barat Indonesia dengan Tugu Kilometer Nol dan diving spot kelas dunia.",
        uniqueFeature: "Km 0 Indonesia",
        image: "/weh.png",
        availableSlots: 55,
        ticketPrice: 250000,
        features: ["Diving", "Snorkeling", "Km 0"],
      },
      {
        id: "cenderawasih",
        name: "TN Teluk Cenderawasih",
        shortName: "Cenderawasih",
        region: "Papua",
        description: "Taman laut terbesar Indonesia dengan whale shark yang jinak dan bisa diajak berenang.",
        uniqueFeature: "Whale Shark Encounter",
        image: "/cenderawasih.png",
        availableSlots: 30,
        ticketPrice: 500000,
        features: ["Whale Shark", "Diving", "Coral"],
      },
      {
        id: "seribu",
        name: "TN Kepulauan Seribu",
        shortName: "Kep. Seribu",
        region: "DKI Jakarta",
        description: "Gugusan 110 pulau di dekat Jakarta, cocok untuk liburan singkat dengan snorkeling dan island hopping.",
        uniqueFeature: "Pulau Harapan & Pramuka",
        image: "/seribu.png",
        availableSlots: 120,
        ticketPrice: 150000,
        features: ["Island Hopping", "Snorkeling", "Mangrove"],
      },
      {
        id: "anambas",
        name: "TWP Kepulauan Anambas",
        shortName: "Anambas",
        region: "Kepulauan Riau",
        description: "Kepulauan tersembunyi dengan laguna biru kristal dan terumbu karang pristine.",
        uniqueFeature: "Laguna Biru Alami",
        image: "/anambas.png",
        availableSlots: 35,
        ticketPrice: 350000,
        features: ["Laguna", "Diving", "Snorkeling"],
      },
      {
        id: "padaido",
        name: "TWP Kepulauan Padaido",
        shortName: "Padaido",
        region: "Papua",
        description: "Surga diving dengan visibility hingga 40 meter dan terumbu karang yang masih perawan.",
        uniqueFeature: "Visibility 40 Meter",
        image: "/padaido.png",
        availableSlots: 25,
        ticketPrice: 400000,
        features: ["Diving", "Coral", "Pristine"],
      },
      {
        id: "biak",
        name: "TWP Pulau Biak",
        shortName: "Biak",
        region: "Papua",
        description: "Destinasi diving dengan gua bawah laut, bangkai kapal PD II, dan budaya Biak yang unik.",
        uniqueFeature: "Gua Bawah Laut",
        image: "/biak.png",
        availableSlots: 40,
        ticketPrice: 375000,
        features: ["Cave Diving", "Wreck", "Budaya"],
      },
      {
        id: "tanjung-lesung",
        name: "TWP Tanjung Lesung",
        shortName: "Tanjung Lesung",
        region: "Banten",
        description: "Pantai berpasir putih di ujung barat Jawa dengan anak Krakatau sebagai latar belakang.",
        uniqueFeature: "View Anak Krakatau",
        image: "/tanjung-lesung.png",
        availableSlots: 100,
        ticketPrice: 175000,
        features: ["Pantai", "Krakatau", "Snorkeling"],
      },
      {
        id: "waigeo",
        name: "TWP Waigeo Barat",
        shortName: "Waigeo",
        region: "Papua Barat Daya",
        description: "Rumah piaynemo dengan laguna-laguna ikonik dan hutan mangrove yang lebat.",
        uniqueFeature: "Pianemo Viewpoint",
        image: "/waigeo.png",
        availableSlots: 45,
        ticketPrice: 450000,
        features: ["Pianemo", "Mangrove", "Kayaking"],
      },
    ];
    
    // Insert locations - skip if already exists to preserve slot counts
    await db.insert(locations).values(allLocations).onConflictDoNothing();

    // Check if demo user already exists before seeding other data
    const existingUsers = await db.select().from(users);
    if (existingUsers.length > 0) return;

    // Seed demo user
    await db.insert(users).values({
      id: "demo-user",
      email: "demo@seapark.id",
      password: "$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJptJ/op0lSsvqNu9le", // hashed "password123"
      firstName: "Andi",
      lastName: "Wijaya",
      level: 3,
      levelTitle: "Coral Guardian",
      totalDonation: 500000,
      coralsAdopted: 2,
      locationsVisited: 3,
      xp: 750,
    });

    // Seed trip buddies
    await db.insert(tripBuddies).values([
      {
        id: "trip-1",
        userId: "user-1",
        name: "Andi Saputra",
        initials: "AS",
        destination: "Raja Ampat",
        dateRange: "20-25 Des 2024",
        budget: "Rp 8-10 Juta",
        tripType: "open-trip",
        participants: 3,
        maxParticipants: 6,
      },
      {
        id: "trip-2",
        userId: "user-2",
        name: "Maya Rahmawati",
        initials: "MR",
        destination: "Banda Neira",
        dateRange: "10-15 Jan 2025",
        budget: "Rp 5-7 Juta",
        tripType: "share-cost",
        participants: 2,
        maxParticipants: 4,
      },
      {
        id: "trip-3",
        userId: "user-3",
        name: "Budi Santoso",
        initials: "BS",
        destination: "Gili Matra",
        dateRange: "25-28 Des 2024",
        budget: "Rp 2-3 Juta",
        tripType: "open-trip",
        participants: 5,
        maxParticipants: 8,
      },
    ]);

    // Seed sea-log posts
    await db.insert(seaLogPosts).values([
      {
        id: "post-1",
        userId: "user-1",
        username: "diver_maya",
        initials: "DM",
        location: "Raja Ampat",
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=600&h=400&fit=crop",
        caption: "Terumbu karang masih sehat! Melihat 3 pari manta hari ini",
        likes: 247,
        comments: 18,
        timeAgo: "2 jam lalu",
      },
      {
        id: "post-2",
        userId: "user-2",
        username: "ocean_andi",
        initials: "OA",
        location: "Banda Neira",
        image: "https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=600&h=400&fit=crop",
        caption: "Sunrise dari Gunung Api. Banda never disappoints!",
        likes: 189,
        comments: 12,
        timeAgo: "5 jam lalu",
      },
      {
        id: "post-3",
        userId: "user-3",
        username: "sea_explorer",
        initials: "SE",
        location: "Laut Sawu",
        image: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=600&h=400&fit=crop",
        caption: "Bertemu pod paus pilot! Pengalaman tak terlupakan",
        likes: 412,
        comments: 34,
        timeAgo: "1 hari lalu",
      },
    ]);

    // Seed events
    await db.insert(events).values([
      {
        id: "event-1",
        title: "Webinar: Mengenal Ekosistem Laut Banda",
        date: "15 Des 2024",
        time: "19:00 WIB",
        location: "Online (Zoom)",
        type: "webinar",
        participants: 45,
        maxParticipants: 100,
        image: "https://images.unsplash.com/photo-1583212292454-1fe6229603b7?w=400&h=250&fit=crop",
      },
      {
        id: "event-2",
        title: "Beach Cleanup Gili Trawangan",
        date: "20 Des 2024",
        time: "07:00 WITA",
        location: "Gili Trawangan",
        type: "cleanup",
        participants: 28,
        maxParticipants: 50,
        image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=250&fit=crop",
      },
      {
        id: "event-3",
        title: "Dive Trip Raja Ampat",
        date: "5-10 Jan 2025",
        time: "Full Day",
        location: "Raja Ampat",
        type: "dive",
        participants: 8,
        maxParticipants: 12,
        image: "https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=400&h=250&fit=crop",
      },
    ]);

    // Seed coral adoptions
    await db.insert(coralAdoptions).values([
      { id: "c1", userId: "user-1", species: "Acropora", adoptedBy: "Andi S.", adoptedDate: "15 Nov 2024", status: "healthy", x: 25, y: 30 },
      { id: "c2", userId: "user-2", species: "Pocillopora", adoptedBy: "Maya R.", adoptedDate: "20 Nov 2024", status: "growing", x: 45, y: 45 },
      { id: "c3", userId: "user-3", species: "Porites", adoptedBy: "Budi W.", adoptedDate: "1 Dec 2024", status: "healthy", x: 65, y: 35 },
      { id: "c4", userId: "user-4", species: "Montipora", adoptedBy: "Sari K.", adoptedDate: "5 Dec 2024", status: "recovering", x: 35, y: 60 },
      { id: "c5", userId: "demo-user", species: "Stylophora", adoptedBy: "Andi W.", adoptedDate: "8 Dec 2024", status: "growing", x: 75, y: 55 },
      { id: "c6", userId: "demo-user", species: "Acropora", adoptedBy: "Andi W.", adoptedDate: "10 Dec 2024", status: "healthy", x: 55, y: 70 },
    ]);

    // Seed tickets for demo user
    await db.insert(tickets).values([
      {
        id: "ticket-1",
        userId: "demo-user",
        locationId: "raja-ampat",
        locationName: "TWP Raja Ampat",
        region: "Papua Barat",
        date: "20 Des 2024",
        time: "08:00 WIT",
        ticketType: "Wisata Selam",
        participants: 2,
        status: "active",
        qrCode: "SEAPARK-RA-2024-001",
      },
      {
        id: "ticket-2",
        userId: "demo-user",
        locationId: "gili-matra",
        locationName: "TWP Gili Matra",
        region: "Lombok, NTB",
        date: "15 Nov 2024",
        time: "09:00 WITA",
        ticketType: "Wisata Umum",
        participants: 1,
        status: "used",
        qrCode: "SEAPARK-GM-2024-002",
      },
    ]);

    // Seed location stamps for demo user
    await db.insert(locationStamps).values([
      {
        id: "stamp-1",
        userId: "demo-user",
        locationId: "raja-ampat",
        locationName: "Raja Ampat",
        region: "Papua Barat",
        visitDate: "20 Nov 2024",
        image: "/raja-ampat.png",
      },
      {
        id: "stamp-2",
        userId: "demo-user",
        locationId: "gili-matra",
        locationName: "Gili Matra",
        region: "NTB",
        visitDate: "5 Sep 2024",
        image: "/gili.png",
      },
      {
        id: "stamp-3",
        userId: "demo-user",
        locationId: "banda",
        locationName: "Banda Neira",
        region: "Maluku",
        visitDate: "12 Jul 2024",
        image: "/banda.png",
      },
    ]);

    // Seed impact stats
    await db.insert(impactStats).values({
      id: "main",
      totalPnbp: "Rp 2.4 Miliar",
      totalPnbpChange: "+18%",
      coralsAdopted: 1247,
      coralsChange: "+42 bulan ini",
      patrolsFunded: 342,
      patrolsChange: "+28 bulan ini",
      consciousTourists: 24893,
      touristsChange: "+2,847 bulan ini",
    });

    console.log("Database seeded successfully!");
  }
}

export const storage = new DatabaseStorage();
