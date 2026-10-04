interface JsonLdProps {
  data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function OrganizationJsonLd({ name, url, logo, description, contactInfo }: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(contactInfo && {
      contactPoint: {
        '@type': 'ContactPoint',
        ...(contactInfo.email && { email: contactInfo.email }),
        ...(contactInfo.phone && { telephone: contactInfo.phone }),
        contactType: 'customer service',
      },
      ...(contactInfo.address && {
        address: {
          '@type': 'PostalAddress',
          streetAddress: contactInfo.address,
        },
      }),
    }),
  };

  return <JsonLd data={data} />;
}

export function LocalBusinessJsonLd({ name, url, logo, description, address, phone, email }: {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  address?: {
    street: string;
    number?: string;
    neighborhood?: string;
    city: string;
    state: string;
    zip: string;
  };
  phone?: string;
  email?: string;
}) {
  const streetAddress = address
    ? [
        [address.street, address.number].filter(Boolean).join(', '),
        address.neighborhood,
      ]
        .filter(Boolean)
        .join(' - ')
    : undefined;
  const data = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name,
    url,
    ...(logo && { logo }),
    ...(description && { description }),
    ...(address && {
      address: {
        '@type': 'PostalAddress',
        ...(streetAddress && { streetAddress }),
        addressLocality: address.city,
        addressRegion: address.state,
        postalCode: address.zip,
        addressCountry: 'BR',
      },
    }),
    ...(phone && { telephone: phone }),
    ...(email && { email }),
  };

  return <JsonLd data={data} />;
}

export function FAQJsonLd({ questions }: {
  questions: Array<{ question: string; answer: string }>;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: questions.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };

  return <JsonLd data={data} />;
}

export function WebSiteJsonLd({ name, url, description }: {
  name: string;
  url: string;
  description?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name,
    url,
    ...(description && { description }),
  };

  return <JsonLd data={data} />;
}

export function BreadcrumbJsonLd({ items }: {
  items: Array<{ name: string; url: string }>;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };

  return <JsonLd data={data} />;
}

export function ProductJsonLd({ name, description, image, price, currency = 'BRL', url }: {
  name: string;
  description: string;
  image: string;
  price?: number;
  currency?: string;
  url: string;
}) {
  const data: any = {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    description,
    image,
    url,
  };

  if (price && price > 0) {
    data.offers = {
      '@type': 'Offer',
      price,
      priceCurrency: currency,
      availability: 'https://schema.org/InStock',
    };
  }

  return <JsonLd data={data} />;
}

export function ArticleJsonLd({ title, description, image, url, publishedTime, modifiedTime, author }: {
  title: string;
  description: string;
  image: string;
  url: string;
  publishedTime: string;
  modifiedTime: string;
  author?: string;
}) {
  const data = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description,
    image,
    url,
    datePublished: publishedTime,
    dateModified: modifiedTime,
    ...(author && { author: { '@type': 'Person', name: author } }),
  };

  return <JsonLd data={data} />;
}
