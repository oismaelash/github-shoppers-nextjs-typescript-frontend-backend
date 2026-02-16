# GitHub Shoppers

GitHub Shoppers is a full-stack e-commerce application designed to demonstrate robust architectural patterns, AI integration, and secure stock management. It features a transactional purchase system, AI-enhanced content generation, and integration with multiple external services.

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
- **Authentication**: OAuth (GitHub/Google) via NextAuth.js.
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
- **Testing**: [Vitest](https://vitest.dev/)
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

## 📘 API Documentation

With the server running, open the interactive API documentation at:

```
http://localhost:3000/api-doc
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
