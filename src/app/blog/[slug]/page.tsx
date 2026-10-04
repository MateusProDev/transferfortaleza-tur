import { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, ArrowLeft } from 'lucide-react';
import { blogService } from '@/lib/firestore';
import { notFound } from 'next/navigation';
import Header from '@/components/public/Header';
import Footer from '@/components/public/Footer';
import ShareButtons from '@/components/public/ShareButtons';
import { ArticleJsonLd, BreadcrumbJsonLd } from '@/components/seo/JsonLd';
import { getSiteUrl } from '@/lib/site-url';

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const baseUrl = getSiteUrl();
  try {
    const posts = await blogService.getAll(false);
    const post = posts.find(p => p.slug === params.slug && p.published);

    if (!post) {
      return {
        title: 'Post não encontrado',
      };
    }

    return {
      title: post.title || 'Post',
      description: post.summary || `Leia o artigo completo no blog da Passeio Legal. Dicas de turismo em Fortaleza e região.`,
      openGraph: {
        type: "article",
        locale: "pt_BR",
        url: `${baseUrl}/blog/${params.slug}`,
        title: post.title,
        description: post.summary,
        images: post.imageUrl ? [
          {
            url: post.imageUrl,
            width: 1200,
            height: 630,
            alt: post.imageAlt || post.title,
          },
        ] : [],
      },
      twitter: {
        card: "summary_large_image",
        title: post.title,
        description: post.summary,
        images: post.imageUrl ? [post.imageUrl] : [],
      },
      alternates: {
        canonical: `${baseUrl}/blog/${params.slug}`,
      },
    };
  } catch (error) {
    return {
      title: 'Post não encontrado',
    };
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  try {
    const posts = await blogService.getAll(false);
    const post = posts.find(p => p.slug === params.slug && p.published);

    if (!post) {
      notFound();
    }

    const formatDate = (date: any) => {
      if (!date) return 'Data não disponível';
      try {
        const d = date.toDate ? date.toDate() : new Date(date);
        return d.toLocaleDateString('pt-BR', {
          day: '2-digit',
          month: 'long',
          year: 'numeric'
        });
      } catch (error) {
        return 'Data não disponível';
      }
    };

    const readTime = (content: string) => {
      if (!content) return 0;
      const wordsPerMinute = 200;
      const words = content.split(/\s+/).length;
      return Math.ceil(words / wordsPerMinute);
    };

    const content = post.content || '';
    const baseUrl = getSiteUrl();

    const breadcrumbItems = [
      { name: "Início", url: baseUrl },
      { name: "Blog", url: `${baseUrl}/blog` },
      { name: post.title || 'Post', url: `${baseUrl}/blog/${params.slug}` },
    ];

    const publishedDate = post.createdAt ? 
      (post.createdAt instanceof Date ? post.createdAt.toISOString() : 
      typeof post.createdAt === 'object' && 'toDate' in post.createdAt ? (post.createdAt as any).toDate().toISOString() : 
      new Date(post.createdAt).toISOString()) : new Date().toISOString();
    const modifiedDate = post.updatedAt ? 
      (post.updatedAt instanceof Date ? post.updatedAt.toISOString() : 
      typeof post.updatedAt === 'object' && 'toDate' in post.updatedAt ? (post.updatedAt as any).toDate().toISOString() : 
      new Date(post.updatedAt).toISOString()) : publishedDate;

    return (
      <main className="min-h-screen pt-24">
        <Header />
        
        <BreadcrumbJsonLd items={breadcrumbItems} />
        
        {post.imageUrl && (
          <ArticleJsonLd
            title={post.title || 'Post'}
            description={post.summary || ''}
            image={post.imageUrl}
            url={`${baseUrl}/blog/${params.slug}`}
            publishedTime={publishedDate}
            modifiedTime={modifiedDate}
            author="Passeio Legal"
          />
        )}

        <div className="min-h-screen bg-gray-50">
          {/* Header */}
          <div className="bg-primary-600 text-white py-16">
            <div className="container mx-auto px-4">
              <Link
                href="/blog"
                className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-6 transition-colors"
              >
                <ArrowLeft size={20} />
                Voltar ao Blog
              </Link>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title || 'Título não disponível'}</h1>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-1">
                  <Calendar size={18} />
                  <span>{formatDate(post.createdAt)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={18} />
                  <span>{readTime(content)} min de leitura</span>
                </div>
              </div>
            </div>
          </div>

          <div className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              {/* Featured Image */}
              {post.imageUrl && (
                <div className="relative h-96 w-full mb-8 rounded-xl overflow-hidden">
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt || post.title || 'Imagem do post'}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}

              {/* Article Content */}
              <article className="bg-gray-50 rounded-xl shadow-lg p-8 md:p-12">
                <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed">
                  {content.split('\n\n').map((paragraph, idx) => (
                    paragraph.trim() && (
                      <p key={idx} className="mb-4">
                        {paragraph}
                      </p>
                    )
                  ))}
                </div>

                {/* Share */}
                <ShareButtons title={post.title || ''} />
              </article>

              {/* Back to Blog */}
              <div className="mt-8 text-center">
                <Link
                  href="/blog"
                  className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium"
                >
                  <ArrowLeft size={20} />
                  Voltar ao Blog
                </Link>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </main>
    );
  } catch (error) {
    console.error('Error loading blog post:', error);
    notFound();
  }
}
