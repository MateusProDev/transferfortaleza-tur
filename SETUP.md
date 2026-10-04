# Passeio Legal - Setup and Development Guide

## 📦 Project Overview

This is a complete Next.js 14 + TypeScript + Firebase + Cloudinary + Tailwind CSS application for managing a tourism website with a full-featured admin panel.

## ✨ Completed Features

### ✅ Core Setup
- [x] TypeScript configuration with strict mode
- [x] Next.js 14 with App Router
- [x] Tailwind CSS with custom theme colors
- [x] ESLint and type checking
- [x] Environment variable setup

### ✅ Database & Authentication
- [x] Firebase Firestore integration
- [x] Firebase Authentication setup
- [x] Firestore service utilities with typed CRUD operations
- [x] Activity logging infrastructure

### ✅ Image Management
- [x] Cloudinary integration
- [x] Client-side upload utilities
- [x] Server-side image deletion API
- [x] Image optimization functions

### ✅ API Routes (Vercel Serverless)
- [x] `/api/banners` - CRUD operations
- [x] `/api/tours` - Tour management
- [x] `/api/transfers` - Transfer management
- [x] `/api/testimonials` - Testimonials
- [x] `/api/blog` - Blog posts
- [x] `/api/faq` - FAQ items
- [x] `/api/settings` - Site settings
- [x] `/api/cloudinary/delete` - Image deletion

### ✅ Admin Panel
- [x] Admin login page
- [x] Dashboard with statistics
- [x] Sidebar navigation
- [x] Banners management page
- [x] Tours management page
- [x] Transfers management page
- [x] Testimonials stub page
- [x] Blog stub page
- [x] FAQ stub page
- [x] Settings page with basic configuration

### ✅ UI Components
- [x] Button component with variants
- [x] Card component system
- [x] Input component
- [x] Global styles with Tailwind
- [x] Responsive design utilities

### ✅ Hooks & Utilities
- [x] `useApi` hook for data fetching and mutations
- [x] `useAuth` hook with Firebase integration
- [x] Custom validation schemas with Zod
- [x] String utilities (slugify, truncate, etc.)
- [x] Formatting utilities (price, date)
- [x] Array utilities and helpers

### ✅ Type Definitions
- [x] Complete TypeScript types for all entities
- [x] User and auth types
- [x] Activity log types
- [x] Settings and configuration types

### ✅ Middleware
- [x] Route protection for admin panel
- [x] Authentication check middleware

## 🚀 Next Steps to Complete

### 1. Complete Admin Forms
- Create form pages for creating/editing:
  - [ ] Banners (with image upload)
  - [ ] Tours (with gallery support)
  - [ ] Transfers
  - [ ] Testimonials
  - [ ] Blog posts (with rich text editor)
  - [ ] FAQ items
  - [ ] Site settings (advanced)

### 2. Public Website Pages
- [ ] Home page with complete layout
- [ ] Tour detail page
- [ ] Transfer detail page
- [ ] Blog page listing
- [ ] Blog post detail page
- [ ] About page
- [ ] Contact page with form
- [ ] FAQ page
- [ ] Gallery page

### 3. Public Website Components
- [ ] Header with navigation
- [ ] Footer with social links
- [ ] Banner carousel/slider
- [ ] Tour cards grid
- [ ] Transfer cards grid
- [ ] Testimonials section
- [ ] Contact form
- [ ] Newsletter signup

### 4. Advanced Features
- [ ] Image gallery with lightbox
- [ ] Search functionality
- [ ] Filtering and sorting
- [ ] Reservation system
- [ ] Payment integration
- [ ] Email notifications
- [ ] Analytics dashboard
- [ ] Multi-language support

### 5. Deployment & DevOps
- [ ] GitHub setup
- [ ] Vercel deployment configuration
- [ ] Environment variables for production
- [ ] Database backups
- [ ] Error monitoring (Sentry)
- [ ] Analytics (Google Analytics)

## 📝 Development Guidelines

### File Structure
```
src/
├── app/                    # Next.js app directory
│   ├── api/               # API routes (Serverless functions)
│   ├── admin/             # Admin dashboard
│   ├── (public)/          # Public pages
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/            # Reusable React components
│   ├── ui/               # Base UI components
│   ├── admin/            # Admin-specific components
│   └── public/           # Public site components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and helpers
│   ├── firebase.ts       # Firebase initialization
│   ├── firestore.ts      # Firestore database service
│   ├── cloudinary.ts     # Cloudinary image service
│   └── utils.ts          # General utilities
├── types/               # TypeScript type definitions
├── stores/              # Zustand state management
└── config/              # Configuration files
```

### Code Style
- Use TypeScript everywhere (no `any` types)
- Use `"use client"` directive for client components
- Use React hooks instead of class components
- Keep components small and focused
- Export components at end of file
- Use consistent naming (camelCase for functions, PascalCase for components)

### API Routes Best Practices
- Always validate input data
- Use proper HTTP methods (GET, POST, PUT, DELETE)
- Return consistent JSON responses
- Include error handling with proper status codes
- Log errors for debugging
- Use TypeScript for route handlers

### Database Patterns
- Use Firestore collections: lowercase, singular names
- Include `createdAt` and `updatedAt` timestamps
- Use `active` boolean for soft deletes
- Use `order` field for ordering items
- Create indexes for frequent queries

### Image Handling
- Always include alt text for accessibility
- Use next/image for optimization
- Store URLs in Firestore, not binary data
- Organize Cloudinary folders by type
- Delete images when records are removed

## 🔐 Security Checklist

- [ ] Set Firebase Firestore security rules
- [ ] Enable API rate limiting
- [ ] Hash sensitive data
- [ ] Validate all user input
- [ ] Use HTTPS in production
- [ ] Set secure cookie flags
- [ ] Enable CORS appropriately
- [ ] Use environment variables for secrets
- [ ] Regular security audits
- [ ] Update dependencies regularly

## 📱 Responsive Design

The application uses Tailwind's responsive utilities:
- Mobile first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
- Use `md:` prefix for medium screens and up
- Navigation: Hamburger menu on mobile, full menu on desktop
- Sidebar: Hidden on mobile, visible on desktop

## 🎨 Customization

### Colors
Edit `tailwind.config.ts` to customize color scheme:
```typescript
colors: {
  primary: { /* your color palette */ },
  secondary: { /* your color palette */ },
}
```

### Fonts
Update font family in `tailwind.config.ts` and `src/app/globals.css`

### Site Info
Update site metadata in:
- `src/app/layout.tsx` - Root metadata
- Admin settings - Dynamic settings

## 🚢 Deployment Checklist

- [ ] All environment variables set in Vercel
- [ ] Firestore security rules configured
- [ ] Cloudinary upload preset created
- [ ] Domain DNS configured
- [ ] SSL certificate enabled
- [ ] Backups configured
- [ ] Error monitoring set up
- [ ] Performance monitoring set up
- [ ] Analytics configured
- [ ] Email notifications working
- [ ] Tested all features in production

## 📚 Documentation Files

- `README.md` - Main project documentation
- `SETUP.md` - Detailed setup instructions
- `.env.example` - Environment variables template
- `API.md` - API documentation
- `ADMIN.md` - Admin panel usage guide

## 🆘 Common Issues & Solutions

### Firebase Connection Error
**Problem**: Cannot connect to Firestore
**Solution**: 
1. Check credentials in `.env.local`
2. Ensure collections exist in Firestore
3. Check security rules allow access

### Image Upload Failed
**Problem**: Cloudinary upload not working
**Solution**:
1. Verify Cloud Name and API key
2. Create unsigned upload preset
3. Check CORS configuration

### Admin Login Not Working
**Problem**: Cannot log in to admin panel
**Solution**:
1. Clear browser cache and localStorage
2. Check Firebase Authentication enabled
3. Verify user account exists

### Slow API Responses
**Problem**: API routes responding slowly
**Solution**:
1. Add Firestore indexes
2. Optimize queries (use where clauses)
3. Implement caching
4. Check database size and optimize

## 📞 Support & Resources

### Official Documentation
- [Next.js](https://nextjs.org/docs)
- [Firebase](https://firebase.google.com/docs)
- [Cloudinary](https://cloudinary.com/documentation)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [TypeScript](https://www.typescriptlang.org/docs)

### Useful Libraries
- [React Hook Form](https://react-hook-form.com/) - Form handling
- [Zod](https://zod.dev/) - Data validation
- [Zustand](https://github.com/pmndrs/zustand) - State management
- [Framer Motion](https://www.framer.com/motion/) - Animations
- [React Hot Toast](https://react-hot-toast.com/) - Notifications

## 🎯 Performance Optimization

1. **Image Optimization**
   - Use Cloudinary transformations
   - Implement lazy loading
   - Use WebP format when possible

2. **Database Optimization**
   - Create Firestore indexes for queries
   - Use pagination for large datasets
   - Cache frequently accessed data

3. **Code Splitting**
   - Use dynamic imports for large components
   - Lazy load routes in admin panel
   - Remove unused dependencies

4. **Monitoring**
   - Set up error tracking (Sentry)
   - Monitor API performance
   - Track user analytics
   - Monitor database usage

## 🔄 Git Workflow

```bash
# Create feature branch
git checkout -b feature/feature-name

# Make changes and commit
git add .
git commit -m "feat: description of changes"

# Push to remote
git push origin feature/feature-name

# Create pull request
# After review and approval, merge to main
```

## 📊 Database Schema

### Collections Structure
```
banners/
  └─ {bannerId}
tours/
  └─ {tourId}
transfers/
  └─ {transferId}
testimonials/
  └─ {testimonialId}
blog/
  └─ {postId}
faq/
  └─ {faqId}
settings/
  └─ {settingsId}
activityLogs/
  └─ {logId}
```

---

**Last Updated**: 2026-08-17
**Version**: 1.0.0
**Status**: In Development ✨
