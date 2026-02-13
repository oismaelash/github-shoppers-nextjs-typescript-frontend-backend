# 📄 PRD – GitHub Shoppers (AI-Assisted Full Stack Application)

## 1. 📌 Product Overview

GitHub Shoppers is a full-stack web application designed to manage a product catalog and simulate purchase operations with strict stock control logic.

The system allows authenticated users to:

* Create and manage catalog items
* Simulate product purchases
* Automatically associate each purchase with a randomly selected GitHub user
* Track purchase history

This project must be built using an AI-assisted development approach, ensuring architectural consistency, type safety, scalability, and production-ready patterns.

---

## 2. 🎯 Goals

### Primary Goals

* Implement a secure and atomic stock control system
* Integrate with external APIs (GitHub)
* Provide a protected admin interface for managing items and purchases
* Maintain a full purchase history
* Guarantee concurrency-safe stock decrement operations

### Secondary Goals

* Provide multilingual support (i18n)
* AI-enhanced product title/description generation
* Analytics integration
* Email notification system
* Link sharing capabilities

---

## 3. 👥 User Roles

### Admin User

* Can register/login
* Can create catalog items
* Can simulate purchases
* Can view purchase history

---

## 4. 🧱 Functional Requirements

### Authentication

* Users must authenticate via:

  * GitHub OAuth
  * Google OAuth
* JWT-based session management
* Protected routes for:

  * Catalog management
  * Purchase simulation
  * Purchase history

---

### Catalog Management

#### Create Item

POST `/api/items`

Payload:

```json
{
  "name": "string",
  "price": number,
  "quantity": number,
  "description": "string"
}
```

Optional:

* AI-generated enhanced title
* AI-generated enhanced description (DeepSeek API)

---

#### List Items

GET `/api/items`

Returns:

* id
* name
* price
* quantity
* description
* created_at

---

### Purchase Simulation

POST `/api/purchases`

Payload:

```json
{
  "item_id": number
}
```

Flow:

1. Validate item existence
2. Validate quantity > 0
3. Start DB transaction
4. Lock item row (SELECT FOR UPDATE)
5. Decrement quantity
6. Fetch random GitHub user from:
   https://api.github.com/users
7. Save purchase with:

   * item_id
   * github_login
8. Commit transaction

If quantity = 0:
Return:
HTTP 409

```json
{
  "error": "Item out of stock"
}
```

---

### Purchase History

GET `/api/purchases`

Join:

* purchases
* items

Return:

* item_name
* item_price
* github_login
* created_at

---

## 5. 🧠 AI Enhancements (DeepSeek)

Used to:

* Improve product titles
* Improve product descriptions

Trigger:

* When admin creates item

Queue-based processing via:

* Redis
* BullMQ Worker

---

## 6. 🌍 Internationalization (i18n)

Supported languages:

* English
* Portuguese

Switchable via UI

---

## 7. 📧 Email Notifications

Resend API used for:

* Purchase confirmation email
* Item creation confirmation (optional)

---

## 8. 🔗 Shareable Product Links

Each product generates:

* Shortened shareable URL via ShareContent

---

## 9. 📊 Analytics

Umami Integration for:

* Page views
* Item creation events
* Purchase simulation events

---

## 10. 🏗️ Technical Architecture

### Frontend

* Next.js (App Router)
* TypeScript
* React
* Ant Design
* i18n Support

### Backend

* Next.js API Routes

### Architecture Pattern

* MVC
* Ports & Adapters

#### Controllers

Handle HTTP layer

#### Services

Business logic

#### Repositories

Database access abstraction

#### External Adapters

* GitHub API Adapter
* DeepSeek Adapter
* Email Adapter (Resend)
* ShareContent Adapter

---

## 11. 🗃️ Database Schema (PostgreSQL)

### users

* id
* email
* created_at
* updated_at

### items

* id
* name
* description
* price
* quantity
* created_at
* updated_at

### purchases

* id
* item_id
* github_login
* created_at

---

## 12. ⚙️ Infrastructure

### ORM

* Prisma

### Queue System

* Redis
* BullMQ

### Containerization

* Docker (Multi-stage)
* Docker Compose

### Deployment

* VPS: Ilumin

---

## 13. 🧪 Testing

Framework:

* Vitest or Jest

Focus:

* Purchase success
* Stock decrement
* Out-of-stock error
* Auth protected routes

---

## 14. 📘 API Documentation

* Swagger/OpenAPI required

---

## 15. 🚀 Non-Functional Requirements

* Atomic purchase operation
* Type-safe DTOs
* Secure authentication
* Error-handling middleware
* Retry mechanism for external API calls

---

## 16. 📦 Deliverables

* Source code
* Docker setup
* .env.example
* README.md
* API Documentation
* Migration scripts
* Test suite
