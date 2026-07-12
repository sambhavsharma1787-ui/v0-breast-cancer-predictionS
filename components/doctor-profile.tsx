'use client'

import { useState } from 'react'
import { Star, MapPin, Phone, Mail, Award, Briefcase, Clock } from 'lucide-react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { leaveReview } from '@/app/actions/appointments'
import { Doctor, DoctorReview } from '@/lib/db/schema'

interface DoctorProfileProps {
  doctor: Doctor
  reviews?: DoctorReview[]
}

export function DoctorProfile({ doctor, reviews = [] }: DoctorProfileProps) {
  const [showReviewForm, setShowReviewForm] = useState(false)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      await leaveReview({
        doctorId: doctor.id,
        appointmentId: '', // Would be provided in real flow
        rating: reviewRating,
        title: reviewTitle,
        comment: reviewComment,
      })

      setReviewTitle('')
      setReviewComment('')
      setReviewRating(5)
      setShowReviewForm(false)
    } catch (error) {
      console.error('Error submitting review:', error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Doctor Header */}
      <Card className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex gap-6">
          <div className="w-32 h-32 bg-gray-300 rounded-lg flex items-center justify-center">
            {doctor.profileImage ? (
              <img
                src={doctor.profileImage}
                alt={doctor.name}
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <span className="text-gray-500">No image</span>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-2">{doctor.name}</h1>
            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-bold text-lg">
                  {doctor.rating
                    ? parseFloat(doctor.rating.toString()).toFixed(1)
                    : 'N/A'}
                </span>
                <span className="text-gray-600">
                  ({doctor.reviewCount || 0} reviews)
                </span>
              </div>
              <span className="text-green-600 font-semibold">
                {doctor.isVerified ? '✓ Verified' : 'Unverified'}
              </span>
            </div>

            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <Briefcase className="h-4 w-4 text-gray-600" />
                <span>{doctor.experience || 0} years experience</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-gray-600" />
                <span>
                  {doctor.address}, {doctor.city}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <span>
                  {doctor.availabilityStart} - {doctor.availabilityEnd}
                </span>
              </div>
            </div>
          </div>

          <div className="text-right">
            <p className="text-3xl font-bold text-blue-600 mb-4">
              ${doctor.consultationFee || 'TBD'}
            </p>
            <Button className="w-full mb-2">Book Appointment</Button>
            <Button variant="outline" className="w-full">
              Send Message
            </Button>
          </div>
        </div>
      </Card>

      {/* Bio & Qualifications */}
      <div className="grid grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4">About</h2>
          <p className="text-gray-600 text-sm leading-relaxed">{doctor.bio}</p>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Award className="h-5 w-5" />
            Qualifications
          </h2>
          <ul className="space-y-2">
            {doctor.qualifications && doctor.qualifications.length > 0 ? (
              doctor.qualifications.map((qual, idx) => (
                <li key={idx} className="text-sm text-gray-600 flex items-start gap-2">
                  <span className="text-blue-500 mt-1">•</span>
                  {qual}
                </li>
              ))
            ) : (
              <p className="text-sm text-gray-500">No qualifications listed</p>
            )}
          </ul>
        </Card>
      </div>

      {/* Contact Information */}
      <Card className="p-6">
        <h2 className="text-xl font-bold mb-4">Contact Information</h2>
        <div className="space-y-3">
          {doctor.email && (
            <div className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-blue-500" />
              <a href={`mailto:${doctor.email}`} className="text-blue-600 hover:underline">
                {doctor.email}
              </a>
            </div>
          )}
          {doctor.phone && (
            <div className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-blue-500" />
              <a href={`tel:${doctor.phone}`} className="text-blue-600 hover:underline">
                {doctor.phone}
              </a>
            </div>
          )}
        </div>
      </Card>

      {/* Reviews Section */}
      <Card className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold">Patient Reviews</h2>
          <Button
            onClick={() => setShowReviewForm(!showReviewForm)}
            variant="outline"
          >
            {showReviewForm ? 'Cancel' : 'Leave Review'}
          </Button>
        </div>

        {showReviewForm && (
          <form
            onSubmit={handleSubmitReview}
            className="mb-6 p-4 bg-blue-50 rounded-lg space-y-4"
          >
            <div>
              <label className="block text-sm font-medium mb-2">
                Rating
              </label>
              <select
                value={reviewRating}
                onChange={(e) => setReviewRating(parseInt(e.target.value))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              >
                <option value={5}>5 Stars - Excellent</option>
                <option value={4}>4 Stars - Very Good</option>
                <option value={3}>3 Stars - Good</option>
                <option value={2}>2 Stars - Fair</option>
                <option value={1}>1 Star - Poor</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Title
              </label>
              <input
                type="text"
                value={reviewTitle}
                onChange={(e) => setReviewTitle(e.target.value)}
                placeholder="Brief summary of your experience"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Your Review
              </label>
              <Textarea
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                placeholder="Share your experience..."
                rows={4}
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Review'}
            </Button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-4">
          {reviews.length === 0 ? (
            <p className="text-gray-500 text-sm">No reviews yet</p>
          ) : (
            reviews.map((review) => (
              <div key={review.id} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-sm">{review.title}</h4>
                    <div className="flex items-center gap-1 mt-1">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3 w-3 ${
                            i < review.rating
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  {review.verified && (
                    <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded">
                      Verified
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600">{review.comment}</p>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  )
}
