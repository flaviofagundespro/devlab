#!/bin/bash

# Production deployment script for APIBR

set -e

echo "🚀 Starting APIBR production deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Create production environment file if it doesn't exist
if [ ! -f .env.production ]; then
    echo "📝 Creating production environment file..."
    cp .env.example .env.production
    echo "⚠️  Please edit .env.production with your production settings before continuing."
    echo "   Important: Set API_KEYS for security!"
    exit 1
fi

# Build and start services
echo "🔨 Building Docker images..."
docker-compose build apibr

echo "🗄️  Starting Redis..."
docker-compose up -d redis

echo "⏳ Waiting for Redis to be ready..."
sleep 5

echo "🚀 Starting APIBR API..."
docker-compose up -d apibr

echo "🔍 Checking service health..."
sleep 10

# Health check
if curl -f http://localhost:3000/health > /dev/null 2>&1; then
    echo "✅ APIBR is running successfully!"
    echo "📊 API Documentation: http://localhost:3000/api/docs"
    echo "📈 Metrics: http://localhost:3000/api/metrics"
    echo "🏥 Health Check: http://localhost:3000/health"
else
    echo "❌ Health check failed. Checking logs..."
    docker-compose logs apibr
    exit 1
fi

echo "🎉 Deployment completed successfully!"
echo ""
echo "📋 Useful commands:"
echo "  View logs: docker-compose logs -f apibr"
echo "  Stop services: docker-compose down"
echo "  Restart: docker-compose restart apibr"
echo "  Update: git pull && docker-compose build apibr && docker-compose up -d apibr"

