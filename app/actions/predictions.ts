"use server"

import { auth } from "@/lib/auth"
import { db } from "@/lib/db"
import { predictions, insights } from "@/lib/db/schema"
import { eq, desc, and } from "drizzle-orm"
import { headers } from "next/headers"
import { revalidatePath } from "next/cache"
import { nanoid } from "nanoid"

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error("Unauthorized")
  return session.user.id
}

interface CreatePredictionInput {
  radius: number
  texture: number
  perimeter: number
  area: number
  smoothness: number
  compactness: number
  concavity: number
  symmetry: number
  fractalDimension: number
  age: number
  familyHistory: boolean
  hormoneTherapy: boolean
  smoking: string
  alcohol: string
  exercise: string
  bmi: number
  riskScore: number
  riskCategory: string
}

export async function createPrediction(input: CreatePredictionInput) {
  const userId = await getUserId()

  const prediction = await db.insert(predictions).values({
    id: nanoid(),
    userId,
    ...input,
  }).returning()

  revalidatePath("/dashboard")
  revalidatePath("/predictions")
  return prediction[0]
}

export async function getPredictions() {
  const userId = await getUserId()

  return db
    .select()
    .from(predictions)
    .where(eq(predictions.userId, userId))
    .orderBy(desc(predictions.createdAt))
}

export async function getPrediction(id: string) {
  const userId = await getUserId()

  const result = await db
    .select()
    .from(predictions)
    .where(and(eq(predictions.id, id), eq(predictions.userId, userId)))
    .limit(1)

  return result[0] || null
}

export async function deletePrediction(id: string) {
  const userId = await getUserId()

  await db
    .delete(predictions)
    .where(and(eq(predictions.id, id), eq(predictions.userId, userId)))

  revalidatePath("/dashboard")
  revalidatePath("/predictions")
}

export async function getPredictionStats() {
  const userId = await getUserId()

  const allPredictions = await db
    .select()
    .from(predictions)
    .where(eq(predictions.userId, userId))

  if (allPredictions.length === 0) {
    return {
      totalPredictions: 0,
      averageRiskScore: 0,
      highRiskCount: 0,
      moderateRiskCount: 0,
      lowRiskCount: 0,
      trendingRisk: null,
    }
  }

  const riskCounts = {
    high: 0,
    moderate: 0,
    low: 0,
  }

  let totalRiskScore = 0

  allPredictions.forEach((pred) => {
    totalRiskScore += pred.riskScore || 0
    const category = pred.riskCategory?.toLowerCase()
    if (category === "high") riskCounts.high++
    else if (category === "moderate") riskCounts.moderate++
    else if (category === "low") riskCounts.low++
  })

  const recentPredictions = allPredictions.slice(0, 2)
  let trendingRisk = null
  if (recentPredictions.length === 2) {
    const diff = (recentPredictions[0].riskScore || 0) - (recentPredictions[1].riskScore || 0)
    trendingRisk = diff > 0 ? "increasing" : diff < 0 ? "decreasing" : "stable"
  }

  return {
    totalPredictions: allPredictions.length,
    averageRiskScore: Math.round(totalRiskScore / allPredictions.length),
    highRiskCount: riskCounts.high,
    moderateRiskCount: riskCounts.moderate,
    lowRiskCount: riskCounts.low,
    trendingRisk,
  }
}

export async function compareTopPredictions(count: number = 5) {
  const userId = await getUserId()

  return db
    .select()
    .from(predictions)
    .where(eq(predictions.userId, userId))
    .orderBy(desc(predictions.createdAt))
    .limit(count)
}

interface CreateInsightInput {
  predictionId: string
  type: string
  title: string
  description: string
  recommendation: string
  severity: "low" | "medium" | "high"
}

export async function createInsight(input: CreateInsightInput) {
  const userId = await getUserId()

  const insight = await db.insert(insights).values({
    id: nanoid(),
    userId,
    ...input,
  }).returning()

  revalidatePath("/dashboard")
  return insight[0]
}

export async function getInsights() {
  const userId = await getUserId()

  return db
    .select()
    .from(insights)
    .where(eq(insights.userId, userId))
    .orderBy(desc(insights.createdAt))
}

export async function deleteInsight(id: string) {
  const userId = await getUserId()

  await db
    .delete(insights)
    .where(and(eq(insights.id, id), eq(insights.userId, userId)))

  revalidatePath("/dashboard")
}
