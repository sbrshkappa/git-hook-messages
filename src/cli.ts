#!/usr/bin/env node
import kleur from 'kleur';
const { Command } = require('commander');
import * as fs from 'fs';
import * as path from 'path';
import { HookHandler } from './hook-handler';
import { ConfigLoader } from './config';
import { GitContext } from './git-context';

const program = new Command();

program
  .name('git-hook-messages')
  .description('A lightweight utility to add friendly or informative messages during git operations')
  .version('1.0.0');

program
  .command('install')
  .description('Install git hooks with message support')
  .option('-f, --force', 'Force installation even if hooks already exist')
  .action(async (options: any) => {
    try {
      if (!GitContext.isGitRepository()) {
        console.error(kleur.red('❌ Not in a git repository'));
        process.exit(1);
      }

      const hooksDir = path.join('.git', 'hooks');
      const hooks = ['pre-commit', 'pre-push', 'post-commit', 'post-merge', 'pre-rebase'];

      for (const hook of hooks) {
        const hookPath = path.join(hooksDir, hook);
        
        if (fs.existsSync(hookPath) && !options.force) {
          console.log(kleur.yellow(`⚠️  Hook ${hook} already exists. Use --force to overwrite.`));
          continue;
        }

        const script = HookHandler.getHookScript(hook);
        fs.writeFileSync(hookPath, script);
        fs.chmodSync(hookPath, '755');
        
        console.log(kleur.green(`✅ Installed ${hook} hook`));
      }

      console.log(kleur.blue('\n🎉 Git hooks installed successfully!'));
      console.log(kleur.gray('Create a .git-messagesrc file to configure your messages.'));
      
    } catch (error) {
      console.error(kleur.red('❌ Failed to install hooks:'), error);
      process.exit(1);
    }
  });

program
  .command('uninstall')
  .description('Remove git hooks installed by this tool')
  .action(async () => {
    try {
      if (!GitContext.isGitRepository()) {
        console.error(kleur.red('❌ Not in a git repository'));
        process.exit(1);
      }

      const hooksDir = path.join('.git', 'hooks');
      const hooks = ['pre-commit', 'pre-push', 'post-commit', 'post-merge', 'pre-rebase'];

      for (const hook of hooks) {
        const hookPath = path.join(hooksDir, hook);
        
        if (fs.existsSync(hookPath)) {
          const content = fs.readFileSync(hookPath, 'utf8');
          if (content.includes('Git Hook Messages')) {
            fs.unlinkSync(hookPath);
            console.log(kleur.green(`✅ Removed ${hook} hook`));
          } else {
            console.log(kleur.yellow(`⚠️  ${hook} hook was not installed by this tool`));
          }
        }
      }

      console.log(kleur.blue('\n🎉 Git hooks removed successfully!'));
      
    } catch (error) {
      console.error(kleur.red('❌ Failed to remove hooks:'), error);
      process.exit(1);
    }
  });

program
  .command('test <hook>')
  .description('Test a specific hook without running the actual git operation')
  .action(async (hook: string) => {
    try {
      const success = await HookHandler.handleHook(hook, false);
      process.exit(success ? 0 : 1);
    } catch (error) {
      console.error(kleur.red('❌ Failed to test hook:'), error);
      process.exit(1);
    }
  });

program
  .command('init')
  .description('Create a sample configuration file')
  .action(async () => {
    try {
      const configPath = '.git-messagesrc.json';
      
      if (fs.existsSync(configPath)) {
        console.error(kleur.red(`❌ ${configPath} already exists`));
        process.exit(1);
      }

      const sampleConfig = {
        hooks: {
          preCommit: [
            "✅ Did you run tests?",
            "🔧 Did you lint your code?",
            "📝 Did you update the changelog?"
          ],
          prePush: [
            "🚨 You're pushing to {branch}. Make sure it's intentional.",
            "✅ Did your PR pass CI?",
            "🔗 Link PR to Jira ticket: JIRA-123"
          ],
          postCommit: [
            "🎉 Commit successful! Don't forget to push your changes."
          ]
        },
        options: {
          interactive: true,
          branchSpecific: true,
          confirmBeforeBlock: true
        },
        branchRules: {
          "main": {
            prePush: [
              "🚨 WARNING: You're pushing directly to main branch!",
              "Are you absolutely sure this is intentional?"
            ]
          },
          "feature/*": {
            preCommit: [
              "💡 Remember to keep commits focused and atomic"
            ]
          }
        }
      };

      fs.writeFileSync(configPath, JSON.stringify(sampleConfig, null, 2));
      console.log(kleur.green(`✅ Created ${configPath}`));
      console.log(kleur.blue('\n📝 Edit the file to customize your messages!'));
      
    } catch (error) {
      console.error(kleur.red('❌ Failed to create config:'), error);
      process.exit(1);
    }
  });

program
  .command('status')
  .description('Show current configuration and hook status')
  .action(async () => {
    try {
      console.log(kleur.bold(kleur.blue('🧩 Git Hook Messages Status')));
      console.log(kleur.gray('─'.repeat(50)));

      // Check if in git repository
      if (!GitContext.isGitRepository()) {
        console.log(kleur.red('❌ Not in a git repository'));
        return;
      }

      // Check config
      const config = ConfigLoader.loadConfig();
      if (config) {
        console.log(kleur.green('✅ Configuration file found'));
        console.log(kleur.gray(`   Hooks configured: ${Object.keys(config.hooks).join(', ')}`));
      } else {
        console.log(kleur.yellow('⚠️  No configuration file found'));
      }

      // Check hooks
      const hooksDir = path.join('.git', 'hooks');
      const hooks = ['pre-commit', 'pre-push', 'post-commit', 'post-merge', 'pre-rebase'];

      console.log('\n' + kleur.blue('Git Hooks:'));
      for (const hook of hooks) {
        const hookPath = path.join(hooksDir, hook);
        if (fs.existsSync(hookPath)) {
          const content = fs.readFileSync(hookPath, 'utf8');
          if (content.includes('Git Hook Messages')) {
            console.log(kleur.green(`  ✅ ${hook} - Installed by git-hook-messages`));
          } else {
            console.log(kleur.yellow(`  ⚠️  ${hook} - Custom hook`));
          }
        } else {
          console.log(kleur.gray(`  ❌ ${hook} - Not installed`));
        }
      }

      // Show git context
      const context = GitContext.getCurrentContext();
      console.log('\n' + kleur.blue('Current Git Context:'));
      console.log(kleur.gray(`  Branch: ${context.branch}`));
      console.log(kleur.gray(`  Main branch: ${context.isMainBranch}`));
      console.log(kleur.gray(`  Staged changes: ${context.hasStagedChanges}`));
      
    } catch (error) {
      console.error(kleur.red('❌ Failed to get status:'), error);
      process.exit(1);
    }
  });

program.parse(); 