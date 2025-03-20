# SafeAI Management Console

A modern, user-friendly web interface for managing the SafeAI Neo4j plugin. This GUI provides comprehensive tools for working with Agentic Knowledge Graphs, creating and managing agents, monitoring security, and configuring the SafeAI plugin.

## Features

- **Dashboard**: Get an overview of system health, security status, and recent activities.
- **Agent Browser**: Browse, search, and manage intelligent agents.
- **Agent Workshop**: Create new agents using natural language descriptions or custom scripts.
- **Security Center**: Monitor and manage security settings, run validations, and view audit logs.
- **Knowledge Graphs**: Explore and manage knowledge graphs used by the system.
- **Settings**: Configure system settings, API keys, blockchain integration, and more.

## Getting Started

### Prerequisites

- Node.js 16.x or later
- npm 8.x or later
- SafeAI Neo4j plugin running locally or remotely

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/safeai-gui.git
cd safeai-gui
```

2. Install dependencies
```bash
npm install
```

3. Configure environment settings (if needed) in a `.env` file:
```
REACT_APP_API_URL=http://localhost:7474
```

4. Start the development server
```bash
npm start
```

The application will be available at http://localhost:3000

## Building for Production

To build the application for production deployment:

```bash
npm run build
```

This will create an optimized build in the `build` folder that can be served by any static hosting service.

## Architecture

The SafeAI Management Console is built using:

- **React**: Frontend library for building user interfaces
- **Material-UI**: Component library implementing Google's Material Design
- **React Router**: For client-side routing
- **Axios**: For making API requests to the SafeAI backend
- **Recharts**: For data visualization

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- The SafeAI team for creating the Neo4j plugin
- Neo4j for providing the graph database platform
- The Material-UI team for the component library 