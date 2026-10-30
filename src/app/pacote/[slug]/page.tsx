import { redirect } from 'next/navigation';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebase';

interface Props {
  params: {
    slug: string;
  };
}

export default async function PackageRedirectPage({ params }: Props) {
  const { slug } = params;

  try {
    if (!db) {
      // If Firebase is not available, redirect to home
      redirect('/');
    }

    // Try to find a tour with this slug
    const toursQuery = query(collection(db, 'tours'), where('slug', '==', slug));
    const toursSnapshot = await getDocs(toursQuery);

    if (!toursSnapshot.empty) {
      redirect(`/passeios/${slug}`);
    }

    // Try to find a transfer with this slug
    const transfersQuery = query(collection(db, 'transfers'), where('slug', '==', slug));
    const transfersSnapshot = await getDocs(transfersQuery);

    if (!transfersSnapshot.empty) {
      redirect(`/transfers/${slug}`);
    }

    // If not found, redirect to home
    redirect('/');
  } catch (error) {
    console.error('Error redirecting package:', error);
    redirect('/');
  }
}
