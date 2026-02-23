# GitHub Shoppers

GitHub Shoppers is a full-stack e-commerce application designed to demonstrate robust architectural patterns, AI integration, and secure stock management. It features a transactional purchase system, AI-enhanced content generation, and integration with multiple external services.

## Demo on Youtube
https://www.youtube.com/watch?v=025sou02IJk&t=5s

## 🚀 Features

### Core Functionality
- **Catalog Management**: Create, view, and manage products.
- **Atomic Purchases**: Secure stock decrement using database row locking (`SELECT FOR UPDATE`).
- **GitHub User Assignment**: Automatically assigns a random GitHub user to each purchase.
- **Purchase History**: View detailed history of all transactions.
- **Public Ledger**: Public, exportable ledger of transactions.

### 🧠 AI & Integrations
- **AI Enhancement**: Uses DeepSeek API to improve product titles and descriptions on demand (API route).
- **Email Notifications**: Sends purchase confirmations via Resend API.
- **Shareable Links**: Generates shortened shareable URLs for products (ShareContent).

### 🛡️ Security & Architecture
- **Authentication**: OAuth (GitHub/Google) via NextAuth.js with database sessions.
- **Role-Based Access**: Protected routes for authorized actions.
- **Clean Architecture**: Follows MVC and Ports & Adapters patterns.
- **Validation**: Strict input validation using Zod.

### 📊 Analytics & Documentation
- **Analytics**: Integration with Umami for tracking events.
- **API Docs**: Interactive Swagger/OpenAPI documentation.

## 🛠️ Tech Stack

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [PostgreSQL](https://www.postgresql.org/)
- **ORM**: [Prisma](https://www.prisma.io/)
- **Styling**: [Ant Design](https://ant.design/) & [Tailwind CSS](https://tailwindcss.com/)
- **Testing**: [Vitest](https://vitest.dev/), [k6](https://grafana.com/docs/k6/latest/) (load tests)
- **Deployment**: Docker & Docker Compose

## 📂 Project Structure

```
src/
├── adapters/       # External service integrations (GitHub, DeepSeek, Resend, ShareContent)
├── app/            # Next.js App Router pages and API routes
├── components/      # React components (layout, pages, ui, providers)
├── controllers/    # Request handlers
├── dto/            # Data Transfer Objects & validation schemas (Zod)
├── lib/            # Shared utilities (Prisma, Auth, Analytics)
├── repositories/   # Database access layer
├── services/       # Business logic layer
├── types/          # TypeScript type definitions
└── tests/          # Unit and integration tests

tests/
└── load/           # k6 load test scripts and seed output (sessions.json, product.json)
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (20 recommended)
- Docker & Docker Compose

### Environment Setup

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/github-shoppers.git
   cd github-shoppers
   ```

2. Copy the example environment file and fill in your values:
   ```bash
   cp .env.example .env
   ```
   Edit `.env` with your database URL, OAuth credentials (GitHub/Google), and optional API keys (DeepSeek, Resend, ShareContent, Umami). See `.env.example` for all variables.

### Running with Docker (Recommended)

Start the stack (App + Postgres):

```bash
docker-compose up --build
```

The application will be available at `http://localhost:3000`.

### Running Locally

1. Install dependencies:
   ```bash
   npm install
   ```

2. Start Postgres:
   ```bash
   docker-compose up -d postgres
   ```

3. Run database migrations:
   ```bash
   npx prisma migrate dev
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

## 🧪 Testing

Run tests:

```bash
npm run test
```

Run tests once (CI-style):

```bash
npm run test:run
```

Run tests with coverage:

```bash
npm run test:coverage
```

### Load testing (k6)

Load tests use [k6](https://grafana.com/docs/k6/latest/) with real NextAuth database sessions to validate transaction safety, row locking, and that stock is never oversold.

1. **Seed load-test data** (50 users with sessions, 1 item with stock 10; writes `tests/load/sessions.json` and `tests/load/product.json`):

   ```bash
   npx prisma db seed
   ```

   If your `.env` uses host `postgres` (e.g. for Docker), the seed runs on your machine and cannot resolve that host. Use a URL with `localhost` so the DB is reachable (Postgres must be running and port 5432 published, e.g. `docker-compose up -d postgres`):

   ```bash
   DATABASE_URL="postgresql://user:password@localhost:5432/github_shoppers?schema=public" npx prisma db seed
   ```

   (Adjust user, password, and database name to match your setup.)

2. **Start the application** (e.g. `npm run dev` or `docker-compose up`).

3. **Run the purchase load test** (100 VUs for 10s, each VU uses a real session cookie):

   ```bash
   npm run load:test
   ```

4. **Optionally run the stock-integrity check** (GET item and assert `quantity >= 0`):

   ```bash
   npm run load:integrity
   ```

   - **With k6 installed** ([install guide](https://grafana.com/docs/k6/latest/set-up/install-k6/), e.g. `sudo apt install k6` or `brew install k6`): run `npm run load:test` and `npm run load:integrity`.
   - **Without k6:** use the Docker-based scripts (app must be at `localhost:3000` on the host):

   ```bash
   npm run load:test:docker
   npm run load:integrity:docker
   ```

   To target another host, set `BASE_URL` (e.g. `BASE_URL=http://localhost:3001 npm run load:test`).

## 📘 API Documentation

With the server running, open the interactive API documentation at:

```
http://localhost:3000/swagger
```

## 🚢 Deployment

The project is ready for deployment with Docker Compose.

1. Ensure the host has Docker and Docker Compose installed.
2. Copy the project to the server and set the production `.env`.
3. Run:

   ```bash
   docker-compose up -d --build
   ```

A production-style image can be built using the multi-stage `Dockerfile` (see `Dockerfile` for the `builder` and runtime stages).

## 📄 License

This project is licensed under the MIT License.
