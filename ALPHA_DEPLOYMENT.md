# 🚀 HBH-2 Alpha Deployment Guide

## 📋 Pre-Deployment Checklist

### ✅ **Completed Cleanup Tasks**
- [x] Removed all test/mock data and sample content
- [x] Deleted demo pages and test components
- [x] Cleaned up service actions (removed sample data)
- [x] Cleaned up transaction actions (removed sample data)
- [x] Removed Jest and testing dependencies
- [x] Removed seed scripts and mock files
- [x] Updated homepage to remove placeholder images
- [x] Created production-ready scripts

### 🔧 **Required Environment Variables**

#### **Database**
```env
DATABASE_URL="postgresql://..."
```

#### **Authentication (Supabase)**
```env
NEXT_PUBLIC_SUPABASE_URL="https://your-project.supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="eyJ..."
SUPABASE_SERVICE_ROLE_KEY="eyJ..."
```

#### **NextAuth**
```env
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="https://your-domain.com"
```

#### **Image Upload (Cloudinary)**
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
CLOUDINARY_API_KEY="your-api-key"
CLOUDINARY_API_SECRET="your-api-secret"
```

#### **Payment Processing (Stripe)**
```env
STRIPE_SECRET_KEY="sk_live_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
```

#### **Optional: Admin User**
```env
ADMIN_EMAIL="admin@homesinbetterhands.com"
ADMIN_NAME="Admin User"
```

## 🚀 **Deployment Steps**

### 1. **Database Setup**
```bash
# Deploy database migrations
npm run db:deploy

# Clean existing data (if any)
npm run cleanup:alpha

# Setup production environment
npm run setup:production
```

### 2. **Build and Deploy**
```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start production server
npm start
```

### 3. **Verify Deployment**
- [ ] Homepage loads correctly
- [ ] User registration/login works
- [ ] Property creation with image upload works
- [ ] Services section is functional
- [ ] Marketplace displays correctly
- [ ] Payment processing is ready

## 💰 **Payment Integration Setup**

### **Stripe Configuration**
1. Set up Stripe account for production
2. Configure webhook endpoints
3. Test payment flows with real money (small amounts)
4. Verify transaction recording in database

### **Fee Structure (Ready for Alpha)**
- **Buyers/Users**: Free
- **Sellers**: $10/listing or $50/month unlimited
- **Service Providers**: 
  - Small business: 5% transaction fee
  - Large business: $50-100/month
- **Transaction Fee**: 5% platform fee

## 🔒 **Security Checklist**
- [ ] HTTPS enabled
- [ ] Environment variables secured
- [ ] Database access restricted
- [ ] API rate limiting enabled
- [ ] CORS properly configured
- [ ] Authentication working correctly

## 📊 **Monitoring Setup**
- [ ] Error tracking (Sentry configured)
- [ ] Performance monitoring
- [ ] Database monitoring
- [ ] User analytics
- [ ] Payment monitoring

## 🎯 **Alpha Testing Plan**

### **Phase 1: Internal Testing**
1. Create admin account
2. Test all user flows
3. Verify payment processing
4. Test image uploads
5. Verify email notifications

### **Phase 2: Limited Alpha Users**
1. Invite 10-20 alpha users
2. Monitor for issues
3. Collect feedback
4. Fix critical bugs

### **Phase 3: Expanded Alpha**
1. Invite more users
2. Monitor performance
3. Scale infrastructure as needed
4. Prepare for beta launch

## 🛠 **Available Scripts**

```bash
# Development
npm run dev

# Production
npm run build
npm start

# Database
npm run db:deploy
npm run db:reset

# Alpha preparation
npm run cleanup:alpha
npm run setup:production
```

## 📞 **Support & Monitoring**

### **Key Metrics to Monitor**
- User registrations
- Property listings created
- Service bookings
- Payment transactions
- Error rates
- Page load times

### **Critical Alerts**
- Payment failures
- Database connection issues
- High error rates
- Performance degradation

## 🎉 **Ready for Alpha!**

The application is now clean of all test data and ready for Alpha users with real money transactions. All mock data has been removed and the system is prepared for production use.

### **Next Steps**
1. Deploy to production environment
2. Configure monitoring
3. Test payment flows with real money
4. Invite alpha users
5. Monitor and iterate based on feedback
