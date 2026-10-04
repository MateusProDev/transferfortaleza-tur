import { initializeTourPackages } from './initialize-tours';
import { initializeSiteContent } from './initialize-site-content';

async function initializeAll() {
  console.log('=== Starting complete initialization ===\n');

  try {
    // Initialize tour packages
    console.log('Step 1: Initializing tour packages...');
    await initializeTourPackages();
    console.log('\n');

    // Initialize site content
    console.log('Step 2: Initializing site content...');
    await initializeSiteContent();
    console.log('\n');

    console.log('=== ✅ Complete initialization finished successfully! ===');
    process.exit(0);
  } catch (error) {
    console.error('=== ❌ Initialization failed ===');
    console.error(error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  initializeAll();
}

export { initializeAll };