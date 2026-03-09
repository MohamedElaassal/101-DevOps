# SSH Key Setup for GitHub Actions

> Configure SSH authentication so GitHub Actions can securely connect to your deployment server during CI/CD workflows.

## Prerequisites

- Access to the deployment server via SSH
- Admin access to the GitHub repository (to manage Secrets)

---

## Option A: Use an Existing Key with Passphrase

If you already have an SSH key pair that requires a passphrase, add the passphrase as a GitHub repository secret:

| Secret Name   | Value                        |
|---------------|------------------------------|
| `PRIVATE_KEY` | Contents of the private key  |
| `PASSPHRASE`  | Passphrase for the key       |

---

## Option B: Generate a Dedicated Key (Recommended)

A dedicated, passphrase-less key scoped to CI/CD is the recommended approach.

### 1. Generate the Key Pair

```bash
ssh-keygen -t ed25519 -f ~/.ssh/github_actions_key -N "" -C "github-actions-deploy"
```

### 2. Authorize the Key on the Server

```bash
ssh-copy-id -i ~/.ssh/github_actions_key.pub user@your-server
```

### 3. Store the Private Key in GitHub Secrets

```bash
cat ~/.ssh/github_actions_key
```

Copy the full output and save it as the `PRIVATE_KEY` secret in:  
**Repository → Settings → Secrets and variables → Actions → New repository secret**

### 4. Clean Up Local Keys (Optional)

```bash
rm ~/.ssh/github_actions_key ~/.ssh/github_actions_key.pub
```

---

## Security Considerations

| Aspect              | With Passphrase          | Without Passphrase (Dedicated Key) |
|---------------------|--------------------------|------------------------------------|
| Automation-friendly | Requires extra secret    | Plug-and-play                      |
| Key scope           | May be shared            | Dedicated to CI/CD                 |
| Revocation          | Affects other uses       | Can be revoked independently       |

Both approaches are secure. A dedicated key without a passphrase is the industry-standard practice for automated deployments.