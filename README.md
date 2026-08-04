# Aegis Command Center

A modern trading dashboard application built with React, TypeScript, and Vite. Aegis Command Center provides mission logging, statistics tracking, and trading intelligence.

## Features

- 📊 **Dashboard** - Real-time command center overview
- 📝 **Mission Logging** - Deploy and track trading missions
- 📚 **Mission History** - Complete logbook of past operations
- 📈 **Statistics** - Performance analytics and metrics
- 💾 **Persistent Storage** - IndexedDB for client-side data persistence
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Dark Theme** - Aegis black and gold color scheme

## Tech Stack

- **Frontend**: React 18.2 + TypeScript
- **Build Tool**: Vite 5.1
- **Styling**: Tailwind CSS + PostCSS
- **Routing**: React Router v6
- **Storage**: IndexedDB (idb library)
- **Icons**: Lucide React
- **PWA**: Service Worker support with vite-plugin-pwa

## Development

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Burningleads/aegis-command-center.git
cd aegis-command-center

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local
```

### Local Development

```bash
# Start development server
npm run dev

# Open http://localhost:5173 in your browser
```

### Building

```bash
# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Format code
npm run format
```

## Project Structure

```
src/
├── components/        # React components
├── pages/            # Page components
├── hooks/            # Custom React hooks
├── services/         # Business logic & API services
├── lib/              # Utility functions
├── types/            # TypeScript type definitions
└── styles/           # CSS and Tailwind styles
```

## Deployment

### Vercel Deployment

This project is optimized for deployment on Vercel:

1. Push your code to GitHub
2. Import the repository in Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy

The `vercel.json` configuration handles:
- Proper build output directory (`dist`)
- Cache headers for static assets
- SPA routing rewrites
- PWA manifest headers

**Deploy to Vercel:**
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FBurningleads%2Faegis-command-center)

## Environment Variables

Create a `.env.local` file with the following variables:

```env
# API Configuration (optional)
VITE_API_URL=http://localhost:3000/api

# Feature Flags
VITE_ENABLE_TRADING=true
VITE_ENABLE_STATISTICS=true

# Application Mode
VITE_APP_ENV=development
VITE_DEBUG=false
```

See `.env.example` for all available options.

## Current Development Status

### Open Tasks

- [#2 - Rebuild Dashboard UI](https://github.com/Burningleads/aegis-command-center/issues/2) - UI/Feature
- [#3 - Mission log CRUD](https://github.com/Burningleads/aegis-command-center/issues/3) - Database/Feature
- [#4 - Backup & Restore](https://github.com/Burningleads/aegis-command-center/issues/4) - Database
- [#5 - Statistic engine](https://github.com/Burningleads/aegis-command-center/issues/5) - Feature
- [#6 - Oracle market brief](https://github.com/Burningleads/aegis-command-center/issues/6) - Oracle Agent
- [#7 - Elias trade assistant](https://github.com/Burningleads/aegis-command-center/issues/7) - Elias Agent

## Contributing

1. Create a feature branch: `git checkout -b feature/your-feature`
2. Commit changes: `git commit -m 'Add feature'`
3. Push to branch: `git push origin feature/your-feature`
4. Open a pull request

## License

This project is part of the Burningleads trading ecosystem.

## Support

For issues and questions, please create an issue on GitHub.
