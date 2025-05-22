# Venzor - E-Marketplace for Event Industry

A modern, full-featured e-marketplace platform connecting event service providers with clients. Built with Next.js 13+ and TypeScript, featuring a beautiful UI with smooth animations and robust functionality.

Venzor - https://www.venzor.pro/

##  Key Features of the Platform

### General System Capabilities
- Fully responsive, mobile-friendly UI optimised for phones, tablets, and desktops
- Secure user authentication via Clerk (email, Google login, OTP verification)
- Role-based access control for Clients, Vendors, and Admins
- Real-time features using Supabase (chat, offer status updates, service sync)

### Client Features

- Client registration and secure login (email & OTP supported)
- Dynamic search and advanced service filtering (by category, rating, price, location)
- View detailed vendor service listings
- Submit Quotation Requests (QR) with event-specific details
- Real-time chat with vendors for negotiation and clarification
- Accept vendor offers and securely complete bookings
- PayPal integration with PayPal
- Submit ratings and reviews after service completion
- Save favourite services to a personal shortlist


### Vendor Features
- Vendor sign-up with admin-verified onboarding process
- Create and manage service listings
- Respond to client quotation requests with tailored offers
- Send offers via chat with negotiation and status updates
- Track service interest and offer status analytics from the dashboard 
- Access the Vendor Community Hub to share insights and support other MSMEs

### Admin Features
- Vendor application review and verification
- Manage platform users, assign roles, and suspend or block accounts


## Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- npm (comes with Node.js) or yarn
- A Clerk account for authentication
- A Supabase project for the database
- A PayPal account for payment processing


### Installation

1. Clone the repository:
   ```bash
   git clone - https://github.com/SN021/E-Marketplace-for-Event-Industry-Frontend.git
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   Create a `.env.local` file in the root directory and add the following variables:
   ```env
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_1234567890abcdef
    CLERK_SECRET_KEY=sk_test_abcdef1234567890
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=/
    NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=/
    CLERK_WEBHOOK_SECRET=whsec_test_9876543210fedcba

    SITE_URL=http://e-marketplace-for-event-industry-frontend.vercel.app
    SUPABASE_URL=https://your-supabase-project.supabase.co
    NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
    NEXT_PUBLIC_SUPABASE_ANON_KEY=pk_test_1234567890abcdef_demo_anon_key
    SUPABASE_SERVICE_ROLE_KEY=pk_test_1234567890abcdef_demo_service_role_key
    PAYPAL_CLIENT_ID=pk_test_1234567890abcdef
    PAYPAL_CLIENT_SECRET=pk_test_1234567890abcdef
    PAYPAL_API=https://api-m.sandbox.paypal.com
    NEXT_PUBLIC_APP_URL=http://localhost:3000

4. Run the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Tech Stack

- **Framework**: Next.js 13+ (App Router)
- **Backend**: Serverless API (Next.js API routes)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Shadcn/ui
- **Authentication**: Clerk
- **Database**: Supabase (PostgreSQL)
- **State Management**: React Context, React Query
- **Form Handling & Validation**: React Hook Form and Zod
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Payment**: PayPal
- **Hosting**: Vercel

## Project Structure

```
.
├── app/                    # App router pages and layouts
├── components/             # Reusable UI components
├── lib/                    # Utility functions and configurations
├── public/                 # Static assets
├── validation-schemas/     # Form validation schemas
└── types/                  # TypeScript type definitions
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Deployment

### Vercel (Recommended)

The easiest way to deploy  Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_campaign=create-next-app) from the creators of Next.js.

1. Push the code to a GitHub/GitLab/Bitbucket repository
2. Import the project on Vercel
3. Add the environment variables
4. Deploy!


##  Acknowledgments

- [Next.js Documentation](https://nextjs.org/docs)
- [Clerk Authentication](https://clerk.com/)
- [Supabase](https://supabase.com/)
- [Shadcn/ui](https://ui.shadcn.com/)
- [Tailwind CSS](https://tailwindcss.com/)
