# Getting Started Guide

Welcome to your **Passeio Legal** Next.js tourism website project! This guide will help you get up and running quickly.

## 🚀 Quick Start (5 minutes)

### Step 1: Install Dependencies
```bash
cd /home/mateus/passeiolegal
npm install
```

### Step 2: Configure Environment
1. Copy `.env.example` to `.env.local`
2. Fill in your Firebase and Cloudinary credentials:

```bash
# Firebase (from Firebase Console)
NEXT_PUBLIC_FIREBASE_API_KEY=xxxx
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=xxxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=xxxx
NEXT_PUBLIC_FIREBASE_APP_ID=xxxx

# Cloudinary (from Cloudinary Dashboard)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxxx
CLOUDINARY_API_KEY=xxxx
CLOUDINARY_API_SECRET=xxxx
```

### Step 3: Set Up Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable **Firestore Database** (Start in test mode)
4. Enable **Authentication** → Email/Password provider
5. Copy credentials from Project Settings

### Step 4: Create Firestore Collections
In Firebase Console → Firestore Database, create these empty collections:
- `banners`
- `tours`
- `transfers`
- `testimonials`
- `blog`
- `faq`
- `settings`
- `activityLogs`

### Step 5: Set Up Cloudinary
1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Get your **Cloud Name**
3. Create an **Upload Preset** (Settings → Upload)
   - Set to **Unsigned**
4. Add to `.env.local`:
```
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_preset_name
```

### Step 6: Create Admin User
1. In Firebase Console → Authentication
2. Click "Add user" → Create with email/password
3. This account can log into the admin panel

### Step 7: Run Development Server
```bash
npm run dev
```

Open in browser:
- **Public Site**: http://localhost:3000
- **Admin Login**: http://localhost:3000/admin/login
- **Admin Dashboard**: http://localhost:3000/admin/dashboard

---

## 📁 Project Structure

```
passeiolegal/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── api/            # API routes (serverless functions)
│   │   ├── admin/          # Admin dashboard pages
│   │   ├── layout.tsx      # Root layout
│   │   ├── page.tsx        # Home page
│   │   └── globals.css     # Global styles
│   ├── components/         # React components
│   │   └── ui/            # Basic UI components
│   ├── hooks/             # Custom React hooks
│   ├── lib/               # Utilities and helpers
│   ├── types/             # TypeScript definitions
│   └── middleware.ts      # Route protection
├── public/                # Static assets
├── package.json          # Dependencies
├── tsconfig.json         # TypeScript config
├── tailwind.config.ts    # Tailwind config
├── README.md             # Main documentation
├── API.md                # API documentation
├── SETUP.md              # Setup guide
└── PROJECT_SUMMARY.md    # Project summary
```

---

## ✅ What's Already Built

### Backend (API Routes)
- ✅ Banners CRUD API
- ✅ Tours CRUD API
- ✅ Transfers CRUD API
- ✅ Testimonials CRUD API
- ✅ Blog CRUD API
- ✅ FAQ CRUD API
- ✅ Settings API
- ✅ Image deletion API
- ✅ Login API

### Admin Dashboard
- ✅ Login page
- ✅ Dashboard with stats
- ✅ Banners management
- ✅ Tours management
- ✅ Transfers management
- ✅ Settings page

### Core Features
- ✅ Firebase integration
- ✅ Cloudinary integration
- ✅ Authentication & authorization
- ✅ Form validation (Zod)
- ✅ Custom hooks and utilities
- ✅ Type-safe codebase
- ✅ Responsive design

---

## 🎯 Next Steps

### To Build Complete Admin Forms:
1. Create `/admin/banners/new` page with form
2. Create `/admin/tours/new` page with gallery
3. Create `/admin/transfers/new` page
4. Create `/admin/blog/new` page with rich text
5. Create edit pages for each

### To Build Public Website:
1. Add Header component
2. Add Footer component
3. Add Hero carousel component
4. Create tour detail page
5. Create blog pages
6. Add forms (contact, newsletter)

### To Deploy:
1. Push to GitHub
2. Connect to Vercel
3. Set environment variables
4. Deploy with `vercel deploy`

---

## 📚 Documentation

- **[README.md](./README.md)** - Full project documentation
- **[API.md](./API.md)** - API routes reference
- **[SETUP.md](./SETUP.md)** - Development guidelines
- **[PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)** - What's been built

---

## 🆘 Common Issues

### "Cannot find module 'firebase'"
```bash
npm install
```

### "Firestore not connected"
- Check `.env.local` has correct Firebase credentials
- Ensure Firestore database is created
- Check Firebase security rules allow access

### "Image upload fails"
- Verify Cloudinary credentials in `.env.local`
- Create unsigned upload preset
- Check `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`

### "Admin login not working"
- Clear browser cache and localStorage
- Verify user exists in Firebase Authentication
- Check `.env.local` credentials

---

## 🔗 Useful Links

| Resource | URL |
|----------|-----|
| Firebase Console | https://console.firebase.google.com |
| Cloudinary Dashboard | https://cloudinary.com/console |
| Vercel Dashboard | https://vercel.com/dashboard |
| Next.js Docs | https://nextjs.org/docs |
| TypeScript Docs | https://www.typescriptlang.org/docs |
| Tailwind CSS | https://tailwindcss.com/docs |

---

## 💡 Tips

1. **Use TypeScript** - Leverage type safety for better development
2. **Follow the patterns** - See existing code for patterns to follow
3. **Read the docs** - Check API.md before making API calls
4. **Test locally** - Always test forms and API routes locally first
5. **Use Vercel CLI** - `npm i -g vercel` for easy deployment
6. **Monitor errors** - Check browser console and server logs
7. **Validate input** - Always validate user input with Zod
8. **Secure images** - Always delete old images when updating

---

## 🎓 Learning Path

1. **Understand the structure** - Read README.md and PROJECT_SUMMARY.md
2. **Explore the code** - Look at existing API routes and components
3. **Try the admin** - Log in and see how data flows
4. **Add a feature** - Start with simple forms, work up to complex ones
5. **Deploy** - Push to GitHub and deploy on Vercel
6. **Monitor** - Set up error tracking and analytics

---

## 📞 Support Resources

### Official Documentation
- [Next.js 14](https://nextjs.org/docs) - Framework
- [Firebase](https://firebase.google.com/docs) - Database & Auth
- [Cloudinary](https://cloudinary.com/documentation) - Image management
- [Tailwind CSS](https://tailwindcss.com/docs) - Styling

### Community
- [Next.js Discord](https://discord.gg/nextjs)
- [Firebase Community](https://stackoverflow.com/questions/tagged/firebase)
- [Stack Overflow](https://stackoverflow.com)

---

## ✨ Features by Section

### Admin Panel
- **Banners**: CRUD with image upload ✅
- **Tours**: CRUD with gallery ✅
- **Transfers**: CRUD with vehicle info ✅
- **Testimonials**: CRUD with photos ✅
- **Blog**: CRUD with rich text (needs editor)
- **FAQ**: CRUD with reordering (needs UI)
- **Settings**: Global site configuration ✅

### Public Website
- **Home**: Hero banner + sections (needs layout)
- **Tours Page**: Grid with filters (needs components)
- **Blog**: List and detail pages (needs pages)
- **Contact**: Form + map (needs components)
- **Footer**: Links and info (needs components)

### Core
- **Authentication**: Email/password ✅
- **Image Management**: Upload & delete ✅
- **Notifications**: Toast messages ✅
- **Validation**: Form validation ✅
- **Error Handling**: API errors ✅

---

## 🚀 Ready to Build?

You have a solid foundation! Now it's time to:

1. **Log in** to admin panel
2. **Create your first banner** to test the API
3. **Build the next feature** using existing patterns
4. **Deploy to Vercel** when ready

Good luck! 🎉

---

**Project**: Passeio Legal Tourism Website
**Status**: Foundation Complete, Ready for Development
**Next**: Build Admin Forms and Public Pages
**Time to Deploy**: ~2-4 weeks with dedicated work

