Multi-Tenant E-commerce

A modern, full-stack e-commerce platform built with Next.js, Payload CMS, and Stripe that supports multiple tenants (stores) on a single platform. Each tenant gets their own subdomain and can manage their products, orders, and payments independently.

🚀 Features

🏢 Multi-Tenant Architecture
- Subdomain-based tenant isolation** - Each store gets its own subdomain (e.g., `store1.yourdomain.com`)
- Independent product catalogs** - Each tenant manages their own products, categories, and media
- Separate Stripe accounts** - Each tenant has their own Stripe account for payments
- Role-based access control** - Super admins can manage all tenants, regular users are restricted to their assigned tenant

🛒 E-commerce Features
- Product management - Create, edit, and organize products with rich content
- Category system - Hierarchical categories with subcategories
- Shopping cart - Per-tenant cart management with persistent storage
- Checkout system - Integrated Stripe checkout with tenant-specific accounts
- Order management - Track orders and manage fulfillment
- Review system - Customer reviews and ratings
- Search and filtering - Advanced product search with category and tag filters

📝 Content Management
- Payload CMS integration - Full-featured admin panel for content management
- Rich text editor - Lexical editor for product descriptions and content
- Media management - Upload and organize images with Vercel Blob storage
- Multi-tenant content isolation - Content is automatically scoped to the correct tenant

🏗️ Architecture

🛠️ Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Payload CMS, tRPC
- **Database**: MongoDB with Mongoose adapter
- **Payment**: Stripe (multi-account support)
- **Storage**: Vercel Blob for media files
- **Styling**: Tailwind CSS, Radix UI components
- **State Management**: Zustand, React Query

### Quick Start

Step 1: Clone the Repository
git clone https://github.com/trnganhson/multitenent-ecommerce.git
cd multitenent-ecommerce
```

Step 2: Install Dependencies
pnpm install (can use npm,yan or not recommended use bun) 

Step 3: Set Up the Database
# Generate TypeScript types
pnpm generate:types

# Fresh database migration
pnpm db:fresh

# Seed the database with initial data
pnpm db:seed

Step 4: Start the Development Server
pnpm run dev

#### Step 6: Access the Application
- Main app: http://localhost:3000
- Admin pane: http://localhost:3000/admin
- Default admin credentials: 
  - Email: `transonnn@demo.com`
  - Password: `123456789`

