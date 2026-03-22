const { spawn, exec } = require('child_process');
const path = require('path');

// Run the next dev command
const nextDev = spawn('npx', ['next', 'dev', '--hostname', '0.0.0.0'], {
  shell: true,
  stdio: 'inherit'
});

console.log('Starting Next.js dev server...');

// Wait for the server to be ready before opening the browser
// 5 seconds is usually enough for local dev startup
setTimeout(() => {
  console.log('Opening Google Chrome at http://localhost:3000...');
  
  // Windows command to open Chrome
  // Using 'start chrome' ensures it uses the Chrome executable if available
  exec('start chrome http://localhost:3000', (error) => {
    if (error) {
      console.error('Could not open Google Chrome. Trying default browser...');
      // Fallback to default browser if chrome start fails
      exec('start http://localhost:3000');
    }
  });
}, 5000);

nextDev.on('close', (code) => {
  process.exit(code);
});
