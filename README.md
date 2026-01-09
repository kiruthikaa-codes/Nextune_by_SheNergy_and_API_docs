# Nextune - Vehicle Service Orchestration Platform

A modern, AI-powered vehicle maintenance and predictive service platform with separate customer and dealership admin interfaces.
http://localhost:5000/api-docs/ ( to view Swagger API documentation)

## Project Structure

```
SheNergy/
├── frontend/                    # Next.js React Frontend
│   ├── src/
│   │   ├── app/                # Next.js App Router
│   │   │   ├── layout.tsx       # Root layout
│   │   │   ├── page.tsx         # Login page
│   │   │   ├── customer/        # Customer screens
│   │   │   └── admin/           # Admin screens
│   │   ├── components/          # Reusable React components
│   │   ├── lib/                 # Utility functions
│   │   └── styles/              # Global CSS
│   ├── public/                  # Static assets
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── tsconfig.json
│
├── backend/                     # Express.js Backend
│   ├── src/
│   │   ├── app.ts               # Express app setup
│   │   ├── config/              # Configuration
│   │   ├── controllers/         # Request handlers
│   │   ├── middleware/          # Express middleware
│   │   ├── models/              # Database models
│   │   ├── routes/              # API routes
│   │   ├── services/            # Business logic
│   │   └── utils/               # Helper functions
│   ├── .env                     # Environment variables
│   ├── package.json
│   ├── tsconfig.json
│   └── dist/                    # Compiled JavaScript
│
└── README.md                    # This file
```

## Technology Stack

### Frontend
- **Framework**: Next.js 14 with TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Lucide React icons
- **State Management**: React Hooks
- **Forms**: React Hook Form
- **Animations**: Framer Motion

### Backend
- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose
- **Language**: TypeScript
- **Authentication**: JWT (to be implemented)
- **Validation**: Zod

## Design System

### Color Palette
- **Primary Dark**: `#0A1A2F`
- **Electric Blue**: `#00E5FF`
- **Neon Green**: `#00FF9D`
- **Electric Cyan**: `#54FFFF`
- **Warning Yellow**: `#FFE066`
- **Text Light**: `#E6F1FF`
- **Card Dark**: `#11263F`

### Typography
- **Font Family**: Inter, Poppins, SF Pro
- **Font Sizes**: Responsive scaling
- **Font Weights**: 400 (regular), 500 (medium), 600 (semibold), 700 (bold)

### Effects
- Glassmorphism cards with backdrop blur
- Neon glow effects on buttons and highlights
- Smooth transitions and animations
- Hover effects with scale transforms

## Getting Started

### Prerequisites
- Node.js 18+ and npm/yarn
- MongoDB (local or cloud instance)

### Installation

#### 1. Frontend Setup
```bash
cd frontend
npm install
```

#### 2. Backend Setup
```bash
cd backend
npm install
```

### Environment Configuration

#### Backend (.env)
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/unified-predictive-service
JWT_SECRET=your_jwt_secret_key_here
JWT_EXPIRES_IN=90d
JWT_COOKIE_EXPIRES_IN=90
```

### Running the Application

#### Development Mode

**Terminal 1 - Frontend**
```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:3000
```

**Terminal 2 - Backend**
```bash
cd backend
npm run dev
# Backend runs on http://localhost:5000
```

#### Production Build

**Frontend**
```bash
cd frontend
npm run build
npm start
```

**Backend**
```bash
cd backend
npm run build
npm start
```

## Features

### Customer Interface
1. **Login Screen** - Secure authentication with email/phone and password
2. **Home Screen** - Vehicle overview with health indicators
3. **Predictive Maintenance Alerts** - Upcoming service notifications
4. **Dealership Finder** - Search and filter dealerships by availability
5. **Appointment Scheduler** - Book service appointments with time slots
6. **Booking Confirmation** - Confirmation details and calendar integration
7. **Chatbot Assistant** - AI-powered support for service inquiries

### Dealership Admin Interface
1. **Dashboard** - Overview of appointments, parts, RFQs, and services
2. **Service Check-In** - Vehicle details and maintenance results
3. **Parts Availability** - Inventory management and vendor tracking
4. **RFQ Management** - Request for Quote handling and vendor quotes
5. **Appointment Management** - Booking management and technician assignment

## API Endpoints (To Be Implemented)

### Authentication
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/logout` - User logout
- `POST /api/v1/auth/refresh` - Refresh JWT token

### Vehicles
- `GET /api/v1/vehicles` - Get user's vehicles
- `GET /api/v1/vehicles/:id` - Get vehicle details
- `POST /api/v1/vehicles` - Add new vehicle
- `PUT /api/v1/vehicles/:id` - Update vehicle

### Appointments
- `GET /api/v1/appointments` - Get appointments
- `POST /api/v1/appointments` - Create appointment
- `PUT /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Cancel appointment

### Dealerships
- `GET /api/v1/dealerships` - Get all dealerships
- `GET /api/v1/dealerships/:id` - Get dealership details
- `GET /api/v1/dealerships/:id/availability` - Check parts availability

### Parts
- `GET /api/v1/parts` - Get parts inventory
- `GET /api/v1/parts/:id` - Get part details
- `PUT /api/v1/parts/:id` - Update part inventory

## Database Schema (To Be Implemented)

### Collections
- **Users** - Customer and admin users
- **Vehicles** - Vehicle information
- **Appointments** - Service appointments
- **Dealerships** - Dealership information
- **Parts** - Parts inventory
- **RFQs** - Request for Quotes
- **MaintenanceHistory** - Service history

## Development Guidelines

### Code Style
- Use TypeScript for type safety
- Follow ESLint configuration
- Use Prettier for code formatting
- Component-based architecture for frontend
- MVC pattern for backend

### Naming Conventions
- **Components**: PascalCase (e.g., `LoginForm.tsx`)
- **Functions**: camelCase (e.g., `handleSubmit()`)
- **Constants**: UPPER_SNAKE_CASE (e.g., `API_BASE_URL`)
- **Files**: kebab-case for utilities, PascalCase for components

### Git Workflow
1. Create feature branch: `git checkout -b feature/feature-name`
2. Commit changes: `git commit -m "feat: description"`
3. Push to remote: `git push origin feature/feature-name`
4. Create Pull Request for review

## Testing (To Be Implemented)

### Frontend Tests
```bash
npm run test
```

### Backend Tests
```bash
npm run test
```

## Deployment

### Frontend Deployment
- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

### Backend Deployment
- Heroku
- Railway
- AWS EC2 / ECS
- DigitalOcean

## Performance Optimization

### Frontend
- Image optimization with Next.js Image component
- Code splitting and lazy loading
- CSS-in-JS optimization
- Caching strategies

### Backend
- Database indexing
- API response caching
- Rate limiting
- Compression middleware

## Security Considerations

- JWT token validation
- CORS configuration
- Input validation and sanitization
- SQL injection prevention (Mongoose)
- XSS protection
- HTTPS enforcement
- Environment variable protection

## Future Enhancements

- [ ] Real-time notifications with WebSockets
- [ ] Mobile app (React Native)
- [ ] Advanced analytics dashboard
- [ ] Machine learning for predictive maintenance
- [ ] Integration with vehicle OBD-II systems
- [ ] Multi-language support
- [ ] Dark/Light theme toggle
- [ ] Two-factor authentication
- [ ] Payment gateway integration
- [ ] SMS/Email notifications

## Troubleshooting

### Frontend Issues
- Clear `.next` folder and reinstall dependencies
- Check Node.js version compatibility
- Verify Tailwind CSS configuration

### Backend Issues
- Ensure MongoDB is running
- Check environment variables
- Verify port availability
- Check database connection string

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is proprietary and confidential.

## Support

For support, contact the development team or create an issue in the repository.

---

## SheNergy JSON Backend (Bangalore Prototype)

This repository also contains a JSON-file–backed prototype backend for **SheNergy**, an automotive assistant focused on **Bangalore**.

### Backend Characteristics

- No database (no MongoDB). All data is stored under `backend/data/*.json`:
  - `customers.json`, `dealerships.json`, `services_master.json`, `service_history.json`, `appointments.json`.
- Predictive maintenance uses a Python model in `backend/predictive_model/model.py` invoked via stdin/stdout.
- All sample dealerships are Bangalore-based (e.g., Trident Hyundai, Indiranagar).

### Running the JSON Backend

1. Install dependencies:

```bash
cd backend
npm install
```

2. Configure env (create `.env` from `.env.example`):

```env
PORT=5000
PYTHON_PATH=python
MODEL_TIMEOUT_MS=20000
```

3. Run in development mode:

```bash
npm run dev
# http://localhost:5000
```

4. Build and run in production mode:

```bash
npm run build
node dist/server.js
```

### Key JSON-Based API Endpoints

All endpoints are under `/api`.

#### 1. Health

```bash
curl http://localhost:5000/api/health
```

#### 2. Auth (JSON customers)

Signup:

```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test.user@example.in",
    "phone": "+91-90000-00000",
    "username": "test_blr",
    "password": "password123"
  }'
```

Login:

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "arjun_blr",
    "password": "password123"
  }'
```

#### 3. Services Master

```bash
curl http://localhost:5000/api/services/list
```

#### 4. Dealerships & Ranking

List Bangalore dealerships:

```bash
curl http://localhost:5000/api/dealerships
```

Rank dealerships for a vehicle and requested services:

```bash
curl -X POST http://localhost:5000/api/dealerships/rank \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST_BLR_001",
    "vin": "MH12AB1234",
    "service_codes_requested": ["PERIODIC_10K", "BRAKE_CHECK"]
  }'
```

#### 5. Predictive Maintenance

```bash
curl -X POST http://localhost:5000/api/predict-maintenance \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST_BLR_001",
    "vin": "MH12AB1234"
  }'
```

#### 6. Inventory Check (non-revealing)

```bash
curl -X POST http://localhost:5000/api/inventory/check \
  -H "Content-Type: application/json" \
  -d '{
    "dealership_id": "DLR_BLR_001",
    "inventory_needed": ["Engine Oil 5W30", "Brake Pads Front"]
  }'
```

If parts are missing, response will be:

```json
{
  "inventory_ok": false,
  "message": "Some required parts are currently unavailable. Are you okay with a delay?"
}
```

#### 7. Appointments

Book appointment (assuming inventory already checked):

```bash
curl -X POST http://localhost:5000/api/appointments/book \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST_BLR_002",
    "vin": "KA03MN4321",
    "dealership_id": "DLR_BLR_001",
    "service_codes_requested": ["PERIODIC_20K"],
    "requested_datetime": "2024-12-15T10:00:00+05:30",
    "inventory_needed": ["Engine Oil 5W30", "Oil Filter Hyundai"],
    "inventory_ok": true
  }'
```

List a customer’s appointments:

```bash
curl "http://localhost:5000/api/appointments/list?customer_id=CUST_BLR_002"
```

#### 8. Chatbot Orchestration (Prototype)

Create chat session:

```bash
curl -X POST http://localhost:5000/api/chat/session \
  -H "Content-Type: application/json" \
  -d '{
    "customer_id": "CUST_BLR_002",
    "vin": "KA03MN4321"
  }'
```

Send a message describing issues (pickup drop, brake spongy, etc.):

```bash
curl -X POST http://localhost:5000/api/chat/message \
  -H "Content-Type: application/json" \
  -d '{
    "session_id": "<SESSION_ID_FROM_PREVIOUS_STEP>",
    "message": "Pickup drop and brake pedal feels spongy in Bangalore traffic"
  }'
```

If required parts are missing, the response will ask:

> "Some required parts are currently unavailable. Are you okay with a delay?"

Reply with another `/api/chat/message` call containing **YES** or **NO** to either confirm a delayed appointment or re-run dealership ranking.

---

**Last Updated**: November 29, 2025
**Version**: 1.0.0
