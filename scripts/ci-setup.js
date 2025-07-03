#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const packagePath = path.join(__dirname, '..', 'package.json');
const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Store the original bin field
const originalBin = package.bin;

// Remove bin field for CI
delete package.bin;

// Write back to package.json
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n');

console.log('✅ Removed bin field from package.json for CI build');
console.log('Original bin field:', JSON.stringify(originalBin, null, 2)); 