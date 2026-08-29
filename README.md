# Banfico Banking System

An enterprise-grade mini banking platform featuring a Spring Boot REST API backend and a React SPA frontend.

---

## Key Features

* **Concurrency Control**: Implements pessimistic write locking (`PESSIMISTIC_WRITE`) on account balance updates to prevent race conditions and ensure data integrity during concurrent transactions.
* **State Management**: Optimized React state updates with memoized refetching hooks, eliminating full page reloads and preserving application state.
* **Standardized API Envelope**: Consistent JSON response envelope for all success and error responses, handled globally.

---

## Tech Stack

### Backend
* **Language**: Java 21
* **Framework**: Spring Boot 3.3.4
* **ORM**: Spring Data JPA + Hibernate
* **Database**: PostgreSQL 14+
* **Build Tool**: Apache Maven 3.9.x

### Frontend
* **Language**: JavaScript (ES2022)
* **UI Library**: React 18.3.1
* **Bundler**: Vite 8.2.2
* **HTTP Client**: Axios 1.7.9
* **Routing**: React Router DOM 7.18.3

---

## Repository Structure

```
banfico/
├── banking-system/          # Spring Boot backend
│   ├── pom.xml
│   └── src/
│       └── main/
│           ├── java/com/banfico/bankingsystem/
│           │   ├── config/          # CORS and JPA configurations
│           │   ├── controller/      # REST Controllers
│           │   ├── service/         # Business logic services
│           │   ├── repository/      # Spring Data JPA repositories
│           │   ├── entity/          # JPA Entities (Customer, Account, Transaction, Beneficiary)
│           │   └── dto/             # Request/Response DTOs & API Response wrapper
│           └── resources/
│               └── application.properties
│
└── banking-ui/              # React frontend
    ├── index.html
    ├── vite.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── components/      # Shared UI components
        ├── pages/           # Application pages
        ├── services/        # API client services
        └── hooks/           # Custom React hooks
```

---

## Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/elayaraji13502/Banfico.git
cd Banfico
```

### Prerequisites
* Java JDK 21+
* PostgreSQL 14+
* Node.js 18+

### 2. Database Setup
Create a PostgreSQL database named `bankingdb`:
```sql
CREATE DATABASE bankingdb;
```
Update the database credentials in `banking-system/src/main/resources/application.properties` if necessary.

### 3. Run the Backend
From the `banking-system` directory, run:
```bash
./mvnw spring-boot:run
```
The backend will start on `http://localhost:8080`.

### 4. Run the Frontend
From the `banking-ui` directory, install dependencies and start the development server:
```bash
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`.

---

## API Reference

### Standard Response Envelope
All API endpoints return a consistent JSON envelope:
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { ... },
  "timestamp": "2026-08-29T12:00:00"
}
```

### Endpoints

#### Customers
* `POST /api/customers` - Create a new customer
* `GET /api/customers` - Retrieve all customers
* `GET /api/customers/{id}` - Retrieve a customer by ID
* `PUT /api/customers/{id}` - Update customer details
* `DELETE /api/customers/{id}` - Delete a customer (cascades to accounts, transactions, and beneficiaries)

#### Accounts
* `POST /api/accounts` - Open a new account
* `GET /api/accounts` - Retrieve all accounts
* `GET /api/accounts?customerId={id}` - Retrieve accounts for a specific customer
* `GET /api/accounts/{id}` - Retrieve account details by ID

#### Transactions
* `POST /api/accounts/{id}/transactions` - Post a transaction (CREDIT/DEBIT)
* `GET /api/accounts/{id}/transactions` - Retrieve transaction history for an account (newest first)

#### Beneficiaries
* `POST /api/beneficiaries` - Add a beneficiary
* `GET /api/beneficiaries` - Retrieve all beneficiaries
* `GET /api/beneficiaries?customerId={id}` - Retrieve beneficiaries for a specific customer
* `DELETE /api/beneficiaries/{id}` - Remove a beneficiary

