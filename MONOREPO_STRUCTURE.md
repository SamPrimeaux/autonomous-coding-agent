# MeauxOS Monorepo Structure

**Last Updated**: December 19, 2025

This document describes the complete structure of the MeauxOS monorepo and what should be tracked in GitHub.

---

## 📁 Repository Structure

### Core Application Files

```
autonomous-coding-agent/
├── src/                          # TypeScript source code
│   ├── index.ts                  # Main Worker (9,243 lines)
│   ├── google-apis.ts            # Google Cloud APIs
│   └── secretary.ts              # Secretary flow
│
├── docs/                         # Frontend application
│   ├── index.html               # Main HTML entry point
│   ├── app.js                   # SPA router
│   ├── app.css                  # Global styles
│   ├── components/              # 100+ UI components
│   │   ├── dashboard.js
│   │   ├── agents.js
│   │   ├── agent-sam.js         # Sitewide AI chat
│   │   ├── terminal.js
│   │   ├── kanban.js
│   │   ├── mcp-control.js
│   │   ├── public-header.js
│   │   ├── public-footer.js
│   │   └── ... (90+ more)
│   └── sitemap.xml
│
├── config/                       # Configuration catalogs
│   ├── apps.catalog.ts          # Application registry
│   ├── d1.databases.ts          # D1 database inventory
│   ├── r2.buckets.ts            # R2 bucket mapping
│   └── do.namespaces.ts         # Durable Objects catalog
│
├── schema/                       # Database schemas
│   ├── d1-main-multitenant.sql  # Multi-tenant schema
│   └── r2-backups.sql           # R2 backup tracking
│
├── .github/                      # GitHub workflows
│   └── workflows/
│       ├── deploy.yml           # CI/CD deployment
│       └── repo-backup.yml      # Multitenant backup
│
├── wrangler.toml                 # Main worker config
├── wrangler.damnsam.toml        # Meauxbility.org worker
├── package.json                # Dependencies
├── tsconfig.json                # TypeScript config
└── README.md                    # Main documentation
```

---

## 📄 Documentation Files (Should be in Repo)

### Core Documentation
- ✅ `README.md` - Main project documentation
- ✅ `MONOREPO_STRUCTURE.md` - This file
- ✅ `ACTIVE_PROJECTS.md` - Active projects summary
- ✅ `ALL_WORKERS_LIST.md` - All 105 workers
- ✅ `ALL_R2_BUCKETS_COMPLETE.md` - All 74 R2 buckets
- ✅ `D1_DATABASES_LIST.md` - All D1 databases

### Setup & Configuration
- ✅ `ENV_COMPLETE_LATEST.md` - Environment variables
- ✅ `API_KEYS_COMPLETE.md` - API keys reference
- ✅ `SECRETS_SETUP.md` - Secrets management
- ✅ `MULTITENANT_REPO_BACKUP.md` - Backup system docs
- ✅ `CURSOR_MCP_CONFIG.md` - MCP configuration

### Deployment & Status
- ✅ `DEPLOYMENT_STATUS.md` - Deployment status
- ✅ `DAMNSAM_DEPLOYMENT_COMPLETE.md` - Damnsam worker
- ✅ `MEAUXBILITY_GITHUB_SETUP.md` - GitHub setup
- ✅ `LIVE_URLS.md` - Live URLs reference

### Feature Documentation
- ✅ `AGENT_ROUTING_AND_BUILD_STORAGE.md` - Agent routing
- ✅ `ALL_ROUTES_COMPLETE.md` - All routes
- ✅ `COMPLETE_SITE_PAGES_LIST.md` - Site pages
- ✅ `TRACKING_GUIDE.md` - Time tracking

---

## 🚫 Files NOT in Repo (Gitignored)

### Secrets & Credentials
- `secrets/` - SSH keys, certificates
- `*.pem`, `*.key`, `*.p12`, `*.crt`
- `client_secret_*.json` - OAuth secrets
- `.secrets-manifest.json`
- `.env`, `.env.local`, `.dev.vars`

### Build Artifacts
- `node_modules/`
- `.wrangler/`
- `dist/`, `build/`
- `*.tsbuildinfo`

### Temporary Files
- `*.log`
- `*.tmp`, `*.bak`
- `.DS_Store`

---

## 🔄 What Should Be Synced to GitHub

### ✅ Should Be Committed

1. **Source Code**
   - `src/*.ts` - All TypeScript source files
   - `docs/**/*.js` - All frontend components
   - `docs/**/*.html` - HTML files
   - `docs/**/*.css` - Stylesheets

2. **Configuration**
   - `wrangler.toml` - Worker configuration (sanitize secrets)
   - `wrangler.damnsam.toml` - Damnsam config
   - `package.json` - Dependencies
   - `tsconfig.json` - TypeScript config
   - `config/*.ts` - Configuration catalogs

3. **Schemas**
   - `schema/*.sql` - Database schemas

4. **CI/CD**
   - `.github/workflows/*.yml` - GitHub Actions

5. **Documentation**
   - `README.md` - Main README
   - `*.md` - All markdown documentation files

6. **Scripts**
   - `*.sh` - Deployment scripts
   - `*.js` - Utility scripts (non-sensitive)

### ❌ Should NOT Be Committed

1. **Secrets**
   - Any file with API keys, tokens, or credentials
   - OAuth client secrets
   - SSH keys

2. **Build Outputs**
   - `node_modules/`
   - `.wrangler/`
   - Compiled JavaScript

3. **Local Config**
   - `.env` files
   - `.dev.vars`
   - Local overrides

---

## 📊 Current Repository Status

### Files to Review

Based on git status, these files may need attention:

1. **New Files** (not yet committed):
   - `MULTITENANT_REPO_BACKUP.md` ✅ Should commit
   - `schema/r2-backups.sql` ✅ Should commit
   - `.github/workflows/repo-backup.yml` ✅ Should commit
   - `MEAUXBILITY_R2_HTML_URLS.md` ✅ Should commit

2. **Modified Files**:
   - `README.md` ✅ Updated - ready to commit
   - `src/index.ts` ✅ Updated with backup endpoints - ready to commit
   - `docs/components/home-public.js` ✅ Updated - ready to commit
   - `docs/components/public-header.js` ✅ Updated - ready to commit

3. **Documentation Files** (many .md files):
   - Most should be committed for reference
   - Review for sensitive information before committing

---

## 🔍 Verification Checklist

Before pushing to GitHub, verify:

- [ ] No secrets in `wrangler.toml` (move to `wrangler secret put`)
- [ ] No API keys in committed files
- [ ] `.gitignore` properly configured
- [ ] `README.md` accurately reflects current state
- [ ] All new features documented
- [ ] CI/CD workflows tested
- [ ] Database schemas up to date

---

## 🚀 Next Steps

1. **Review Changes**
   ```bash
   git status
   git diff
   ```

2. **Stage Changes**
   ```bash
   git add README.md
   git add .github/workflows/repo-backup.yml
   git add schema/r2-backups.sql
   git add MULTITENANT_REPO_BACKUP.md
   git add src/index.ts
   # ... review other files
   ```

3. **Commit**
   ```bash
   git commit -m "Update monorepo: 105 workers, multitenant backup, accurate docs"
   ```

4. **Push**
   ```bash
   git push origin main
   ```

---

**Last Updated**: December 19, 2025
