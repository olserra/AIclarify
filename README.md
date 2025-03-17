# AIClarify

A real-time code quality analysis tool that provides insights into your codebase's performance, security, and maintainability.

## Features

- 🔍 Real-time code analysis
- 📊 Performance metrics
- 🔒 Security checks
- 🛠️ Maintainability scoring
- 📱 Live dashboard
- 🔄 File watching
- 🎯 Multiple language support (TypeScript, JavaScript, Python)

## Installation

```bash
npm install -g aiclarify
```

## Usage

1. Navigate to your project directory:
```bash
cd your-project
```

2. Run the analysis:
```bash
aiclarify analyze
```

3. View the metrics dashboard at `http://localhost:5000`

### Options

- `-p, --port <number>`: Port to run the server on (default: 5000)
- `-w, --watch`: Watch for file changes and update analysis in real-time
- `-e, --exclude <patterns...>`: Patterns to exclude from analysis

Example with options:
```bash
aiclarify analyze -p 3000 -w -e "dist" "coverage"
```

## Metrics

AIClarify analyzes your codebase for:

### Performance
- Code complexity
- Execution time estimates
- Memory usage patterns

### Security
- Common vulnerabilities
- Best practices
- Dependency security

### Maintainability
- Code quality score
- Documentation coverage
- Test coverage

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT 