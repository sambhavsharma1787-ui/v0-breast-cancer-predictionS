import { integer, numeric, pgTable, text, timestamp, boolean } from "drizzle-orm/pg-core"

export const doctors = pgTable("doctors", {
  id: text("id").primaryKey(),
  userId: text("userid"),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone").notNull(),
  specialtyId: text("specialtyid"),
  qualifications: text("qualifications").array(),
  experience: integer("experience"),
  bio: text("bio"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  state: text("state"),
  zipcode: text("zipcode"),
  profileImage: text("profileimage"),
  latitude: numeric("latitude"),
  longitude: numeric("longitude"),
  isVerified: boolean("isverified").default(false),
  rating: numeric("rating"),
  reviewCount: integer("reviewcount").default(0),
  createdAt: timestamp("createdat").defaultNow(),
  updatedAt: timestamp("updatedat").defaultNow(),
})

export type Doctor = typeof doctors.$inferSelect
export type NewDoctor = typeof doctors.$inferInsert
