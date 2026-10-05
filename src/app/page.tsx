import dynamicImport from "next/dynamic";
import { Metadata } from "next";
import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import HomeConfiguredSections from "@/components/public/HomeConfiguredSections";
import { bannerService, tourService, transferService, testimonialService, googleReviewsService, homeContentService, blogService, faqService, settingsService, firebaseService } from "@/lib/firestore";
import { getSiteUrl } from "@/lib/site-url";
import { replaceLegacyBrand } from "@/lib/brand";

const Tours = dynamicImport(() => import("@/components/public/Tours"), {
  loading: () => <div className="h-[420px] w-full" />,
});

const Transfers = dynamicImport(() => import("@/components/public/Transfers"), {
  loading: () => <div className="h-[420px] w-full" />,
});

const Testimonials = dynamicImport(() => import("@/components/public/Testimonials"), {
  loading: () => <div className="h-[320px] w-full" />,
});

const GoogleReviews = dynamicImport(() => import("@/components/public/GoogleReviews"));

const Blog = dynamicImport(() => import("@/components/public/Blog"), {
  loading: () => <div className="h-[360px] w-full" />,
});

const FAQ = dynamicImport(() => import("@/components/public/FAQ"), {
  loading: () => <div className="h-[280px] w-full" />,
});

const Footer = dynamicImport(() => import("@/components/public/Footer"), {
  loading: () => <div className="h-[220px] w-full" />,
});

// Cache the homepage briefly to keep content fresh without rendering it on every request.
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getSiteUrl();
  let homeSeo: Record<string, unknown> | null = null;

  try {
    homeSeo = await firebaseService.get<Record<string, unknown>>("content", "homeSeo");
  } catch (error) {
    console.error("Error fetching homepage SEO content:", error);
  }

  const title = typeof homeSeo?.title === "string" && homeSeo.title.trim()
    ? replaceLegacyBrand(homeSeo.title)
    : "Passeios e Transfers em Fortaleza e Região";
  const description = typeof homeSeo?.description === "string" && homeSeo.description.trim()
    ? replaceLegacyBrand(homeSeo.description)
    : "Reserve passeios e transfers em Fortaleza com conforto e segurança. Praias, dunas, buggy e muito mais. Garanta sua vaga!";
  const keywords = Array.isArray(homeSeo?.keywords)
    ? homeSeo.keywords
        .filter((keyword): keyword is string => typeof keyword === "string")
        .map(replaceLegacyBrand)
    : ["passeios fortaleza", "tours fortaleza", "transfer fortaleza", "turismo ceará"];
  const canonical = typeof homeSeo?.canonical === "string" && homeSeo.canonical.trim()
    ? replaceLegacyBrand(homeSeo.canonical)
    : baseUrl;
  const ogImage = typeof homeSeo?.ogImage === "string" && homeSeo.ogImage.trim()
    ? homeSeo.ogImage
    : `${baseUrl}/OG.png`;

  return {
    title,
    description,
    keywords,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: canonical,
      title,
      description,
      siteName: title,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical,
    },
  };
}

async function getPageData() {
  try {
    const [banners, featuredTours, featuredTransfers, testimonials, googleReviews, homeSections, blogPosts, faqContent, settings] = await Promise.all([
      bannerService.getAll(),
      tourService.getFeatured(),
      transferService.getFeatured(),
      testimonialService.getAll(),
      googleReviewsService.get(),
      homeContentService.getSections(),
      blogService.getAll(true),
      faqService.getHomeContent(),
      settingsService.get(),
    ]);

    return {
      banners,
      tours: featuredTours.slice(0, 5),
      transfers: featuredTransfers.slice(0, 5),
      testimonials: testimonials.filter((testimonial) => testimonial.active),
      googleReviews,
      homeSections,
      blogPosts,
      faqs: faqContent.faqs,
      faqContent,
      settings,
    };
  } catch (error) {
    console.error("Error fetching page data:", error);
    return {
      banners: [],
      tours: [],
      transfers: [],
      testimonials: [],
      googleReviews: null,
      homeSections: { services: null, differentials: null, imageCarousel: null, transferBeberibe: null },
      blogPosts: [],
      faqs: [],
      faqContent: { faqs: [], title: "", subtitle: "" },
      settings: null,
    };
  }
}

export default async function Home() {
  const { banners, tours, transfers, testimonials, googleReviews, homeSections, blogPosts, faqs, faqContent, settings } = await getPageData();
  
  const toursEnabled = settings?.sections?.toursEnabled ?? true;
  const transfersEnabled = settings?.sections?.transfersEnabled ?? true;

  return (
    <main className="min-h-screen pt-20 sm:pt-24">
      <Header />
      
      <Hero banners={banners} />

      {toursEnabled && <Tours tours={tours} whatsappNumber={settings?.whatsappConfig?.number} />}
      
      {transfersEnabled && <Transfers transfers={transfers} whatsappNumber={settings?.whatsappConfig?.number} />}

      <HomeConfiguredSections
        services={homeSections.services}
        differentials={homeSections.differentials}
        imageCarousel={homeSections.imageCarousel}
        transferBeberibe={homeSections.transferBeberibe}
        settings={settings}
      />

      <Blog posts={blogPosts} />

      <Testimonials testimonials={testimonials} />

      <GoogleReviews content={googleReviews} />
      
      <FAQ faqs={faqs} title={faqContent.title || undefined} subtitle={faqContent.subtitle || undefined} />
      
      <Footer />
    </main>
  );
}
