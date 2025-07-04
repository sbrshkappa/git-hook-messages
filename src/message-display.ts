import kleur from 'kleur';
import * as readline from 'readline';
import { HookContext } from './types';

export class MessageDisplay {
  private static rl: readline.Interface | null = null;

  static displayMessages(messages: string[], context?: HookContext, hookName?: string): void {
    if (messages.length === 0) {
      return;
    }

    // Different styling for post-commit to make it visually distinct
    if (hookName === 'postCommit') {
      console.log('\n' + kleur.bold(kleur.green('🎉 Post-Commit Reminders')));
      console.log(kleur.green('─'.repeat(50)));
    } else {
      console.log('\n' + kleur.bold(kleur.blue('🧩 Git Hook Messages')));
      console.log(kleur.gray('─'.repeat(50)));
    }

    for (const message of messages) {
      const formattedMessage = this.formatMessage(message, context);
      console.log(formattedMessage);
    }

    if (hookName === 'postCommit') {
      console.log(kleur.green('─'.repeat(50)) + '\n');
    } else {
      console.log(kleur.gray('─'.repeat(50)) + '\n');
    }
  }

  private static formatMessage(message: string, context?: HookContext): string {
    let formatted = message;

    // Replace placeholders with context values
    if (context) {
      formatted = formatted.replace(/{branch}/g, kleur.cyan(context.branch));
      formatted = formatted.replace(/{isMainBranch}/g, context.isMainBranch ? 'true' : 'false');
      formatted = formatted.replace(/{hasStagedChanges}/g, context.hasStagedChanges ? 'true' : 'false');
      formatted = formatted.replace(/{lastCommitMessage}/g, kleur.gray(context.lastCommitMessage));
    }

    // Add emoji if not present
    if (!formatted.match(/^[^\w]*[🔧✅🚨💡🔗📝]/)) {
      formatted = '💡 ' + formatted;
    }

    return formatted;
  }

  static async promptConfirmation(message: string): Promise<boolean> {
    if (!this.rl) {
      this.rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
      });
    }

    return new Promise((resolve) => {
      this.rl!.question(`${kleur.yellow('❓')} ${message} (y/N): `, (answer) => {
        const confirmed = answer.toLowerCase().startsWith('y');
        resolve(confirmed);
      });
    });
  }

  static async displayInteractiveMessages(
    messages: string[], 
    context?: HookContext,
    requireConfirmation: boolean = false,
    hookName?: string
  ): Promise<boolean> {
    if (messages.length === 0) {
      return true;
    }

    this.displayMessages(messages, context, hookName);

    if (requireConfirmation) {
      const confirmed = await this.promptConfirmation(
        'Do you want to continue with this git operation?'
      );
      
      if (!confirmed) {
        console.log(kleur.red('❌ Git operation cancelled by user.'));
        return false;
      }
    }

    return true;
  }

  static close(): void {
    if (this.rl) {
      this.rl.close();
      this.rl = null;
    }
  }
} 