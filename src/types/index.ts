// Banner/Hero Types
export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  imageAlt: string;
  buttonText: string;
  buttonLink: string;
  order: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Tours/Passeios Types
export interface Tour {
  id: string;
  slug?: string;
  recommendedTourIds?: string[];
  order?: number;
  faqs?: TourFAQ[];
  name: string;
  description: string;
  longDescription?: string;
  mainImageUrl: string;
  mainImageAlt: string;
  galleryImages: GalleryImage[];
  price: number;
  duration: string;
  includesItems: string[];
  excludesItems: string[];
  featured: boolean;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TourFAQ {
  question: string;
  answer: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  alt: string;
  order: number;
}

// Transfers Types
export interface Transfer {
  id: string;
  slug?: string;
  recommendedTransferIds?: string[];
  featuredOnHome?: boolean;
  name: string;
  description: string;
  longDescription?: string;
  imageUrl: string;
  imageAlt: string;
  galleryImages?: GalleryImage[];
  includesItems?: string[];
  excludesItems?: string[];
  faqs?: TourFAQ[];
  price?: number;
  vehicleType: string;
  capacity: number;
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Testimonials Types
export interface Testimonial {
  id: string;
  clientName: string;
  clientPhoto: string;
  clientPhotoAlt: string;
  text: string;
  rating: number; // 1-5 stars
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// Blog/Articles Types
export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string; // Rich text/HTML
  imageUrl: string;
  imageAlt: string;
  author?: string;
  published: boolean;
  publishedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// FAQ Types
export interface FAQ {
  id: string;
  question: string;
  answer: string;
  order?: number;
  active: boolean;
  category?: string;
  createdAt: Date;
  updatedAt: Date;
}

// Gallery Types
export interface PhotoGallery {
  id: string;
  title: string;
  description?: string;
  images: GalleryImage[];
  createdAt: Date;
  updatedAt: Date;
}

// Differentials/Numbers Types
export interface Differential {
  id: string;
  icon: string; // Icon name or URL
  number: string;
  description: string;
  order: number;
  active: boolean;
}

// About Us Types
export interface AboutUs {
  id: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  mission: string;
  vision: string;
  values: string[];
  updatedAt: Date;
}

// General Settings Types
export interface SiteSettings {
  id: string;
  headerLogo: string;
  headerLogoAlt: string;
  menuLinks: MenuLink[];
  footerLogo: string;
  footerLogoAlt: string;
  socialLinks: SocialLink[];
  contactInfo: ContactInfo;
  seoSettings: SEOSettings;
  whatsappConfig: WhatsappConfig;
  primaryColor: string;
  secondaryColor: string;
  sections: SectionSettings;
  aboutSection?: AboutSectionSettings;
  updatedAt: Date;
}

export interface AboutSectionSettings {
  title: string;
  description: string;
  stats: AboutStat[];
}

export interface AboutStat {
  value: number;
  label: string;
}

export interface SectionSettings {
  toursEnabled: boolean;
  transfersEnabled: boolean;
}

export interface MenuLink {
  id: string;
  label: string;
  url: string;
  order: number;
  active: boolean;
}

export interface SocialLink {
  id: string;
  platform: "facebook" | "instagram" | "whatsapp" | "youtube" | "twitter";
  url: string;
  icon?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
  whatsapp: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  latitude?: number;
  longitude?: number;
}

export interface SEOSettings {
  siteTitle: string;
  siteDescription: string;
  keywords: string[];
  ogImage: string;
  twitterHandle?: string;
}

export interface WhatsappConfig {
  number: string;
  defaultMessage: string;
}

// User/Auth Types
export interface AdminUser {
  id: string;
  email: string;
  displayName: string;
  role: "admin" | "editor";
  active: boolean;
  createdAt: Date;
  lastLogin?: Date;
}

// Activity Log Types
export interface ActivityLog {
  id: string;
  userId: string;
  action: string;
  entityType: string;
  entityId: string;
  changes?: Record<string, unknown>;
  timestamp: Date;
}
