# PikaApuri

## Project Overview
PikaApuri is a peer-to-peer (P2P) marketplace app designed for exchange students, young professionals, and locals to find and offer short-term help with tasks like moving, cleaning, and errands.

## Tech Stack

### Frontend
- React.js
- Next.js
- Tailwind CSS
- Redux Toolkit
- React Router

### Backend
- Node.js
- NestJS
- TypeORM (Database ORM)
- PostgreSQL
- JWT Authentication
- Socket.io (Real-time communication)
- Bull (Task Queue)

### Deployment
- Vercel (Frontend)
- AWS EC2 / DigitalOcean (Backend)
- Docker (Containerization)
- AWS RDS (PostgreSQL Hosting)

## Installation Guide

### Prerequisites
Ensure you have the following installed:
- Node.js (v16+)
- PostgreSQL
- Docker (optional, for containerized deployment)

### Setup

#### 1. Clone the repository
```sh
git clone https://github.com/your-repo/pikaapuri.git
cd pikaapuri
```

#### 2. Install dependencies
```sh
npm install
```

#### 3. Set up environment variables
Create a `.env` file in the root directory and add:
```
DATABASE_URL=postgresql://user:password@localhost:5432/pikaapuri
JWT_SECRET=your_secret_key
```

#### 4. Run database migrations
```sh
npm run migration:run
```

#### 5. Start the development server
```sh
npm run dev
```

## Testing
Run unit tests using Jest:
```sh
npm run test
```

## Deployment
Build the project before deployment:
```sh
npm run build
```
Deploy the frontend using Vercel:
```sh
vercel
```
Deploy the backend using Docker:
```sh
docker-compose up --build
```

## Contribution
Feel free to submit pull requests or issues to improve the project.

## License
MIT License

