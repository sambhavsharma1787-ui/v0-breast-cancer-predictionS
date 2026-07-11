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
