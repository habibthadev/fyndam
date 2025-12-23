# Fyndam - Music Recognition Application

A production-ready Shazam-like music recognition application built with a clean architecture backend and modern React frontend.

## Architecture

### Backend (`/server`)

- **Clean Architecture** with strict separation of concerns
- **Domain Layer**: Entities, value objects, and interfaces
- **Application Layer**: Use cases and business logic
- **Infrastructure Layer**: External services (audd.io, MongoDB, logging)
- **Interface Layer**: HTTP controllers, routes, and DTOs
- **Technology Stack**: Node.js, TypeScript, Express, MongoDB, Zod, Pino

### Frontend (`/client`)

- **Modern React** with TypeScript
- **State Management**: Zustand + TanStack React Query
- **UI Framework**: TailwindCSS + shadcn/ui + Radix UI
- **Routing**: React Router DOM
- **Audio Processing**: MediaRecorder API with browser microphone support
- **Design**: Vercel-inspired black & white aesthetic with dark/light mode

## Features

- **Live Audio Recognition**: Record audio from microphone in real-time
- **File Upload**: Upload mp3, wav, or m4a files for recognition
- **Recognition History**: View all past recognitions with full details
- **Rich Metadata**: Artist, title, album, release date, Spotify/Apple Music links
- **Responsive Design**: Mobile-first and fully accessible
- **Type-Safe**: End-to-end type safety with Zod schemas
- **Production Ready**: Rate limiting, error handling, validation, logging

## Setup

### Prerequisites

- Node.js 18+
- MongoDB instance
- audd.io API key

### Backend Setup

```bash
cd server
npm install
cp .env.example .env
# Edit .env with your configuration
npm run dev
```

Environment variables:

```
AUDD_API_KEY=your_api_key
MONGODB_URI=mongodb://localhost:27017/fyndam
PORT=3000
NODE_ENV=development
ALLOWED_ORIGINS=http://localhost:5173
MAX_FILE_SIZE_MB=10
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Frontend Setup

```bash
cd client
npm install
cp .env.example .env
# Edit .env with your API URL
npm run dev
```

Environment variables:

```
VITE_API_URL=http://localhost:3000/api/v1
```

## API Documentation

Once the server is running, visit:

```
http://localhost:3000/api/docs
```

### Endpoints

- `POST /api/v1/recognize/upload` - Upload audio file for recognition
- `POST /api/v1/recognize/stream` - Recognize from audio stream chunks
- `GET /api/v1/history` - Get recognition history (paginated)
- `GET /api/v1/history/:id` - Get specific recognition by ID
- `GET /api/v1/health` - Health check

## Testing

### Backend Tests

```bash
cd server
npm test
npm run test:coverage
```

### Frontend Tests

```bash
cd client
npm test
npm run test:coverage
```

## Deployment

### Vercel Deployment

Both backend and frontend are configured for Vercel deployment.

**Backend:**

```bash
cd server
vercel
```

**Frontend:**

```bash
cd client
vercel
```

Update environment variables in Vercel dashboard for production.

## Project Structure

```
fyndam/
├── server/
│   ├── src/
│   │   ├── domain/           # Entities, value objects, interfaces
│   │   ├── application/      # Use cases
│   │   ├── infrastructure/   # External services, DB, config
│   │   ├── interface/        # Controllers, routes, DTOs
│   │   └── tests/           # Unit and integration tests
│   ├── package.json
│   └── vercel.json
├── client/
│   ├── src/
│   │   ├── components/      # UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom hooks
│   │   ├── stores/         # Zustand stores
│   │   ├── lib/            # Utilities, API client
│   │   ├── types/          # TypeScript types
│   │   └── tests/          # Component tests
│   ├── package.json
│   └── vercel.json
└── README.md
```

## License

MIT
