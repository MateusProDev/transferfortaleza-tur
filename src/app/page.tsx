import dynamicImport from "next/dynamic";
import { Metadata } from "next";
import Header from "@/components/public/Header";
import Hero from "@/components/public/Hero";
import AnimatedCounter from "@/components/public/AnimatedCounter";
import HomeConfiguredSections from "@/components/public/HomeConfiguredSections";
import { bannerService, tourService, transferService, testimonialService, googleReviewsService, homeContentService, blogService, faqService, settingsService, firebaseService } from "@/lib/firestore";
import { getSiteUrl } from "@/lib/site-url";

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
    ? homeSeo.title
    : "Passeios e Transfers em Fortaleza e Região";
  const description = typeof homeSeo?.description === "string" && homeSeo.description.trim()
    ? homeSeo.description
    : "Reserve passeios e transfers em Fortaleza com conforto e segurança. Praias, dunas, buggy e muito mais. Garanta sua vaga!";
  const keywords = Array.isArray(homeSeo?.keywords)
    ? homeSeo.keywords.filter((keyword): keyword is string => typeof keyword === "string")
    : ["passeios fortaleza", "tours fortaleza", "transfer fortaleza", "turismo ceará"];
  const canonical = typeof homeSeo?.canonical === "string" && homeSeo.canonical.trim()
    ? homeSeo.canonical
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
      blogService.getAll(false),
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
  const aboutSection = settings?.aboutSection;
  const aboutStats = aboutSection?.stats || [
    { value: 4, label: "Anos de Experiência" },
    { value: 2000, label: "Clientes Satisfeitos" },
    { value: 20, label: "Destinos" },
  ];

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

      <section id="about" className="border-t border-gray-200 bg-white py-12 sm:py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10 sm:mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              {aboutSection?.title || "Sobre a Passeio Legal"}
            </h2>
            <p className="text-gray-600 max-w-3xl mx-auto text-lg">
              {aboutSection?.description || "Há mais de 10 anos no mercado de turismo, oferecendo experiências únicas e memoráveis para nossos clientes. Nossa missão é proporcionar momentos inesquecíveis com segurança, conforto e profissionalismo."}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {aboutStats.map((stat) => (
              <div className="text-center" key={stat.label}>
                <AnimatedCounter target={stat.value} suffix="+" />
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      <Blog posts={blogPosts} />

      <Testimonials testimonials={testimonials} />

      <GoogleReviews content={googleReviews} />
      
      <FAQ faqs={faqs} title={faqContent.title || undefined} subtitle={faqContent.subtitle || undefined} />
      
      <Footer />
    </main>
  );
}
