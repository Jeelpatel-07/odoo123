# replit.md

## Overview

This is a full-stack skill exchange platform called "SkillSwap" built with React and Express. The application allows users to exchange skills without monetary transactions, connecting people who want to learn new skills with those who can teach them.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **UI Library**: Radix UI components with shadcn/ui styling system
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Forms**: React Hook Form with Zod validation

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon serverless PostgreSQL
- **Authentication**: Replit Auth with OpenID Connect
- **Session Management**: PostgreSQL-backed sessions using connect-pg-simple
- **File Uploads**: Multer for handling multipart form data

### Key Design Decisions
1. **Monorepo Structure**: Shared schema and types between client and server in `/shared` directory
2. **Glass Morphism UI**: Modern glassmorphism design with backdrop blur effects
3. **Serverless Database**: Uses Neon serverless PostgreSQL for scalability
4. **Type Safety**: Full TypeScript coverage with shared types and Zod validation
5. **Authentication**: Replit Auth for seamless integration in Replit environment

## Key Components

### Database Schema
- **users**: User profiles with Replit Auth integration
- **skills**: Skills offered by users with categories, levels, and availability
- **swaps**: Skill exchange requests and transactions
- **messages**: Communication between users
- **reviews**: Rating system for completed swaps
- **files**: File attachments for skills and messages
- **sessions**: Session storage for authentication

### API Endpoints
- **Auth**: `/api/auth/*` - Authentication and user management
- **Skills**: `/api/skills/*` - CRUD operations for skills
- **Swaps**: `/api/swaps/*` - Managing skill exchanges
- **Messages**: `/api/messages/*` - User communication
- **Reviews**: `/api/reviews/*` - Rating and feedback system
- **Files**: `/api/files/*` - File upload and management

### Frontend Pages
- **Landing**: Marketing page for non-authenticated users
- **Home**: Dashboard for authenticated users
- **Browse Skills**: Search and filter available skills
- **Add Skill**: Form to create new skill offerings
- **My Swaps**: Manage ongoing and completed exchanges
- **Community**: Social features and user discovery

## Data Flow

1. **Authentication**: Users authenticate through Replit Auth
2. **Skill Discovery**: Users browse skills with search/filter capabilities
3. **Swap Initiation**: Users request skill exchanges
4. **Communication**: Built-in messaging system for coordination
5. **Completion**: Review and rating system for quality assurance

## External Dependencies

### Core Technologies
- **React**: Frontend framework
- **Express**: Backend framework
- **Drizzle ORM**: Type-safe database queries
- **TanStack Query**: Server state management
- **Radix UI**: Accessible component primitives
- **Tailwind CSS**: Utility-first styling

### Services
- **Neon Database**: Serverless PostgreSQL hosting
- **Replit Auth**: Authentication service
- **Wouter**: Lightweight routing

### Development Tools
- **Vite**: Build tool and dev server
- **TypeScript**: Type safety
- **Zod**: Runtime type validation
- **ESBuild**: Production bundling

## Deployment Strategy

### Development
- **Dev Server**: `npm run dev` runs both frontend and backend
- **Database**: `npm run db:push` syncs schema changes
- **Hot Reload**: Vite provides fast refresh for frontend changes

### Production
- **Build Process**: `npm run build` creates optimized bundles
- **Frontend**: Static files served from `/dist/public`
- **Backend**: Bundled with ESBuild for Node.js deployment
- **Database**: Migrations stored in `/migrations` directory

### Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `SESSION_SECRET`: Session encryption key
- `REPL_ID`: Replit environment identifier
- `ISSUER_URL`: OpenID Connect issuer (defaults to Replit)

The application is designed to run seamlessly in the Replit environment with automatic authentication and database provisioning.