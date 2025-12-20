# Multitenant Repository Backup System for CI/CD

## Overview

This system provides automated repository backups to Cloudflare R2 for multiple tenants/repositories as part of CI/CD workflows. It supports:

- **Automatic backups** on push to main/master/develop branches
- **Manual backups** via workflow_dispatch
- **Multi-tenant support** with automatic bucket mapping
- **Metadata tracking** and audit trails
- **Notification system** for backup status

---

## Architecture

### Components

1. **GitHub Actions Workflow** (`.github/workflows/repo-backup.yml`)
   - Triggers on push events
   - Creates backup archives
   - Syncs files to R2
   - Sends notifications

2. **Worker API Endpoints** (`src/index.ts`)
   - `/api/github/backup` - Backup metadata storage
   - `/api/github/backup/notify` - Backup completion notifications
   - `/api/github/backup/list` - List backups for a tenant

3. **R2 Storage Structure**
   ```
   {bucket}/
   ├── backups/
   │   ├── {tenant}/
   │   │   ├── {timestamp}.tar.gz          # Backup archives
   │   │   ├── metadata/
   │   │   │   └── {timestamp}.tar.gz.json  # Backup metadata
   │   │   └── notifications/
   │   │       └── {timestamp}.json         # Status notifications
   └── repos/
       └── {tenant}/
           └── {branch}/
               └── {files}                  # Synced repository files
   ```

---

## Setup

### 1. Configure GitHub Secrets

Add these secrets to your GitHub repository:

```bash
# Required
CLOUDCONNECT=githubr2backup  # Secret for API authentication

# Optional (for direct wrangler uploads)
CLOUDFLARE_API_TOKEN=your_token
CLOUDFLARE_ACCOUNT_ID=your_account_id
```

### 2. Configure Worker Secret

Add the `CLOUDCONNECT` secret to your Cloudflare Worker:

```bash
wrangler secret put CLOUDCONNECT
# When prompted, enter: githubr2backup
```

### 3. Tenant-to-Bucket Mapping

The workflow auto-detects tenants and maps them to R2 buckets. Default mappings:

| Tenant/Repo | R2 Bucket |
|------------|-----------|
| `meauxbility` / `meauxbility.org` | `meauxbilitygithubconnect` |
| `inneranimalmedia-app-library` | `inneranimalmedia-assets` |
| `autonomous-coding-agent` | `autonomous-coding-agent` |
| *Other* | `{tenant}-github-backup` |

**Custom Mapping**: Override in workflow inputs or modify `.github/workflows/repo-backup.yml`

---

## Usage

### Automatic Backup (On Push)

The workflow automatically triggers on push to `main`, `master`, or `develop` branches:

```bash
git push origin main
# → Triggers backup automatically
```

### Manual Backup

Trigger manually via GitHub Actions UI or API:

```bash
# Via GitHub CLI
gh workflow run repo-backup.yml \
  -f tenant=my-repo \
  -f bucket=my-bucket
```

### Repository Dispatch

Trigger from another repository:

```bash
curl -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  https://api.github.com/repos/OWNER/REPO/dispatches \
  -d '{"event_type":"backup-request","client_payload":{"tenant":"my-repo"}}'
```

---

## API Endpoints

### POST `/api/github/backup`

Store backup metadata.

**Headers:**
```
Authorization: Bearer githubr2backup
Content-Type: application/json
```

**Body:**
```json
{
  "tenant": "my-repo",
  "bucket": "my-bucket",
  "repo": "owner/repo",
  "branch": "main",
  "commit": "abc123...",
  "backup_file": "my-repo-20250101-120000.tar.gz",
  "action": "upload"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Backup metadata stored",
  "metadata": { ... },
  "upload_url": "/api/r2/buckets/my-bucket/upload?key=..."
}
```

### POST `/api/github/backup/notify`

Send backup completion notification.

**Headers:**
```
Authorization: Bearer githubr2backup
Content-Type: application/json
```

**Body:**
```json
{
  "tenant": "my-repo",
  "bucket": "my-bucket",
  "repo": "owner/repo",
  "branch": "main",
  "commit": "abc123...",
  "status": "success"
}
```

### GET `/api/github/backup/list`

List backups for a tenant.

**Query Parameters:**
- `tenant` (optional) - Filter by tenant
- `bucket` (optional) - Filter by bucket (default: `autonomous-coding-agent`)

**Example:**
```
GET /api/github/backup/list?tenant=my-repo&bucket=my-bucket
```

**Response:**
```json
{
  "success": true,
  "tenant": "my-repo",
  "bucket": "my-bucket",
  "backups": [ ... ],
  "count": 5
}
```

---

## Workflow Configuration

### Customize Trigger Paths

Edit `.github/workflows/repo-backup.yml`:

```yaml
on:
  push:
    paths-ignore:
      - '**.md'           # Ignore markdown changes
      - '.gitignore'      # Ignore gitignore changes
      - 'README.md'       # Ignore README changes
```

### Customize Excluded Files

Edit the `tar` command in the workflow:

```yaml
tar --exclude='.git' \
    --exclude='node_modules' \
    --exclude='.next' \
    --exclude='dist' \
    --exclude='build' \
    --exclude='.cache' \
    -czf "$BACKUP_NAME" .
```

---

## Monitoring & Debugging

### View Backup Logs

1. **GitHub Actions**: Check workflow runs in `.github/actions`
2. **Worker Logs**: View in Cloudflare Dashboard → Workers → Logs
3. **R2 Objects**: List backups via worker API or Cloudflare Dashboard

### Check Backup Status

```bash
# List backups for a tenant
curl "https://hybridprosaas-dashboard-production.meauxbility.workers.dev/api/github/backup/list?tenant=my-repo" \
  -H "Authorization: Bearer githubr2backup"
```

### Verify Backup Files

```bash
# List R2 objects
npx wrangler r2 object list my-bucket --prefix "backups/my-repo/"
```

---

## Security

### Authentication

- **API Authentication**: Uses `CLOUDCONNECT` secret (Bearer token)
- **GitHub Secrets**: Stored securely in GitHub repository settings
- **Worker Secrets**: Stored securely in Cloudflare Workers

### Best Practices

1. **Rotate Secrets**: Change `CLOUDCONNECT` periodically
2. **Limit Access**: Only grant backup permissions to trusted workflows
3. **Audit Logs**: Review backup notifications regularly
4. **Encryption**: R2 buckets can be configured with encryption at rest

---

## Troubleshooting

### Backup Fails with "Unauthorized"

- Verify `CLOUDCONNECT` secret matches in both GitHub and Worker
- Check Authorization header format: `Bearer githubr2backup`

### Backup Fails with "Bucket Not Found"

- Verify bucket name exists in `wrangler.toml`
- Check bucket binding in worker configuration
- Ensure bucket is accessible via R2 API

### Files Not Syncing

- Check file exclusions in workflow
- Verify wrangler CLI is installed in GitHub Actions
- Review workflow logs for upload errors

---

## Example: Adding a New Tenant

1. **Add to Workflow Mapping** (`.github/workflows/repo-backup.yml`):

```yaml
case "$TENANT" in
  "my-new-repo")
    BUCKET="my-new-bucket"
    ;;
  # ... existing mappings
esac
```

2. **Add R2 Bucket Binding** (`wrangler.toml`):

```toml
[[r2_buckets]]
binding = "R2_MY_NEW_BUCKET"
bucket_name = "my-new-bucket"
```

3. **Update Worker Bucket Map** (`src/index.ts`):

```typescript
const bucketMap: Record<string, R2Bucket> = {
  // ... existing mappings
  'my-new-bucket': env.R2_MY_NEW_BUCKET!,
};
```

4. **Deploy Worker**:

```bash
npx wrangler deploy
```

---

## Cost Considerations

- **R2 Storage**: $0.015 per GB/month
- **R2 Operations**: $4.50 per million Class A (write) operations
- **Worker Requests**: Included in Workers plan
- **GitHub Actions**: Free for public repos, usage-based for private

**Estimated Costs** (per repository, monthly):
- Small repo (100MB): ~$0.0015/month storage
- Medium repo (1GB): ~$0.015/month storage
- Large repo (10GB): ~$0.15/month storage

---

## Support

For issues or questions:
1. Check workflow logs in GitHub Actions
2. Review worker logs in Cloudflare Dashboard
3. Verify R2 bucket permissions and bindings
4. Check API authentication tokens

---

**Last Updated**: December 19, 2025  
**Version**: 1.0.0
