#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Deployment Helper');
console.log('===================\n');

// Check if vercel is installed
function checkVercel() {
  try {
    execSync('vercel --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

// Check if netlify-cli is installed
function checkNetlify() {
  try {
    execSync('netlify --version', { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

console.log('Available deployment options:');
console.log('1. Vercel (Recommended)');
console.log('2. Netlify');
console.log('3. Manual deployment guide');
console.log('4. Build for production');

const readline = require('readline');
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question('\nChoose an option (1-4): ', (answer) => {
  switch(answer.trim()) {
    case '1':
      if (checkVercel()) {
        console.log('\n📦 Deploying to Vercel...');
        try {
          execSync('vercel --prod', { stdio: 'inherit' });
        } catch (error) {
          console.log('❌ Vercel deployment failed. Please try running "vercel" manually.');
        }
      } else {
        console.log('\n📦 Installing Vercel CLI...');
        try {
          execSync('npm install -g vercel', { stdio: 'inherit' });
          console.log('\n✅ Vercel CLI installed! Run "vercel" to deploy.');
        } catch (error) {
          console.log('❌ Failed to install Vercel CLI. Please install manually: npm install -g vercel');
        }
      }
      break;
      
    case '2':
      if (checkNetlify()) {
        console.log('\n📦 Deploying to Netlify...');
        try {
          execSync('npm run build', { stdio: 'inherit' });
          execSync('netlify deploy --prod --dir=.next', { stdio: 'inherit' });
        } catch (error) {
          console.log('❌ Netlify deployment failed. Please check the logs above.');
        }
      } else {
        console.log('\n📦 Installing Netlify CLI...');
        try {
          execSync('npm install -g netlify-cli', { stdio: 'inherit' });
          console.log('\n✅ Netlify CLI installed! Run "netlify deploy" to deploy.');
        } catch (error) {
          console.log('❌ Failed to install Netlify CLI. Please install manually: npm install -g netlify-cli');
        }
      }
      break;
      
    case '3':
      console.log('\n📖 Opening deployment guide...');
      console.log('Check DEPLOYMENT.md for detailed instructions.');
      break;
      
    case '4':
      console.log('\n🔨 Building for production...');
      try {
        execSync('npm run build', { stdio: 'inherit' });
        console.log('\n✅ Build completed successfully!');
        console.log('Run "npm start" to test the production build locally.');
      } catch (error) {
        console.log('❌ Build failed. Please check the errors above.');
      }
      break;
      
    default:
      console.log('❌ Invalid option. Please choose 1-4.');
  }
  
  rl.close();
}); 