# Contributing to Git Hook Messages

Thank you for your interest in contributing to Git Hook Messages! This document provides guidelines and information for contributors.

## 🚀 Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/yourusername/git-hook-messages.git
   cd git-hook-messages
   ```
3. **Install dependencies**:
   ```bash
   npm install
   ```
4. **Create a feature branch**:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## 🛠️ Development

### Available Scripts

- `npm run build` - Build the TypeScript code
- `npm run dev` - Watch mode for development
- `npm test` - Run tests
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

### Project Structure

```
src/
├── types.ts          # TypeScript type definitions
├── config.ts         # Configuration loading and validation
├── message-display.ts # Message formatting and display
├── git-context.ts    # Git context gathering
├── hook-handler.ts   # Main hook orchestration
├── cli.ts           # Command-line interface
├── hook-runner.ts   # Hook execution script
└── index.ts         # Public API exports
```

## 📝 Making Changes

1. **Make your changes** in the appropriate files
2. **Add tests** for new functionality
3. **Run the test suite**:
   ```bash
   npm test
   ```
4. **Check linting**:
   ```bash
   npm run lint
   ```
5. **Format your code**:
   ```bash
   npm run format
   ```

## 🧪 Testing

### Running Tests
```bash
npm test
```

### Testing Hooks Locally
```bash
# Test specific hooks
node dist/cli.js test preCommit
node dist/cli.js test prePush

# Install hooks in a test repository
node dist/cli.js install
```

## 📋 Pull Request Guidelines

1. **Keep PRs focused** - One feature or fix per PR
2. **Write clear commit messages** - Use conventional commit format
3. **Update documentation** - If adding new features
4. **Add tests** - For new functionality
5. **Ensure CI passes** - All tests and linting must pass

### Commit Message Format
```
type(scope): description

[optional body]

[optional footer]
```

Examples:
- `feat(cli): add new command for hook status`
- `fix(config): handle missing config file gracefully`
- `docs(readme): update installation instructions`

## 🐛 Reporting Issues

When reporting issues, please include:

1. **Operating system** and **Node.js version**
2. **Steps to reproduce** the issue
3. **Expected behavior** vs **actual behavior**
4. **Error messages** (if any)
5. **Configuration file** (if relevant)

## 📦 Publishing

Releases are automated via GitHub Actions. To publish:

1. **Create a new release** on GitHub
2. **Tag it** with a semantic version (e.g., `v1.0.0`)
3. **GitHub Actions** will automatically publish to npm

## 🤝 Code of Conduct

- Be respectful and inclusive
- Help others learn and grow
- Focus on the code, not the person
- Be open to feedback and suggestions

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to Git Hook Messages! 🎉 