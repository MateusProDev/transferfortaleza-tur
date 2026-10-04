/**
 * Firebase Initialization Script
 * Run this script after deployment to initialize Firebase collections
 * 
 * Usage: 
 * - Development: npm run init-firebase
 * - Production: Call /api/init endpoint with INIT_SECRET
 */

const { execSync } = require('child_process');
const https = require('https');

async function callInitApi(url: string, secret: string): Promise<any> {
  return new Promise((resolve: (value: any) => void, reject: (reason?: any) => void) => {
    const data = JSON.stringify({ secret });

    const options = {
      hostname: new URL(url).hostname,
      port: new URL(url).port || 443,
      path: new URL(url).pathname,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': data.length,
      },
    };

    const req = https.request(options, (res: any) => {
      let body = '';
      res.on('data', (chunk: any) => body += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          if (res.statusCode === 200) {
            resolve(response);
          } else {
            reject(new Error(`API returned ${res.statusCode}: ${response.error || 'Unknown error'}`));
          }
        } catch (e: any) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    });

    req.on('error', reject);
    req.write(data);
    req.end();
  });
}

// For local development initialization
if (require.main === module) {
  const secret = process.env.INIT_SECRET || 'dev-secret';
  const url = process.env.INIT_URL || 'http://localhost:3000/api/init';

  console.log('Initializing Firebase collections...');
  console.log(`URL: ${url}`);
  
  callInitApi(url, secret)
    .then((result) => {
      console.log('✅ Firebase initialized successfully:', result.message);
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Failed to initialize Firebase:', error.message);
      process.exit(1);
    });
}

module.exports = { callInitApi };
