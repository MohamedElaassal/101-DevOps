# n8n Post-Deploy Workflow

This folder contains an import-ready n8n workflow for post CI/CD automation.

## File

- `post-deploy-handler.workflow.json`
- `docker-compose.local.yml`
- `.env.example`

## Run n8n locally with Docker (persistent data)

This setup uses a named Docker volume so your workflows, credentials, and execution history are not lost when the container restarts.

1. Go to the n8n folder:

  ```bash
  cd n8n
  ```

2. Create your local environment file from template:

  ```bash
  cp .env.example .env
  ```

  On Windows PowerShell, use:

  ```powershell
  Copy-Item .env.example .env
  ```

3. Update `.env` values:

  - `N8N_BASIC_AUTH_PASSWORD`
  - `N8N_NOTIFY_WEBHOOK_URL`

4. Start n8n:

  ```bash
  docker compose -f docker-compose.local.yml up -d
  ```

5. Open n8n UI:

  - http://localhost:5678

6. Verify the named volume exists:

  ```bash
  docker volume ls
  ```

  Expected volume name: `oneohone-devops-n8n-data`

7. Stop/start without losing data:

  ```bash
  docker compose -f docker-compose.local.yml stop
  docker compose -f docker-compose.local.yml start
  ```

8. Remove container but keep data:

  ```bash
  docker compose -f docker-compose.local.yml down
  ```

9. Remove everything including data volume (destructive):

  ```bash
  docker compose -f docker-compose.local.yml down -v
  ```

## What this workflow does

- Receives GitHub Actions post-deploy event via Webhook
- Routes by `status` (`success` or `failure`)
- Sends notification to your messaging webhook

## Required n8n environment variables

Set these variables in your n8n environment before activating the workflow:

- `N8N_NOTIFY_WEBHOOK_URL`: Incoming webhook URL (Slack, Discord, Teams, etc.)

## Payload expected from GitHub Actions

Send JSON body with fields below (minimum required is `status`):

```json
{
  "status": "success",
  "repository": "owner/repo",
  "branch": "master",
  "actor": "github-user",
  "sha": "abc123...",
  "commit_message": "your commit message",
  "run_id": "123456789",
  "run_number": "42",
  "run_url": "https://github.com/owner/repo/actions/runs/123456789",
  "workflow": "Deploy to GCP",
  "timestamp": "2026-03-18T14:22:10Z",
  "environment": "production"
}
```

## Import steps

1. Open n8n.
2. Create new workflow.
3. Import from file and select `post-deploy-handler.workflow.json`.
4. Save.
5. Open the Webhook node and copy the Production URL.
6. Add your environment variables.
7. Activate workflow.

## Test URL vs Production URL

Both URLs are shown inside the Webhook node in n8n:

- Test URL:
  - Use only while manually testing in n8n editor
  - Works when you click "Execute workflow" and n8n is listening
  - Usually contains `/webhook-test/`

- Production URL:
  - Use for real CI/CD calls from GitHub Actions
  - Works only when workflow is activated
  - Usually contains `/webhook/`

For this workflow path (`github-cicd-events`), local examples are:

- Test: `http://localhost:5678/webhook-test/github-cicd-events`
- Production: `http://localhost:5678/webhook/github-cicd-events`

## How this connects to your CI/CD pipeline

The link is made by one secret in GitHub:

- `N8N_WEBHOOK_URL` = Production URL copied from your n8n Webhook node

Then `.github/workflows/build.yml` sends a POST to that URL after deploy finishes.

Important: `localhost` only works on your machine. GitHub-hosted runners cannot reach `http://localhost:5678` on your PC.

To test from GitHub Actions, use a publicly reachable n8n URL by one of these options:

1. Host n8n on a VM/server with HTTPS.
2. Use a temporary tunnel (for example, ngrok or Cloudflare Tunnel) and use that public URL in `N8N_WEBHOOK_URL`.

If you only want local testing first, use the Test URL and run curl from your own machine.

## Minimal GitHub Actions call example

```bash
payload='{"status":"success","repository":"'"${{ github.repository }}"'","branch":"'"${{ github.ref_name }}"'","actor":"'"${{ github.actor }}"'","sha":"'"${{ github.sha }}"'","commit_message":"'"${{ github.event.head_commit.message }}"'","run_id":"'"${{ github.run_id }}"'","run_number":"'"${{ github.run_number }}"'","run_url":"https://github.com/'"${{ github.repository }}"'/actions/runs/'"${{ github.run_id }}"'","workflow":"'"${{ github.workflow }}"'","timestamp":"'"$(date -u +%FT%TZ)"'","environment":"production"}'

curl -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "$payload"
```

## Where to get the only workflow variable

- `N8N_NOTIFY_WEBHOOK_URL` comes from your messaging platform incoming webhook feature:
  - Slack: App settings -> Incoming Webhooks -> Add New Webhook to Workspace
  - Discord: Server Settings -> Integrations -> Webhooks -> New Webhook
  - Teams: Channel -> Connectors/Workflows -> Incoming Webhook

If you do not want external notifications yet, you can temporarily set this to a test endpoint like webhook.site and still verify workflow execution.
