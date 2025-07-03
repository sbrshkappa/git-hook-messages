#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

// Debug output
console.log('PWD:', process.cwd());
console.log('Script DIR:', __dirname);

const packagePath = path.join(__dirname, '..', 'package.json');
console.log('Package.json path:', packagePath);
console.log('Package.json exists:', fs.existsSync(packagePath));

const package = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

// Store the original bin field
const originalBin = package.bin;
console.log('Original bin field:', JSON.stringify(originalBin, null, 2));

// Remove bin field for CI
delete package.bin;

// Write back to package.json
fs.writeFileSync(packagePath, JSON.stringify(package, null, 2) + '\n');

// Verify the change
const updatedPackage = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
console.log('Bin field after removal:', JSON.stringify(updatedPackage.bin, null, 2));

console.log('✅ Removed bin field from package.json for CI build'); 