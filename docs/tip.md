# 🛠️ TIP – Technical Implementation Plan

## GitHub Shoppers (AI-Assisted Development)

---

# 📍 EXECUTION STRATEGY

This project must be implemented incrementally using AI-assisted code generation.

Each step below should be executed sequentially in the IDE (Trae Solo Builder Mode), ensuring code validation before proceeding to the next stage.

Avoid generating the entire project at once to prevent LLM hallucinations or architectural inconsistencies.

---

# 🔹 STEP 1 — Project Initialization

### Tasks:

* Initialize Next.js project with:

  * TypeScript
  * App Router
* Setup ESLint + Prettier
* Setup i18n support
* Install dependencies:

  * Prisma
  * NextAuth
  * BullMQ
  * Redis Client
  * Zod
  * Axios
  * Resend SDK
  * Ant Design
  * Swagger UI
* Setup project folder structure based on:

  * MVC
  * Ports & Adapters

### Expected Folder Structure:

```
src/
 ├── controllers/
 ├── services/
 ├── repositories/
 ├── domain/
 ├── adapters/
 ├── queues/
 ├── workers/
 ├── dto/
 ├── middleware/
 ├── config/
 └── lib/
```

---

# 🔹 STEP 2 — Database Configuration

### Tasks:

* Configure Prisma with PostgreSQL
* Create initial migration

### Models:

* User
* Item
* Purchase

Ensure:

* Foreign key between Purchase and Item
* Timestamps enabled

---

# 🔹 STEP 3 — Authentication Layer

### Tasks:

* Configure NextAuth
* OAuth Providers:

  * GitHub
  * Google
* Protect routes:

  * /dashboard
  * /catalog
  * /purchases

Implement:

* Middleware for route protection
* Session validation

---

# 🔹 STEP 4 — Item Domain

### Tasks:

Create:

* ItemRepository
* ItemService
* ItemController
* ItemDTO

Implement:

POST `/api/items`
GET `/api/items`

Include:

* Zod validation
* DTO typing
* Repository abstraction

---

# 🔹 STEP 5 — Purchase Domain (CRITICAL)

### Tasks:

Create:

* PurchaseRepository
* PurchaseService
* PurchaseController

Implement:

POST `/api/purchases`

Purchase flow must:

1. Start DB transaction
2. Lock item row using:
   SELECT FOR UPDATE
3. Validate stock
4. Decrement quantity
5. Fetch GitHub user via Adapter
6. Persist purchase
7. Commit transaction

If stock is 0:
Return HTTP 409

---

# 🔹 STEP 6 — GitHub Adapter

### Tasks:

Create:

GitHubUserAdapter

Responsibilities:

* Call https://api.github.com/users
* Randomly select login
* Handle:

  * Timeout
  * Retry
  * External failure

---

# 🔹 STEP 7 — Queue System

### Tasks:

Setup:

* Redis connection
* BullMQ Queue

Create Worker:

AIEnhancementWorker

Triggers:

* On item creation

Responsibility:

* Call DeepSeek API
* Improve title/description

---

# 🔹 STEP 8 — Email Adapter

### Tasks:

Create:

ResendAdapter

Triggers:

* Purchase created

---

# 🔹 STEP 9 — Shareable Links

### Tasks:

* Integrate ShareContent API
* Generate short URL on item creation

---

# 🔹 STEP 10 — Purchase History

Implement:

GET `/api/purchases`

Include JOIN:

* Item Name
* Item Price
* GitHub Login

---

# 🔹 STEP 11 — Swagger Documentation

### Tasks:

* Document:

  * /api/items
  * /api/purchases
  * Auth Routes

---

# 🔹 STEP 12 — Testing

### Tasks:

Write integration tests for:

* Successful purchase
* Stock decrement
* Out of stock error (409)
* Auth protected routes

---

# 🔹 STEP 13 — Analytics

Integrate:

Umami

Track:

* Item creation
* Purchase simulation

---

# 🔹 STEP 14 — Dockerization

### Tasks:

* Multi-stage Dockerfile
* Docker Compose with:

  * App
  * PostgreSQL
  * Redis

---

# 🔹 STEP 15 — Deployment

Deploy via:

Docker Compose
to:

Ilumin VPS

---

# 📍 COMPLETION CRITERIA

* Atomic purchase operation guaranteed
* OAuth authentication working
* Queue-based AI enhancement
* External API integration stable
* Test suite passing
* Swagger documentation available
* Multilingual UI functional
* Dockerized deployment ready
