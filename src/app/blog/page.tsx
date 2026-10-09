import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import { getSiteUrl } from '@/lib/site-url';
import { getCachedBlogPosts, getCachedSiteSettings } from '@/lib/public-data-cache';
import { shouldOptimizeImage } from '@/lib/image-optimization';
import EditableHeading, { getHeadingLevel, isCopyFieldEnabled } from '@/components/public/EditableHeading';

export const revalidate = 86400;

export default async function BlogPage() {
  const [posts, settings] = await Promise.all([
    getCachedBlogPosts(),
    getCachedSiteSettings(),
  ]);
  const copy = settings?.pageCopy?.blog;
  
  const baseUrl = getSiteUrl();
  const breadcrumbItems = [
    { name: "Início", url: baseUrl },
    { name: "Blog", url: `${baseUrl}/blog` },
  ];

  const formatDate = (date: Date | null) => {
    if (!date) return '';
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  const readTime = (content: string) => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <main className="min-h-screen bg-gray-50 pt-24">
      <Header />
      
      <BreadcrumbJsonLd items={breadcrumbItems} />
      
      {/* Header */}
      <div className="bg-primary-600 text-white py-16">
        <div className="container mx-auto px-4">
          {isCopyFieldEnabled(copy, "title") && <EditableHeading level={getHeadingLevel(copy, 'title', 'h1')} className="font-display text-4xl md:text-5xl mb-4">{copy?.title || "Blog"}</EditableHeading>}
          {isCopyFieldEnabled(copy, "intro") && <p className="text-xl max-w-2xl">
            {copy?.intro || "Dicas, guias e inspirações para suas próximas aventuras"}
          </p>}
        </div>
      </div>

      {isCopyFieldEnabled(copy, "listingSection") && <div className="container mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">{copy?.noPosts || "Nenhum post publicado ainda."}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <article
                key={post.id}
                className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow flex flex-col"
              >
                <Link href={`/blog/${post.slug}`}>
                  <div className="relative h-48 w-full cursor-pointer">
                    {post.imageUrl ? (
                      <Image
                        src={post.imageUrl}
                        alt={post.imageAlt || post.title || copy?.emptyImageAlt || 'Artigo sobre turismo em Fortaleza'}
                        fill
                        className="object-cover"
                        unoptimized={!shouldOptimizeImage(post.imageUrl)}
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-r from-primary-600 to-secondary-600 flex items-center justify-center">
                        <span className="text-white text-2xl font-bold">{copy?.imagePlaceholder || "Transfer Fortaleza Tur"}</span>
                      </div>
                    )}
                  </div>
                </Link>

                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center gap-4 text-sm text-gray-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Calendar size={16} />
                      <span>{formatDate(post.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock size={16} />
                      <span>{readTime(post.content)} {copy?.readTimeSuffix || "min de leitura"}</span>
                    </div>
                  </div>

                  {isCopyFieldEnabled(copy, "blogCardTitle") && <Link href={`/blog/${post.slug}`}>
                    <EditableHeading level={getHeadingLevel(copy, "blogCardTitle", "h2")} className="font-display text-xl text-gray-900 mb-3 hover:text-primary-600 transition-colors cursor-pointer">
                      {post.title}
                    </EditableHeading>
                  </Link>}

                  {isCopyFieldEnabled(copy, "blogCardDescription") && <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.summary}</p>}

                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mt-auto"
                  >
                    {copy?.readArticlePrefix || "Ler artigo sobre"} {post.title}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>}
      
      <Footer />
    </main>
  );
}
