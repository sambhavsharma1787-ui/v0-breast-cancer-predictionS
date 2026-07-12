'use client'

import { useState, useEffect, useRef } from 'react'
import { Send, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card } from '@/components/ui/card'
import { sendMessage, getChatHistory } from '@/app/actions/chat'
import { Doctor, ChatMessage } from '@/lib/db/schema'

interface DoctorChatProps {
  doctor: Doctor
  isOpen?: boolean
}

export function DoctorChat({ doctor, isOpen = true }: DoctorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isFetching, setIsFetching] = useState(true)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return

    // Fetch chat history
    const fetchMessages = async () => {
      try {
        setIsFetching(true)
        const history = await getChatHistory(doctor.id)
        setMessages(history)
      } catch (error) {
        console.error('Error fetching chat history:', error)
      } finally {
        setIsFetching(false)
      }
    }

    fetchMessages()

    // Scroll to bottom
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [isOpen, doctor.id])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!inputValue.trim()) return

    const userMessage = inputValue
    setInputValue('')
    setIsLoading(true)

    try {
      const newMessage: ChatMessage = {
        id: 'temp-' + Date.now(),
        userId: '',
        doctorId: doctor.id,
        message: userMessage,
        senderType: 'patient',
        isRead: false,
        createdAt: new Date(),
      }

      setMessages((prev) => [...prev, newMessage])

      await sendMessage({
        doctorId: doctor.id,
        message: userMessage,
      })

      // Simulate doctor response after 2 seconds
      setTimeout(() => {
        const doctorResponse: ChatMessage = {
          id: 'temp-' + Date.now(),
          userId: '',
          doctorId: doctor.id,
          message: "Thank you for your message. I'll get back to you shortly.",
          senderType: 'doctor',
          isRead: true,
          createdAt: new Date(),
        }
        setMessages((prev) => [...prev, doctorResponse])
      }, 2000)
    } catch (error) {
      console.error('Error sending message:', error)
    } finally {
      setIsLoading(false)
    }
  }

  if (isFetching) {
    return (
      <Card className="p-4 flex items-center justify-center h-96">
        <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
      </Card>
    )
  }

  return (
    <Card className="flex flex-col h-96 bg-white">
      {/* Header */}
      <div className="border-b p-4">
        <h3 className="font-bold text-lg">{doctor.name}</h3>
        <p className="text-sm text-gray-600">Usually responds within 2 hours</p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 py-8">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.senderType === 'patient' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  message.senderType === 'patient'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-200 text-gray-900'
                }`}
              >
                <p className="text-sm break-words">{message.message}</p>
                <span className="text-xs opacity-70 mt-1 block">
                  {message.createdAt
                    ? new Date(message.createdAt).toLocaleTimeString()
                    : ''}
                </span>
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <form
        onSubmit={handleSendMessage}
        className="border-t p-4 flex gap-2"
      >
        <Input
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
          disabled={isLoading}
          className="flex-1"
        />
        <Button
          type="submit"
          disabled={isLoading || !inputValue.trim()}
          size="icon"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </form>
    </Card>
  )
}
