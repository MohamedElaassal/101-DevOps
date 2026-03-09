# Deploy Key Setup Guide

> Configure a GitHub Deploy Key so your CI/CD pipeline can securely clone or pull from a private repository.

## Prerequisites

- A local machine or CI environment with `ssh-keygen` available
- Admin access to the GitHub repository

---

## Step 1 — Generate an SSH Key Pair

Run the following on your local machine:

```bash
ssh-keygen -t ed25519 -f deploy_key -N "" -C "deploy-key-for-101DevOps"
```

This produces two files:

| File             | Purpose                          |
|------------------|----------------------------------|
| `deploy_key`     | Private key (stored as a secret) |
| `deploy_key.pub` | Public key (added to GitHub)     |

---

## Step 2 — Register the Public Key on GitHub

1. Copy the public key:
   ```bash
   cat deploy_key.pub
   ```
2. Navigate to **Repository → Settings → Deploy keys**.
3. Click **Add deploy key** and fill in:
   - **Title:** `Server Deploy Key`
   - **Key:** Paste the public key content
   - **Allow write access:** Enable if the workflow needs to push changes
4. Click **Add key**.

---

## Step 3 — Store the Private Key as a GitHub Secret

1. Copy the private key:
   ```bash
   cat deploy_key
   ```
2. Navigate to **Repository → Settings → Secrets and variables → Actions**.
3. Click **New repository secret** and fill in:
   - **Name:** `DEPLOY_KEY`
   - **Secret:** Paste the entire private key (including header/footer lines)
4. Click **Add secret**.

---

## Step 4 — Clean Up Local Files

Remove the generated key pair from your local machine:

```bash
rm deploy_key deploy_key.pub
```

---

## Why Deploy Keys over Personal Access Tokens?

| Criteria            | Deploy Key | Personal Access Token |
|---------------------|------------|-----------------------|
| Scope               | Single repository | All accessible repos |
| Expiration          | None       | Configurable / expires |
| User dependency     | None       | Tied to a user account |
| Revocation          | Per-repository | Account-wide impact |
| Principle of least privilege | ✅ | ❌ |

Deploy keys follow the principle of least privilege and are the recommended approach for repository-scoped automation.