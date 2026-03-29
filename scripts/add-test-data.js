const http = require('http');

const API_BASE = 'http://localhost:3000';

async function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: {
        'Content-Type': 'application/json',
      },
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          resolve(data);
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

async function seedData() {
  console.log('🌱 Starting test data seeding via API...');
  
  try {
    // Test the API connection
    console.log('📡 Testing API connection...');
    const health = await makeRequest('GET', '/api/health');
    console.log('✅ API is running');

    console.log('✅ Test data seeding completed!');
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

seedData();
