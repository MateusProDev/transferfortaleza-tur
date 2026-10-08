import dynamicImport from "next/dynamic";
import { Metadata } from "next";
import Header from "@/components/public/Header";
import { isCopyFieldEnabled } from "@/components/public/EditableHeading";
import Hero from "@/components/public/Hero";
import HomeConfiguredSections from "@/components/public/HomeConfiguredSections";
import {
  getCachedBanners,
  getCachedBlogPosts,
  getCachedFaqContent,
  getCachedGoogleReviews,
  getCachedHomeSections,
  getCachedHomepageSeo,
  getCachedSiteSettings,
  getCachedTestimonials,
  getCachedTours,
  getCachedTransfers,
} from "@/lib/public-data-cache";
import { getSiteUrl } from "@/lib/site-url";
import { normalizeOpenGraphImage, stripBrandSuffix, withBrandSuffix } from "@/lib/open-graph";
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
    homeSeo = await getCachedHomepageSeo();
  } catch (error) {
    console.error("Error fetching homepage SEO content:", error);
  }

  const title = stripBrandSuffix(typeof homeSeo?.title === "string" && homeSeo.title.trim()
    ? replaceLegacyBrand(homeSeo.title)
    : "Passeios e Transfers em Fortaleza e Região");
  const description = typeof homeSeo?.description === "string" && homeSeo.description.trim()
    ? replaceLegacyBrand(homeSeo.description)
    : "Reserve passeios e transfers em Fortaleza com conforto e segurança. Praias, dunas, buggy e muito mais. Garanta sua vaga!";
  const keywords = Array.isArray(homeSeo?.keywords)
    ? homeSeo.keywords
        .filter((keyword): keyword is string => typeof keyword === "string")
        .map(replaceLegacyBrand)
    : ["passeios fortaleza", "tours fortaleza", "transfer fortaleza", "turismo ceará"];
  const ogImage = normalizeOpenGraphImage(homeSeo?.ogImage);
  const ogImageAlt = typeof homeSeo?.ogImageAlt === "string" && homeSeo.ogImageAlt.trim()
    ? homeSeo.ogImageAlt.trim()
    : title;

  return {
    title,
    description,
    keywords,
    openGraph: {
      type: "website",
      locale: "pt_BR",
      url: baseUrl,
      title: withBrandSuffix(title),
      description,
      siteName: "Transfer Fortaleza Tur",
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: ogImageAlt,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: withBrandSuffix(title),
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: baseUrl,
    },
  };
}

async function getPageData() {
  try {
    const [banners, tours, transfers, testimonials, googleReviews, homeSections, blogPosts, faqContent, settings] = await Promise.all([
      getCachedBanners(),
      getCachedTours(true),
      getCachedTransfers(true),
      getCachedTestimonials(),
      getCachedGoogleReviews(),
      getCachedHomeSections(),
      getCachedBlogPosts(),
      getCachedFaqContent(),
      getCachedSiteSettings(),
    ]);

    return {
      banners,
      tours: tours.filter((tour) => tour.featured).slice(0, 5),
      transfers: transfers
        .filter((transfer) => transfer.featuredOnHome)
        .sort((first, second) =>
          (first.order ?? Number.MAX_SAFE_INTEGER) - (second.order ?? Number.MAX_SAFE_INTEGER)
          || first.name.localeCompare(second.name)
        )
        .slice(0, 5),
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
  const { banners, tours, transfers, testimonials, googleReviews, homeSections, blogPosts, faqs, settings } = await getPageData();
  
  const toursEnabled = settings?.sections?.toursEnabled ?? true;
  const transfersEnabled = settings?.sections?.transfersEnabled ?? true;
  const homeCopy = settings?.pageCopy?.home;
  const testimonialsCopy = settings?.pageCopy?.testimonials;
  const faqCopy = settings?.pageCopy?.faq;

  return (
    <main className="min-h-screen pt-20 sm:pt-24">
      <Header />
      
      <Hero banners={banners} copy={homeCopy} />

      {toursEnabled && isCopyFieldEnabled(homeCopy, "toursSection") && <Tours tours={tours} whatsappNumber={settings?.whatsappConfig?.number} copy={homeCopy} />}
      
      {transfersEnabled && isCopyFieldEnabled(homeCopy, "transfersSection") && <Transfers transfers={transfers} whatsappNumber={settings?.whatsappConfig?.number} copy={homeCopy} />}

      <HomeConfiguredSections
        services={homeSections.services}
        differentials={homeSections.differentials}
        imageCarousel={homeSections.imageCarousel}
        transferBeberibe={homeSections.transferBeberibe}
        settings={settings}
        copy={homeCopy}
      />

      {isCopyFieldEnabled(homeCopy, "blogSection") && <Blog posts={blogPosts} copy={homeCopy} />}

      {isCopyFieldEnabled(testimonialsCopy, "section") && <Testimonials testimonials={testimonials} copy={testimonialsCopy} />}

      <GoogleReviews content={googleReviews} copy={homeCopy} />
      
      <FAQ
        faqs={faqs}
        title={faqCopy?.title}
        subtitle={faqCopy?.intro}
        noItemsText={faqCopy?.noItems}
        titleLevel={faqCopy?.titleHeadingLevel || "h2"}
        titleEnabled={isCopyFieldEnabled(faqCopy, "title")}
        subtitleEnabled={isCopyFieldEnabled(faqCopy, "intro")}
        sectionEnabled={isCopyFieldEnabled(homeCopy, "faqSection")}
      />
      
      <Footer />
    </main>
  );
}
