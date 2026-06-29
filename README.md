# Xeno Shopify Data Ingestion & Insights Service

![Xeno Dashboard](https://img.shields.io/badge/Status-Production_Ready-green) ![Next.js](https://img.shields.io/badge/Next.js-14-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind](https://img.shields.io/badge/TailwindCSS-3.0-38B2AC)

> **Multi-tenant Shopify Analytics Dashboard** - A comprehensive solution for Shopify store owners to visualize and analyze their e-commerce data with real-time insights, customer analytics, and performance metrics.

## 🎯 Project Overview

Xeno is a full-stack web application that provides Shopify store owners with advanced analytics and insights beyond what's available in the standard Shopify dashboard. The system ingests data from multiple Shopify stores (multi-tenant architecture) and presents actionable insights through beautiful, interactive visualizations.

### 🌟 Key Features

- **Multi-Tenant Architecture**: Support multiple Shopify stores with data isolation
- **Real-time Dashboard**: Live metrics and KPIs with auto-refresh
- **Customer Analytics**: Customer lifetime value, segmentation, and behavior analysis
- **Product Performance**: Sales trends, inventory tracking, and profitability analysis
- **Order Management**: Comprehensive order tracking and financial metrics
- **Data Synchronization**: Automated Shopify data ingestion with manual sync options
- **Responsive Design**: Mobile-first design with modern UI/UX
- **Secure Authentication**: JWT-based auth with role-based access control

## 🏗️ System Architecture

### High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    Frontend (Next.js)                          │
├─────────────────────────────────────────────────────────────────┤
│  • React 18 with App Router                                    │
│  • TypeScript for type safety                                  │
│  • Tailwind CSS for styling                                    │
│  • Recharts for data visualization                             │
│  • Context API for state management                            │
│  • js-cookie for secure authentication                         │
└─────────────────────────────────────────────────────────────────┘
                                    │
                              HTTPS/API Calls
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│                    Backend (Node.js/Express)                   │
├─────────────────────────────────────────────────────────────────┤
│  • RESTful API with Express.js                                 │
│  • JWT Authentication & Authorization                          │
│  • Rate Limiting & Security Middleware                         │
│  • Prisma ORM for database operations                          │
│  • Cron jobs for scheduled data sync                           │
│  • Shopify Admin API integration                               │
└─────────────────────────────────────────────────────────────────┘
                                    │
                                    ▼
┌─────────────────────────────────────────────────────────────────┐
│               PostgreSQL Database (Railway)                    │
├─────────────────────────────────────────────────────────────────┤
│  • Multi-tenant data isolation                                 │
│  • Optimized indexes for analytics queries                     │
│  • Automated backups and scaling                               │
│  • Connection pooling                                          │
└─────────────────────────────────────────────────────────────────┘
```

### Component Architecture

#### Frontend Structure

```
frontend/
├── app/                          # Next.js 14 App Router
│   ├── (auth)/                  # Authentication pages
│   │   ├── login/               # Login page
│   │   └── register/            # Registration page
│   ├── dashboard/               # Protected dashboard routes
│   │   ├── customers/           # Customer management
│   │   ├── products/            # Product analytics
│   │   ├── orders/              # Order tracking
│   │   ├── sync/                # Data synchronization
│   │   └── settings/            # Tenant settings
│   ├── globals.css              # Global styles
│   ├── layout.tsx               # Root layout with providers
│   └── page.tsx                 # Landing page
├── components/                   # Reusable React components
│   ├── dashboard/               # Dashboard-specific components
│   │   ├── DashboardLayout.tsx  # Main dashboard layout
│   │   ├── OverviewCards.tsx    # KPI summary cards
│   │   ├── RevenueChart.tsx     # Revenue visualization
│   │   ├── TopCustomers.tsx     # Customer leaderboard
│   │   ├── ProductPerformance.tsx # Product analytics
│   │   └── SyncStatus.tsx       # Data sync monitoring
│   ├── auth/                    # Authentication components
│   │   ├── LoginForm.tsx        # Login form with validation
│   │   └── RegisterForm.tsx     # Registration with tenant setup
│   └── ui/                      # Base UI components
├── lib/                         # Utility libraries and configurations
│   ├── auth-context.tsx         # Authentication state management
│   ├── api.ts                   # API client and service methods
│   └── utils.ts                 # Helper functions
├── types/                       # TypeScript type definitions
│   └── index.ts                 # Shared interfaces and types
└── package.json                 # Dependencies and scripts
```

## 🚀 Getting Started

### Prerequisites

- **Node.js**: Version 18 or higher
- **npm or yarn**: Latest version
- **Backend API**: Running Xeno backend service
- **Shopify Store**: Admin API access

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/xeno-shopify-frontend.git
   cd xeno-shopify-frontend
   ```

2. **Install dependencies**

   ```bash
   npm install
   # or
   yarn install
   ```

3. **Environment Setup**

   Create a `.env.local` file in the root directory:

   ```env
   # API Configuration
   NEXT_PUBLIC_API_URL=https://your-backend-api.com

   # Optional: Analytics and monitoring
   NEXT_PUBLIC_GA_ID=your-google-analytics-id
   ```

4. **Start development server**

   ```bash
   npm run dev
   # or
   yarn dev
   ```

5. **Open your browser**

   Navigate to [http://localhost:3000](http://localhost:3000)

### Production Deployment

#### Deploy to Vercel (Recommended)

1. **Connect your repository** to Vercel
2. **Set environment variables** in Vercel dashboard
3. **Deploy** - Automatic deployments on git push

```bash
# Using Vercel CLI
npm i -g vercel
vercel --prod
```

#### Alternative Deployment Options

- **Netlify**: Static site deployment with serverless functions
- **Railway**: Full-stack deployment with database
- **AWS Amplify**: Scalable hosting with CDN
- **Docker**: Containerized deployment

## 🎨 UI/UX Design System

### Design Principles

- **Modern & Clean**: Gradient backgrounds with glassmorphism effects
- **Mobile-First**: Responsive design for all screen sizes
- **Accessibility**: WCAG 2.1 AA compliance
- **Performance**: Optimized loading and smooth animations

### Color Palette

```css
/* Primary Gradient */
.bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900

/* Secondary Colors */
.text-purple-400    /* Accent text */
.bg-white/10        /* Glass effect backgrounds */
.border-white/20    /* Subtle borders */

/* Status Colors */
.text-green-400     /* Success states */
.text-red-400       /* Error states */
.text-yellow-400; /* Warning states */
```

### Typography

- **Font Family**: Inter (Google Fonts)
- **Headings**: Font weights 600-800
- **Body Text**: Font weight 400-500
- **Code**: Monospace font family

## 📊 Features Deep Dive

### 1. Dashboard Overview

**Real-time KPIs and Metrics**

- Total customers, products, orders, and revenue
- Recent activity trends and percentage changes
- Quick action buttons for common tasks

**Components Used:**

- `OverviewCards.tsx` - KPI summary cards
- `RevenueChart.tsx` - Revenue trends visualization
- `TopCustomers.tsx` - Customer leaderboard

### 2. Customer Analytics

**Customer Management Features**

- Customer list with search and filtering
- Individual customer profiles with order history
- Customer segmentation and lifetime value analysis
- Marketing preference tracking

**Key Metrics:**

- Customer Lifetime Value (CLV)
- Average Order Value (AOV)
- Customer acquisition and retention rates
- Geographic distribution

### 3. Product Performance

**Product Analytics**

- Product catalog with performance metrics
- Sales trends and revenue attribution
- Inventory tracking and low-stock alerts
- Vendor and category analysis

**Analytics Features:**

- Top-selling products by revenue and quantity
- Product performance over time
- Inventory optimization insights
- Profit margin analysis

### 4. Order Management

**Order Tracking**

- Comprehensive order list with filtering
- Order status tracking and financial metrics
- Revenue analysis by time periods
- Order fulfillment monitoring

**Financial Metrics:**

- Revenue trends and forecasting
- Average order value tracking
- Tax and discount analysis
- Payment status monitoring

### 5. Data Synchronization

**Shopify Integration**

- Real-time data sync with Shopify stores
- Manual sync triggers for immediate updates
- Sync status monitoring and error handling
- Historical sync logs and performance metrics

**Sync Features:**

- Full sync (all data types)
- Incremental sync (changes only)
- Scheduled automatic syncing
- Error recovery and retry mechanisms

## 🔐 Security & Authentication

### Authentication Flow

1. **User Registration**

   - Email validation and password requirements
   - Tenant creation with Shopify store setup
   - Email verification (optional)

2. **Login Process**

   - JWT token generation and validation
   - Secure cookie storage with httpOnly flag
   - Automatic token refresh mechanism

3. **Session Management**
   - Sliding session expiration
   - Logout on inactivity
   - Multi-device session handling

### Security Features

- **HTTPS Enforcement**: All communications encrypted
- **XSS Protection**: Secure cookie configuration
- **CSRF Protection**: Token-based request validation
- **Rate Limiting**: API call restrictions
- **Input Validation**: Client and server-side validation

## 📡 API Integration

### Backend API Services

The frontend integrates with multiple backend services:

#### Authentication Service

```typescript
authService.login(email: string, password: string)
authService.register(userData: RegisterFormData)
authService.getProfile()
authService.refreshToken()
```

#### Dashboard Service

```typescript
dashboardService.getOverview();
dashboardService.getTopCustomers(params);
dashboardService.getProductPerformance(params);
dashboardService.getRevenueTrends(params);
```

#### Data Management Services

```typescript
customerService.getCustomers(filters);
productService.getProducts(filters);
orderService.getOrders(filters);
syncService.startSync(type);
```

### Error Handling

- **Network Errors**: Automatic retry with exponential backoff
- **Authentication Errors**: Automatic logout and redirect
- **Validation Errors**: User-friendly error messages
- **Server Errors**: Graceful degradation with fallback UI

## 🎯 Performance Optimization

### Frontend Performance

- **Code Splitting**: Automatic route-based splitting
- **Image Optimization**: Next.js Image component
- **Bundle Analysis**: webpack-bundle-analyzer
- **Caching Strategy**: Browser and CDN caching

### Loading Performance

- **Skeleton Screens**: Loading placeholders for better UX
- **Progressive Loading**: Priority-based content loading
- **Lazy Loading**: Images and components loaded on demand
- **Prefetching**: Critical resources preloaded

### Monitoring & Analytics

- **Core Web Vitals**: Performance metric tracking
- **Error Tracking**: Client-side error monitoring
- **User Analytics**: Page views and user behavior
- **Performance Monitoring**: Real-time performance insights

## 🧪 Development Workflow

### Code Quality

- **TypeScript**: Type safety and better developer experience
- **ESLint**: Code linting and formatting
- **Prettier**: Consistent code formatting
- **Husky**: Git hooks for pre-commit validation

### Development Scripts

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript validation

# Deployment
npm run deploy       # Deploy to production
npm run preview      # Preview production build
```

### Git Workflow

1. **Feature Branches**: Create feature branches from main
2. **Pull Requests**: Code review before merging
3. **Automated Testing**: CI/CD pipeline validation
4. **Deployment**: Automatic deployment on merge to main

## 🔧 Configuration

### Next.js Configuration

```javascript
// next.config.js
const nextConfig = {
  experimental: {
    appDir: true,
  },
  images: {
    domains: ["your-image-domains.com"],
  },
  env: {
    CUSTOM_ENV_VAR: process.env.CUSTOM_ENV_VAR,
  },
};
```

### Tailwind Configuration

```javascript
// tailwind.config.js
module.exports = {
  content: ["./app/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        // Custom color palette
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
```

## 📚 Project Assumptions

### Business Logic Assumptions

1. **Multi-Tenancy**: Each tenant represents a single Shopify store
2. **User Roles**: Two-tier system (ADMIN/USER) sufficient for MVP
3. **Data Sync**: Daily full sync acceptable for business needs
4. **Revenue Calculation**: Include taxes and discounts in totals

### Technical Assumptions

1. **Authentication**: JWT with 24-hour expiration strikes right balance
2. **Database**: PostgreSQL sufficient for target scale
3. **API Rate Limits**: 100 requests per 15 minutes reasonable
4. **Error Handling**: Graceful degradation preferred over failures

### Data Model Assumptions

1. **Customer Data**: Email addresses may be null (guest checkouts)
2. **Product Pricing**: Single price per product (ignoring variants)
3. **Order Status**: Financial status drives revenue reporting
4. **Inventory**: Product-level tracking (not variant-level)

## 🚀 Production Readiness

### Next Steps for Production

#### Infrastructure & Scaling

1. **CDN Implementation**

   - CloudFlare or AWS CloudFront
   - Global edge caching for static assets
   - Image optimization and compression

2. **Monitoring & Observability**

   - Application Performance Monitoring (APM)
   - Error tracking with Sentry
   - User analytics with Google Analytics
   - Performance monitoring with Core Web Vitals

3. **Security Enhancements**
   - Content Security Policy (CSP) headers
   - Regular security audits
   - Penetration testing
   - GDPR compliance implementation

#### Feature Enhancements

1. **Advanced Analytics**

   - Predictive analytics and forecasting
   - Custom dashboard creation
   - Advanced customer segmentation
   - A/B testing framework

2. **Integration Expansion**

   - Multiple Shopify app integration
   - Third-party marketing tools
   - Inventory management systems
   - Accounting software integration

3. **User Experience**
   - Real-time notifications
   - Mobile app development
   - Advanced filtering and search
   - Data export functionality

#### Scalability Considerations

1. **Performance Optimization**

   - Server-side rendering for critical pages
   - Progressive Web App (PWA) features
   - Advanced caching strategies
   - Database query optimization

2. **Architecture Evolution**
   - Microservices migration
   - Event-driven architecture
   - Real-time data streaming
   - Multi-region deployment

## 🤝 Contributing

We welcome contributions from the community! Please read our contributing guidelines before submitting pull requests.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new features
5. Submit a pull request

### Code Standards

- Follow TypeScript best practices
- Write meaningful commit messages
- Include documentation for new features
- Ensure all tests pass before submitting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Next.js Team** for the amazing React framework
- **Tailwind CSS** for the utility-first CSS framework
- **Shopify** for the comprehensive Admin API
- **Vercel** for seamless deployment platform
- **Railway** for database hosting

## 📞 Support

For support, email waseem20032005@gmail.com or create an issue in this repository.

---

**Built with ❤️ by the Waseem**

![Footer](https://img.shields.io/badge/Made_with-Next.js-black) ![Footer](https://img.shields.io/badge/Styled_with-TailwindCSS-38B2AC) ![Footer](https://img.shields.io/badge/Deployed_on-Vercel-black)


