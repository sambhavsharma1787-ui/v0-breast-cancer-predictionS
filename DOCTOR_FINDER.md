# Interactive Doctor Finder System

Your breast cancer prediction app now includes a comprehensive, interactive doctor finder that connects patients with specialist medical professionals based on location, specialty, and ratings.

## Overview

The Doctor Finder system provides:
- Real-time location-based specialist search
- Interactive map with geolocation
- Appointment booking system
- Live chat with doctors
- Doctor profiles with ratings and reviews
- Integration with prediction data for referrals

## Database Schema

### Specialties Table
```sql
- id: Primary key
- name: Specialty type (Oncology, Radiology, Pathology, etc.)
- description: What the specialty covers
- icon: Visual representation
```

### Doctors Table
```sql
- id: Doctor unique identifier
- userId: Associated user account
- name: Doctor name
- specialtyId: Medical specialty
- email, phone: Contact information
- bio: Professional biography
- qualifications: Array of certifications
- experience: Years of practice
- rating: Average star rating (0-5)
- reviewCount: Number of reviews
- latitude, longitude: Geographic location
- address, city, state, zipCode: Physical location
- profileImage: Doctor photo
- availabilityStart/End: Operating hours
- consultationFee: Cost per consultation
- isVerified: Medical license verification status
```

### Doctor Availability Table
```sql
- id: Availability slot ID
- doctorId: Associated doctor
- dayOfWeek: 0-6 (Sunday-Saturday)
- startTime, endTime: Available hours
- isAvailable: Current availability status
```

### Appointments Table
```sql
- id: Appointment ID
- userId, doctorId: Participants
- appointmentDate: Scheduled time
- duration: Session length in minutes
- consultationType: video/phone/in-person
- status: scheduled/completed/cancelled
- notes: Patient notes
- remindAt: Reminder trigger time
```

### Doctor Reviews Table
```sql
- id: Review ID
- doctorId: Reviewed doctor
- userId: Patient who reviewed
- rating: 1-5 stars
- title: Review headline
- comment: Detailed review text
- verified: Verified appointment flag
```

### Chat Messages Table
```sql
- id: Message ID
- userId, doctorId: Conversation participants
- message: Text content
- senderType: patient/doctor
- isRead: Message read status
- createdAt: Timestamp
```

## Components

### DoctorMap Component
**Location:** `components/doctor-map.tsx`

Interactive Leaflet-based map showing:
- User's current location (blue circle)
- Doctor markers with rating badges
- Distance indicators
- Cluster markers for multiple doctors
- Click-to-select doctor functionality

**Features:**
- Real-time map updates
- Smooth marker animations
- Popup information display
- Distance calculation using Haversine formula

### DoctorSearch Component
**Location:** `components/doctor-search.tsx`

Advanced search interface with:
- Text search by name or location
- Specialty filter dropdown
- Minimum rating selector
- Doctor cards with key information
- Selection highlighting

**Filters:**
- Doctor name
- Address/location
- Specialty
- Minimum rating (3.5+, 4+, 4.5+)
- Distance (when location enabled)

### AppointmentBooking Component
**Location:** `components/appointment-booking.tsx`

Complete booking form with:
- Date picker (minimum tomorrow)
- Time selection
- Consultation type selector
- Notes field
- Cost display
- Confirmation flow

**Consultation Types:**
- Video Consultation
- Phone Consultation
- In-Person Visit

### DoctorChat Component
**Location:** `components/doctor-chat.tsx`

Real-time messaging interface:
- Message history display
- Send message functionality
- Typing indicators
- Read receipts
- Auto-scroll to latest messages
- Doctor response simulation

### DoctorProfile Component
**Location:** `components/doctor-profile.tsx`

Comprehensive profile display:
- Doctor photo and header
- Rating and review count
- Experience and qualifications
- Contact information
- Availability hours
- Full review section
- Review submission form

## Services

### Doctor Finder Service
**Location:** `lib/doctor-finder.ts`

**Functions:**

#### `calculateDistance(lat1, lon1, lat2, lon2): number`
- Haversine formula implementation
- Returns distance in kilometers
- Used for proximity filtering

#### `searchDoctors(filters): Promise<Doctor[]>`
- Filter by specialty, rating, city
- Distance-based filtering
- Sorted by rating (descending) then distance

#### `getNearbyDoctors(lat, lon, maxDistance): Promise<DoctorWithDistance[]>`
- Find doctors within specified radius
- Sorted by distance
- Returns distance alongside doctor data

#### `getSpecialties(): Promise<Specialty[]>`
- Fetch all available medical specialties
- Used for filter dropdowns

## Server Actions

### Appointment Actions
**Location:** `app/actions/appointments.ts`

#### `bookAppointment(data)`
- Create new appointment
- Set reminder 24 hours before
- Validate time slots
- Returns appointment ID

#### `getMyAppointments()`
- Fetch user's appointments
- Scoped by user ID
- Ordered by date

#### `cancelAppointment(appointmentId)`
- Update status to cancelled
- User-scoped security

#### `leaveReview(data)`
- Submit doctor review
- Update doctor rating (average)
- Verify appointment flag

### Chat Actions
**Location:** `app/actions/chat.ts`

#### `sendMessage(data)`
- Store chat message in database
- Mark as unread initially
- Returns message ID

#### `getChatHistory(doctorId)`
- Fetch conversation with doctor
- Ordered chronologically
- User-scoped access

#### `markMessagesAsRead(doctorId)`
- Update read status
- User-scoped operation

## Pages

### Doctor Finder Page
**Location:** `app/doctors/page.tsx`

**Features:**
- Geolocation request on load
- View mode toggle (map/list)
- Doctor selection state management
- Real-time data fetching

**Layout:**
- Left sidebar: Search and doctor list
- Right panel: Map or detail view
- Responsive grid (1 column mobile, 3 columns desktop)

## Usage Flow

### Finding a Doctor
1. Navigate to `/doctors`
2. Accept geolocation request (or allow default)
3. Browse map or search doctors
4. Filter by specialty/rating/distance
5. Click doctor card to select
6. View profile and reviews

### Booking an Appointment
1. Select a doctor
2. Click "Book Appointment"
3. Choose date (tomorrow or later)
4. Select time slot
5. Choose consultation type
6. Add notes (optional)
7. Confirm booking
8. Receive confirmation email

### Live Chat
1. Open doctor chat from profile
2. Type message
3. Send and receive responses
4. View conversation history
5. Get responses within 2 hours (typical)

### Leaving a Review
1. Complete appointment
2. Go to doctor profile
3. Click "Leave Review"
4. Select star rating
5. Write title and comment
6. Submit review
7. Rating updates automatically

## Integration with Predictions

The Doctor Finder integrates with breast cancer predictions:

1. **Referral System:** High-risk predictions can auto-suggest oncologists
2. **Specialist Recommendation:** Based on risk category
3. **Consultation History:** Linked to prediction data
4. **Follow-up Tracking:** Appointments tracked with predictions

## Location-Based Features

### Geolocation
- Browser geolocation API
- Falls back to NYC coordinates if denied
- Updates available doctor list

### Distance Calculation
- Haversine formula for accuracy
- Returns distance in kilometers
- Real-time calculation on map

### Map Integration
- Leaflet library
- OpenStreetMap tiles (free, no API key)
- Dynamic marker clustering
- Interactive popups

## Real-time Features

### Chat System
- Message persistence in database
- Read status tracking
- Timestamp display
- Auto-scroll to new messages

### Availability
- Real-time slot availability
- Doctor schedule management
- Reminder system (24 hours before)
- Status tracking (scheduled/completed/cancelled)

## Security & Privacy

### Authentication
- All operations require user login
- User ID scoping on queries
- Session-based access control

### Data Protection
- Patient information isolated
- Doctor contact info shown only after booking
- Review verified flag for appointment proof

### HIPAA Compliance Ready
- User/doctor separation
- Audit trail via timestamps
- Encrypted connection ready

## Performance Optimizations

### Database
- Indexed on userId, doctorId, appointmentDate
- Indexed on ratings for sorting
- Indexed on location coordinates for distance queries

### Frontend
- Component code splitting
- Lazy loading of doctor data
- Map virtualization for many markers
- Message pagination in chat

## Future Enhancements

1. **Video Integration:** Actual video consultations via Twilio/Zoom
2. **Payment Processing:** Stripe integration for consultation fees
3. **AI Recommendations:** ML-based doctor matching
4. **Admin Dashboard:** Doctor management and verification
5. **SMS/Email Notifications:** Appointment reminders
6. **Analytics:** Doctor performance metrics

## Testing

To test the doctor finder:

1. Navigate to `/doctors`
2. Allow geolocation access
3. Search and filter doctors
4. Book test appointment
5. Send test message
6. Leave test review

Mock doctors are loaded from database if available, otherwise showing the component structure.

## Notes

- All components are fully type-safe with Drizzle ORM
- Server actions follow the `getUserId()` pattern for security
- Chat has simulated doctor responses for demo purposes
- Leaflet map requires Internet for tile loading
- Geolocation requires HTTPS in production
