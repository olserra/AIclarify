# AIclarify

AIclarify is a powerful code analysis platform that provides real-time insights into your codebase's quality, maintainability, and performance. It combines the power of AI with traditional code analysis to help developers write better code.

## Features

### Web Application
- **Code Analysis Dashboard**: Visualize code quality metrics including complexity, maintainability, and test coverage
- **Usage Analytics**: Track API usage and monitor your analysis history
- **API Key Management**: Securely manage your API keys and access
- **Settings & Customization**: Configure analysis preferences and theme settings
- **Modern UI**: Beautiful, responsive interface built with Next.js and Tailwind CSS

### VSCode Extension
- **Real-time Analysis**: Get instant feedback on your code as you write
- **Language Support**: Works with JavaScript, TypeScript, and Python
- **Integrated Results**: View analysis results directly in your IDE
- **Quick Actions**: Access common analysis features through the command palette

## Getting Started

### Prerequisites
- Node.js 18.x or later
- npm or yarn
- VSCode (for the extension)

### Installation

1. Clone the repository:
```bash
git clone https://github.com/olserra/aiclarify.git
cd aiclarify
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Set up environment variables:
```bash
cp .env.example .env.local
# Edit .env.local with your configuration
```

4. Start the development server:
```bash
npm run dev
# or
yarn dev
```

### VSCode Extension

1. Open the `apps/vscode-extension` directory
2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Build the extension:
```bash
npm run compile
# or
yarn compile
```

4. Press F5 in VSCode to start debugging the extension

## Usage

### Web Application
1. Visit `http://localhost:3000`
2. Sign in or create an account
3. Navigate to the Code Analysis dashboard
4. Start analyzing your code

### VSCode Extension
1. Open any JavaScript, TypeScript, or Python file
2. Use the command palette (Ctrl+Shift+P / Cmd+Shift+P)
3. Select "Analyze Code with CursorAI"
4. View the analysis results in the side panel

## Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- GitHub Issues: [Report a bug](https://github.com/olserra/aiclarify/issues)
- Documentation: [Coming soon]
- Twitter: [@olserra](https://twitter.com/olserra)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide](https://lucide.dev/) 