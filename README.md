# Homes Better Hands (HBH) - Real Estate Platform

A comprehensive real estate platform with property listings, transaction management, service marketplace, and real-time communication features.

## Features

- **User Authentication**: Secure login/signup with email/password and GitHub OAuth
- **Property Marketplace**: Browse, search, and filter property listings
- **Transaction Management**: Track real estate transactions with progress monitoring
- **Service Marketplace**: Find and hire real estate professionals
- **Real-time Chat**: Communicate with agents and service providers
- **Document Management**: Upload and share transaction documents
- **Calendar Integration**: Schedule and manage appointments
- **Notifications**: Real-time updates on important events

## Tech Stack

- **Frontend**: Next.js 14, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes, Server Actions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js
- **Real-time**: Pusher
- **File Storage**: Cloudinary
- **Deployment**: Vercel

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Cloudinary account
- Pusher account
- GitHub OAuth application (for GitHub login)

### Environment Setup

1. Clone the repository
   \`\`\`bash
   git clone https://github.com/yourusername/homes-better-hands.git
   cd homes-better-hands
   \`\`\`

2. Install dependencies
   \`\`\`bash
   npm install
   \`\`\`

3. Create a `.env` file based on `.env.example`
   \`\`\`bash
   cp .env.example .env
   \`\`\`

4. Fill in the environment variables in `.env`

5. Set up the database
   \`\`\`bash
   npx prisma migrate dev
   npx prisma db seed
   \`\`\`

6. Start the development server
   \`\`\`bash
   npm run dev
   \`\`\`

### Using Docker

Alternatively, you can use Docker Compose:

\`\`\`bash
docker-compose up -d
\`\`\`

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

1. Build the application
   \`\`\`bash
   npm run build
   \`\`\`

2. Start the production server
   \`\`\`bash
   npm start
   \`\`\`

## Project Structure

- `/app`: Next.js App Router pages and layouts
- `/components`: Reusable React components
- `/lib`: Utility functions and configuration
- `/prisma`: Database schema and migrations
- `/public`: Static assets
- `/styles`: Global CSS styles
- `/types`: TypeScript type definitions

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
