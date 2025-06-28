# PortfolioGuardian Client Application Form

This is a secure multi-step client onboarding application for PortfolioGuardian investment management and reporting services.

## 🚀 Features

- **Multi-step Form Flow**: User-friendly interface with 6 steps
- **Identity Verification**: Integrated with Stripe Identity for document verification
- **Security**: End-to-end encryption, bank-level security standards
- **Responsive Design**: Modern UI using Tailwind CSS
- **Type Safety**: Full TypeScript support
- **State Management**: Uses Zustand for form state management
- **GDPR Compliance**: Data processing compliance features
- **Accounting Team Access**: Secure portal for the accounting team to view and process applications

## 📋 Form Steps

1. **Entity Type Selection** - Individual, SMSF, Company, Trust
2. **Entity Details** - Legal name, ABN, GST registration, address
3. **Contact Information** - Email, phone, preferred contact method
4. **Identity Verification** - Stripe Identity document upload and verification
5. **Investment Profile** - Experience level, risk tolerance, investment objectives
6. **Additional Information** - Tax residency, beneficial ownership, source of funds

## 🛠 Tech Stack

### Frontend
- **Next.js 14** - React framework
- **Shadcn UI** - Component library
- **Tailwind CSS** - Styling framework
- **TypeScript** - Type safety
- **React Hook Form** - Form management
- **Zod** - Data validation
- **Zustand** - State management

### Backend Services
- **Supabase** - Database (PostgreSQL) and authentication
- **Stripe Identity** - Identity verification API
- **Supabase Storage** - Encrypted file storage
- **Supabase Edge Functions** - Serverless functions

## 🔧 Installation & Setup

### 1. Install dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env.local` file and configure the following variables:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_public_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# Stripe
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret
NEXTAUTH_URL=http://localhost:3000

# Email
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@portfolioguardian.com

# Security
ENCRYPTION_KEY=your_32_character_encryption_key
RATE_LIMIT_MAX=10

# Accounting Team Access
ACCOUNTING_JWT_SECRET=your_accounting_jwt_secret_key
ACCOUNTING_TEAM_EMAIL=accounting@portfolioguardian.com
```

### 3. Database Setup
Run Supabase migrations to create the required tables. First, run the base table structure:

```sql
-- Create applications table
CREATE TABLE applications (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id VARCHAR UNIQUE NOT NULL,
  entity_type VARCHAR NOT NULL,
  entity_name VARCHAR NOT NULL,
  australian_business_number VARCHAR,
  is_registered_for_gst BOOLEAN,
  holder_identification_number VARCHAR,
  registered_address TEXT NOT NULL,
  contact_email VARCHAR NOT NULL,
  contact_phone VARCHAR NOT NULL,
  preferred_contact_method VARCHAR NOT NULL,
  stripe_identity_session_id VARCHAR,
  identity_verification_status VARCHAR DEFAULT 'pending',
  investment_experience VARCHAR,
  risk_tolerance VARCHAR,
  portfolio_size VARCHAR,
  investment_objectives JSONB,
  tax_residency VARCHAR,
  beneficial_ownership TEXT,
  source_of_funds TEXT,
  privacy_policy_accepted BOOLEAN DEFAULT FALSE,
  terms_of_service_accepted BOOLEAN DEFAULT FALSE,
  data_processing_consent BOOLEAN DEFAULT FALSE,
  is_submitted BOOLEAN DEFAULT FALSE,
  submitted_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create documents table
CREATE TABLE application_documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  application_id UUID REFERENCES applications(id),
  document_type VARCHAR NOT NULL,
  file_path VARCHAR NOT NULL,
  file_name VARCHAR NOT NULL,
  file_size INTEGER,
  mime_type VARCHAR,
  uploaded_at TIMESTAMP DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE application_documents ENABLE ROW LEVEL SECURITY;
```

Then run the full accounting team access system migration:

```bash
# Run database-migration.sql in the Supabase SQL Editor
```

### 4. Start the Development Server
```bash
npm run dev
```

The application will run at [http://localhost:3000](http://localhost:3000).

The accounting team portal will run at [http://localhost:3000/accounting](http://localhost:3000/accounting).

## 🔒 Security Features

- **HTTPS Only** - Enforces HTTPS connections
- **Content Security Policy (CSP)** - Prevents XSS attacks
- **Input Validation** - Validates and sanitizes all user input
- **Rate Limiting** - API endpoint rate limiting
- **Audit Logs** - Logs all operations
- **Data Encryption** - End-to-end encryption of sensitive data
- **Automatic Cleanup** - 30-day automatic data cleanup
- **Accounting Team Access Control** - JWT and API key authentication
- **Row Level Security** - Database-level access control

## 📁 Project Structure

```
PG_Application_Form/
├── app/                          # Next.js App Router
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Home page
│   ├── application/             # Application form pages
│   │   ├── step-1/page.tsx     # Entity type selection
│   │   ├── step-2/page.tsx     # Entity details
│   │   ├── step-3/page.tsx     # Contact information
│   │   ├── step-4/page.tsx     # Identity verification
│   │   ├── step-5/page.tsx     # Investment profile
│   │   └── step-6/page.tsx     # Review and submit
│   ├── accounting/              # Accounting team portal
│   │   ├── page.tsx            # Application list
│   │   ├── login/page.tsx      # Login page
│   │   └── applications/       # Application detail pages
│   ├── api/                     # API routes
│   │   ├── stripe-identity/     # Stripe Identity integration
│   │   ├── applications/        # Application CRUD
│   │   ├── documents/           # Document upload
│   │   └── accounting/          # Accounting team API
│   └── thank-you/page.tsx       # Success page
├── components/                   # React components
│   └── ui/                      # Shadcn UI components
│       ├── button.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── textarea.tsx
│       └── progress-indicator.tsx
├── lib/                         # Utilities and config
│   ├── utils.ts                 # General utility functions
│   ├── store.ts                 # Zustand state management
│   ├── auth.ts                  # Accounting team authentication
│   ├── encryption.ts            # Data encryption
│   └── notifications.ts         # Notification system
└── public/                      # Static assets
```

## 🚦 Usage Flow

### Client Application Flow
1. **Visit Home Page** - User sees welcome page and security notice
2. **Start Application** - Click "Start Application" button
3. **Complete Each Step** - Fill out the 6 form pages step by step
4. **Identity Verification** - Upload documents via Stripe Identity
5. **Review and Submit** - Final review and submit application
6. **Confirmation Page** - Receive confirmation and next steps

### Accounting Team Access Flow
1. **Login to Portal** - Visit `/accounting/login` for authentication
2. **View Application List** - See all submitted applications
3. **View Application Details** - Click to view full details (including decrypted sensitive data)
4. **Add Notes** - Add internal notes to applications
5. **Update Status** - Mark applications as reviewed or set priority

## 🔐 Accounting Team Security

### Authentication Methods
- **JWT Token** - Time-based access token
- **API Key** - For programmatic access
- **Password Hashing** - Secure password storage

### Data Protection
- **Sensitive Data Encryption** - ABN, phone numbers, bank account info, etc.
- **Access Logs** - Record all data access
- **Audit Trail** - Complete operation history

### Default Account
After system setup, you can use the following default account to log in to the accounting team portal:
- **Email**: admin@portfolioguardian.com
- **Password**: admin123

**Important**: Please change the default password immediately in production!

## 🔧 Development

### Add New Components
```bash
# Use Shadcn UI CLI to add components
npx shadcn-ui@latest add [component-name]
```

### Type Checking
```bash
npm run type-check
```

### Build for Production
```bash
npm run build
```

### Database Migration
```bash
# Run SQL migration in Supabase console
# Or use Supabase CLI
supabase db push
```

## 📞 Support

If you have any questions or need help, please contact the development team.

---

**Note**: This is a production-ready application with full security and compliance features. Before deploying to production, please ensure:
1. All default passwords are changed
2. Environment variables are correctly configured
3. Proper domain and SSL certificates are set up
4. Email service is configured
5. Monitoring and logging are enabled 

export function encryptApplicationData(data: any) {
  const sensitiveFields = [
    'australian_business_number',
    'holder_identification_number',
    'contact_phone',
    'account_number', // Only if this is a string field
    'bsb' // Only if this is a string field
  ];

  const encryptedData = { ...data };

  for (const field of sensitiveFields) {
    if (typeof data[field] === 'string' && data[field]) {
      encryptedData[field] = encryptData(data[field]);
    }
  }

  return encryptedData;
} 