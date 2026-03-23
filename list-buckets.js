const { Storage } = require('@google-cloud/storage');

const storage = new Storage({
  projectId: 'vv-portfolio-41712',
  keyFilename: '/Users/vishnurajvishwakarma/Downloads/vv-portfolio-41712-firebase-adminsdk-fbsvc-60cfefb92c.json'
});

async function listBuckets() {
  try {
    const [buckets] = await storage.getBuckets();
    console.log('Buckets:');
    buckets.forEach(bucket => {
      console.log(bucket.name);
    });
    if (buckets.length === 0) {
      console.log('NO BUCKETS FOUND.');
    }
  } catch (err) {
    console.error('ERROR:', err.message);
  }
}

listBuckets();
