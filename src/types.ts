export interface GitHookConfig {
  preCommit?: string[];
  prePush?: string[];
  postCommit?: string[];
  postMerge?: string[];
  preRebase?: string[];
  [key: string]: string[] | undefined;
}

export interface MessageOptions {
  interactive?: boolean;
  branchSpecific?: boolean;
  confirmBeforeBlock?: boolean;
}

export interface HookContext {
  branch: string;
  isMainBranch: boolean;
  hasStagedChanges: boolean;
  lastCommitMessage: string;
}

export interface ConfigFile {
  hooks: GitHookConfig;
  options?: MessageOptions;
  branchRules?: {
    [branchPattern: string]: GitHookConfig;
  };
} 