# MedGrid API Documentation

## Base URL
```
http://localhost:5000/api
```

## Authentication
Most endpoints require authentication using JWT tokens. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

## Response Format
All API responses follow this format:
```json
{
  "message": "Success message",
  "data": { ... },
  "error": "Error message (if any)"
}
```

## Error Codes
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

---

## Authentication Endpoints

### POST /auth/login
Login user and get JWT token.

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:**
```json
{
  "message": "Login successful",
  "token": "jwt_token_here",
  "user": {
    "id": "user_id",
    "username": "admin",
    "email": "admin@medgrid.com",
    "role": "admin",
    "fullName": "Admin User",
    "department": "Administration"
  }
}
```

### POST /auth/register
Register new user (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "username": "newuser",
  "email": "user@medgrid.com",
  "password": "password123",
  "role": "staff",
  "firstName": "John",
  "lastName": "Doe",
  "department": "General",
  "employeeId": "EMP002"
}
```

### GET /auth/me
Get current user information.

**Headers:** `Authorization: Bearer <token>`

**Response:**
```json
{
  "user": {
    "id": "user_id",
    "username": "admin",
    "email": "admin@medgrid.com",
    "role": "admin",
    "fullName": "Admin User",
    "department": "Administration"
  }
}
```

---

## Department Endpoints

### GET /departments
Get all departments with bed availability.

**Response:**
```json
{
  "departments": [
    {
      "_id": "dept_id",
      "name": "General",
      "description": "General medical care",
      "totalBeds": 10,
      "occupiedBeds": 3,
      "availableBeds": 7,
      "availabilityPercentage": 70,
      "availabilityStatus": "green"
    }
  ],
  "total": 2
}
```

### GET /departments/:id
Get specific department by ID.

**Response:**
```json
{
  "department": {
    "_id": "dept_id",
    "name": "General",
    "description": "General medical care",
    "totalBeds": 10,
    "occupiedBeds": 3,
    "availableBeds": 7,
    "contactNumber": "+1-555-0101",
    "location": {
      "floor": 1,
      "wing": "A",
      "room": "101-110"
    }
  }
}
```

### POST /departments
Create new department (Admin only).

**Headers:** `Authorization: Bearer <admin_token>`

**Request Body:**
```json
{
  "name": "Emergency",
  "description": "Emergency medical care",
  "totalBeds": 15,
  "contactNumber": "+1-555-0301",
  "location": {
    "floor": 1,
    "wing": "C",
    "room": "101-115"
  }
}
```

---

## Bed Endpoints

### GET /beds
Get all beds with optional filters.

**Query Parameters:**
- `department` - Filter by department ID
- `departmentName` - Filter by department name
- `status` - Filter by bed status

**Response:**
```json
{
  "beds": [
    {
      "_id": "bed_id",
      "bedNumber": "GEN01",
      "department": "dept_id",
      "departmentName": "General",
      "status": "available",
      "position": { "row": 1, "column": 1 },
      "bedType": "standard",
      "dailyRate": 2000
    }
  ],
  "total": 20
}
```

### GET /beds/department/:departmentId/grid
Get bed grid layout for department.

**Response:**
```json
{
  "department": {
    "id": "dept_id",
    "name": "General",
    "description": "General medical care"
  },
  "grid": [
    [
      {
        "id": "bed_id",
        "bedNumber": "GEN01",
        "status": "available",
        "isAvailable": true,
        "bedType": "standard",
        "dailyRate": 2000
      }
    ]
  ],
  "dimensions": { "rows": 2, "columns": 5 },
  "stats": {
    "total": 10,
    "available": 7,
    "occupied": 3,
    "availabilityPercentage": 70,
    "colorStatus": "green"
  }
}
```

### PUT /beds/:id/occupy
Occupy bed with patient.

**Headers:** `Authorization: Bearer <staff_token>`

**Request Body:**
```json
{
  "patientId": "patient_id"
}
```

### PUT /beds/:id/release
Release bed (discharge patient).

**Headers:** `Authorization: Bearer <staff_token>`

### PUT /beds/:id/status
Update bed status.

**Headers:** `Authorization: Bearer <staff_token>`

**Request Body:**
```json
{
  "status": "maintenance",
  "notes": "Routine maintenance required"
}
```

---

## Patient Endpoints

### GET /patients
Get all patients with filters.

**Headers:** `Authorization: Bearer <staff_token>`

**Query Parameters:**
- `status` - Filter by patient status
- `department` - Filter by department
- `search` - Search by name, ID, or contact
- `page` - Page number (default: 1)
- `limit` - Items per page (default: 10)

**Response:**
```json
{
  "patients": [
    {
      "_id": "patient_id",
      "patientId": "PAT20240001",
      "firstName": "John",
      "lastName": "Doe",
      "fullName": "John Doe",
      "age": 45,
      "gender": "Male",
      "status": "admitted",
      "admission": {
        "departmentName": "General",
        "assignedBed": { "bedNumber": "GEN01" },
        "admissionDate": "2024-01-01T00:00:00.000Z"
      }
    }
  ],
  "pagination": {
    "current": 1,
    "pages": 5,
    "total": 50,
    "limit": 10
  }
}
```

### POST /patients/admit
Admit new patient.

**Headers:** `Authorization: Bearer <staff_token>`

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "dateOfBirth": "1979-01-01",
  "gender": "Male",
  "contactNumber": "+1-555-1234",
  "email": "john.doe@email.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "state": "State",
    "zipCode": "12345"
  },
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "contactNumber": "+1-555-5678"
  },
  "medicalHistory": {
    "allergies": ["Penicillin"],
    "chronicConditions": ["Diabetes"],
    "bloodType": "O+"
  },
  "departmentId": "dept_id",
  "bedId": "bed_id",
  "reasonForAdmission": "Chest pain",
  "diagnosis": "Suspected heart condition",
  "insurance": {
    "provider": "Health Insurance Co",
    "policyNumber": "POL123456"
  }
}
```

### PUT /patients/:id/discharge
Discharge patient.

**Headers:** `Authorization: Bearer <staff_token>`

**Request Body:**
```json
{
  "dischargeDate": "2024-01-05T10:00:00.000Z",
  "dischargeSummary": "Patient recovered well, discharged in stable condition"
}
```

---

## Billing Endpoints

### GET /billing
Get all billing records.

**Headers:** `Authorization: Bearer <staff_token>`

**Query Parameters:**
- `paymentStatus` - Filter by payment status
- `billStatus` - Filter by bill status
- `department` - Filter by department
- `search` - Search by patient name, bill number, or patient ID
- `page` - Page number
- `limit` - Items per page

**Response:**
```json
{
  "bills": [
    {
      "_id": "bill_id",
      "billNumber": "BILL202401001",
      "patientName": "John Doe",
      "patientId": "PAT20240001",
      "departmentName": "General",
      "totalAmount": 15000,
      "totalPaid": 5000,
      "balanceAmount": 10000,
      "paymentStatus": "partial",
      "billStatus": "generated"
    }
  ]
}
```

### POST /billing/:id/charges/medical
Add medical charge to bill.

**Headers:** `Authorization: Bearer <staff_token>`

**Request Body:**
```json
{
  "description": "Blood test",
  "amount": 500,
  "category": "test"
}
```

### POST /billing/:id/charges/additional
Add additional charge to bill.

**Headers:** `Authorization: Bearer <staff_token>`

**Request Body:**
```json
{
  "description": "Phone charges",
  "amount": 100
}
```

### POST /billing/:id/payments
Add payment to bill.

**Headers:** `Authorization: Bearer <staff_token>`

**Request Body:**
```json
{
  "amount": 5000,
  "paymentMethod": "cash",
  "transactionId": "TXN123456",
  "notes": "Partial payment received"
}
```

### PUT /billing/:id/discounts
Apply discounts to bill.

**Headers:** `Authorization: Bearer <staff_token>`

**Request Body:**
```json
{
  "insuranceDiscount": 2000,
  "hospitalDiscount": 500,
  "otherDiscounts": 0
}
```

---

## Real-time Events (Socket.io)

### Client Events (Emit)
- `join-hospital` - Join hospital room for updates

### Server Events (Listen)
- `department-updated` - Department bed counts changed
- `bed-occupied` - Bed assigned to patient
- `bed-released` - Bed freed from patient
- `bed-status-updated` - Bed status changed
- `patient-admitted` - New patient admission
- `patient-discharged` - Patient discharge
- `billing-updated` - Bill information changed
- `payment-received` - New payment recorded

### Example Socket Usage
```javascript
import { io } from 'socket.io-client'

const socket = io('http://localhost:5000')

// Join hospital room
socket.emit('join-hospital', 'main')

// Listen for bed updates
socket.on('bed-occupied', (data) => {
  console.log('Bed occupied:', data)
  // Update UI accordingly
})

// Listen for department updates
socket.on('department-updated', (data) => {
  console.log('Department updated:', data)
  // Refresh department data
})
```

---

## Error Handling

### Common Error Responses

**Validation Error (400):**
```json
{
  "message": "Validation error",
  "error": "VALIDATION_ERROR",
  "errors": [
    {
      "field": "email",
      "message": "Please enter a valid email"
    }
  ]
}
```

**Authentication Error (401):**
```json
{
  "message": "Invalid token",
  "error": "INVALID_TOKEN"
}
```

**Authorization Error (403):**
```json
{
  "message": "Insufficient permissions",
  "error": "INSUFFICIENT_PERMISSIONS",
  "required": ["admin"],
  "current": "staff"
}
```

**Not Found Error (404):**
```json
{
  "message": "Patient not found",
  "error": "PATIENT_NOT_FOUND"
}
```

---

## Rate Limiting

API endpoints are rate limited to 100 requests per 15-minute window per IP address.

**Rate Limit Headers:**
- `X-RateLimit-Limit` - Request limit
- `X-RateLimit-Remaining` - Remaining requests
- `X-RateLimit-Reset` - Reset time

---

## Testing with cURL

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get Departments
```bash
curl -X GET http://localhost:5000/api/departments
```

### Get Bed Grid (with auth)
```bash
curl -X GET http://localhost:5000/api/beds/department/DEPT_ID/grid \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Admit Patient
```bash
curl -X POST http://localhost:5000/api/patients/admit \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "firstName": "John",
    "lastName": "Doe",
    "dateOfBirth": "1979-01-01",
    "gender": "Male",
    "contactNumber": "+1-555-1234",
    "departmentId": "DEPT_ID",
    "bedId": "BED_ID",
    "reasonForAdmission": "Chest pain",
    "emergencyContact": {
      "name": "Jane Doe",
      "relationship": "Spouse",
      "contactNumber": "+1-555-5678"
    }
  }'
```

