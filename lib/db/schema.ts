import {
  pgTable,
  text,
  timestamp,
  boolean,
  numeric,
  integer,
  varchar,
} from "drizzle-orm/pg-core";

// Better Auth Tables
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: boolean("emailVerified").default(false),
  image: text("image"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => user.id),
  accountId: text("accountId").notNull(),
  providerId: text("providerId").notNull(),
  accessToken: text("accessToken"),
  refreshToken: text("refreshToken"),
  idToken: text("idToken"),
  accessTokenExpiresAt: timestamp("accessTokenExpiresAt"),
  refreshTokenExpiresAt: timestamp("refreshTokenExpiresAt"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expiresAt").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

// App Tables
export const predictions = pgTable("predictions", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  radius: numeric("radius"),
  texture: numeric("texture"),
  perimeter: numeric("perimeter"),
  area: numeric("area"),
  smoothness: numeric("smoothness"),
  compactness: numeric("compactness"),
  concavity: numeric("concavity"),
  symmetry: numeric("symmetry"),
  fractalDimension: numeric("fractalDimension"),
  age: integer("age"),
  familyHistory: boolean("familyHistory"),
  hormoneTherapy: boolean("hormoneTherapy"),
  smoking: varchar("smoking"),
  alcohol: varchar("alcohol"),
  exercise: varchar("exercise"),
  bmi: numeric("bmi"),
  riskScore: integer("riskScore"),
  riskCategory: varchar("riskCategory"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const reports = pgTable("reports", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  predictionId: text("predictionId"),
  title: text("title").notNull(),
  content: text("content"),
  format: varchar("format"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const insights = pgTable("insights", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  predictionId: text("predictionId"),
  type: varchar("type"),
  title: text("title"),
  description: text("description"),
  recommendation: text("recommendation"),
  severity: varchar("severity"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const apiKeys = pgTable("api_keys", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull(),
  key: text("key").notNull().unique(),
  name: text("name"),
  lastUsedAt: timestamp("lastUsedAt"),
  rateLimit: integer("rateLimit").default(100),
  createdAt: timestamp("createdAt").defaultNow(),
  expiresAt: timestamp("expiresAt"),
});

// Doctor Finder Tables
export const specialties = pgTable("specialties", {
  id: text("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const doctors = pgTable("doctors", {
  id: text("id").primaryKey(),
  userId: text("userId").references(() => user.id),
  name: text("name").notNull(),
  specialtyId: text("specialtyId").references(() => specialties.id),
  email: text("email"),
  phone: text("phone"),
  bio: text("bio"),
  qualifications: text("qualifications"),
  experience: integer("experience"),
  rating: numeric("rating").default("0"),
  reviewCount: integer("reviewCount").default(0),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  zipCode: text("zipCode"),
  profileImage: text("profileImage"),
  availabilityStart: text("availabilityStart"),
  availabilityEnd: text("availabilityEnd"),
  consultationFee: numeric("consultationFee"),
  isVerified: boolean("isVerified").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const doctorAvailability = pgTable("doctor_availability", {
  id: text("id").primaryKey(),
  doctorId: text("doctorId").notNull().references(() => doctors.id),
  dayOfWeek: integer("dayOfWeek"),
  startTime: text("startTime"),
  endTime: text("endTime"),
  isAvailable: boolean("isAvailable").default(true),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  doctorId: text("doctorId").notNull().references(() => doctors.id),
  appointmentDate: timestamp("appointmentDate").notNull(),
  duration: integer("duration"),
  consultationType: text("consultationType"),
  status: varchar("status").default("scheduled"),
  notes: text("notes"),
  remindAt: timestamp("remindAt"),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow(),
});

export const doctorReviews = pgTable("doctor_reviews", {
  id: text("id").primaryKey(),
  doctorId: text("doctorId").notNull().references(() => doctors.id),
  userId: text("userId").notNull().references(() => user.id),
  rating: integer("rating").notNull(),
  title: text("title"),
  comment: text("comment"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: text("id").primaryKey(),
  userId: text("userId").notNull().references(() => user.id),
  doctorId: text("doctorId").notNull().references(() => doctors.id),
  message: text("message").notNull(),
  senderType: text("senderType"),
  isRead: boolean("isRead").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
});

// Type exports
export type User = typeof user.$inferSelect;
export type NewUser = typeof user.$inferInsert;

export type Prediction = typeof predictions.$inferSelect;
export type NewPrediction = typeof predictions.$inferInsert;

export type Report = typeof reports.$inferSelect;
export type NewReport = typeof reports.$inferInsert;

export type Insight = typeof insights.$inferSelect;
export type NewInsight = typeof insights.$inferInsert;

export type ApiKey = typeof apiKeys.$inferSelect;
export type NewApiKey = typeof apiKeys.$inferInsert;

export type Specialty = typeof specialties.$inferSelect;
export type NewSpecialty = typeof specialties.$inferInsert;

export type Doctor = typeof doctors.$inferSelect;
export type NewDoctor = typeof doctors.$inferInsert;

export type DoctorAvailability = typeof doctorAvailability.$inferSelect;
export type NewDoctorAvailability = typeof doctorAvailability.$inferInsert;

export type Appointment = typeof appointments.$inferSelect;
export type NewAppointment = typeof appointments.$inferInsert;

export type DoctorReview = typeof doctorReviews.$inferSelect;
export type NewDoctorReview = typeof doctorReviews.$inferInsert;

export type ChatMessage = typeof chatMessages.$inferSelect;
export type NewChatMessage = typeof chatMessages.$inferInsert;
