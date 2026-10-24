# Rental DIY 2.0

A modern web application for generating tenancy agreements with integrated payment processing.

## Features

- Beautiful and user-friendly form interface
- Automatic PDF generation
- Stripe payment integration (HKD 3 per agreement)
- Email delivery option
- Modern, responsive design

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- jsPDF for PDF generation

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
   STRIPE_SECRET_KEY=your_stripe_secret_key
   NEXT_PUBLIC_BASE_URL=http://localhost:3000
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Environment Variables

- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Your Stripe publishable key
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `NEXT_PUBLIC_BASE_URL`: The base URL of your application

## Deployment

1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Contributing

1. Fork the repository
2. Create your feature branch
