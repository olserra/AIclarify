# AIClarify

AIClarify is a powerful code analysis tool that helps developers understand and improve their codebase quality. It provides real-time analysis through a beautiful dashboard interface.

## Features

- Real-time code analysis
- Beautiful and modern dashboard interface
- Detailed metrics and insights
- Code quality suggestions
- Project-wide analysis
- Customizable analysis options

## Installation

```bash
npm install aiclarify
# or
yarn add aiclarify
# or
pnpm add aiclarify
```

## Usage

1. Add the following script to your `package.json`:

```json
{
  "scripts": {
    "analyze": "aiclarify"
  }
}
```

2. Run the analysis:

```bash
npm run analyze
# or
yarn analyze
# or
pnpm analyze
```

3. Open your browser and navigate to `http://localhost:5000` to view the analysis dashboard.

## Configuration

You can customize the analysis by creating an `aiclarify.config.js` file in your project root:

```javascript
module.exports = {
  includePatterns: ['**/*.{js,jsx,ts,tsx}'],
  excludePatterns: ['**/node_modules/**', '**/dist/**', '**/build/**'],
  maxDepth: 10,
  timeout: 30000,
};
```

## Development

To contribute to AIClarify:

1. Clone the repository
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Start the development server:
   ```bash
   pnpm dev
   ```
4. Open `http://localhost:5000` in your browser

## License

MIT 