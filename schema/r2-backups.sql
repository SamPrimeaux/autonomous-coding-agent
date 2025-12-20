-- R2 Repository Backup Tracking Schema
-- Tracks multitenant repository backups stored in R2 buckets

-- ============================================================================
-- R2 BACKUP METADATA
-- ============================================================================

CREATE TABLE IF NOT EXISTS r2_backups (
  id TEXT PRIMARY KEY,
  tenant TEXT NOT NULL, -- Repository/tenant name
  bucket TEXT NOT NULL, -- R2 bucket name
  repo TEXT NOT NULL, -- Full repo name (owner/repo)
  branch TEXT NOT NULL, -- Git branch
  commit TEXT NOT NULL, -- Git commit SHA
  backup_file TEXT NOT NULL, -- Backup archive filename
  r2_key TEXT NOT NULL, -- Full R2 object key (e.g., backups/tenant/file.tar.gz)
  size_bytes INTEGER, -- Backup file size
  status TEXT DEFAULT 'pending', -- 'pending', 'uploading', 'completed', 'failed'
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  completed_at INTEGER,
  metadata TEXT -- JSON: additional backup info
);

CREATE INDEX IF NOT EXISTS idx_r2_backups_tenant ON r2_backups(tenant);
CREATE INDEX IF NOT EXISTS idx_r2_backups_bucket ON r2_backups(bucket);
CREATE INDEX IF NOT EXISTS idx_r2_backups_repo ON r2_backups(repo);
CREATE INDEX IF NOT EXISTS idx_r2_backups_status ON r2_backups(status);
CREATE INDEX IF NOT EXISTS idx_r2_backups_created ON r2_backups(created_at DESC);

-- ============================================================================
-- R2 BACKUP NOTIFICATIONS
-- ============================================================================

CREATE TABLE IF NOT EXISTS r2_backup_notifications (
  id TEXT PRIMARY KEY,
  backup_id TEXT REFERENCES r2_backups(id) ON DELETE CASCADE,
  tenant TEXT NOT NULL,
  bucket TEXT NOT NULL,
  repo TEXT NOT NULL,
  branch TEXT NOT NULL,
  commit TEXT NOT NULL,
  status TEXT NOT NULL, -- 'success', 'failure', 'warning'
  message TEXT,
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  metadata TEXT -- JSON: notification details
);

CREATE INDEX IF NOT EXISTS idx_r2_backup_notifications_backup ON r2_backup_notifications(backup_id);
CREATE INDEX IF NOT EXISTS idx_r2_backup_notifications_tenant ON r2_backup_notifications(tenant);
CREATE INDEX IF NOT EXISTS idx_r2_backup_notifications_status ON r2_backup_notifications(status);
CREATE INDEX IF NOT EXISTS idx_r2_backup_notifications_created ON r2_backup_notifications(created_at DESC);

-- ============================================================================
-- R2 BUCKET INVENTORY (Optional - for tracking bucket contents)
-- ============================================================================

CREATE TABLE IF NOT EXISTS r2_bucket_objects (
  id TEXT PRIMARY KEY,
  bucket TEXT NOT NULL,
  key TEXT NOT NULL, -- R2 object key
  size_bytes INTEGER,
  mime_type TEXT,
  etag TEXT,
  last_modified INTEGER, -- Unix timestamp
  metadata TEXT, -- JSON: custom metadata
  created_at INTEGER DEFAULT (strftime('%s', 'now')),
  updated_at INTEGER DEFAULT (strftime('%s', 'now')),
  UNIQUE(bucket, key)
);

CREATE INDEX IF NOT EXISTS idx_r2_bucket_objects_bucket ON r2_bucket_objects(bucket);
CREATE INDEX IF NOT EXISTS idx_r2_bucket_objects_key ON r2_bucket_objects(key);
CREATE INDEX IF NOT EXISTS idx_r2_bucket_objects_modified ON r2_bucket_objects(last_modified DESC);

-- ============================================================================
-- R2 FILES (From main multitenant schema - tracks uploaded files)
-- ============================================================================

-- This table is defined in schema/d1-main-multitenant.sql:
-- CREATE TABLE IF NOT EXISTS files (
--   id TEXT PRIMARY KEY,
--   workspace_id TEXT NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
--   project_id TEXT REFERENCES projects(id) ON DELETE CASCADE,
--   name TEXT NOT NULL,
--   r2_key TEXT NOT NULL, -- R2 object key
--   r2_bucket TEXT NOT NULL, -- R2 bucket name
--   mime_type TEXT,
--   size INTEGER,
--   uploaded_by TEXT NOT NULL REFERENCES users(id),
--   created_at INTEGER DEFAULT (strftime('%s', 'now')),
--   metadata TEXT -- JSON: dimensions, duration, etc.
-- );

-- ============================================================================
-- USEFUL QUERIES
-- ============================================================================

-- Get latest backup for a tenant
-- SELECT * FROM r2_backups 
-- WHERE tenant = 'my-repo' 
-- ORDER BY created_at DESC 
-- LIMIT 1;

-- Get all backups for a repository
-- SELECT * FROM r2_backups 
-- WHERE repo = 'owner/repo' 
-- ORDER BY created_at DESC;

-- Get backup statistics by tenant
-- SELECT 
--   tenant,
--   COUNT(*) as total_backups,
--   SUM(size_bytes) as total_size_bytes,
--   MAX(created_at) as last_backup
-- FROM r2_backups 
-- WHERE status = 'completed'
-- GROUP BY tenant;

-- Get failed backups
-- SELECT * FROM r2_backups 
-- WHERE status = 'failed' 
-- ORDER BY created_at DESC;

-- Get backup notifications for a tenant
-- SELECT * FROM r2_backup_notifications 
-- WHERE tenant = 'my-repo' 
-- ORDER BY created_at DESC;
