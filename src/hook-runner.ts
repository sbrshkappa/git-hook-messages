#!/usr/bin/env node

import { HookHandler } from './hook-handler';

async function main() {
  const hookName = process.argv[2];
  
  if (!hookName) {
    console.error('❌ Hook name not provided');
    process.exit(1);
  }

  try {
    let success = false;
    
    switch (hookName) {
      case 'pre-commit':
        success = await HookHandler.handlePreCommit();
        break;
      case 'pre-push':
        success = await HookHandler.handlePrePush();
        break;
      case 'post-commit':
        success = await HookHandler.handlePostCommit();
        break;
      case 'post-merge':
        success = await HookHandler.handlePostMerge();
        break;
      case 'pre-rebase':
        success = await HookHandler.handlePreRebase();
        break;
      default:
        console.error(`❌ Unknown hook: ${hookName}`);
        process.exit(1);
    }

    process.exit(success ? 0 : 1);
  } catch (error) {
    console.error(`❌ Error in ${hookName} hook:`, error);
    process.exit(1);
  }
}

main(); 