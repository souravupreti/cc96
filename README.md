# Service Booking Web App

A full-stack service booking platform (MakeMyTrip/Urban Company style) built with React, Node.js, Express, and MongoDB.

## 🚀 Features

### Customer Features
- Mobile number + OTP-based signup
- Browse and book services
- Track booking status (Pending/Accepted/Delivered)
- View booking history

### Vendor Features
- Email + password login
- View assigned bookings
- Accept/reject bookings
- Mark services as delivered

## 🛠️ Tech Stack

- **Frontend**: React.js (Vite), Tailwind CSS, Axios
- **Backend**: Node.js, Express.js, MongoDB Atlas
- **Authentication**: JWT tokens
- **OTP**: Simulated with console.log in backend
- **Testing**: Jest + Supertest (backend), Vitest + React Testing Library (frontend)
- **Hosting**: Vercel (frontend), Render (backend)

## 📋 Prerequisites

- Node.js 18+ installed
- MongoDB Atlas account (free tier available)
- GitHub account for version control
- Vercel account for frontend hosting
- Render account for backend hosting

## 🔧 Local Setup

### Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file with MongoDB Atlas connection string and JWT secret
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/bookingapp
# JWT_SECRET=your_super_secret_key
# PORT=5000

# Seed database with sample data
npm run seed

# Run development server
npm run dev

# Run tests
npm test

# Run tests with coverage
npm test -- --coverage
```

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
# VITE_API_URL=http://localhost:5000

# Run development server
npm run dev

# Run tests
npm test

# Build for production
npm build
```

## 🧪 Testing

### Backend Tests

Tests cover all API endpoints with comprehensive scenarios:

```bash
cd backend

# Run all tests with coverage
npm test

# Run tests in watch mode
npm test:watch
```

**Test Coverage:**
- Auth APIs (send OTP, verify OTP, register, login)
- Booking APIs (create, retrieve, accept, deliver)
- Service APIs (list all services)
- Error handling and validation

### Frontend Tests

```bash
cd frontend

# Run all tests
npm test

# Run tests with coverage
npm test:coverage
```

**Test Coverage:**
- Component rendering (Landing, Navbar, Cards)
- Form validation (Login, Signup, Booking)
- OTP input validation (6-digit numeric only)
- Status badge colors

## 📚 Database Models

### Customer
- name, mobile (unique), passwordHash, isVerified, createdAt

### Vendor
- name, email (unique), passwordHash, serviceCategory, createdAt

### Booking
- customerId, vendorId, serviceId, date, time, address, status, createdAt, updatedAt

### Service
- name, description, basePrice, icon, category, createdAt

### OTP (Auto-deleted after 5 minutes)
- mobile, otp, expiresAt (TTL index)

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/customer/send-otp` - Send OTP to mobile
- `POST /api/auth/customer/verify-otp` - Verify OTP
- `POST /api/auth/customer/register` - Create customer account
- `POST /api/auth/customer/login` - Customer login
- `POST /api/auth/vendor/login` - Vendor login

### Bookings (Protected)
- `POST /api/bookings` - Create booking
- `GET /api/bookings/customer/:id` - Get customer bookings
- `GET /api/bookings/vendor/:id` - Get vendor bookings
- `PATCH /api/bookings/:id/accept` - Accept booking (vendor only)
- `PATCH /api/bookings/:id/deliver` - Mark delivered (vendor only)

### Services
- `GET /api/services` - Get all services

## 🌐 Deployment

### Backend Deployment (Render)

1. **Prepare GitHub Repository**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin <YOUR_REPO_URL>
   git push -u origin main
   ```

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Create new "Web Service"
   - Connect GitHub repository
   - Set environment variables:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `JWT_SECRET`: Generate a strong secret
     - `NODE_ENV`: production
   - Deploy

3. **Get Backend URL**
   - Render provides a URL like: `https://service-booking-api.onrender.com`

### Frontend Deployment (Vercel)

1. **Push to GitHub**
   ```bash
   cd frontend
   git init
   git add .
   git commit -m "Frontend initial commit"
   ```

2. **Deploy to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Import GitHub repository
   - Set environment variables:
     - `VITE_API_URL`: Your Render backend URL
   - Deploy

3. **Get Frontend URL**
   - Vercel provides a URL like: `https://service-booking.vercel.app`

## 🔐 Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/bookingapp
JWT_SECRET=your_super_secret_jwt_key_change_in_production
PORT=5000
NODE_ENV=production
```

### Frontend (.env)
```
VITE_API_URL=https://service-booking-api.onrender.com
```

## 📱 Test Credentials

### Customer
- Signup: Use any 10-digit mobile number
- OTP will be printed in backend console
- Set password during registration

### Vendor (Pre-seeded)
- Email: `vendor@test.com`
- Password: `vendor123`

## 🎯 Services Available

1. **Home Cleaning** - ₹500
2. **Plumbing** - ₹700
3. **Electrician** - ₹800
4. **Painting** - ₹1000
5. **Pest Control** - ₹600

## 🐛 Debugging

### Backend Console
- OTP values are logged when sent
- API errors logged to console
- MongoDB connection logs available

### Frontend
- Check browser DevTools (F12)
- Network tab shows all API calls
- Console logs any errors

## 📊 Project Structure

```
project-root/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── controllers/
│   ├── middleware/
│   ├── utils/
│   ├── tests/
│   ├── seed/
│   └── server.js
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── context/
│   │   ├── utils/
│   │   ├── tests/
│   │   └── App.jsx
│   └── package.json
└── README.md
```

## 🚀 Performance Tips

- Images are optimized through Tailwind CSS
- JWT tokens cached in localStorage
- API calls debounced in components
- Booking list auto-refreshes every 30 seconds

## 📝 Common Issues

### OTP Not Appearing
- Check backend console terminal for "[OTP DEBUG]" message
- Ensure mobile format is correct (10 digits)

### Login Failed
- Verify credentials in database
- Check MongoDB connection
- Ensure JWT_SECRET matches between .env files

### CORS Errors
- Verify frontend and backend URLs match
- Check environment variables
- Restart backend server

## 🔄 Refresh Bookings

- Use "Refresh" button on My Bookings page
- Automatically refreshes every 30 seconds
- Vendor Dashboard updates in real-time

## 📞 Support

For issues:
1. Check browser console (F12)
2. Check backend terminal for errors
3. Verify MongoDB Atlas cluster status
4. Ensure all environment variables are set

## 📄 License

MIT License

---

**Deployed URLs** (after deployment):
- Frontend: [Your Vercel URL]
- Backend API: [Your Render URL]

