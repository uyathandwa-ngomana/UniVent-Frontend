# UniVent

## Campus Event Discovery System

UniVent is a campus event discovery and booking platform designed for students at CPUT. The system allows students to discover upcoming campus events, view event details, book events, and access their tickets. Organizers can create and manage events, while administrators manage event approvals, users, and platform activity.

This repository contains the **UniVent React frontend**. The backend is maintained in a separate repository using Spring Boot.

---

## Project Overview

UniVent provides three main user experiences:

### Student

Students can:

* Register and log in to UniVent
* Browse upcoming approved events
* Search and filter events
* View detailed event information
* Book available events
* View their bookings
* Access their event tickets
* View their student profile

### Organizer

Organizers can:

* Register and log in as an organizer
* Create events
* Edit events
* Cancel events
* View their events
* View event registrations
* Monitor the number of registered students

### Administrator

Administrators can:

* View platform statistics
* View all events
* Approve pending events
* Disable events
* View all users
* Disable user accounts
* Manage the overall platform

---

# Tech Stack

## Frontend

* React
* Vite
* JavaScript
* React Router
* TanStack Query
* Axios
* Tailwind CSS
* shadcn/ui
* Lucide React

## Backend

The frontend communicates with a separate Spring Boot REST API.

* Java
* Spring Boot
* Spring Web
* Spring Data JPA
* Spring Security
* JWT
* MySQL
* Bean Validation

The backend is maintained in a separate GitHub repository.

---

# Repository Structure

UniVent uses two separate repositories:

```text
UniVent
│
├── UniVent-Frontend
│   └── React + Vite application
│
└── UniVent-Backend
    └── Spring Boot REST API
```

This repository is:

```text
UniVent-Frontend
```

The frontend does not contain the Spring Boot backend.

---

# Frontend Project Structure

```text
src/
│
├── api/
│   ├── client.js
│   ├── auth.js
│   ├── events.js
│   ├── bookings.js
│   ├── tickets.js
│   ├── venues.js
│   └── admin.js
│
├── components/
│   ├── auth/
│   ├── shared/
│   └── ui/
│
├── context/
│
├── hooks/
│
├── pages/
│   ├── admin/
│   ├── organizer/
│   └── student/
│
├── App.jsx
├── index.css
└── main.jsx
```

---

# Requirements

Before running the project, install:

* Node.js
* npm
* Git

Verify your installation:

```bash
node -v
npm -v
git --version
```

---

# Installation

Clone the repository:

```bash
git clone <FRONTEND_REPOSITORY_URL>
```

Enter the project:

```bash
cd UniVent-Frontend
```

Install dependencies:

```bash
npm install
```

---

# Environment Variables

Create a `.env` file in the project root:

```env
VITE_API_URL=http://localhost:8080
```

The `.env` file should not be committed to Git.

A `.env.example` file should be maintained in the repository:

```env
VITE_API_URL=http://localhost:8080
```

The backend must be running for API functionality to work.

---

# Running the Application

Start the development server:

```bash
npm run dev
```

The application will normally be available at:

```text
http://localhost:5173
```

To create a production build:

```bash
npm run build
```

To preview the production build locally:

```bash
npm run preview
```

---

# Application Routes

## Public Routes

```text
/login
/register
/unauthorized
```

A catch-all route is used for pages that do not exist.

```text
/*
```

## Student Routes

```text
/student
/student/profile
/student/events/:id
/student/bookings
/student/tickets/:bookingId
```

Student routes require authentication and the `STUDENT` role.

## Organizer Routes

```text
/organizer/events
/organizer/events/create
/organizer/events/:id/edit
/organizer/events/:id/registrations
```

Organizer routes require authentication and the `ORGANIZER` role.

## Administrator Routes

```text
/admin
/admin/events
/admin/users
```

Administrator routes require authentication and the `ADMIN` role.

---

# Authentication

UniVent uses JWT-based authentication.

The frontend communicates with the backend through the authentication endpoints:

```text
POST /api/auth/register
POST /api/auth/login
```

After a successful login, the JWT is managed through the application's authentication context.

The frontend authentication context provides:

```text
login(token)
logout()
isAuthenticated()
```

The authenticated user contains:

```text
id
name
email
role
```

The frontend uses the JWT to determine the user's role and control access to protected routes.

JWTs are kept in memory through the authentication context rather than being stored in `localStorage`.

---

# Route Protection

The application uses two types of route protection:

### ProtectedRoute

Checks whether a user is authenticated.

Unauthenticated users are redirected to:

```text
/login
```

### RoleRoute

Checks whether an authenticated user has the required role.

Supported roles:

```text
STUDENT
ORGANIZER
ADMIN
```

Users attempting to access a route that their role does not permit are redirected to:

```text
/unauthorized
```

---

# API Communication

Axios is used as the HTTP client.

The application uses a shared Axios instance:

```text
src/api/client.js
```

The API client communicates with the Spring Boot backend using:

```env
VITE_API_URL
```

API functionality is separated into individual modules:

```text
src/api/
│
├── auth.js
├── events.js
├── bookings.js
├── tickets.js
├── venues.js
└── admin.js
```

Each API module is responsible for its relevant backend endpoints.

---

# Data Fetching

TanStack Query is used for server-side data fetching and caching.

It is used for functionality such as:

* Event feed
* Event details
* Student bookings
* Organizer events
* Event registrations
* Admin events
* Admin users
* Platform statistics

After mutations such as approving, disabling, creating, editing, booking, or cancelling an event, relevant queries should be invalidated so that the UI reflects the latest backend data.

---

# UI and Styling

The application uses:

* Tailwind CSS for styling
* shadcn/ui for reusable UI components
* Lucide React for icons

The interface should be responsive across:

* Desktop
* Tablet
* Mobile

Shared UI components should be reused wherever possible to maintain consistency throughout the application.

---

# Shared Components

The frontend contains reusable components that are shared across multiple screens.

Examples include:

### Navbar

The shared navigation bar provides:

* UniVent branding
* Role-specific navigation
* Profile dropdown
* Profile navigation
* Logout
* Mobile navigation

### EventCard

Used to display event information in the student event feed.

It displays information such as:

* Event name
* Date and time
* Venue
* Campus
* Organizer
* Category
* Spots remaining
* Booking status

### StatusBadge

Provides consistent status indicators for:

```text
PENDING_APPROVAL
APPROVED
CANCELLED
DISABLED
CONFIRMED
ATTENDED
```

The status must always include a text label and must not rely on colour alone.

---

# Main Frontend Features

## Authentication

* Student registration
* Organizer registration
* Login
* Logout
* JWT authentication
* Protected routes
* Role-based routing

## Student

* Event discovery
* Event search
* Event category filtering
* Event details
* Event booking
* My Bookings
* Ticket viewing
* Student profile

## Organizer

* Create event
* Edit event
* Cancel event
* View owned events
* View event registrations

## Administrator

* Platform statistics
* Event management
* Event approval
* Event disabling
* User management
* User account disabling

## UI

* Responsive navigation
* Loading skeletons
* Empty states
* Error states
* Toast notifications
* 404 page
* Unauthorized page

---

# Event Categories

The student event feed supports filtering by:

```text
All
Tech
Sports
Social
Academic
```

---

# Backend API

The frontend expects the Spring Boot backend to expose REST endpoints under:

```text
/api
```

Examples include:

```text
/api/auth
/api/events
/api/bookings
/api/tickets
/api/venues
/api/admin
```

The backend is responsible for:

* Business logic
* Authentication
* Authorization
* Database operations
* Validation
* JWT generation and validation
* REST API responses

The frontend is responsible for:

* User interface
* Client-side routing
* Client-side state
* API communication
* User interaction
* Presentation of API data

---

# Development Workflow

The team follows a feature-branch workflow.

The main branches are:

```text
main
dev
```

### Main

`main` contains stable versions of the application.

### Dev

`dev` is the integration branch where completed features are combined before being released to `main`.

### Feature Branches

Create feature branches from `dev`:

```text
feature/<feature-name>
```

Example:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/login-screen
```

After completing the feature:

```bash
git add .
git commit -m "feat: implement login screen"
git push origin feature/login-screen
```

Create a Pull Request:

```text
feature/login-screen
        ↓
       dev
```

After the application reaches a milestone and has been reviewed:

```text
dev
 ↓
main
```

---

# Commit Convention

Use clear commit messages that describe the change.

Examples:

```text
feat: implement login screen
feat: add student event feed
feat: implement admin dashboard
fix: handle expired authentication token
fix: correct event filtering
refactor: extract reusable EventCard
style: improve mobile navbar
test: add login component tests
docs: update frontend setup instructions
chore: update dependencies
```

---

# Team Responsibilities

| Team Member | Primary Responsibility                                                               |
| ----------- | ------------------------------------------------------------------------------------ |
| Samukelo    | User, Student, Authentication, Protected Routes, Login, Register, Student Profile    |
| Amanda      | Organizer, Administrator, Admin Dashboard, Admin Management, Organizer Registrations |
| Uyathandwa  | Event, Event Feed, Event Details, Create/Edit Event                                  |
| Sesethu     | Venue, Navbar, EventCard, StatusBadge, Error Pages                                   |
| Zusiphe     | Ticket, API Client, API Service Modules, Ticket View, Loading Skeletons              |
| Amahle      | Booking, My Bookings, Organizer My Events, Empty States, Toasts and Error Handling   |

---

# Project Milestones

The project is divided into the following milestones:

### M0 — Project Setup

Repository, tooling and application skeleton.

### M1 — Domain Layer

Entities, enums, factories and repositories.

### M2 — Service & API Layer

Business logic, REST controllers and JWT authentication.

### M3 — Frontend Foundation

React/Vite setup, routing and authentication screens.

### M4 — Student Flow

Student dashboard, event feed, booking and ticket functionality.

### M5 — Organizer Flow

Organizer portal, event CRUD and registrations.

### M6 — Admin Flow

Admin dashboard, approvals and user management.

### M7 — Polish & QA

Responsive design, error states, testing and bug fixes.

---

# GitHub Issue Labels

The project uses the following labels:

```text
backend
frontend
setup
testing
domain
service
api
ui
auth
bug
documentation
```

These labels identify the type of work associated with each issue.

---

# Error Handling

The frontend should provide clear feedback for:

* Failed API requests
* Network failures
* Authentication failures
* Unauthorized access
* Validation errors
* Empty results
* Unexpected application errors

Users should never be left with a blank screen when an unexpected error occurs.

Toast notifications should be used for important actions such as:

* Booking confirmed
* Event created
* Event cancelled
* Account actions
* API errors

---

# Responsive Design

All screens must be responsive.

The application should support:

```text
Desktop
Tablet
Mobile
```

Examples include:

* Responsive event card grids
* Collapsible mobile navigation
* Responsive tables
* Mobile-friendly forms
* Responsive ticket cards
* Responsive admin dashboards

---

# Testing

Frontend functionality should be tested as features are implemented.

Testing should focus on:

* Authentication behaviour
* Route protection
* Role-based access
* API interactions
* Component behaviour
* Form validation
* Error states
* Loading states
* Booking flows

The backend maintains its own unit and integration test suite in the separate backend repository.

---

# Building for Production

Create a production build:

```bash
npm run build
```

The production files will be generated in:

```text
dist/
```

Preview the production build:

```bash
npm run preview
```

The production environment should use the deployed Spring Boot API URL through:

```env
VITE_API_URL=<PRODUCTION_API_URL>
```

---

# Important Development Rules

1. Do not commit `.env` files containing secrets.
2. Do not hardcode API URLs throughout components.
3. Use the shared Axios client for API requests.
4. Reuse shared components instead of duplicating UI.
5. Do not bypass `ProtectedRoute` or `RoleRoute`.
6. Do not store raw passwords in the frontend or backend.
7. Do not return or render raw backend entities when DTOs are available.
8. Keep components focused on their responsibilities.
9. Follow the existing project folder structure.
10. Create feature branches from `dev`.
11. Open Pull Requests into `dev`.
12. Do not merge directly into `main` without following the team's review process.

---

# Getting Started for Team Members

Clone the repository:

```bash
git clone <FRONTEND_REPOSITORY_URL>
```

Enter the project:

```bash
cd UniVent-Frontend
```

Install dependencies:

```bash
npm install
```

Create your environment file:

```text
.env
```

Add:

```env
VITE_API_URL=http://localhost:8080
```

Start the application:

```bash
npm run dev
```

Before starting a new feature:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/<feature-name>
```

After completing the feature:

```bash
git add .
git commit -m "feat: <description>"
git push origin feature/<feature-name>
```

Then open a Pull Request into `dev`.

---

# UniVent MVP

The goal of the MVP is to provide a complete campus event discovery experience where:

```text
Student
   │
   ├── Register / Login
   │
   ├── Discover Events
   │
   ├── View Event
   │
   ├── Book Event
   │
   └── Receive / View Ticket
```

while:

```text
Organizer
   │
   ├── Create Event
   ├── Manage Events
   └── View Registrations
```

and:

```text
Administrator
   │
   ├── Approve Events
   ├── Disable Events
   ├── Manage Users
   └── View Platform Statistics
```

all interact with the same Spring Boot API and MySQL database.

---

# Project Documentation

The project requirements, GitHub issues, responsibilities and milestone breakdown are maintained in the project's GitHub issue documentation.

For the complete task breakdown, refer to:

**UniVent — GitHub Issues Breakdown**

---

## License

This project is developed as an academic project for CPUT.

---

## UniVent

**Campus events. One place.**

Built by the UniVent development team.
