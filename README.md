# PrimeTrade Backend Developer Intern Assignment

## Project Overview

A full-stack Task Management System built using Spring Boot and React. The application provides secure authentication using JWT, role-based authorization, task management APIs, Swagger documentation, and a simple frontend interface.

---

## Tech Stack

### Backend

* Java 21
* Spring Boot 3
* Spring Security
* JWT Authentication
* Spring Data JPA
* PostgreSQL
* Swagger / OpenAPI
* Maven

### Frontend

* React
* Vite
* JavaScript
* CSS

---

## Features

### Authentication

* User Registration
* User Login
* Password Encryption using BCrypt
* JWT-based Authentication

### Authorization

* Role-based Access Control
* Admin and User Roles
* Protected Endpoints

### Task Management

* Create Tasks
* View Tasks
* Update Tasks
* Delete Tasks

### API Documentation

* Swagger UI support

### Frontend

* Register Page
* Login Page
* Dashboard
* Admin Page

---

## Project Structure

```
bdi/
│
├── src/
├── fdi/
├── pom.xml
├── mvnw
└── README.md
```

---

## Backend Setup

Clone the repository and move into the project:

```bash
cd bdi
```

Run the Spring Boot application:

```bash
./mvnw spring-boot:run
```

Backend runs on:

```
http://localhost:8080
```

---

## Frontend Setup

Move into frontend:

```bash
cd fdi
```

Install dependencies:

```bash
npm install
```

Run frontend:

```bash
npm run dev
```

Frontend runs on:

```
http://localhost:5173
```

---

## API Documentation

Swagger UI:

```
http://localhost:8080/swagger-ui.html
```

---

## Database

* PostgreSQL
* Spring Data JPA
* Automatic schema update using Hibernate

---

## Security Features

* BCrypt Password Hashing
* JWT Authentication
* Stateless Sessions
* Spring Security Configuration
* Role-Based Authorization

---

## Future Improvements

* Dockerization
* Redis Caching
* Microservices Architecture
* Message Queues
* Kubernetes Deployment
* Centralized Logging

---
