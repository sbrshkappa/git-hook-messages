import { ConfigLoader } from './config';
import { MessageDisplay } from './message-display';
import { GitContext } from './git-context';
import { HookContext } from './types';

export class HookHandler {
  static async handleHook(hookName: string, requireConfirmation: boolean = false): Promise<boolean> {
    // Check if we're in a git repository
    if (!GitContext.isGitRepository()) {
      console.error('❌ Not in a git repository');
      return false;
    }

    // Get git context
    const context = GitContext.getCurrentContext();
    
    // Get messages for this hook
    const messages = ConfigLoader.getHookMessages(hookName, context);
    
    if (messages.length === 0) {
      // No messages configured for this hook
      return true;
    }

    // Display messages and handle interaction
    const shouldContinue = await MessageDisplay.displayInteractiveMessages(
      messages,
      context,
      requireConfirmation
    );

    // Clean up
    MessageDisplay.close();

    return shouldContinue;
  }

  static async handlePreCommit(): Promise<boolean> {
    return this.handleHook('preCommit', false);
  }

  static async handlePrePush(): Promise<boolean> {
    return this.handleHook('prePush', true); // Require confirmation for push
  }

  static async handlePostCommit(): Promise<boolean> {
    return this.handleHook('postCommit', false);
  }

  static async handlePostMerge(): Promise<boolean> {
    return this.handleHook('postMerge', false);
  }

  static async handlePreRebase(): Promise<boolean> {
    return this.handleHook('preRebase', true); // Require confirmation for rebase
  }

  static getHookScript(hookName: string): string {
    return `#!/bin/sh
# Git Hook Messages - ${hookName}
node "${__dirname}/hook-runner.js" ${hookName}
exit $?
`;
  }
} 