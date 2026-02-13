# GitHub Shoppers

GitHub Shoppers is a full-stack e-commerce application designed to demonstrate robust architectural patterns, AI integration, and secure stock management. It features a transactional purchase system, AI-enhanced content generation, and integration with multiple external services.

## 🚀 Features

### Core Functionality
- **Catalog Management**: Create, view, and manage products.
- **Atomic Purchases**: Secure stock decrement using database row locking (`SELECT FOR UPDATE`).
- **GitHub User Assignment**: Automatically assigns a random GitHub user to each purchase.
- **Purchase History**: View detailed history of all transactions.

### 🧠 AI & Automation
- **AI Enhancement**: Uses DeepSeek API to automatically improve product titles and descriptions via a background worker.
- **Queue System**: Powered by BullMQ and Redis to handle asynchronous tasks reliably.
- **Email Notifications**: Sends purchase confirmations via Resend API.
- **Shareable Links**: Generates shortened shareable URLs for products.

### 🛡️ Security & Architecture
- **Authentication**: OAuth (GitHub/Google) via NextAuth.js.
- **Role-Based Access**: Protected routes for authorized actions.
- **Clean Architecture**: Follows MVC and Ports & Adapters patterns.
- **Validation**: Strict input validation using Zod.

### 🌐 Internationalization
- **i18n Support**: Full support for English and Portuguese (via `next-intl`).

### 📊 Analytics & Documentation
- **Analytics**: Integration with Umami for tracking events.
- **API Docs**: Interactive Swagger/OpenAPI documentation.

## 🛠️ Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Queue**: [BullMQ](https://docs.bullmq.io/) & [Redis](https://redis.io/)
- **Styling**: [Ant Design](https://ant.design/)
- **Testing**: [Vitest](https://vitest.dev/)
- **Deployment**: Docker & Docker Compose

## 📂 Project Structure

```
src/
├── adapters/       # External service integrations (GitHub, DeepSeek, Resend)
├── app/            # Next.js App Router pages and API routes
├── config/         # Configuration files
├── controllers/    # Request handlers
├── domain/         # Business entities (if applicable)
├── dto/            # Data Transfer Objects & Validation Schemas
├── lib/            # Shared utilities (Prisma, Auth, Analytics)
├── middleware/     # Next.js Middleware
├── queues/         # Queue definitions
├── repositories/   # Database access layer
├── services/       # Business logic layer
├── workers/        # Background job processors
└── tests/          # Integration tests
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Docker & Docker Compose

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/github-shoppers.git
   cd github-shoppers
   ```

2. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

3. Fill in the required environment variables in `.env`:
   - Database credentials
   - OAuth keys (GitHub/Google)
   - API keys (DeepSeek, Resend, ShareContent, Umami)

### Running with Docker (Recommended)

Start the entire stack (App, Worker, Postgres, Redis):

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`.

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start infrastructure (Postgres & Redis):
   ```bash
   docker-compose up -d postgres redis
   ```

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Start the background worker (in a separate terminal):
   ```bash
   npx tsx src/workers/ai-enhancement.worker.ts
   ```

## 🧪 Testing

Run integration tests:

```bash
npm run test
```

## 📘 API Documentation

Once the server is running, access the interactive API documentation at:

```
http://localhost:3000/api-doc
```

## 🚢 Deployment

The project is configured for easy deployment using Docker Compose.

1. Ensure your VPS has Docker and Docker Compose installed.
2. Transfer the project files to your server.
3. Set up your production `.env` file.
4. Run `docker-compose up -d --build`.

## 📄 License

This project is licensed under the MIT License.
