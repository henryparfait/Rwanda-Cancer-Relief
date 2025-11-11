# Counselor Dashboard API Documentation

This document outlines all the backend endpoints created for the counselor dashboard functionality.

## Base URL
All endpoints are prefixed with `/api`

## Authentication
All counselor endpoints require:
- JWT token in `Authorization: Bearer <token>` header
- User role must be `counselor`

---

## 1. Counselor Dashboard Endpoints

### Get Dashboard Statistics
**GET** `/api/counselor/dashboard/stats`

Returns overview statistics for the counselor dashboard.

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalPatients": 10,
      "upcomingSessions": 5,
      "completedSessions": 25,
      "pendingMessages": 3,
      "recentSessions": 2
    }
  }
}
```

### Get My Patients
**GET** `/api/counselor/patients`

Returns all patients assigned to the counselor.

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "id": "...",
      "email": "patient@example.com",
      "role": "patient",
      "profile": { ... },
      "lastSession": "2024-10-28T10:00:00Z",
      "sessionCount": 5
    }
  ]
}
```

### Get Patient Profile
**GET** `/api/counselor/patients/:patientId`

Returns detailed profile of a specific patient.

**Response:**
```json
{
  "success": true,
  "data": {
    "patient": { ... },
    "recentSessions": [ ... ]
  }
}
```

---

## 2. Session Management Endpoints

### Get Sessions
**GET** `/api/sessions`

Get all sessions for the counselor. If no status query parameter is provided, returns upcoming, past, and pending requests.

**Query Parameters:**
- `status` (optional): Filter by status (`requested`, `scheduled`, `in-progress`, `completed`, `cancelled`)
- `type` (optional): Filter by session type (`individual`, `group`, `family`)

**Response (without status):**
```json
{
  "success": true,
  "data": {
    "pendingRequests": [ ... ],
    "upcoming": [ ... ],
    "past": [ ... ]
  }
}
```

**Response (with status):**
```json
{
  "success": true,
  "count": 5,
  "data": [ ... ]
}
```

### Get Single Session
**GET** `/api/sessions/:sessionId`

Get details of a specific session.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "counselor": { ... },
    "patient": { ... },
    "scheduledDate": "2024-10-28T10:00:00Z",
    "scheduledTime": "10:00 AM - 11:00 AM",
    "duration": 60,
    "status": "scheduled",
    "sessionType": "individual",
    "notes": "...",
    "sessionSummary": "..."
  }
}
```

### Create Session
**POST** `/api/sessions`

Create a new counseling session.

**Request Body:**
```json
{
  "patientId": "...",
  "scheduledDate": "2024-10-28T10:00:00Z",
  "scheduledTime": "10:00 AM - 11:00 AM",
  "duration": 60,
  "sessionType": "individual",
  "notes": "Initial consultation"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session created successfully",
  "data": { ... }
}
```

### Update Session
**PUT** `/api/sessions/:sessionId`

Update an existing session.

**Request Body:**
```json
{
  "scheduledDate": "2024-10-29T10:00:00Z",
  "scheduledTime": "10:00 AM - 11:00 AM",
  "duration": 60,
  "status": "completed",
  "notes": "Session notes...",
  "sessionSummary": "Summary..."
}
```

### Reschedule Session
**PUT** `/api/sessions/:sessionId/reschedule`

Reschedule a session (creates new session and marks old one as rescheduled).

**Request Body:**
```json
{
  "scheduledDate": "2024-10-30T10:00:00Z",
  "scheduledTime": "10:00 AM - 11:00 AM",
  "duration": 60
}
```

### Cancel Session
**PUT** `/api/sessions/:sessionId/cancel`

Cancel a session.

**Request Body:**
```json
{
  "cancellationReason": "Patient requested cancellation"
}
```

### Start Session
**PUT** `/api/sessions/:sessionId/start`

Start a scheduled session (changes status to `in-progress`).

**Response:**
```json
{
  "success": true,
  "message": "Session started successfully",
  "data": { ... }
}
```

### Respond to Session Request
**PUT** `/api/sessions/requests/:sessionId/respond`

Approve or decline a pending session request. Only counselors can perform this action.

**Request Body:**
```json
{
  "action": "approve",
  "scheduledDate": "2024-11-01",
  "scheduledTime": "09:30",
  "duration": 60,
  "responseMessage": "Looking forward to our session."
}
```

- `action`: Allowed values are `approve` or `decline`.
- `scheduledDate` and `scheduledTime` are optional when declining a request.
- `responseMessage` is optional notes shared with the patient.

**Response (approve):**
```json
{
  "success": true,
  "message": "Session request approved",
  "data": { ... }
}
```

**Response (decline):**
```json
{
  "success": true,
  "message": "Session request declined",
  "data": { ... }
}
```

---

## 3. Messaging Endpoints

### Get Conversations
**GET** `/api/messages/conversations`

Get all conversations for the counselor.

**Query Parameters:**
- `search` (optional): Search conversations by patient name or email

**Response:**
```json
{
  "success": true,
  "count": 5,
  "data": [
    {
      "_id": "...",
      "counselor": "...",
      "patient": { ... },
      "lastMessage": { ... },
      "lastMessageAt": "2024-10-28T10:00:00Z",
      "unreadCount": 2
    }
  ]
}
```

### Get or Create Conversation
**GET** `/api/messages/conversations/:patientId`

Get existing conversation with a patient or create a new one.

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "...",
    "counselor": "...",
    "patient": { ... },
    "participants": [ ... ],
    "unreadCount": { ... }
  }
}
```

### Get Messages
**GET** `/api/messages/conversations/:conversationId/messages`

Get all messages in a conversation.

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Messages per page (default: 50)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "data": [
    {
      "_id": "...",
      "conversation": "...",
      "sender": { ... },
      "receiver": { ... },
      "content": "Message text...",
      "isRead": true,
      "readAt": "2024-10-28T10:00:00Z",
      "createdAt": "2024-10-28T10:00:00Z"
    }
  ]
}
```

### Send Message
**POST** `/api/messages/send`

Send a message to a patient.

**Request Body:**
```json
{
  "conversationId": "...",
  "content": "Hello, how are you feeling today?",
  "patientId": "..." // Alternative to conversationId
}
```

**Response:**
```json
{
  "success": true,
  "message": "Message sent successfully",
  "data": { ... }
}
```

### Mark Messages as Read
**PUT** `/api/messages/conversations/:conversationId/read`

Mark all messages in a conversation as read.

**Response:**
```json
{
  "success": true,
  "message": "Messages marked as read"
}
```

---

## 4. Resource Library Endpoints

### Get Resources
**GET** `/api/resources`

Get all public resources (available to all users).

**Query Parameters:**
- `type` (optional): Filter by type (`pdf`, `video`, `guide`, `link`, `audio`, `image`)
- `category` (optional): Filter by category (`counseling`, `education`, `support`, `medical`, `wellness`, `other`)
- `search` (optional): Search by title, description, or tags
- `sortBy` (optional): Sort order (`newest`, `oldest`, `alphabetical`) - default: `newest`
- `page` (optional): Page number (default: 1)
- `limit` (optional): Resources per page (default: 20)

**Response:**
```json
{
  "success": true,
  "count": 10,
  "total": 50,
  "page": 1,
  "pages": 5,
  "data": [
    {
      "_id": "...",
      "title": "Counselling Techniques for Anxiety",
      "description": "...",
      "type": "pdf",
      "url": "...",
      "thumbnail": "...",
      "category": "counseling",
      "tags": [ ... ],
      "uploadedBy": { ... },
      "downloadCount": 10,
      "viewCount": 25,
      "createdAt": "2024-10-28T10:00:00Z"
    }
  ]
}
```

### Get Single Resource
**GET** `/api/resources/:resourceId`

Get details of a specific resource (increments view count).

**Response:**
```json
{
  "success": true,
  "data": { ... }
}
```

### Download Resource
**GET** `/api/resources/:resourceId/download`

Increment download count and return resource URL.

**Response:**
```json
{
  "success": true,
  "data": {
    "url": "...",
    "downloadCount": 11
  }
}
```

### Create Resource
**POST** `/api/resources`

Create a new resource (counselor/admin only).

**Request Body:**
```json
{
  "title": "Resource Title",
  "description": "Resource description",
  "type": "pdf",
  "url": "https://...",
  "thumbnail": "https://...",
  "category": "counseling",
  "tags": ["anxiety", "counseling"],
  "isPublic": true,
  "fileSize": 1024000,
  "mimeType": "application/pdf"
}
```

**Note:** File upload via `multipart/form-data` is supported. Use `file` field for file uploads.

### Update Resource
**PUT** `/api/resources/:resourceId`

Update an existing resource (only by uploader or admin).

**Request Body:**
```json
{
  "title": "Updated Title",
  "description": "Updated description",
  "tags": ["updated", "tags"]
}
```

### Delete Resource
**DELETE** `/api/resources/:resourceId`

Delete a resource (only by uploader or admin).

**Response:**
```json
{
  "success": true,
  "message": "Resource deleted successfully"
}
```

---

## 5. Profile Settings Endpoints

### Update Profile
**PUT** `/api/profile/update`

Update counselor profile information.

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Experienced counselor...",
  "specialization": ["oncology", "grief"],
  "yearsOfExperience": 10,
  "qualifications": "MSc in Counseling",
  "profilePicture": "https://...",
  "telephone": "+250 788 123 456"
}
```

**Note:** Profile picture can be uploaded via `multipart/form-data` with field name `profilePicture`.

### Update Availability
**PUT** `/api/profile/availability`

Update availability status.

**Request Body:**
```json
{
  "isAvailable": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Availability updated successfully",
  "data": {
    "isAvailable": true
  }
}
```

### Update Notification Preferences
**PUT** `/api/profile/notifications`

Update notification preferences.

**Request Body:**
```json
{
  "email": true,
  "sms": false,
  "message": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Notification preferences updated successfully",
  "data": {
    "notificationPreferences": {
      "email": true,
      "sms": false,
      "message": true
    }
  }
}
```

### Update Password
**PUT** `/api/profile/password`

Update user password (available to all authenticated users).

**Request Body:**
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword",
  "confirmPassword": "newpassword"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Password updated successfully"
}
```

### Update Contact Information
**PUT** `/api/profile/contact`

Update email and phone number.

**Request Body:**
```json
{
  "email": "newemail@example.com",
  "telephone": "+250 788 123 456"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Contact information updated successfully",
  "data": { ... }
}
```

---

## 6. Counselor Directory Endpoints

### Search Counsellors
**GET** `/api/counselor/directory`

Search and filter counsellors. Accessible to patients, counselors, and admins.

**Query Parameters:**
- `q` (optional): Free-text search across names, bios, and specialties.
- `serviceMode` (optional): Filter by `in-person`, `virtual`, or `hybrid`.
- `specialization` (optional): Filter by specialization keyword.
- `limit` (optional): Results per page (default: 12).
- `page` (optional): Page number (default: 1).

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "...",
      "email": "counselor@example.com",
      "fullName": "Dr. Jane Doe",
      "specialties": ["oncology", "family support"],
      "languages": ["English"],
      "serviceModes": ["virtual"],
      "rating": { "average": 4.8, "count": 12 },
      "metrics": {
        "totalSessions": 120,
        "completedSessions": 110,
        "upcomingSessions": 4,
        "activePatients": 18,
        "completionRate": 91.7,
        "averageSessionsPerPatient": 6.7
      }
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 12,
    "total": 24,
    "totalPages": 2
  }
}
```

### Get Counsellor Details
**GET** `/api/counselor/directory/:counselorId`

Return the public profile for a counsellor, including availability preview.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "counselor@example.com",
    "fullName": "Dr. Jane Doe",
    "bio": "Oncology specialist with 10 years of experience.",
    "availability": {
      "timezone": "Africa/Kigali",
      "weeklySchedule": [ ... ],
      "upcomingSlots": [
        {
          "date": "2024-11-05T00:00:00.000Z",
          "start": "09:00",
          "end": "10:00",
          "isVirtual": true
        }
      ]
    },
    "metrics": { ... },
    "recentPatients": [ ... ]
  }
}
```

### Update Availability and Preferences
**PUT** `/api/counselor/profile/availability`

Update availability, specialties, languages, and service modes. Counselor role required.

**Request Body (partial example):**
```json
{
  "isAvailable": true,
  "availability": {
    "timezone": "Africa/Kigali",
    "weeklySchedule": [
      {
        "day": "monday",
        "slots": [
          { "start": "09:00", "end": "12:00", "isVirtual": true },
          { "start": "14:00", "end": "16:00", "isVirtual": false }
        ]
      }
    ],
    "exceptions": [
      { "date": "2024-11-15", "isAvailable": false, "reason": "Conference" }
    ]
  },
  "specialties": ["oncology", "grief support"],
  "serviceModes": ["virtual", "in-person"],
  "languages": ["English", "Kinyarwanda"]
}
```

---

## 7. Patient Session Endpoints

### Get Patient Sessions
**GET** `/api/sessions/patient`

Return the patient’s upcoming sessions, past sessions, and pending requests.

**Response:**
```json
{
  "success": true,
  "data": {
    "pendingRequests": [ ... ],
    "upcoming": [ ... ],
    "past": [ ... ]
  }
}
```

### Request a Session
**POST** `/api/sessions/patient/request`

Submit a new session request to a counsellor. Patient role required.

**Request Body:**
```json
{
  "counselorId": "...",
  "scheduledDate": "2024-11-05",
  "scheduledTime": "09:30",
  "sessionType": "individual",
  "notes": "Follow-up after treatment."
}
```

**Response:**
```json
{
  "success": true,
  "message": "Session request submitted successfully",
  "data": { ... }
}
```

### Cancel a Session Request
**PUT** `/api/sessions/patient/:sessionId/cancel`

Cancel a pending or scheduled session as a patient.

**Request Body:**
```json
{
  "cancellationReason": "Scheduling conflict"
}
```

---

## 8. Community Feed Endpoints

### List Community Posts
**GET** `/api/community`

Retrieve community posts filtered by audience.

**Query Parameters:**
- `audience` (optional): `patients`, `counselors`, or `all` (defaults to role-based scope).
- `tag` (optional): Filter by tag.
- `page` and `limit` (optional): Pagination controls (defaults: 1, 20).

### Create a Post
**POST** `/api/community`

Create a new community post. Patients, counselors, and admins are allowed.

**Request Body:**
```json
{
  "title": "Coping with treatment",
  "content": "Sharing my tips for staying positive...",
  "audience": "patients",
  "tags": ["mindset", "support"]
}
```

### React to a Post
**POST** `/api/community/:postId/reactions`

Toggle or change a reaction on a post. Allowed types: `like`, `support`, `insight`, `celebrate`.

### Manage Comments
- **GET** `/api/community/:postId/comments` — List comments for a post (supports pagination and `parentId` for replies).
- **POST** `/api/community/:postId/comments` — Add a comment or reply.
- **DELETE** `/api/community/comments/:commentId` — Delete a comment (author, post owner, or admin).

### Moderate Posts
- **DELETE** `/api/community/:postId` — Delete a post (author or admin).
- **PUT** `/api/community/:postId/pin` — Toggle the pinned state (admin only).

---

## 9. Admin Analytics Endpoints

### System Overview
**GET** `/api/admin/analytics/overview`

Return user, session, and messaging metrics for dashboards.

### Session Analytics
**GET** `/api/admin/analytics/sessions`

Return completion rates, upcoming sessions, and top counselors.

### Message Analytics
**GET** `/api/admin/analytics/messages`

Return message volumes, unread counts, and reaction distributions by role.

### Patient Engagement
**GET** `/api/admin/analytics/patient-engagement`

Report on patient adoption, active patients, and returning session counts.

---

## Error Responses

All endpoints return errors in the following format:

```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error message"
}
```

### Common HTTP Status Codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Database Models

### Session Model
- `counselor` (ObjectId, ref: User)
- `patient` (ObjectId, ref: User)
- `scheduledDate` (Date)
- `scheduledTime` (String)
- `duration` (Number, default: 60)
- `status` (Enum: scheduled, in-progress, completed, cancelled, rescheduled)
- `sessionType` (Enum: individual, group, family)
- `notes` (String)
- `sessionSummary` (String)
- `startedAt`, `endedAt`, `cancelledAt` (Date)
- `cancellationReason` (String)
- `rescheduledFrom`, `rescheduledTo` (ObjectId, ref: Session)

### Message Model
- `conversation` (ObjectId, ref: Conversation)
- `sender` (ObjectId, ref: User)
- `receiver` (ObjectId, ref: User)
- `content` (String)
- `isRead` (Boolean, default: false)
- `readAt` (Date)
- `attachments` (Array)

### Conversation Model
- `participants` (Array of ObjectId, ref: User)
- `counselor` (ObjectId, ref: User)
- `patient` (ObjectId, ref: User)
- `lastMessage` (ObjectId, ref: Message)
- `lastMessageAt` (Date)
- `unreadCount` (Object: { counselor: Number, patient: Number })
- `isArchived` (Boolean)

### Resource Model
- `title` (String)
- `description` (String)
- `type` (Enum: pdf, video, guide, link, audio, image)
- `url` (String)
- `thumbnail` (String)
- `uploadedBy` (ObjectId, ref: User)
- `category` (Enum: counseling, education, support, medical, wellness, other)
- `tags` (Array of String)
- `isPublic` (Boolean, default: true)
- `downloadCount`, `viewCount` (Number)
- `fileSize`, `mimeType` (String/Number)

---

## Notes

1. All counselor endpoints require authentication and counselor role authorization.
2. Resource endpoints are public for reading, but require authentication for creating/updating/deleting.
3. File uploads are handled via Multer (memory storage). Cloudinary integration should be added for production.
4. All timestamps are in ISO 8601 format.
5. Pagination is available for list endpoints (messages, resources).
6. Search functionality is available for conversations and resources.

