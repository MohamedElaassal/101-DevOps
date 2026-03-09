import mysql from "mysql2/promise";

if (!process.env.DATABASE_URL) {
  throw new Error(
    "DATABASE_URL environment variable is not set. Please configure it in your .env file or pass it when running with Docker.",
  );
}

export const db = mysql.createPool(process.env.DATABASE_URL);

export async function initDB() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS checkpoints (
        id INT AUTO_INCREMENT PRIMARY KEY,
        step INT NOT NULL UNIQUE,
        title VARCHAR(255) NOT NULL,
        phase VARCHAR(100) NOT NULL DEFAULT 'Foundation',
        done BOOLEAN DEFAULT false,
        memo TEXT,
        finished_at TIMESTAMP NULL
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS wisdom (
        id INT AUTO_INCREMENT PRIMARY KEY,
        message TEXT NOT NULL,
        author VARCHAR(255),
        category VARCHAR(100),
        stars INT DEFAULT 0
      )
    `);

    await db.query(`
      CREATE TABLE IF NOT EXISTS toolkit (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        domain VARCHAR(100) NOT NULL,
        rating INT DEFAULT 0
      )
    `);

    await seedData();
    console.log("Database initialized successfully");
  } catch (error) {
    console.error("Database initialization failed:", error);
    throw error;
  }
}

async function seedData() {
  const [cpRows] = await db.query("SELECT COUNT(*) AS cnt FROM checkpoints");
  if ((cpRows as any)[0].cnt === 0) {
    const steps = [
      { step: 1, title: "Linux Basics & Shell Navigation", phase: "Foundation" },
      { step: 2, title: "Version Control with Git", phase: "Foundation" },
      { step: 3, title: "Networking Fundamentals", phase: "Foundation" },
      { step: 4, title: "Install & Configure Docker", phase: "Foundation" },
      { step: 5, title: "Build Your First Container Image", phase: "Foundation" },
      { step: 6, title: "Docker Compose Multi-Service Apps", phase: "Foundation" },
      { step: 7, title: "Shell Scripting for Automation", phase: "Foundation" },
      { step: 8, title: "Environment Variables & Secrets", phase: "Foundation" },
      { step: 9, title: "Package Managers & Dependencies", phase: "Foundation" },
      { step: 10, title: "Introduction to Cloud Providers", phase: "Foundation" },
      { step: 11, title: "CI Pipeline with GitHub Actions", phase: "Scaling" },
      { step: 12, title: "Automated Testing in Pipelines", phase: "Scaling" },
      { step: 13, title: "Artifact Management & Registries", phase: "Scaling" },
      { step: 14, title: "Infrastructure as Code with Terraform", phase: "Scaling" },
      { step: 15, title: "Configuration Management Basics", phase: "Scaling" },
      { step: 16, title: "Container Orchestration Concepts", phase: "Scaling" },
      { step: 17, title: "Kubernetes Pods & Deployments", phase: "Scaling" },
      { step: 18, title: "Services, Ingress & Load Balancing", phase: "Scaling" },
      { step: 19, title: "Helm Charts & Templating", phase: "Scaling" },
      { step: 20, title: "Database Migrations in Pipelines", phase: "Scaling" },
      { step: 21, title: "Monitoring with Prometheus & Grafana", phase: "Production" },
      { step: 22, title: "Centralized Logging with ELK/Loki", phase: "Production" },
      { step: 23, title: "Alerting & Incident Response", phase: "Production" },
      { step: 24, title: "Security Scanning in CI/CD", phase: "Production" },
      { step: 25, title: "Blue-Green & Canary Deployments", phase: "Production" },
      { step: 26, title: "GitOps with ArgoCD", phase: "Production" },
      { step: 27, title: "Chaos Engineering Principles", phase: "Production" },
      { step: 28, title: "Performance Testing & Optimization", phase: "Production" },
      { step: 29, title: "Cost Optimization in the Cloud", phase: "Production" },
      { step: 30, title: "Building a Production-Grade Pipeline", phase: "Production" },
    ];
    for (const s of steps) {
      await db.query(
        "INSERT INTO checkpoints (step, title, phase) VALUES (?, ?, ?)",
        [s.step, s.title, s.phase],
      );
    }
  }

  const [wRows] = await db.query("SELECT COUNT(*) AS cnt FROM wisdom");
  if ((wRows as any)[0].cnt === 0) {
    const entries = [
      { message: "Infrastructure as code is the foundation of reproducible environments", author: "HashiCorp Docs", category: "IaC" },
      { message: "Measure everything, alert only on what matters to avoid fatigue", author: "Rob Ewaschuk", category: "Monitoring" },
      { message: "Chaos engineering reveals weaknesses before they become outages", author: "Netflix Engineering", category: "Resilience" },
      { message: "Immutable deployments eliminate configuration drift entirely", author: "Martin Fowler", category: "Architecture" },
      { message: "Feature flags let you decouple deployment from release safely", author: "LaunchDarkly", category: "Delivery" },
      { message: "GitOps makes the desired system state declarative and auditable", author: "Weaveworks", category: "GitOps" },
      { message: "Shift-left testing catches defects when they are cheapest to fix", author: "Testing Principle", category: "Quality" },
      { message: "Blameless postmortems build trust and continuously improve systems", author: "Google SRE Book", category: "Culture" },
    ];
    for (const e of entries) {
      await db.query(
        "INSERT INTO wisdom (message, author, category) VALUES (?, ?, ?)",
        [e.message, e.author, e.category],
      );
    }
  }

  const [tRows] = await db.query("SELECT COUNT(*) AS cnt FROM toolkit");
  if ((tRows as any)[0].cnt === 0) {
    const tools = [
      { name: "TeamCity", domain: "CI/CD" },
      { name: "Drone CI", domain: "CI/CD" },
      { name: "Tekton", domain: "CI/CD" },
      { name: "ArgoCD", domain: "CI/CD" },
      { name: "Docker", domain: "Containers" },
      { name: "Podman", domain: "Containers" },
      { name: "Buildah", domain: "Containers" },
      { name: "containerd", domain: "Containers" },
      { name: "Loki", domain: "Monitoring" },
      { name: "Jaeger", domain: "Monitoring" },
      { name: "Elastic APM", domain: "Monitoring" },
      { name: "Zabbix", domain: "Monitoring" },
      { name: "Terraform", domain: "IaC" },
      { name: "Pulumi", domain: "IaC" },
      { name: "Ansible", domain: "IaC" },
      { name: "CloudFormation", domain: "IaC" },
    ];
    for (const t of tools) {
      await db.query(
        "INSERT INTO toolkit (name, domain) VALUES (?, ?)",
        [t.name, t.domain],
      );
    }
  }
}
