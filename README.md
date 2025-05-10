# 5Sense Platform

A comprehensive platform for investments, choirs, and shopping.

## Deployment

### Prerequisites

- Node.js 18+ and npm
- Vercel account
- Neon PostgreSQL database
- Pusher account

### Environment Variables

Set up the following environment variables in your Vercel project:

\`\`\`
DATABASE_URL=your_neon_database_url
NEXT_PUBLIC_PUSHER_APP_ID=your_pusher_app_id
NEXT_PUBLIC_PUSHER_KEY=your_pusher_key
NEXT_PUBLIC_PUSHER_CLUSTER=your_pusher_cluster
PUSHER_SECRET=your_pusher_secret
\`\`\`

### Deployment Steps

1. Fork this repository
2. Connect your fork to Vercel
3. Set up the environment variables
4. Deploy

### Database Setup

Run the following SQL to set up your database:

\`\`\`sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Add other tables as needed
\`\`\`

## Development

### Local Setup

1. Clone the repository
2. Install dependencies: `npm install`
3. Create a `.env.local` file with the environment variables
4. Run the development server: `npm run dev`

### Testing

Run tests with: `npm test`

## Features

- Real-time notifications with Pusher
- User authentication
- Investment tracking
- Choir management
- Shopping platform

## License

MIT
\`\`\`

Let's update the package.json file with proper scripts and dependencies:
