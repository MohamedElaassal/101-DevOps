# VM Deploy Key Setup

> Configure SSH-based GitHub access directly on your virtual machine so it can pull from a private repository without CI/CD secrets.

## Prerequisites

- SSH access to the VM instance
- Admin access to the GitHub repository (to manage Deploy Keys)

---

## Step 1 — Generate a Deploy Key on the VM

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_deploy_key -N "" -C "github-deploy-key"
```

Display the public key and copy it:

```bash
cat ~/.ssh/github_deploy_key.pub
```

---

## Step 2 — Register the Public Key on GitHub

1. Navigate to **Repository → Settings → Deploy keys**.
2. Click **Add deploy key** and fill in:
   - **Title:** `VM Deploy Key`
   - **Key:** Paste the public key
   - **Allow write access:** Enable if you need push capability
3. Click **Add key**.

---

## Step 3 — Configure SSH on the VM

```bash
# Add GitHub to known hosts (prevents interactive prompt)
ssh-keyscan github.com >> ~/.ssh/known_hosts

# Create or append SSH config for GitHub
cat >> ~/.ssh/config << 'EOF'
Host github.com
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_deploy_key
    IdentitiesOnly yes
EOF

# Set secure file permissions
chmod 600 ~/.ssh/config
chmod 600 ~/.ssh/github_deploy_key
```

---

## Step 4 — Verify the Connection

```bash
ssh -T git@github.com
```

Expected output:

```
Hi <owner>/<repo>! You've successfully authenticated, but GitHub does not provide shell access.
```

---

## When to Use This Approach

| Scenario                                   | Recommended Guide                                |
|--------------------------------------------|--------------------------------------------------|
| CI/CD pipeline needs repo access           | [deploy-key-setup.md](deploy-key-setup.md)  |
| GitHub Actions needs to SSH into the server| [ssh-key-setup.md](ssh-key-setup.md)         |
| VM needs to pull the repo directly         | **This guide**                                   |

This approach is ideal when the VM performs `git pull` independently (e.g., via a cron job or a simple deployment script) and does not rely on GitHub Actions for repository access.