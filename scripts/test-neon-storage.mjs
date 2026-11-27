import { Files } from 'files-sdk';
import { neon } from 'files-sdk/neon';

const files = new Files({ adapter: neon({ bucket: 'uploads' }) });
const key = 'smoke-tests/med360-hello.txt';
const payload = 'Hello from Med360 on Neon Object Storage (uploads bucket)! Timestamp: ' + new Date().toISOString();

await files.upload(key, payload, { contentType: 'text/plain; charset=utf-8' });
console.log('UPLOADED:', key);

const listed = await files.list({ prefix: 'smoke-tests/' });
console.log('BUCKET LIST:', JSON.stringify(listed, null, 2));

const downloaded = await files.download(key);
const content = await downloaded.text();
console.log('READ BACK CONTENT:', content);
