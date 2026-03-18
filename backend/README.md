This is the backend API for the 101 DevOps learning project, built with Express.js and MySQL.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- MySQL 8 database (local or Docker)

## Environment Setup

1. **Copy the environment template**
   ```bash
   cp .env.example .env
   ```

2. **Configure your environment variables**
   ```bash
   DATABASE_URL=mysql://root:password@localhost:3306/devopsdb
   ```

## Quick Start

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start MySQL** (if not already running)
   ```bash
   # Using Docker (recommended)
   docker run --name oneohone-devops-db \
     -e MYSQL_ROOT_PASSWORD=password \
     -e MYSQL_DATABASE=devopsdb \
     -p 3306:3306 \
     -d mysql:8
   ```

3. **Start the development server**
   ```bash
   npm run start
   ```

The API will be available at http://localhost:3000

## API Routes

| Route             | Description                  |
|--------------------|------------------------------|
| `/api/roadmap`     | Milestones data              |
| `/api/insights`    | Tips and insights            |
| `/api/toolbox`     | Instruments and tools        |

## Database Tables

| Table         | Description                  |
|---------------|------------------------------|
| `milestones`  | Roadmap milestone entries    |
| `tips`        | Insight tips                 |
| `instruments` | Toolbox instrument entries   |

## Troubleshooting

### Common Issues

#### 1. Database Connection Errors

**Problem**: `Error: connect ECONNREFUSED 127.0.0.1:3306`

**Solutions**:
- Ensure MySQL is running:
  ```bash
  # Check if MySQL is running
  docker ps | grep mysql
  
  # If not running, start it
  docker start oneohone-devops-db
  ```
- Verify your `.env` database credentials match your MySQL setup
- Check if the database exists:
  ```bash
  docker exec -it oneohone-devops-db mysql -u root -p -e "SHOW DATABASES;"
  ```

#### 2. Port Already in Use

**Problem**: `Error: listen EADDRINUSE: address already in use :::3000`

**Solutions**:
- Kill the process using port 3000:
  ```bash
  # Find the process
  lsof -i :3000

  # Kill it (replace PID with actual process ID)
  kill -9 <PID>
  ```
- Or change the port in your `.env` file:
  ```bash
  PORT=5000
  ```

#### 3. Module Not Found Errors

**Problem**: `Error: Cannot find module 'express'`

**Solutions**:
- Ensure you've installed dependencies:
  ```bash
  npm install
  ```
- Clear npm cache if needed:
  ```bash
  npm cache clean --force
  rm -rf node_modules package-lock.json
  npm install
  ```

#### 4. Environment Variables Not Loading

**Problem**: Database credentials showing as undefined

**Solutions**:
- Ensure `.env` file exists in the backend directory
- Check that variable names match exactly (no extra spaces)
- Restart the server after changing `.env` file

## Need Help?

- Check the component-specific README files for detailed setup instructions
- Review the troubleshooting sections for common issues
- Feel free to reach out if you run into any issues or have questions:
    - LinkedIn: [in/mohamed-el-aassal](https://www.linkedin.com/in/mohamed-el-aassal-910486267)
    - Mail: [mohamedelaassal42@gmail.com](mohamedelaassal42@gmail.com)

