'use client'

import { useState } from 'react'
import { Calendar, Clock, FileText } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { bookAppointment } from '@/app/actions/appointments'
import { Doctor } from '@/lib/db/schema'

interface AppointmentBookingProps {
  doctor: Doctor
  onBookingComplete?: () => void
}

export function AppointmentBooking({
  doctor,
  onBookingComplete,
}: AppointmentBookingProps) {
  const [date, setDate] = useState('')
  const [time, setTime] = useState('')
  const [consultationType, setConsultationType] = useState('video')
  const [notes, setNotes] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const getMinDate = () => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return tomorrow.toISOString().split('T')[0]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      if (!date || !time) {
        throw new Error('Please select date and time')
      }

      const appointmentDate = new Date(`${date}T${time}:00`)

      await bookAppointment({
        doctorId: doctor.id,
        appointmentDate: appointmentDate.toISOString(),
        consultationType,
        notes: notes || undefined,
      })

      setSuccess(true)
      setTimeout(() => {
        onBookingComplete?.()
      }, 2000)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to book appointment')
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <Card className="p-6 bg-green-50 border-green-200">
        <div className="text-center">
          <div className="text-4xl mb-2">✓</div>
          <h3 className="text-lg font-bold text-green-900 mb-2">
            Appointment Booked!
          </h3>
          <p className="text-sm text-green-700">
            Confirmation sent to your email. The doctor will contact you shortly.
          </p>
        </div>
      </Card>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Date Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Calendar className="inline h-4 w-4 mr-2" />
          Appointment Date
        </label>
        <Input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          min={getMinDate()}
          required
          className="w-full"
        />
      </div>

      {/* Time Selection */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <Clock className="inline h-4 w-4 mr-2" />
          Preferred Time
        </label>
        <Input
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          required
          className="w-full"
        />
      </div>

      {/* Consultation Type */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Consultation Type
        </label>
        <select
          value={consultationType}
          onChange={(e) => setConsultationType(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          <option value="video">Video Consultation</option>
          <option value="phone">Phone Consultation</option>
          <option value="in-person">In-Person Visit</option>
        </select>
      </div>

      {/* Notes */}
      <div>
        <label className="block text-sm font-medium mb-2">
          <FileText className="inline h-4 w-4 mr-2" />
          Additional Notes (Optional)
        </label>
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Any specific symptoms or concerns to discuss..."
          rows={3}
          className="w-full"
        />
      </div>

      {/* Summary */}
      <Card className="p-4 bg-blue-50">
        <p className="text-sm">
          <strong>Doctor:</strong> {doctor.name}
        </p>
        <p className="text-sm">
          <strong>Fee:</strong> ${doctor.consultationFee || 'TBD'}
        </p>
      </Card>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full"
      >
        {isLoading ? 'Booking...' : 'Confirm Booking'}
      </Button>
    </form>
  )
}
