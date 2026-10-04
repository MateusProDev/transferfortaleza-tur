import { adminDb } from '../src/lib/firebase-admin';
import { isTransferPackage } from '../src/lib/firestore-content';

// Função para gerar slugs amigáveis a partir de nomes
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove acentos
    .replace(/[^a-z0-9\s-]/g, '') // Remove caracteres especiais
    .trim()
    .replace(/\s+/g, '-') // Substitui espaços por hífens
    .replace(/-+/g, '-'); // Remove hífens duplicados
}

async function updateTourSlugs() {
  if (!adminDb) {
    console.warn('Firebase Admin not initialized - skipping slug update');
    return;
  }

  console.log('Starting tour slug update...');

  try {
    const packagesRef = adminDb.collection('pacotes');
    const packagesSnapshot = await packagesRef.get();
    
    let updatedCount = 0;
    let skippedCount = 0;

    for (const doc of packagesSnapshot.docs) {
      const tourData = doc.data();
      if (isTransferPackage(tourData)) {
        skippedCount++;
        continue;
      }

      const tourName = tourData.titulo || tourData.name;
      
      if (!tourName) {
        console.log(`Skipping tour ${doc.id} - no name found`);
        skippedCount++;
        continue;
      }

      const newSlug = generateSlug(tourName);
      const existingSlug = tourData.slug;

      // Apenas atualiza se o slug for diferente ou não existir
      if (!existingSlug || existingSlug !== newSlug) {
        await packagesRef.doc(doc.id).update({
          slug: newSlug,
          updatedAt: new Date(),
        });
        console.log(`✓ Updated slug for tour: ${tourName} -> ${newSlug}`);
        updatedCount++;
      } else {
        console.log(`✓ Slug already correct for tour: ${tourName}`);
        skippedCount++;
      }
    }

    console.log('\n✅ Tour slug update completed!');
    console.log(`   Updated: ${updatedCount} tours`);
    console.log(`   Skipped: ${skippedCount} tours`);
  } catch (error) {
    console.error('Error updating tour slugs:', error);
    process.exit(1);
  }
}

// Run the update if executed directly
if (require.main === module) {
  updateTourSlugs()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { updateTourSlugs };