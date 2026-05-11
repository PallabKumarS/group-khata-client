# Group Khata

## Vision

Group Khata is a personal group finance management platform designed for
friends, roommates, and small groups who regularly share subscriptions,
expenses, and payments.

The initial goal is to manage subscription payments such as Spotify Premium
Family plans and track:

- who paid
- who did not pay
- payment methods
- due dates
- reminders

Over time, Group Khata will evolve into a complete shared expense and debt
tracking platform for friend groups.

Examples:

- Subscription sharing
- Shared purchases
- Group trips
- Split bills
- Debt tracking
- Settlements

The system should stay:

- simple
- clean
- scalable
- maintainable
- easy to extend

---

# Main Features

## Subscription Management

Manage subscriptions such as:

- Spotify
- Netflix
- YouTube Premium
- ChatGPT Plus
- Any shared monthly service

Features:

- Add subscription
- Add members
- Track monthly payments
- Mark payment status
- View payment history

---

## Member Management

Store:

- Name
- Email
- Phone
- Payment methods
- Assigned subscriptions

Supported payment methods:

- bKash
- DBBL
- Bank accounts
- Others later

---

## Monthly Payment Tracking

Track:

- Amount due
- Amount paid
- Due date
- Paid date
- Payment status

Statuses:

- paid
- unpaid
- partial
- overdue

---

## Email Notifications

Using Nodemailer:

- Payment reminders
- Due reminders
- Overdue notifications
- Payment confirmation

Future:

- Scheduled automatic reminders

---

## Shared Expense Tracking (Future)

Example: "We bought a keyboard for 3000 taka."

Features:

- Track who paid
- Split among participants
- Calculate debts
- Show balances
- Settlement tracking

Inspired by:

- Splitwise
- Tricount

But simpler and more personal.

---

# Tech Stack

## Frontend

- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui

## Backend

- Next.js Route Handlers
- Mongoose
- MongoDB

## Forms & Validation

- react-hook-form
- zod

## Tables

- TanStack Table

## Mail

- Nodemailer

## State Management

Avoid unnecessary global state. Prefer:

- Server Components
- URL state
- Local state
- React Query only if needed later

---

# Project Architecture Goals

The codebase must be:

- modular
- reusable
- scalable
- type-safe
- feature-oriented

Avoid:

- duplicated logic
- massive files
- tightly coupled code
- overengineering

---

# Folder Structure

src/ ├── app/ │ ├── api/ │ ├── dashboard/ │ ├── subscriptions/ │ ├── members/ │
└── expenses/ │ ├── components/ │ ├── forms/ │ ├── tables/ │ ├── shared/ │ └──
ui/ │ ├── lib/ │ ├── db.ts │ ├── mail.ts │ ├── auth.ts │ └── utils.ts │ ├──
models/ ├── services/ ├── validations/ ├── hooks/ ├── types/ └── constants/

---

# Design Philosophy

UI should be:

- minimal
- clean
- dashboard-focused
- responsive
- fast

Avoid excessive animations or visual clutter.

Focus on usability first.

---

# MVP Scope

## Phase 1

- Authentication
- Members CRUD
- Subscriptions CRUD
- Monthly payments
- Dashboard
- Manual payment tracking

## Phase 2

- Email reminders
- Automated due generation
- Payment history
- Filters & analytics

## Phase 3

- Shared expenses
- Debt calculation
- Settlement system
- Group balances

---

# Long-Term Goal

Become a lightweight personal finance & shared expense platform specifically
optimized for friend groups and small teams.
