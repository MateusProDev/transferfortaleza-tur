import admin from 'firebase-admin';
import { writeFileSync } from 'fs';
import path from 'path';

// Initialize Firebase Admin SDK using environment variables
const serviceAccountKey = process.env.FIREBASE_ADMIN_SDK
  ? JSON.parse(process.env.FIREBASE_ADMIN_SDK)
  : null;

if (!serviceAccountKey) {
  console.error('FIREBASE_ADMIN_SDK environment variable not found');
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey),
  projectId: serviceAccountKey.projectId || 'maiatur',
});

const db = admin.firestore();

interface PackageData {
  id: string;
  slug?: string;
  tipo?: string;
  name?: string;
  active?: boolean;
}

async function fetchAllPackages() {
  try {
    console.log('Fetching all packages from Firestore...');
    const snapshot = await db.collection('pacotes').get();
    const packages: PackageData[] = [];

    snapshot.forEach((doc) => {
      const data = doc.data();
      packages.push({
        id: doc.id,
        slug: data.slug,
        tipo: data.tipo,
        name: data.nome || data.name,
        active: data.ativo ?? data.active,
      });
    });

    console.log(`Found ${packages.length} packages`);
    return packages;
  } catch (error) {
    console.error('Error fetching packages:', error);
    throw error;
  }
}

function generateRedirects(packages: PackageData[]) {
  const redirects: Array<{ source: string; destination: string; permanent: boolean }> = [];

  packages.forEach((pkg) => {
    if (!pkg.slug) {
      console.warn(`Package ${pkg.id} (${pkg.name}) has no slug, skipping`);
      return;
    }

    // Determine if it's a tour or transfer based on tipo field
    const isTransfer = pkg.tipo === 'transfer';
    const newPath = isTransfer ? `/transfers/${pkg.slug}` : `/passeios/${pkg.slug}`;
    const oldPath = `/pacote/${pkg.slug}`;

    redirects.push({
      source: oldPath,
      destination: newPath,
      permanent: true,
    });

    console.log(`Redirect: ${oldPath} -> ${newPath} (${pkg.name})`);
  });

  return redirects;
}

function updateVercelJson(redirects: Array<{ source: string; destination: string; permanent: boolean }>) {
  const vercelJsonPath = path.join(process.cwd(), 'vercel.json');
  const fs = require('fs');

  let vercelConfig: any = {};

  // Read existing vercel.json if it exists
  if (fs.existsSync(vercelJsonPath)) {
    try {
      const content = fs.readFileSync(vercelJsonPath, 'utf8');
      vercelConfig = JSON.parse(content);
    } catch (error) {
      console.error('Error reading vercel.json:', error);
    }
  }

  // Add redirects array
  vercelConfig.redirects = redirects;

  // Write back to vercel.json
  try {
    fs.writeFileSync(vercelJsonPath, JSON.stringify(vercelConfig, null, 2));
    console.log(`\n✅ Updated vercel.json with ${redirects.length} redirects`);
  } catch (error) {
    console.error('Error writing vercel.json:', error);
    throw error;
  }
}

async function main() {
  try {
    console.log('Starting redirect generation...\n');
    const packages = await fetchAllPackages();
    const redirects = generateRedirects(packages);
    updateVercelJson(redirects);
    console.log('\n✅ Redirect generation completed successfully!');
  } catch (error) {
    console.error('Error in main:', error);
    process.exit(1);
  }
}

main();
