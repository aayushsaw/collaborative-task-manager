# Collaborative Task Manager - Frontend

A React-based frontend for a collaborative task management application with real-time notifications.

## Features

- User authentication
- Task management
- Real-time notifications via WebSockets
- Responsive UI with Tailwind CSS

## Development

### Prerequisites

- Node.js
- npm or yarn

### Installation

```bash
npm install
```

### Running the Application

```bash
npm run dev
```

## TODO List

1) Inspect backend and frontend notification/socket code — done;
2) Patch backend to persist and emit notifications — done;
3) Patch frontend to join socket and listen properly — done;
4) Provide test instructions for user to run two browsers and verify real-time + persistence — todo.
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
