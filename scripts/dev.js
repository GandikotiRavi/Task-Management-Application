const { spawn } = require('child_process');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

console.log('\x1b[36m%s\x1b[0m', '==================================================');
console.log('\x1b[36m%s\x1b[0m', '   Starting TaskFlow Application in Dev Mode...  ');
console.log('\x1b[36m%s\x1b[0m', '==================================================\n');

// Detect npm executable
const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const nodeCmd = process.execPath;

// Start Server
const server = spawn(nodeCmd, ['server.js'], {
  cwd: serverDir,
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: process.env.PORT || 5000 }
});

// Start Client (Vite)
const client = spawn(npmCmd, ['run', 'dev'], {
  cwd: clientDir,
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\nShutting down TaskFlow servers...');
  try { server.kill(); } catch (e) {}
  try { client.kill(); } catch (e) {}
  process.exit(0);
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);
