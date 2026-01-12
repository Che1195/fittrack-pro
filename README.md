# FitTrack Pro

A modern personal trainer app for managing clients and tracking training sessions.

## Features

- **Secure Authentication** - Login with Replit Auth
- **Client Management** - Full CRUD operations for managing your clients
- **Session Tracking** - Log training sessions with date, duration, and notes
- **Payment Tracking** - Mark sessions as paid/unpaid
- **Mobile-Friendly** - Responsive design with bottom navigation
- **Modern UI** - Material-inspired design with glass-morphism effects

## Tech Stack

- **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI
- **Backend**: Express.js, Node.js
- **Database**: PostgreSQL with Drizzle ORM
- **Authentication**: Replit Auth (OpenID Connect)

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables (DATABASE_URL, SESSION_SECRET)
4. Push database schema: `npm run db:push`
5. Start development server: `npm run dev`

## License

MIT
