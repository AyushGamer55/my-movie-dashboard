# Docker Setup for Next.js 15 Project

## Tasks
- [x] Update Dockerfile to copy standalone to ./.next/standalone and set CMD to ["node", ".next/standalone/server.js"]
- [x] Update docker-compose.yml to map host port 10000 to container port 3000
- [ ] Test local run with `docker compose up --build` and access at http://localhost:10000
- [ ] Verify Render deployment (Dockerfile only, binds to 0.0.0.0:3000)
