# 🧩 Git Hook Messages

A lightweight utility to add friendly or informative messages during git operations. Perfect for teams who want to enforce best practices and remind developers of important steps without being overly intrusive.

## ✨ Features

- **Non-blocking by default** - Messages are informational unless you configure them to require confirmation
- **Branch-specific rules** - Show different messages for different branches (main, feature/*, etc.)
- **Template variables** - Use `{branch}`, `{isMainBranch}`, and other placeholders in your messages
- **Multiple config formats** - Support for JSON and YAML configuration files
- **Easy installation** - Simple CLI commands to install/uninstall hooks
- **Beautiful output** - Colored, emoji-rich messages that are easy to read

## 🚀 Quick Start

### Installation

```bash
npm install git-hook-messages
```

### Setup

1. **Initialize configuration:**
   ```bash
   npx git-hook-messages init
   ```

2. **Install git hooks:**
   ```bash
   npx git-hook-messages install
   ```

3. **Customize your messages** by editing `.git-messagesrc.json`

## 📝 Configuration

Create a `.git-messagesrc.json` file in your project root:

```json
{
  "hooks": {
    "preCommit": [
      "✅ Did you run tests?",
      "🔧 Did you lint your code?",
      "📝 Did you update the changelog?"
    ],
    "prePush": [
      "🚨 You're pushing to {branch}. Make sure it's intentional.",
      "✅ Did your PR pass CI?"
    ]
  },
  "options": {
    "interactive": true,
    "branchSpecific": true,
    "confirmBeforeBlock": true
  },
  "branchRules": {
    "main": {
      "prePush": [
        "🚨 WARNING: You're pushing directly to main branch!",
        "Are you absolutely sure this is intentional?"
      ]
    }
  }
}
```

### Supported Hooks

- `preCommit` - Before committing changes
- `prePush` - Before pushing to remote
- `postCommit` - After committing changes
- `postMerge` - After merging branches
- `preRebase` - Before rebasing

### Template Variables

Use these placeholders in your messages:

- `{branch}` - Current branch name
- `{isMainBranch}` - Whether current branch is main/master
- `{hasStagedChanges}` - Whether there are staged changes
- `{lastCommitMessage}` - Last commit message

### Branch Rules

Configure different messages for specific branches:

```json
{
  "branchRules": {
    "main": {
      "prePush": ["🚨 WARNING: Pushing to main!"]
    },
    "feature/*": {
      "preCommit": ["💡 Remember to keep commits focused"]
    }
  }
}
```

## 🛠️ CLI Commands

### Install Hooks
```bash
git-hook-messages install
```

### Uninstall Hooks
```bash
git-hook-messages uninstall
```

### Test a Hook
```bash
git-hook-messages test preCommit
```

### Show Status
```bash
git-hook-messages status
```

### Initialize Config
```bash
git-hook-messages init
```

## 🎯 Use Cases

### Team Best Practices
- Remind developers to run tests before committing
- Ensure documentation is updated
- Prompt for Jira ticket links
- Warn about pushing to protected branches

### Development Workflow
- Guide new team members through proper git practices
- Enforce commit message conventions
- Remind about code review processes
- Ensure CI/CD pipeline steps are followed

### Project-Specific Reminders
- Update changelog entries
- Check for breaking changes
- Verify environment-specific configurations
- Remind about deployment procedures

## 🔧 Advanced Configuration

### YAML Configuration

You can also use YAML format (`.git-messagesrc.yaml`):

```yaml
hooks:
  preCommit:
    - "✅ Did you run tests?"
    - "🔧 Did you lint your code?"
  
  prePush:
    - "🚨 You're pushing to {branch}"

options:
  interactive: true
  branchSpecific: true

branchRules:
  main:
    prePush:
      - "🚨 WARNING: Pushing to main!"
```

### Interactive Mode

When `interactive: true` is set, users will be prompted to confirm before proceeding with git operations that have blocking messages.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Inspired by the need for better developer workflow tools
- Built with modern Node.js and TypeScript
- Uses [simple-git-hooks](https://github.com/toplenboren/simple-git-hooks) for hook management

---

**Made with ❤️ for better developer experiences** 