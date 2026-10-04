import { adminDb } from '../src/lib/firebase-admin';

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

async function updateTransferSlugs() {
  if (!adminDb) {
    console.warn('Firebase Admin not initialized - skipping slug update');
    return;
  }

  console.log('Starting transfer slug update...');

  try {
    const transfersRef = adminDb.collection('transfers');
    const transfersSnapshot = await transfersRef.get();
    
    let updatedCount = 0;
    let skippedCount = 0;

    for (const doc of transfersSnapshot.docs) {
      const transferData = doc.data();
      const transferName = transferData.name;
      
      if (!transferName) {
        console.log(`Skipping transfer ${doc.id} - no name found`);
        skippedCount++;
        continue;
      }

      const newSlug = generateSlug(transferName);
      const existingSlug = transferData.slug;

      // Apenas atualiza se o slug for diferente ou não existir
      if (!existingSlug || existingSlug !== newSlug) {
        await transfersRef.doc(doc.id).update({
          slug: newSlug,
          updatedAt: new Date(),
        });
        console.log(`✓ Updated slug for transfer: ${transferName} -> ${newSlug}`);
        updatedCount++;
      } else {
        console.log(`✓ Slug already correct for transfer: ${transferName}`);
        skippedCount++;
      }
    }

    console.log('\n✅ Transfer slug update completed!');
    console.log(`   Updated: ${updatedCount} transfers`);
    console.log(`   Skipped: ${skippedCount} transfers`);
  } catch (error) {
    console.error('Error updating transfer slugs:', error);
    process.exit(1);
  }
}

// Run the update if executed directly
if (require.main === module) {
  updateTransferSlugs()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}

export { updateTransferSlugs };