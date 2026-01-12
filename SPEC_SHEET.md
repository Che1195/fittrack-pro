# FitTrack Pro - Specification Sheet

## 1. Overview
FitTrack Pro is a high-performance, mobile-first personal trainer management application designed for independent fitness professionals. It streamlines client management, session tracking, and payment oversight through a modern, elegant interface.

## 2. Capabilities
### 2.1 Authentication & Security
- **Replit Auth Integration**: Secure, enterprise-grade login using Replit's identity provider.
- **Data Isolation**: Multi-tenant architecture ensuring trainers only see their own client data and session history.

### 2.2 Client Management (CRUD)
- **Comprehensive Profiles**: Store client names, emails, phone numbers, and specific fitness goals.
- **Financial Configuration**: Define custom "Session Cost" per client for automated billing calculations.
- **Actionable UI**: Dedicated client dashboard with search and quick-edit capabilities.

### 2.3 Session Tracking
- **Smart Logging**: Quickly record training sessions with client selection, date/time pickers, duration, and notes.
- **Payment Lifecycle**: Integrated checkbox system to track paid vs. unpaid sessions.
- **Chronological History**: Sessions are automatically sorted by date to highlight recent and upcoming activity.

### 2.4 Financial Overview
- **Revenue Tracking**: Automated calculation of outstanding balances based on unpaid sessions and individual client rates.
- **Quick Action Dashboard**: High-level stats showing active clients, total sessions, and total unpaid earnings.

### 2.5 GitHub Integration
- **Automated Repository Management**: Programmatic creation of GitHub repositories.
- **Code Synchronization**: Direct pushing of local project files to remote repositories via the GitHub API.

## 3. Look & Feel
### 3.1 Design Principles
- **Modern Material Design**: Adherence to Material 3 principles with a focus on depth, motion, and clarity.
- **Emerald Fitness Theme**: A vibrant emerald green primary color scheme (#10b981) symbolizing energy and growth.

### 3.2 Key Visual Elements
- **Glass-morphism**: Headers and bottom navigation bars utilize backdrop blurs (`backdrop-blur-lg`) and semi-transparent backgrounds for a premium feel.
- **Gradients**: Dashboard stat cards feature subtle linear gradients and soft shadows (`shadow-lg`) to draw attention to key metrics.
- **Typography**: Uses the 'Inter' sans-serif typeface for maximum readability and a professional aesthetic.
- **Responsive Layout**: A mobile-first approach featuring a persistent bottom navigation bar for easy thumb-reach accessibility.

### 3.3 Interactive Feedback
- **Elevation System**: Custom `hover-elevate` and `active-elevate-2` utility classes provide tactile feedback on user interactions.
- **Empty States**: Custom-designed illustrations and prompts appear when no data is available to guide new users.
- **Toasts & Dialogs**: Non-intrusive notifications for successful actions (e.g., "Client added") and elegant modal windows for forms.

## 4. Technical Stack
- **Frontend**: React 18, TypeScript, TailwindCSS, Radix UI, Framer Motion.
- **Backend**: Express.js, Node.js.
- **Database**: PostgreSQL with Drizzle ORM.
- **Deployment**: Replit Deployments with automatic SSL and scaling.
