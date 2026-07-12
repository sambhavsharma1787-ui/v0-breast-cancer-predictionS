'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { chatMessages } from '@/lib/db/schema'
import { eq, and, desc } from 'drizzle-orm'
import { headers } from 'next/headers'
import { nanoid } from 'nanoid'

async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function sendMessage(data: {
  doctorId: string
  message: string
}) {
  const userId = await getUserId()

  const messageId = nanoid()

  try {
    await db.insert(chatMessages).values({
      id: messageId,
      userId,
      doctorId: data.doctorId,
      message: data.message,
      senderType: 'patient',
      isRead: false,
    })

    return { success: true, messageId }
  } catch (error) {
    console.error('Error sending message:', error)
    throw new Error('Failed to send message')
  }
}

export async function getChatHistory(doctorId: string) {
  const userId = await getUserId()

  try {
    const messages = await db
      .select()
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.userId, userId),
          eq(chatMessages.doctorId, doctorId)
        )
      )
      .orderBy(desc(chatMessages.createdAt))

    return messages.reverse()
  } catch (error) {
    console.error('Error fetching chat history:', error)
    return []
  }
}

export async function markMessagesAsRead(doctorId: string) {
  const userId = await getUserId()

  try {
    await db
      .update(chatMessages)
      .set({ isRead: true })
      .where(
        and(
          eq(chatMessages.userId, userId),
          eq(chatMessages.doctorId, doctorId),
          eq(chatMessages.isRead, false)
        )
      )

    return { success: true }
  } catch (error) {
    console.error('Error marking messages as read:', error)
    throw new Error('Failed to mark messages as read')
  }
}
