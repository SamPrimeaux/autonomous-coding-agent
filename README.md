# MeauxOS / Autonomous Coding Agent - Monorepo

**Multi-tenant SaaS platform** deployed on Cloudflare Workers with 105+ workers, 74 R2 buckets, 12+ D1 databases, and comprehensive AI-powered development tools.

## 🚀 Production URLs

### Main Dashboard
- **Production**: https://hybridprosaas-dashboard-production.meauxbility.workers.dev
- **Dev**: https://autonomous-coding-agent-dev.meauxbility.workers.dev
- **MeauxOS**: https://meauxos.meauxbility.workers.dev

### Public Sites
- **Meauxbility.org**: https://www.meauxbility.org (via `damnsam` worker)
- **Inner Animal Media**: https://inneranimalmedia.com (8 subdomains)
- **Inner Autodidact**: https://innerautodidact.com | https://iautodidact.app

### Account Details
- **Account ID**: `ede6590ac0d2fb7daf155b35653457b2`
- **Subdomain**: `meauxbility.workers.dev`
- **Total Workers**: **105**

---

## 📊 Platform Statistics

### Infrastructure
- **Cloudflare Workers**: 105 workers
- **R2 Buckets**: 74 buckets (12 Meauxbility, 6 Inner Animal Media, 15+ Meaux projects)
- **D1 Databases**: 12+ databases
- **KV Namespaces**: Multiple (cache, config, sessions, users)
- **Durable Objects**: 3 (CommunicationsHub, RealtimeServer, TerminalSession)

### Usage (Nov 22 - Dec 22)
- **Requests**: 393.44k
- **CPU Time**: 1,540,074 ms
- **Observability Events**: 16.05k
- **Workers Build Mins**: 29

---

## 🎯 Overview

MeauxOS is a **multi-tenant SaaS operating system** that provides:

- **AI-Powered Development**: Multiple specialized AI agents (Control, Research, Builder, Designer, Agent Sam)
- **Multi-Cloud Infrastructure**: Cloudflare Workers, AWS Bedrock, Google Cloud, GitHub
- **Project Management**: Time tracking, cost analytics, kanban boards, project lifecycle
- **Real-Time Collaboration**: WebSocket-based communication, terminal sessions
- **AutoRAG System**: Intelligent knowledge base retrieval from R2 storage
- **Comprehensive Dashboard**: 40+ routes, 100+ components, modern glassmorphic UI
- **Multitenant Repository Backup**: CI/CD workflows with automated R2 backups

---

## ✨ Key Features

### 🤖 AI Agents

- **MeauxControlPilot (Control)**: Infrastructure, deployment, strategy (Cloudflare AI)
- **MeauxResearch (Research)**: Technical analysis, multi-cloud insights (Google Gemini)
- **MeauxBuilder (Builder)**: Code generation, development (Cloudflare AI)
- **MeauxDesigner (Design)**: UI/UX design, visual concepts (Google Gemini)
- **Agent Sam**: Sitewide AI chat with model switching, CLI, file attachments, Auto RAG

### 📊 Project Management

- **Multi-tenant Workspaces**: Isolated workspaces with member management
- **Projects & Tasks**: Full project lifecycle with kanban boards
- **Time Tracking**: Start/stop timers with automatic cost calculation
- **Cost Analytics**: Real-time AI token usage, project costs, CloudConvert analytics
- **Build Storage**: Cross-device build artifact storage in R2

### 🔌 Integrations

- **Cloudflare**: Workers, D1, R2, KV, Durable Objects, Stream, Images, AI
- **AWS**: Bedrock (AI), S3 Bridge, API Gateway, Lambda Bridge
- **Google Cloud**: 8 APIs (Vision, Speech, Translate, TTS, Language, Document AI, Video, Vertex AI)
- **GitHub**: Repository management, CI/CD workflows, automated backups
- **Other**: Resend (email), CloudConvert, Meshy AI, Stripe

### 🎨 Web Dashboard

- **40+ Routes**: Dashboard, agents, dev tools, terminal, kanban, MCP control, analytics, and more
- **100+ Components**: Modular JavaScript components loaded on-demand
- **Modern UI**: Glassmorphic design, dark theme, responsive
- **Agent Sam**: Sitewide chat (orange on public, teal on dashboard)

### 💾 Storage & Database

- **D1 Databases** (12+):
  - `meauxbility-dashboard-db` - Main dashboard
  - `meaux-work-db` - Main hub (3MB)
  - `meauxstack-saas-db` - SaaS core (2.5MB)
  - `meauxos` - MeauxOS system
  - `inneranimalmedia_app_library` - Inner Animal Media
  - `meauxbility-api-db` - API database
  - And 6+ more specialized databases

- **R2 Buckets** (74 total):
  - **Meauxbility Brand** (12): `meauxbilitygithubconnect`, `meauxbility-dashboard`, `meauxbility-3d-models`, etc.
  - **Inner Animal Media** (6): `inneranimalmedia-assets`, etc.
  - **Meaux Projects** (15+): `meauxos`, `meauxlife-appkit`, `meaux-work-storage`, etc.
  - **Client Buckets** (8): `acemedical`, `evergreen-landscaping`, `grantwriting`, etc.
  - **Infrastructure** (8): `autonomous-coding-agent`, `gcloud`, `meaux-deploy-vault`, etc.

---

## 🏗️ Architecture

### Technology Stack

- **Runtime**: Cloudflare Workers (Edge Computing)
- **Language**: TypeScript
- **Database**: Cloudflare D1 (SQLite-based, 12+ databases)
- **Storage**: Cloudflare R2 (S3-compatible, 74 buckets)
- **AI**: Cloudflare Workers AI, OpenAI, Anthropic, Google Gemini, Groq
- **Frontend**: Vanilla JavaScript (ES Modules), HTML5, CSS3
- **Build Tool**: Wrangler CLI

### Project Structure

```
autonomous-coding-agent/
├── src/
│   ├── index.ts              # Main Worker entry point (9,243 lines)
│   ├── google-apis.ts        # Google Cloud APIs integration
│   └── secretary.ts          # Secretary flow processing
├── docs/                     # Frontend application
│   ├── index.html           # Main HTML file
│   ├── app.js               # Application router and core logic
│   ├── app.css              # Global styles
│   └── components/          # 100+ modular UI components
│       ├── dashboard.js     # Main dashboard
│       ├── agents.js        # AI agents dashboard
│       ├── agent-sam.js     # Sitewide AI chat
│       ├── terminal.js      # Terminal interface
│       ├── kanban.js        # Kanban boards
│       ├── mcp-control.js   # MCP control panel
│       ├── public-header.js # Public site header
│       ├── public-footer.js # Public site footer
│       └── ...              # 90+ additional components
├── config/                   # Configuration catalogs
│   ├── apps.catalog.ts      # Application registry
│   ├── d1.databases.ts      # D1 database inventory
│   ├── r2.buckets.ts        # R2 bucket mapping
│   └── do.namespaces.ts     # Durable Objects catalog
├── schema/                   # Database schemas
│   ├── d1-main-multitenant.sql  # Multi-tenant schema
│   └── r2-backups.sql       # R2 backup tracking schema
├── .github/
│   └── workflows/
│       ├── deploy.yml       # CI/CD deployment
│       └── repo-backup.yml  # Multitenant repo backup
├── wrangler.toml            # Main worker configuration
├── wrangler.damnsam.toml   # Meauxbility.org worker config
├── package.json             # Dependencies and scripts
└── tsconfig.json            # TypeScript configuration
```

### Key Components

1. **Worker Handler** (`src/index.ts`): Main request router (9,243 lines)
   - API endpoints (40+)
   - Static file serving from R2
   - WebSocket connections
   - Multi-tenant routing

2. **Frontend Router** (`docs/app.js`): Client-side routing for SPA navigation
   - 40+ routes
   - Dynamic component loading
   - Agent Sam integration

3. **Component System**: 100+ modular JavaScript components
   - Dashboard components
   - Public site components (header, footer, pages)
   - Admin tools (MCP, analytics, terminal)

4. **AutoRAG System**: Knowledge base retrieval from R2
   - Intelligent context injection
   - Multi-source knowledge base

5. **Multitenant Backup System**: CI/CD repository backups
   - GitHub Actions workflows
   - Automated R2 backups
   - Metadata tracking

---

## 🔧 Setup

### Prerequisites

- Node.js 20+ and npm
- Cloudflare account with Workers, D1, and R2 enabled
- Wrangler CLI: `npm install -g wrangler`

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SamPrimeaux/autonomous-coding-agent.git
   cd autonomous-coding-agent
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Cloudflare**
   ```bash
   wrangler login
   ```

4. **Set up environment variables** (see [Environment Variables](#environment-variables))

5. **Initialize databases** (if needed)
   ```bash
   # Database schemas are auto-initialized on first request
   # Or visit: https://your-worker.workers.dev/api/init
   ```

6. **Deploy**
   ```bash
   npm run deploy
   # Or for specific workers:
   npx wrangler deploy --name hybridprosaas-dashboard-production
   npx wrangler deploy --config wrangler.damnsam.toml  # For damnsam worker
   ```

---

## 📚 API Documentation

### Authentication & Health

- `GET /api/health` - Health check endpoint
- `GET /api/test-keys` - Test API key configuration

### AI Chat

- `POST /api/chat` - Main chat endpoint with AutoRAG
- `POST /api/agent-sam` - Agent Sam chat (sitewide, with model switching)
- `POST /api/agent-sam/rag` - Agent Sam Auto RAG
- `POST /api/autorag/query` - Direct AutoRAG queries

### Projects & Time Tracking

- `GET /api/projects` - List all projects
- `POST /api/projects` - Create new project
- `POST /api/time/start` - Start timer
- `POST /api/time/stop` - Stop timer
- `GET /api/time/entries` - Get time entries
- `DELETE /api/time/entries/{id}` - Delete time entry

### Analytics

- `GET /api/analytics/costs` - Cost breakdown
- `GET /api/analytics/tokens` - Token usage statistics
- `GET /api/analytics/cloudconvert` - CloudConvert usage

### R2 & Storage

- `GET /api/r2/buckets/{bucket}/objects` - List R2 objects
- `POST /api/r2/buckets/{bucket}/upload` - Upload to R2
- `GET /api/r2/buckets/{bucket}/object/{key}` - Get R2 object
- `DELETE /api/r2/buckets/{bucket}/object/{key}` - Delete R2 object
- `POST /api/builds` - Upload build artifact
- `GET /api/builds` - List all builds

### GitHub Backup (Multitenant)

- `POST /api/github/backup` - Store backup metadata
- `POST /api/github/backup/notify` - Backup completion notification
- `GET /api/github/backup/list` - List backups for tenant

### MCP (Model Context Protocol)

- `GET /api/mcp/d1/databases` - List D1 databases
- `GET /api/mcp/d1/tables` - List tables in database
- `GET /api/mcp/d1/schema` - Get table schema
- `POST /api/mcp/d1/query` - Execute SQL query
- `GET /api/mcp/r2/buckets` - List R2 buckets

### OAuth

- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Email

- `POST /api/mail/send` - Send email via Resend

---

## 🚀 Deployment

### Manual Deployment

```bash
# Main production worker
npm run deploy

# Specific workers
npx wrangler deploy --name hybridprosaas-dashboard-production
npx wrangler deploy --config wrangler.damnsam.toml  # Meauxbility.org
npx wrangler deploy --env dev  # Development environment
npx wrangler deploy --env meauxos  # MeauxOS environment
```

### Deploy All Workers

```bash
./deploy-all-workers.sh
```

### CI/CD

GitHub Actions workflows:

- **`.github/workflows/deploy.yml`**: Automatic deployment on push to `main`
- **`.github/workflows/repo-backup.yml`**: Multitenant repository backup to R2

**Required Secrets**:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`
- `CLOUDCONNECT` (for backup API)

### Environment-Specific Deployments

The `wrangler.toml` includes multiple environments:

- **Production**: Default deployment (`hybridprosaas-dashboard-production`)
- **Development**: `wrangler deploy --env dev` (`autonomous-coding-agent-dev`)
- **MeauxOS**: `wrangler deploy --env meauxos` (`meauxos`)
- **Damnsam**: `wrangler deploy --config wrangler.damnsam.toml` (`damnsam`)

---

## 🔐 Environment Variables

### Required Secrets

Set using `wrangler secret put <NAME>`:

- `CLOUDFLARE_API_TOKEN` - Cloudflare API token
- `CLOUDFLARE_ACCOUNT_ID` - Cloudflare account ID
- `CLOUDCONNECT` - GitHub backup API secret (default: `githubr2backup`)

### Optional Secrets

- `OPENAI_API_KEY` - OpenAI API key
- `ANTHROPIC_API_KEY` - Anthropic Claude API key
- `GOOGLE_API_KEY` - Google API key
- `GOOGLE_API_KEY_MEAUXOS` - MeauxOS Google API key
- `GOOGLE_API_KEY_HYBRIDSAAS` - HybridSaaS Google API key
- `GITHUB_TOKEN` - GitHub personal access token
- `RESEND_API_KEY` - Resend API key for email
- `AWS_ACCESS_KEY_ID` - AWS access key
- `AWS_SECRET_ACCESS_KEY` - AWS secret key

### Configuration in wrangler.toml

⚠️ **Security Warning**: Some API keys are in `wrangler.toml`. Consider moving sensitive values to `wrangler secret put`.

See `SECRETS_SETUP.md` and `ENV_COMPLETE_LATEST.md` for detailed configuration.

---

## 📦 Workers Overview

### Production Workers (Top 8 - Most Active)

1. **hybridprosaas-dashboard-production** - Main dashboard
2. **damnsam** - Meauxbility.org website
3. **meauxos** - MeauxOS features
4. **autonomous-coding-agent** - Agent system
5. **meauxaccessmvp** - MeauxAccess MVP
6. **meauxstack-os** - MeauxStack OS
7. **hybridprosaas-dashboard** - Dashboard (staging)
8. **autonomous-coding-agent-dev** - Development environment

### Total: 105 Workers

See `ALL_WORKERS_LIST.md` for complete list of all 105 workers.

---

## 🔒 Security

### Current Security Considerations

1. **Secrets Management**: Most secrets stored via `wrangler secret put`
2. **CORS**: Configured per environment (public vs dashboard)
3. **Authentication**: OAuth for dashboard, public API endpoints
4. **R2 Access**: Bucket-level permissions and public/private configurations

### Best Practices

- Use `wrangler secret put` for all sensitive values
- Implement authentication/authorization for API endpoints
- Use environment-specific configurations
- Regularly rotate API keys and tokens
- Review and audit access logs

---

## 💻 Development

### Local Development

```bash
# Start development server
npm run dev

# Build TypeScript
npm run build
```

### Project Scripts

- `npm run dev` - Start Wrangler dev server
- `npm run deploy` - Deploy to Cloudflare Workers
- `npm run build` - Compile TypeScript

### Adding New Features

1. **API Endpoints**: Add handlers in `src/index.ts` `handleAPI` function
2. **Frontend Routes**: Add routes in `docs/app.js` router
3. **Components**: Create new component files in `docs/components/`
4. **Database**: Add schema migrations in `schema/` directory

---

## 📦 Dependencies

### Production Dependencies

- `@anthropic-ai/sdk` - Anthropic Claude API client
- `fflate` - Fast compression/decompression library

### Development Dependencies

- `@cloudflare/workers-types` - TypeScript types for Cloudflare Workers
- `typescript` - TypeScript compiler
- `wrangler` - Cloudflare Workers CLI

---

## 📄 Documentation

### Key Documentation Files

- `ALL_WORKERS_LIST.md` - Complete list of 105 workers
- `ALL_R2_BUCKETS_COMPLETE.md` - All 74 R2 buckets
- `D1_DATABASES_LIST.md` - All D1 databases
- `ACTIVE_PROJECTS.md` - Active projects and deployments
- `MULTITENANT_REPO_BACKUP.md` - Repository backup system
- `ENV_COMPLETE_LATEST.md` - Complete environment variables
- `API_KEYS_COMPLETE.md` - API keys reference
- `SECRETS_SETUP.md` - Secrets management guide

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow TypeScript best practices
- Write modular, reusable components
- Document API endpoints
- Test locally before deploying
- Update README for new features

---

## 📄 License

[Add your license here]

---

## 🔗 Resources

- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Cloudflare D1 Documentation](https://developers.cloudflare.com/d1/)
- [Cloudflare R2 Documentation](https://developers.cloudflare.com/r2/)
- [Wrangler CLI Documentation](https://developers.cloudflare.com/workers/wrangler/)

---

## 📞 Support

For issues, questions, or contributions, please open an issue on the repository.

---

**Built with ❤️ using Cloudflare Workers**

**Last Updated**: December 19, 2025
