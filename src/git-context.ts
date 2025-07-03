import { execSync } from 'child_process';
import { HookContext } from './types';

export class GitContext {
  static getCurrentContext(): HookContext {
    try {
      const branch = this.getCurrentBranch();
      const isMainBranch = this.isMainBranch(branch);
      const hasStagedChanges = this.hasStagedChanges();
      const lastCommitMessage = this.getLastCommitMessage();

      return {
        branch,
        isMainBranch,
        hasStagedChanges,
        lastCommitMessage
      };
    } catch (error) {
      // Return default context if git commands fail
      return {
        branch: 'unknown',
        isMainBranch: false,
        hasStagedChanges: false,
        lastCommitMessage: 'unknown'
      };
    }
  }

  private static getCurrentBranch(): string {
    try {
      return execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  private static isMainBranch(branch: string): boolean {
    const mainBranches = ['main', 'master', 'develop'];
    return mainBranches.includes(branch);
  }

  private static hasStagedChanges(): boolean {
    try {
      const result = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      return result.trim().length > 0;
    } catch {
      return false;
    }
  }

  private static getLastCommitMessage(): string {
    try {
      return execSync('git log -1 --pretty=%B', { encoding: 'utf8' }).trim();
    } catch {
      return 'unknown';
    }
  }

  static getStagedFiles(): string[] {
    try {
      const result = execSync('git diff --cached --name-only', { encoding: 'utf8' });
      return result.trim().split('\n').filter(file => file.length > 0);
    } catch {
      return [];
    }
  }

  static getUnstagedFiles(): string[] {
    try {
      const result = execSync('git diff --name-only', { encoding: 'utf8' });
      return result.trim().split('\n').filter(file => file.length > 0);
    } catch {
      return [];
    }
  }

  static getRemoteUrl(): string {
    try {
      return execSync('git config --get remote.origin.url', { encoding: 'utf8' }).trim();
    } catch {
      return '';
    }
  }

  static isGitRepository(): boolean {
    try {
      execSync('git rev-parse --git-dir', { stdio: 'ignore' });
      return true;
    } catch {
      return false;
    }
  }
} 