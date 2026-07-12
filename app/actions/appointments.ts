'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { appointments, doctors, doctorReviews } from '@/lib/db/schema'
import { eq, and } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { nanoid } from 'nanoid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function bookAppointment(data: {
  doctorId: string
  appointmentDate: string
  consultationType: string
  notes?: string
}) {
  const userId = await getUserId()

  const appointmentId = nanoid()
  const appointmentDate = new Date(data.appointmentDate)

  try {
    await db.insert(appointments).values({
      id: appointmentId,
      userId,
      doctorId: data.doctorId,
      appointmentDate,
      consultationType: data.consultationType,
      notes: data.notes,
      duration: 30,
      status: 'scheduled',
      remindAt: new Date(appointmentDate.getTime() - 24 * 60 * 60 * 1000),
    })

    revalidatePath('/appointments')
    return { success: true, appointmentId }
  } catch (error) {
    console.error('Error booking appointment:', error)
    throw new Error('Failed to book appointment')
  }
}

export async function getMyAppointments() {
  const userId = await getUserId()

  try {
    const result = await db
      .select()
      .from(appointments)
      .where(eq(appointments.userId, userId))

    return result
  } catch (error) {
    console.error('Error fetching appointments:', error)
    return []
  }
}

export async function cancelAppointment(appointmentId: string) {
  const userId = await getUserId()

  try {
    await db
      .update(appointments)
      .set({ status: 'cancelled' })
      .where(and(eq(appointments.id, appointmentId), eq(appointments.userId, userId)))

    revalidatePath('/appointments')
    return { success: true }
  } catch (error) {
    console.error('Error canceling appointment:', error)
    throw new Error('Failed to cancel appointment')
  }
}

export async function leaveReview(data: {
  doctorId: string
  appointmentId: string
  rating: number
  title: string
  comment: string
}) {
  const userId = await getUserId()

  try {
    const reviewId = nanoid()
    await db.insert(doctorReviews).values({
      id: reviewId,
      doctorId: data.doctorId,
      userId,
      rating: data.rating,
      title: data.title,
      comment: data.comment,
      verified: true,
    })

    // Update doctor rating
    const reviews = await db
      .select()
      .from(doctorReviews)
      .where(eq(doctorReviews.doctorId, data.doctorId))

    const avgRating =
      reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await db
      .update(doctors)
      .set({
        rating: avgRating.toString(),
        reviewCount: reviews.length,
      })
      .where(eq(doctors.id, data.doctorId))

    revalidatePath('/doctors')
    return { success: true, reviewId }
  } catch (error) {
    console.error('Error leaving review:', error)
    throw new Error('Failed to leave review')
  }
}
