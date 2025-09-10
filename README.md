# RecruityHub

A marketplace that merges job recruitment with a bounty model. Companies post bounties for open roles (cash or percentage-based rewards for successful hires), and recruiters can browse and apply to bounties to earn income by sourcing candidates.

## Features

### Core Functionality
- **Bounty System**: Companies post bounties with cash or percentage-based payouts
- **Recruiter Collaboration**: Recruiters can express interest and work on bounties
- **Candidate Submissions**: Secure file upload system for CVs and candidate data
- **Company Profiles**: Dedicated pages for companies and their bounties
- **User Authentication**: Role-based access (Company/Recruiter) with Better Auth

### Pages & Routes
- `/` - Landing page with platform overview
- `/bounties` - Browse all active bounties (public)
- `/company/bounty/[id]` - Detailed bounty view with interaction features
- `/company/[id]` - Company profile with all their bounties
- `/my-bounties` - Recruiter dashboard for managing collaborations
- `/create` - Create new bounties with dynamic form builder
- `/account` - User profile and activity dashboard
- `/sign-in` & `/sign-up` - Authentication pages

### Key Features
- **Dynamic Form Builder**: Companies can create custom submission forms
- **Real-time Collaboration**: Recruiters can express interest and get unlocked
- **File Upload System**: Secure CV and document handling
- **Responsive Design**: Mobile-first approach with modern UI
- **Type Safety**: Full TypeScript implementation

## Tech Stack

- **Framework**: Nuxt 4 with Vue 3
- **Styling**: Tailwind CSS + Shadcn/ui components
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (prod)
- **Authentication**: Better Auth with email/password
- **File Handling**: Built-in file upload system
- **Type Safety**: TypeScript throughout

## Database Schema

The application uses a comprehensive database schema with the following key models:

- **User**: Base user authentication with role-based access
- **Company**: Company profiles and information
- **Recruiter**: Recruiter profiles with specialties
- **Bounty**: Job bounties with payout information
- **RecruiterCollaboration**: Manages recruiter-bounty relationships
- **Submission**: Candidate submissions with file attachments
- **BountyNote**: Comments and communication on bounties
- **Payout**: Payment tracking for successful hires

## Setup

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm

### Installation

1. **Clone and install dependencies:**
```bash
git clone <repository-url>
cd recruityhub
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env
```

Edit `.env` with your configuration:
```env
DATABASE_URL="file:./dev.db"  # SQLite for development
BETTER_AUTH_SECRET="your-secret-key-here"
```

3. **Set up the database:**
```bash
# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Seed sample data
npm run db:seed
```

4. **Start development server:**
```bash
npm run dev
```

Visit `http://localhost:3000` to see the application.

## Development

### Database Management
```bash
# View database in Prisma Studio
npx prisma studio

# Reset database
npx prisma migrate reset

# Deploy migrations to production
npx prisma migrate deploy
```

### Sample Data
The seed script creates sample companies, recruiters, and bounties for testing:
- TechCorp Solutions (company with 2 bounties)
- StartupXYZ (company with 2 bounties)  
- Jane Smith (sample recruiter)

### API Endpoints

#### Public Endpoints
- `GET /api/bounties` - List all open bounties
- `GET /api/bounties/[id]` - Get bounty details
- `GET /api/companies/[id]` - Get company profile

#### Authenticated Endpoints
- `POST /api/bounties` - Create new bounty
- `POST /api/bounties/[id]/collaborate` - Express interest in bounty
- `POST /api/bounties/[id]/notes` - Add note to bounty
- `GET /api/recruiter/collaborations` - Get recruiter's bounties
- `GET /api/user/*` - User profile and stats

## User Flows

### Company Flow
1. Sign up as Company
2. Create company profile (on first bounty)
3. Post bounty with requirements and payout
4. Review recruiter interest
5. Unlock recruiters for submissions
6. Review candidate submissions
7. Mark successful hires

### Recruiter Flow
1. Sign up as Recruiter
2. Browse available bounties
3. Express interest ("Let's Work Together")
4. Wait for company approval
5. Submit candidates with CVs
6. Track submission status
7. Receive payouts for successful hires

## Production Deployment

### Environment Setup
Update `.env` for production:
```env
DATABASE_URL="postgresql://user:password@host:5432/recruityhub"
BETTER_AUTH_SECRET="secure-random-key"
```

### Build and Deploy
```bash
# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Your chosen license]

## Support

For support or questions, please create an issue or contact the development team.