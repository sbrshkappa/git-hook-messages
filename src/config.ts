import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import { ConfigFile, GitHookConfig } from './types';

export class ConfigLoader {
  private static readonly CONFIG_FILES = [
    '.git-messagesrc',
    '.git-messagesrc.json',
    '.git-messagesrc.yaml',
    '.git-messagesrc.yml'
  ];

  static loadConfig(): ConfigFile | null {
    const configPath = this.findConfigFile();
    if (!configPath) {
      return null;
    }

    try {
      const content = fs.readFileSync(configPath, 'utf8');
      const ext = path.extname(configPath);
      
      let config: ConfigFile;
      
      if (ext === '.json' || ext === '') {
        config = JSON.parse(content);
      } else if (ext === '.yaml' || ext === '.yml') {
        config = yaml.load(content) as ConfigFile;
      } else {
        throw new Error(`Unsupported config file format: ${ext}`);
      }

      return this.validateConfig(config);
    } catch (error) {
      console.error(`Error loading config from ${configPath}:`, error);
      return null;
    }
  }

  private static findConfigFile(): string | null {
    let currentDir = process.cwd();
    
    while (currentDir !== path.dirname(currentDir)) {
      for (const filename of this.CONFIG_FILES) {
        const configPath = path.join(currentDir, filename);
        if (fs.existsSync(configPath)) {
          return configPath;
        }
      }
      currentDir = path.dirname(currentDir);
    }
    
    return null;
  }

  private static validateConfig(config: any): ConfigFile {
    if (!config || typeof config !== 'object') {
      throw new Error('Invalid config: must be an object');
    }

    if (!config.hooks || typeof config.hooks !== 'object') {
      throw new Error('Invalid config: missing or invalid hooks section');
    }

    // Validate hooks structure
    for (const [hookName, messages] of Object.entries(config.hooks)) {
      if (!Array.isArray(messages)) {
        throw new Error(`Invalid config: hook "${hookName}" must be an array of strings`);
      }
      
      for (const message of messages) {
        if (typeof message !== 'string') {
          throw new Error(`Invalid config: all messages in "${hookName}" must be strings`);
        }
      }
    }

    return config as ConfigFile;
  }

  static getHookMessages(hookName: string, context?: any): string[] {
    const config = this.loadConfig();
    if (!config) {
      return [];
    }

    const messages: string[] = [];

    // Check for branch-specific rules first
    if (config.branchRules && context?.branch) {
      for (const [pattern, branchConfig] of Object.entries(config.branchRules)) {
        if (this.matchesBranchPattern(context.branch, pattern)) {
          const branchMessages = branchConfig[hookName as keyof GitHookConfig];
          if (branchMessages) {
            messages.push(...branchMessages);
          }
        }
      }
    }

    // Add general hook messages
    const generalMessages = config.hooks[hookName as keyof GitHookConfig];
    if (generalMessages) {
      messages.push(...generalMessages);
    }

    return messages;
  }

  private static matchesBranchPattern(branch: string, pattern: string): boolean {
    // Simple pattern matching - can be enhanced with regex support
    if (pattern === '*') return true;
    if (pattern === branch) return true;
    if (pattern.startsWith('*') && branch.endsWith(pattern.slice(1))) return true;
    if (pattern.endsWith('*') && branch.startsWith(pattern.slice(0, -1))) return true;
    return false;
  }
} 