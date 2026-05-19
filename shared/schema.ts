import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, jsonb, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table for Replit Auth
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// Users table
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  password: varchar("password"),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  level: integer("level").default(1),
  levelTitle: text("level_title").default("Ocean Explorer"),
  totalDonation: integer("total_donation").default(0),
  coralsAdopted: integer("corals_adopted").default(0),
  locationsVisited: integer("locations_visited").default(0),
  xp: integer("xp").default(0),
  resetToken: varchar("reset_token"),
  resetTokenExpiry: timestamp("reset_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({ 
  id: true, 
  level: true, 
  levelTitle: true, 
  totalDonation: true, 
  coralsAdopted: true, 
  locationsVisited: true, 
  xp: true,
  createdAt: true,
  updatedAt: true,
});
export type InsertUser = z.infer<typeof insertUserSchema>;
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;

// Locations table
export const locations = pgTable("locations", {
  id: varchar("id").primaryKey(),
  name: text("name").notNull(),
  shortName: text("short_name").notNull(),
  region: text("region").notNull(),
  description: text("description").notNull(),
  uniqueFeature: text("unique_feature").notNull(),
  image: text("image").notNull(),
  availableSlots: integer("available_slots").default(100),
  ticketPrice: integer("ticket_price").default(150000),
  features: text("features").array(),
});

export const insertLocationSchema = createInsertSchema(locations).omit({ id: true });
export type InsertLocation = z.infer<typeof insertLocationSchema>;
export type Location = typeof locations.$inferSelect;

// Tickets table
export const tickets = pgTable("tickets", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  locationId: varchar("location_id").notNull(),
  locationName: text("location_name").notNull(),
  region: text("region").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  ticketType: text("ticket_type").notNull(),
  participants: integer("participants").default(1),
  status: text("status").default("active"),
  qrCode: text("qr_code").notNull(),
  paymentMethod: text("payment_method").default("qris"),
  paymentStatus: text("payment_status").default("pending"),
  paymentDeadline: timestamp("payment_deadline"),
  totalPrice: integer("total_price").default(0),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTicketSchema = createInsertSchema(tickets).omit({ id: true, qrCode: true, paymentDeadline: true, createdAt: true });
export type InsertTicket = z.infer<typeof insertTicketSchema>;
export type Ticket = typeof tickets.$inferSelect;

// Trip Buddy table
export const tripBuddies = pgTable("trip_buddies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  initials: text("initials").notNull(),
  destination: text("destination").notNull(),
  dateRange: text("date_range").notNull(),
  budget: text("budget").notNull(),
  tripType: text("trip_type").notNull(),
  participants: integer("participants").default(1),
  maxParticipants: integer("max_participants").default(6),
});

export const insertTripBuddySchema = createInsertSchema(tripBuddies).omit({ id: true });
export type InsertTripBuddy = z.infer<typeof insertTripBuddySchema>;
export type TripBuddy = typeof tripBuddies.$inferSelect;

// Sea-Log Posts table
export const seaLogPosts = pgTable("sea_log_posts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  username: text("username").notNull(),
  initials: text("initials").notNull(),
  location: text("location").notNull(),
  image: text("image").notNull(),
  caption: text("caption").notNull(),
  likes: integer("likes").default(0),
  comments: integer("comments").default(0),
  timeAgo: text("time_ago").default("Baru saja"),
});

export const insertSeaLogPostSchema = createInsertSchema(seaLogPosts).omit({ id: true, likes: true, comments: true, timeAgo: true });
export type InsertSeaLogPost = z.infer<typeof insertSeaLogPostSchema>;
export type SeaLogPost = typeof seaLogPosts.$inferSelect;

// Events table
export const events = pgTable("events", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  date: text("date").notNull(),
  time: text("time").notNull(),
  location: text("location").notNull(),
  type: text("type").notNull(),
  participants: integer("participants").default(0),
  maxParticipants: integer("max_participants"),
  image: text("image"),
});

export const insertEventSchema = createInsertSchema(events).omit({ id: true, participants: true });
export type InsertEvent = z.infer<typeof insertEventSchema>;
export type Event = typeof events.$inferSelect;

// Coral Adoptions table
export const coralAdoptions = pgTable("coral_adoptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  species: text("species").notNull(),
  adoptedBy: text("adopted_by").notNull(),
  adoptedDate: text("adopted_date").notNull(),
  status: text("status").default("growing"),
  x: integer("x").notNull(),
  y: integer("y").notNull(),
});

export const insertCoralAdoptionSchema = createInsertSchema(coralAdoptions).omit({ id: true });
export type InsertCoralAdoption = z.infer<typeof insertCoralAdoptionSchema>;
export type CoralAdoption = typeof coralAdoptions.$inferSelect;

// Location Stamps (visited locations)
export const locationStamps = pgTable("location_stamps", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  locationId: varchar("location_id").notNull(),
  locationName: text("location_name").notNull(),
  region: text("region").notNull(),
  visitDate: text("visit_date").notNull(),
  image: text("image").notNull(),
});

export const insertLocationStampSchema = createInsertSchema(locationStamps).omit({ id: true });
export type InsertLocationStamp = z.infer<typeof insertLocationStampSchema>;
export type LocationStamp = typeof locationStamps.$inferSelect;

// Impact Stats (singleton record)
export const impactStats = pgTable("impact_stats", {
  id: varchar("id").primaryKey().default("main"),
  totalPnbp: text("total_pnbp").default("Rp 2.4 Miliar"),
  totalPnbpChange: text("total_pnbp_change").default("+18%"),
  coralsAdopted: integer("corals_adopted").default(1247),
  coralsChange: text("corals_change").default("+42 bulan ini"),
  patrolsFunded: integer("patrols_funded").default(342),
  patrolsChange: text("patrols_change").default("+28 bulan ini"),
  consciousTourists: integer("conscious_tourists").default(24893),
  touristsChange: text("tourists_change").default("+2,847 bulan ini"),
});

export type ImpactStats = typeof impactStats.$inferSelect;
