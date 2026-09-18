import cron from 'node-cron';
import { spawn } from 'child_process';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('📅 Morning News Agent - Scheduler Started');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('⏰ Schedule: Every day at 7:30 AM IST');
console.log('📱 Target: +91-8219895658');
console.log('🌍 Timezone: Asia/Kolkata (IST)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Schedule: 7:30 AM IST = 2:00 AM UTC
// Using cron: 30 2 * * * (minute hour day month weekday)
const SCHEDULE = '30 2 * * *';

cron.schedule(SCHEDULE, () => {
  const now = new Date().toLocaleString('en-IN', {
    timeZone: 'Asia/Kolkata',
    dateStyle: 'full',
    timeStyle: 'short'
  });

  console.log('\n🔔 ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('⏰ Scheduled Task Triggered!');
  console.log('🕐 Time:', now);
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Run send-news.js in a child process
  const newsProcess = spawn('node', ['send-news.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, NEWS_API_KEY: undefined } // Clear any shell env vars
  });

  newsProcess.on('exit', (code) => {
    if (code === 0) {
      console.log('\n✅ News delivery completed successfully!\n');
    } else {
      console.log(`\n⚠️  News delivery exited with code ${code}\n`);
    }
  });

  newsProcess.on('error', (err) => {
    console.error('❌ Error running news delivery:', err.message);
  });

}, {
  timezone: 'Asia/Kolkata'
});

console.log('✅ Scheduler is active and waiting...');
console.log('⏰ Next run: Tomorrow at 7:30 AM IST\n');
console.log('💡 To test immediately, run: npm run news');
console.log('🛑 To stop: Press Ctrl+C\n');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

// Optional: Run once on startup for testing
const args = process.argv.slice(2);
if (args.includes('--now')) {
  console.log('🔄 Running immediately (--now flag detected)...\n');
  const newsProcess = spawn('node', ['send-news.js'], {
    cwd: __dirname,
    stdio: 'inherit',
    env: { ...process.env, NEWS_API_KEY: undefined }
  });
}

// Keep the process running
process.on('SIGINT', () => {
  console.log('\n\n🛑 Scheduler stopped by user');
  console.log('👋 Goodbye!\n');
  process.exit(0);
});
