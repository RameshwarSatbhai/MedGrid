# MedGrid - Hospital Bed Tracking System

A comprehensive MERN stack hospital bed tracking system with real-time bed management, patient admission/discharge functionality, and billing module.

## 🏥 Overview

MedGrid is a modern hospital management system designed to streamline bed allocation, patient management, and billing processes. The system provides real-time updates using WebSocket technology and features a movie ticket booking-style bed selection interface.

## ✨ Key Features

### Public Features
- **Real-time Bed Availability**: Public view of hospital departments and bed availability
- **Department Overview**: Visual representation of bed occupancy with color-coded availability
- **Responsive Design**: Mobile-friendly interface for all devices

### Staff Features
- **Authentication System**: Role-based access control (Admin, Doctor, Nurse, Staff)
- **Bed Grid Layout**: Movie ticket booking-style bed selection interface
- **Patient Management**: Complete patient admission, discharge, and record management
- **Billing Module**: Comprehensive billing system with payment tracking
- **Real-time Updates**: Live updates for bed status, patient admissions, and payments

### Technical Features
- **MERN Stack**: MongoDB, Express.js, React, Node.js
- **Real-time Communication**: Socket.io for live updates
- **Responsive UI**: Tailwind CSS with shadcn/ui components
- **RESTful API**: Well-structured API endpoints
- **Data Validation**: Comprehensive input validation and error handling

## 🎯 Core Functionality

### Bed Management
- **Grid Layout**: Visual bed arrangement similar to movie theater seating
- **Status Tracking**: Available, Occupied, Maintenance, Cleaning
- **Color Coding**: 
  - 🟢 Green: ≥60% availability
  - 🟡 Yellow: 30-59% availability
  - 🔴 Red: <30% availability
- **Real-time Updates**: Instant bed status changes across all connected clients

### Patient Management
- **Admission Process**: Link bed selection to patient admission forms
- **Patient Records**: Complete medical history and contact information
- **Discharge Process**: Automated bed release and billing finalization
- **Search & Filter**: Advanced patient search and filtering capabilities

### Billing System
- **Automated Billing**: Automatic bill generation upon patient admission
- **Payment Tracking**: Multiple payment methods and partial payment support
- **Charge Management**: Medical charges, additional charges, and discounts
- **Payment Status**: Pending, Partial, Paid, Overdue tracking

## 🏗️ System Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   React Client  │    │  Express Server │    │   MongoDB       │
│                 │    │                 │    │                 │
│ - Public View   │◄──►│ - REST API      │◄──►│ - User Data     │
│ - Staff Portal  │    │ - Authentication│    │ - Patient Data  │
│ - Real-time UI  │    │ - Socket.io     │    │ - Bed Data      │
│                 │    │ - Business Logic│    │ - Billing Data  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- pnpm (for frontend)
- npm (for backend)

### Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd MedGrid
   ```

2. **Start the application**
   ```bash
   ./start.sh
   ```

   This script will:
   - Install all dependencies
   - Initialize the database with demo data
   - Start both backend and frontend servers

3. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000
   - API Health Check: http://localhost:5000/api/health

### Demo Credentials
```
Admin:  admin  / admin123
Doctor: doctor / doctor123
Nurse:  nurse  / nurse123
Staff:  staff  / staff123
```

## 📁 Project Structure

```
MedGrid/
├── backend/                 # Node.js/Express backend
│   ├── models/             # MongoDB schemas
│   ├── routes/             # API endpoints
│   ├── middleware/         # Authentication & validation
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
├── frontend/               # React frontend
│   └── medgrid-frontend/
│       ├── src/
│       │   ├── components/ # Reusable components
│       │   ├── pages/      # Page components
│       │   ├── contexts/   # React contexts
│       │   └── utils/      # API utilities
│       └── public/         # Static assets
├── start.sh               # Startup script
└── README.md              # This file
```

## 🔧 Manual Setup

If you prefer to set up the application manually:

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env  # Configure environment variables
node utils/initDatabase.js  # Initialize database
npm run dev  # Start development server
```

### Frontend Setup
```bash
cd frontend/medgrid-frontend
pnpm install
cp .env.example .env  # Configure environment variables
pnpm run dev --host  # Start development server
```

## 🌐 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user (Admin only)
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update user profile

### Department Endpoints
- `GET /api/departments` - Get all departments
- `GET /api/departments/:id` - Get department by ID
- `POST /api/departments` - Create department (Admin only)
- `PUT /api/departments/:id` - Update department (Admin only)

### Bed Endpoints
- `GET /api/beds` - Get all beds
- `GET /api/beds/department/:id/grid` - Get bed grid layout
- `PUT /api/beds/:id/occupy` - Occupy bed with patient
- `PUT /api/beds/:id/release` - Release bed
- `PUT /api/beds/:id/status` - Update bed status

### Patient Endpoints
- `GET /api/patients` - Get all patients
- `POST /api/patients/admit` - Admit new patient
- `PUT /api/patients/:id/discharge` - Discharge patient
- `GET /api/patients/:id/history` - Get patient history

### Billing Endpoints
- `GET /api/billing` - Get all bills
- `POST /api/billing/:id/payments` - Add payment
- `POST /api/billing/:id/charges/medical` - Add medical charge
- `PUT /api/billing/:id/discounts` - Apply discounts

## 🔄 Real-time Features

The application uses Socket.io for real-time communication:

### Events
- `department-updated` - Department bed counts changed
- `bed-occupied` - Bed assigned to patient
- `bed-released` - Bed freed from patient
- `patient-admitted` - New patient admission
- `patient-discharged` - Patient discharge
- `billing-updated` - Bill information changed
- `payment-received` - New payment recorded

## 🎨 UI/UX Features

### Color Coding System
- **Green (≥60% availability)**: Good availability
- **Yellow (30-59% availability)**: Moderate availability  
- **Red (<30% availability)**: Low availability

### Responsive Design
- Mobile-first approach
- Touch-friendly bed selection
- Adaptive layouts for all screen sizes
- Optimized for both desktop and mobile use

### Accessibility
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes
- Clear visual indicators

## 🔒 Security Features

- **JWT Authentication**: Secure token-based authentication
- **Role-based Access Control**: Different permissions for different roles
- **Input Validation**: Comprehensive data validation
- **Password Hashing**: Secure password storage with bcrypt
- **CORS Protection**: Configured cross-origin resource sharing
- **Rate Limiting**: API rate limiting to prevent abuse

## 📊 Database Schema

### Collections
- **Users**: Staff authentication and profiles
- **Departments**: Hospital departments (General, ICU)
- **Beds**: Individual bed records with positions
- **Patients**: Patient information and admission details
- **Billing**: Financial records and payment tracking

### Key Relationships
- Departments → Beds (One-to-Many)
- Patients → Beds (One-to-One when admitted)
- Patients → Billing (One-to-Many)
- Users → Patients (Many-to-Many via admissions)

## 🚀 Deployment

### Production Deployment
1. Set up MongoDB Atlas or production MongoDB instance
2. Configure environment variables for production
3. Build frontend for production: `pnpm run build`
4. Deploy backend to cloud service (Heroku, AWS, etc.)
5. Deploy frontend to static hosting (Netlify, Vercel, etc.)

### Environment Variables

#### Backend (.env)
```
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb://localhost:27017/medgrid
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRE=7d
CLIENT_URL=http://localhost:3000
```

#### Frontend (.env)
```
VITE_API_URL=http://localhost:5000/api
VITE_SOCKET_URL=http://localhost:5000
VITE_APP_NAME=MedGrid
VITE_APP_VERSION=1.0.0
```

## 🧪 Testing

### Manual Testing Checklist
- [ ] Public bed availability view
- [ ] Staff login with different roles
- [ ] Bed grid visualization and interaction
- [ ] Patient admission process
- [ ] Patient discharge process
- [ ] Billing creation and payment
- [ ] Real-time updates across multiple browsers
- [ ] Mobile responsiveness
- [ ] Color coding accuracy

### Test Scenarios
1. **Public User**: View bed availability without login
2. **Staff Login**: Authenticate with different role credentials
3. **Bed Selection**: Click available beds to start admission
4. **Patient Admission**: Complete patient admission form
5. **Real-time Updates**: Verify live updates in multiple browser tabs
6. **Patient Discharge**: Discharge patient and verify bed release
7. **Billing Management**: Add charges and payments
8. **Mobile Usage**: Test on mobile devices

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the demo credentials and test data

## 🔮 Future Enhancements

- **Mobile App**: React Native mobile application
- **Advanced Analytics**: Reporting and analytics dashboard
- **Integration**: EMR/EHR system integration
- **Notifications**: SMS/Email notifications for staff
- **Inventory Management**: Medical equipment tracking
- **Appointment Scheduling**: Patient appointment system
- **Multi-hospital Support**: Support for multiple hospital locations

---

**MedGrid** - Streamlining hospital bed management with modern technology.

