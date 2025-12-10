# Secrets Setup Guide

## Required Secrets

The autonomous coding agent requires the following secrets to be configured in Cloudflare Workers:

### 1. OpenAI API Key
```bash
wrangler secret put OPENAI_API_KEY
# Then paste your OpenAI API key when prompted
```

### 2. Google API Key (Optional)
```bash
wrangler secret put GOOGLE_API_KEY
# Then paste your Google API key when prompted
```

### 3. Anthropic API Key (Optional)
```bash
wrangler secret put ANTHROPIC_API_KEY
# Then paste your Anthropic API key when prompted
```

### 4. Cloudflare API Token (Optional)
```bash
wrangler secret put CLOUDFLARE_API_TOKEN
# Then paste your Cloudflare API token when prompted
```

## Verify Secrets

After setting up secrets, you can verify them by:

1. Visiting: `https://autonomous-coding-agent.meauxbility.workers.dev/api/test-keys`
2. Or clicking "Test API Keys" in the sidebar navigation

## AI Provider Priority

The agent will try AI providers in this order:
1. **Cloudflare Workers AI** (via `env.AI` binding) - Always available if configured
2. **OpenAI** (GPT-4) - If `OPENAI_API_KEY` is set
3. **Anthropic** (Claude) - If `ANTHROPIC_API_KEY` is set

## Current Status

- ✅ OPENAI_API_KEY - Configured
- ⚠️ GOOGLE_API_KEY - Not configured (optional)
- ⚠️ ANTHROPIC_API_KEY - Not configured (optional)
- ⚠️ CLOUDFLARE_API_TOKEN - Not configured (optional)
- ✅ AI Binding - Configured (Cloudflare Workers AI)

## Notes

- The Cloudflare Workers AI binding (`env.AI`) is automatically available and doesn't require a secret
- At least one AI provider should be configured for the chat functionality to work
- The agent will gracefully fall back to the next available provider if one fails

