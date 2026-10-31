const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: '.env.production' });

// Initialize Firebase Admin SDK
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

let db = null;
try {
  // Try to load from file first, fallback to env var
  const serviceAccountPath = path.join(__dirname, '../firebase-adminsdk.json');

  if (fs.existsSync(serviceAccountPath)) {
    const serviceAccount = require(serviceAccountPath);
    admin.initializeApp({
      credential: admin.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized from file');
  } else if (process.env.FIREBASE_ADMIN_SDK) {
    // Parse the service account JSON from env var (like firebase-admin.ts does)
    const serviceAccount = JSON.parse(process.env.FIREBASE_ADMIN_SDK);

    admin.initializeApp({
      credential: admin.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized from env var');
  } else {
    throw new Error('No Firebase Admin credentials found');
  }

  db = getFirestore();
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error.message);
  console.error('💡 Make sure firebase-adminsdk.json exists or FIREBASE_ADMIN_SDK is set in .env.production');
  process.exit(1);
}

async function generateRedirects() {
  const redirects = [];

  try {
    if (!db) {
      console.error('❌ Firebase is not configured. Please check your .env.production file.');
      process.exit(1);
    }

    console.log('🔗 Fetching data from Firebase...');

    // Fetch all packages from Firebase (both tours and transfers are in 'pacotes' collection)
    const packagesSnapshot = await db.collection('pacotes').get();
    const packages = packagesSnapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        slug: data.slug,
        tipo: data.tipo, // 'tour' or 'transfer'
        name: data.nome || data.name,
      };
    });

    const tours = packages.filter(p => p.tipo === 'tour');
    const transfers = packages.filter(p => p.tipo === 'transfer');

    console.log(`✅ Found ${tours.length} tours and ${transfers.length} transfers from ${packages.length} total packages`);

    // Generate redirects for tours from /pacote/[slug] to /passeios/[slug]
    for (const tour of tours) {
      if (tour.slug) {
        redirects.push({
          source: `/pacote/${tour.slug}`,
          destination: `/passeios/${tour.slug}`,
          statusCode: 301,
        });
      }
    }

    // Generate redirects for transfers from /pacote/[slug] to /transfers/[slug]
    for (const transfer of transfers) {
      if (transfer.slug) {
        redirects.push({
          source: `/pacote/${transfer.slug}`,
          destination: `/transfers/${transfer.slug}`,
          statusCode: 301,
        });
      }
    }

    // Also redirect by ID as fallback
    for (const tour of tours) {
      redirects.push({
        source: `/pacote/${tour.id}`,
        destination: `/passeios/${tour.slug || tour.id}`,
        statusCode: 301,
      });
    }

    for (const transfer of transfers) {
      redirects.push({
        source: `/pacote/${transfer.id}`,
        destination: `/transfers/${transfer.slug || transfer.id}`,
        statusCode: 301,
      });
    }

    console.log(`✅ Generated ${redirects.length} redirects`);
  } catch (error) {
    console.error('❌ Error generating redirects:', error);
    process.exit(1);
  }

  return redirects;
}

// Generate and write redirects.json
generateRedirects().then(redirects => {
  const redirectsPath = path.join(__dirname, '../redirects.json');
  fs.writeFileSync(redirectsPath, JSON.stringify(redirects, null, 2));
  console.log(`✅ Wrote ${redirects.length} redirects to ${redirectsPath}`);
  console.log('\n📝 Redirects generated successfully!');
  console.log('💡 Run this script again when you add new tours or transfers.');
}).catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});
