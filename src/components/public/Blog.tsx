import Image from 'next/image';
import Link from 'next/link';
import { Calendar } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  summary: string;
  imageUrl: string;
  imageAlt: string;
  published: boolean;
  createdAt: any;
}

interface BlogProps {
  posts: BlogPost[];
}

export default function Blog({ posts }: BlogProps) {
  const displayPosts = posts.filter(post => post.published).slice(0, 3);

  const formatDate = (date: any) => {
    if (!date) return '';
    const d = date.toDate ? date.toDate() : new Date(date);
    return d.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  return (
    <section id="blog" className="py-14 bg-gray-100">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Nosso Blog
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Dicas de viagem, destinos e muito mais
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {displayPosts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${post.slug}`}
              className="bg-gray-50 rounded-xl overflow-hidden hover:shadow-lg transition-shadow flex flex-col group"
              aria-label={`Ler artigo: ${post.title}`}
            >
              <div className="relative h-48 w-full">
                {post.imageUrl ? (
                  <Image
                    src={post.imageUrl}
                    alt={post.imageAlt || post.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    sizes="(min-width: 1024px) 30vw, (min-width: 768px) 45vw, calc(100vw - 2rem)"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-400">Sem imagem</span>
                  </div>
                )}
              </div>

              <div className="p-6 flex flex-col flex-1">
                <div className="flex items-center space-x-2 text-sm text-gray-500 mb-3">
                  <Calendar size={16} />
                  <span>{formatDate(post.createdAt)}</span>
                </div>

                <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-primary-600 transition-colors">
                  {post.title}
                </h3>
                <p className="text-gray-600 mb-4 line-clamp-3 flex-1">{post.summary}</p>

                <span className="text-primary-900 hover:text-primary-950 font-medium inline-flex items-center">
                  Ler mais
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-12">
          <Link
            href="/blog"
            className="inline-block bg-secondary-800 hover:bg-secondary-900 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
          >
            Ver Todos os Artigos
          </Link>
        </div>
      </div>
    </section>
  );
}
