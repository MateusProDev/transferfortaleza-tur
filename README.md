# Transfer Fortaleza Tur - Next.js Tourism Website with Admin Panel

A complete Next.js 14+ application with admin panel, featuring tours and transfers management, built with TypeScript, Tailwind CSS, Firebase, and Cloudinary.

## 🚀 Features

### Public Website
- **Responsive Design**: Mobile-first approach with hamburger menu
- **Hero Banner Carousel**: Auto-rotating banners with smooth transitions
- **Tours/Passeios Section**: Grid of tour cards with pricing and details
- **Transfers Section**: Available transfer options with vehicle types
- **Testimonials**: Client reviews with ratings
- **Blog**: Articles with rich text content
- **FAQ Section**: Accordion-style questions and answers
- **Gallery**: Lightbox image gallery
- **Contact Form**: Integrated contact form
- **SEO Optimized**: Next.js Metadata API with Open Graph tags

### Admin Dashboard
- **Authentication**: Email/password login with Firebase Auth
- **Dashboard**: Overview of content statistics
- **Banners Management**: Create, edit, delete, and reorder banners
- **Tours Management**: Full CRUD with image gallery support
- **Transfers Management**: Vehicle and transfer management
- **Testimonials**: Client review management
- **Blog Management**: Article creation with slug generation
- **FAQ Management**: Reorderable FAQ entries
- **Settings**: Global site configuration
- **Activity Logs**: Track all admin actions

### Backend
- **Vercel Serverless**: API Routes for all operations
- **Firebase Integration**: Firestore for data, Auth for users
- **Cloudinary**: Image upload and management
- **Validation**: Zod schemas for data validation
- **Error Handling**: Comprehensive error management

## 📋 Prerequisites

- Node.js 18+ and npm
- Firebase project with Firestore and Auth enabled
- Cloudinary account
- Git

## 🔧 Installation

### 1. Clone or download the project

```bash
cd transferfortaleza-tur
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` in the project root and set the Firebase
web configuration values for the project you want to use locally. `.env.local`
is excluded from Git and Vercel CLI uploads; configure production variables
separately in the Vercel project settings.

For local Firebase Admin access, first create a new service account key and
save the JSON file as `firebase-adminsdk.json` in the project root. This file
is excluded from Git and Vercel CLI uploads. Never commit or share service
account private keys; revoke any key that has been exposed.

```bash
# Firebase Configuration
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

# Cloudinary Configuration
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Application
NEXT_PUBLIC_APP_NAME=Transfer Fortaleza Tur
NEXT_PUBLIC_APP_URL=https://transferfortalezatur.com.br
NODE_ENV=development
```

### 4. Set up Firebase

1. Go to [Firebase Console](https://console.firebase.google.com)
2. Create a new project or use existing one
3. Enable Firestore Database
4. Enable Authentication (Email/Password)
5. Copy your Firebase config to `.env.local`

### 5. Set up Cloudinary

1. Go to [Cloudinary Dashboard](https://cloudinary.com/console)
2. Copy your Cloud Name and API credentials
3. Create an unsigned upload preset for client-side uploads
4. Add to `.env.local`

### 6. Initialize Firestore Collections

Create these collections in Firestore (empty collections are fine):
- `banners`
- `pacotes`
- `avaliacoes`
- `blogPosts`
- `content`
- `settings`
- `activityLogs`

The home page reads banner fields in Portuguese (`titulo`, `subtitulo`, `imagem`,
`botaoTexto`, `botaoLink`, `ativo`, `ordem`) and maps them to the site's banner
model. Tours and transfers are read from the shared `pacotes` collection:
`categoria`/`categorias` identify the type, `destaque` controls home highlights,
and package fields such as `titulo`, `descricao`, `descricaoCurta`, `imagens`,
`imagensAlt`, `preco`, `comodidades`, `faq`, and `pacotesRecomendados` are mapped
to the existing catalog and detail pages. Transfer-specific fields such as
`veiculos`, `precoPorVeiculo`, and `locaisAtendidos` are used to identify and
display transfer packages.

Additional home content is read from `content/homeSeo`, `content/header`,
`content/footer`, `content/servicesSection`, `content/differentialsSection`,
`content/imageCarouselSection`, `content/transferBeberibe`,
`content/homeFAQ`, and `content/googleReviews`; WhatsApp configuration is read
from `settings/whatsapp`. Testimonials and blog posts are read from
`avaliacoes` and `blogPosts`.

### 7. Create admin user

1. Go to Firebase Console → Authentication
2. Create a user with email/password
3. In Firestore, add a document to `users/{uid}` with:
```json
{
  "email": "admin@example.com",
  "role": "admin",
  "displayName": "Admin Name",
  "active": true
}
```

## 🚀 Running the Application

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Production Build

```bash
npm run build
npm start
```

### Linting

```bash
npm run lint
npm run type-check
```

## 📁 Project Structure

```
src/
├── app/
│   ├── api/                    # API routes (Serverless functions)
│   │   ├── banners/
│   │   ├── tours/
│   │   ├── transfers/
│   │   ├── testimonials/
│   │   ├── blog/
│   │   ├── faq/
│   │   ├── settings/
│   │   └── cloudinary/
│   ├── admin/                  # Admin dashboard routes
│   │   ├── login/
│   │   ├── dashboard/
│   │   ├── banners/
│   │   ├── tours/
│   │   ├── transfers/
│   │   ├── testimonials/
│   │   ├── blog/
│   │   ├── faq/
│   │   └── settings/
│   ├── (public)/               # Public website routes
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── components/
│   ├── ui/                     # Reusable UI components
│   ├── admin/                  # Admin-specific components
│   └── public/                 # Public site components
├── lib/
│   ├── firebase.ts             # Firebase configuration
│   ├── firestore.ts            # Firestore utilities
│   ├── cloudinary.ts           # Cloudinary utilities
│   ├── utils.ts                # General utilities
│   └── cn.ts                   # Classname helper
├── hooks/
│   ├── useApi.ts               # API data fetching hooks
│   └── useAuth.tsx            # Authentication hooks
├── types/
│   └── index.ts                # TypeScript type definitions
├── stores/                     # Zustand state management
├── middleware.ts               # Next.js middleware for auth
└── config/                     # Configuration files
```

## 🛣️ API Routes

### Banners
- `GET /api/banners` - Get all active banners
- `POST /api/banners` - Create banner
- `PUT /api/banners/[id]` - Update banner
- `DELETE /api/banners/[id]` - Delete banner

### Tours
- `GET /api/tours?active=true` - Get tours (filtered)
- `POST /api/tours` - Create tour
- `PUT /api/tours/[id]` - Update tour
- `DELETE /api/tours/[id]` - Delete tour

### Transfers
- `GET /api/transfers?active=true` - Get transfers
- `POST /api/transfers` - Create transfer
- `PUT /api/transfers/[id]` - Update transfer
- `DELETE /api/transfers/[id]` - Delete transfer

### Cloudinary
- `POST /api/cloudinary/delete` - Delete image from Cloudinary

Similar routes exist for: `/testimonials`, `/blog`, `/faq`, `/settings`

## 🔐 Authentication

The admin panel uses Firebase Authentication with email/password. Authentication is handled through:

1. **Login Page** (`/admin/login`) - Email/password form
2. **Middleware** - Protects `/admin/*` routes
3. **Auth Context** - Manages user state globally
4. **Local Storage** - Persists auth token

## 🖼️ Image Management

### Client-Side Upload (Cloudinary Widget)
```typescript
import { CldUploadWidget } from "next-cloudinary";

<CldUploadWidget
  uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
  onSuccess={(result) => {
    console.log("Upload successful:", result);
  }}
/>
```

### Programmatic Upload
```typescript
import { uploadImageToCloudinary } from "@/lib/cloudinary";

const file = new File([blob], "image.jpg");
const result = await uploadImageToCloudinary(file, "tours");
```

### Delete Image
```typescript
import { deleteImageFromCloudinary } from "@/lib/cloudinary";

await deleteImageFromCloudinary(publicId);
```

## 📱 Responsive Design

The application is fully responsive using Tailwind CSS:
- Desktop: Full layout with sidebars
- Tablet: Adjusted layout with collapsible menu
- Mobile: Single column with hamburger menu

## 🎨 Customization

### Themes
Customize colors in `tailwind.config.ts`:
```typescript
colors: {
  primary: { /* Your colors */ },
  secondary: { /* Your colors */ },
}
```

### Branding
Update site settings in admin panel:
- Logo and favicon
- Site title and description
- Color scheme
- Contact information

## 🚢 Deployment to Vercel

1. Push your code to GitHub
2. Go to [Vercel Dashboard](https://vercel.com/dashboard)
3. Click "New Project"
4. Import your repository
5. Set environment variables
6. Deploy

```bash
# Or deploy from CLI
npm install -g vercel
vercel
```

## SEO and legacy URLs

- Tour and transfer details use the legacy `/pacote/:slug` URL. Keep existing slugs exactly as stored; do not regenerate them from names.
- The Portuguese routes `/sobre` and `/contato` are canonical. English aliases and replaced detail paths return permanent redirects to the preferred URLs.
- Blog pages are server-rendered so article links and content are present in the initial HTML response.
- Every public page template has one page-level `<h1>`; section headings use `<h2>` and nested topics/cards use `<h3>` or `<h4>` as appropriate. Multiple `<h2>` elements are expected and are not duplicate H1s.
- Blog and catalog descriptions from Firestore are sanitized before rendering. Any stored `<h1>` inside an article body is rendered as `<h2>` so it cannot compete with the page title; the stored Firestore content is not changed.
- Configure `NEXT_PUBLIC_APP_URL` with the production origin. Localhost values fall back to the brand domain so they cannot become public canonical URLs.
- `/sitemap.xml` contains the canonical static pages and active catalog/blog URLs. Submit it in Google Search Console after deployment.

## 📝 Environment Variables for Production

Remember to set all environment variables in Vercel project settings:
- `NEXT_PUBLIC_APP_URL`
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`
- `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`

## 🆘 Troubleshooting

### Firebase Connection Issues
- Verify Firebase credentials in `.env.local`
- Check that Firestore is enabled in Firebase Console
- Ensure collections are created in Firestore

### Cloudinary Upload Fails
- Verify Cloud Name and API credentials
- Check upload preset is created in Cloudinary
- Ensure CORS is properly configured

### Admin Login Not Working
- Clear browser cache and localStorage
- Verify user exists in Firebase Authentication
- Check that user document exists in Firestore `users` collection

### Images Not Loading
- Verify Cloudinary URL format
- Check image ALT text is set
- Ensure images are properly uploaded to Cloudinary

## 📚 Technologies Used

- **Framework**: Next.js 14+
- **Language**: TypeScript
- **Styling**: Tailwind CSS + Framer Motion
- **Database**: Firebase Firestore
- **Authentication**: Firebase Auth
- **Images**: Cloudinary
- **Forms**: React Hook Form + Zod
- **State**: Zustand
- **Components**: Shadcn/ui inspired
- **UI Framework**: Headless UI
- **Icons**: Lucide React, React Icons

## 📄 License

This project is open source and available under the MIT License.

## 👥 Support

For issues or questions:
1. Check the troubleshooting section
2. Review Firebase documentation
3. Check Cloudinary documentation
4. Open an issue on GitHub

## 🎯 Future Enhancements

- [ ] Google Analytics integration
- [ ] Email notifications
- [ ] Booking/Reservation system
- [ ] Payment integration (Stripe/PayPal)
- [ ] Multi-language support
- [ ] Advanced analytics dashboard
- [ ] Social media integration
- [ ] SMS notifications

---

**Made with ❤️ for tourism businesses**
