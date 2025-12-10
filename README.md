# Autonomous Coding Agent

AI-powered autonomous application builder using Claude API, deployed on Cloudflare Workers.

## 🚀 Live URL

**Production**: https://autonomous-coding-agent.meauxbility.workers.dev

## ✨ Features

### Autonomous Coding
- **Project Management**: Create and manage multiple coding projects
- **Feature Tracking**: Track progress through feature lists
- **Session Management**: Resume work across multiple sessions
- **Progress Persistence**: All progress saved in D1 database and R2 storage

### API Endpoints

#### Initialize Database
```bash
GET /api/init
```

#### Create New Session
```bash
POST /api/sessions
Body: {
  "project_name": "my-app",
  "app_spec": "Build a todo app...",
  "feature_list": ["Feature 1", "Feature 2"]
}
```

#### Get All Sessions
```bash
GET /api/sessions
```

#### Get Single Session
```bash
GET /api/sessions/{id}
```

#### Run Agent Session
```bash
POST /api/sessions/{id}/run
```

### Web Dashboard
- Full-featured web UI at the root URL
- Create new coding projects
- View session status and progress
- Start/continue agent sessions
- Real-time progress tracking

## 🏗️ Built Functionality

1. **D1 Database Integration**
   - `agent_sessions` table with indexes
   - Automatic schema initialization
   - Session status tracking

2. **R2 Storage Integration**
   - Feature lists stored in R2
   - Project artifacts storage
   - Scalable file storage

3. **RESTful API**
   - Full CRUD operations for sessions
   - CORS support
   - JSON responses
   - Error handling

4. **Web Dashboard**
   - Modern dark theme UI
   - Responsive design
   - Real-time session management
   - Progress visualization

5. **Cloudflare Workers**
   - Edge deployment
   - Low latency
   - Global distribution
   - Serverless architecture

## 🔧 Setup

```bash
npm install
wrangler deploy
```

## 📦 Dependencies

- Cloudflare Workers runtime
- D1 Database (meaux-work-db)
- R2 Storage (meaux-work-storage)
- AI binding (Cloudflare Workers AI)
- @anthropic-ai/sdk (for Claude API integration)

## 🔄 CI/CD

Automated deployment via GitHub Actions on push to `main` branch.

Required GitHub Secrets:
- `CLOUDFLARE_API_TOKEN`
- `CLOUDFLARE_ACCOUNT_ID`

## 🔗 Resources

- [Claude API Documentation](https://docs.claude.com)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript)

