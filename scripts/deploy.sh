#!/bin/bash
set -e

echo "Starting deployment process..."

# Step 1: Install dependencies
echo "Installing dependencies..."
npm ci

# Step 2: Run linting
echo "Running linter..."
npm run lint

# Step 3: Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# Step 4: Run database migrations
echo "Running database migrations..."
npx prisma migrate deploy

# Step 5: Build the application
echo "Building the application..."
npm run build

# Step 6: Run tests
echo "Running tests..."
npm test

echo "Deployment preparation complete!"
echo "You can now deploy the application to your hosting provider."
