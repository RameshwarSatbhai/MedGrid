# MedGrid Deployment Guide

This guide covers deploying MedGrid to production environments.

## 🚀 Deployment Options

### Option 1: Cloud Platform Deployment (Recommended)

#### Backend Deployment (Heroku/Railway/Render)

1. **Prepare for deployment**
   ```bash
   cd backend
   # Ensure package.json has correct start script
   npm install --production
   ```

2. **Environment Variables**
   Set these in your cloud platform:
   ```
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medgrid
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRE=7d
   CLIENT_URL=https://your-frontend-domain.com
   ```

3. **Deploy to Heroku**
   ```bash
   # Install Heroku CLI
   heroku create medgrid-api
   heroku config:set NODE_ENV=production
   heroku config:set MONGODB_URI=your_mongodb_uri
   heroku config:set JWT_SECRET=your_jwt_secret
   heroku config:set CLIENT_URL=https://your-frontend-domain.com
   git subtree push --prefix backend heroku main
   ```

#### Frontend Deployment (Netlify/Vercel)

1. **Build for production**
   ```bash
   cd frontend/medgrid-frontend
   # Update .env for production
   echo "VITE_API_URL=https://your-backend-domain.com/api" > .env.production
   echo "VITE_SOCKET_URL=https://your-backend-domain.com" >> .env.production
   pnpm run build
   ```

2. **Deploy to Netlify**
   ```bash
   # Install Netlify CLI
   npm install -g netlify-cli
   netlify deploy --prod --dir=dist
   ```

3. **Deploy to Vercel**
   ```bash
   # Install Vercel CLI
   npm install -g vercel
   vercel --prod
   ```

### Option 2: VPS/Server Deployment

#### Prerequisites
- Ubuntu 20.04+ server
- Domain name with DNS configured
- SSL certificate (Let's Encrypt recommended)

#### Server Setup

1. **Update system**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Install MongoDB**
   ```bash
   wget -qO - https://www.mongodb.org/static/pgp/server-6.0.asc | sudo apt-key add -
   echo "deb [ arch=amd64,arm64 ] https://repo.mongodb.org/apt/ubuntu focal/mongodb-org/6.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-6.0.list
   sudo apt-get update
   sudo apt-get install -y mongodb-org
   sudo systemctl start mongod
   sudo systemctl enable mongod
   ```

4. **Install PM2**
   ```bash
   sudo npm install -g pm2
   ```

5. **Install Nginx**
   ```bash
   sudo apt install nginx
   sudo systemctl start nginx
   sudo systemctl enable nginx
   ```

#### Application Deployment

1. **Clone and setup**
   ```bash
   cd /var/www
   sudo git clone <your-repo-url> medgrid
   sudo chown -R $USER:$USER medgrid
   cd medgrid
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install --production
   
   # Create production environment file
   cat > .env << EOF
   NODE_ENV=production
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/medgrid
   JWT_SECRET=your_super_secure_jwt_secret_key_here
   JWT_EXPIRE=7d
   CLIENT_URL=https://yourdomain.com
   EOF
   
   # Initialize database
   node utils/initDatabase.js
   
   # Start with PM2
   pm2 start server.js --name medgrid-api
   pm2 save
   pm2 startup
   ```

3. **Frontend setup**
   ```bash
   cd ../frontend/medgrid-frontend
   npm install -g pnpm
   pnpm install
   
   # Create production environment
   cat > .env.production << EOF
   VITE_API_URL=https://yourdomain.com/api
   VITE_SOCKET_URL=https://yourdomain.com
   EOF
   
   # Build for production
   pnpm run build
   
   # Copy build files
   sudo cp -r dist/* /var/www/html/
   ```

#### Nginx Configuration

1. **Create Nginx config**
   ```bash
   sudo nano /etc/nginx/sites-available/medgrid
   ```

2. **Add configuration**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com www.yourdomain.com;
       
       # Frontend
       location / {
           root /var/www/html;
           index index.html;
           try_files $uri $uri/ /index.html;
       }
       
       # Backend API
       location /api/ {
           proxy_pass http://localhost:5000/api/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
           proxy_cache_bypass $http_upgrade;
       }
       
       # Socket.io
       location /socket.io/ {
           proxy_pass http://localhost:5000/socket.io/;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection "upgrade";
           proxy_set_header Host $host;
           proxy_set_header X-Real-IP $remote_addr;
           proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
           proxy_set_header X-Forwarded-Proto $scheme;
       }
   }
   ```

3. **Enable site**
   ```bash
   sudo ln -s /etc/nginx/sites-available/medgrid /etc/nginx/sites-enabled/
   sudo nginx -t
   sudo systemctl reload nginx
   ```

#### SSL Certificate (Let's Encrypt)

1. **Install Certbot**
   ```bash
   sudo apt install certbot python3-certbot-nginx
   ```

2. **Get certificate**
   ```bash
   sudo certbot --nginx -d yourdomain.com -d www.yourdomain.com
   ```

3. **Auto-renewal**
   ```bash
   sudo crontab -e
   # Add this line:
   0 12 * * * /usr/bin/certbot renew --quiet
   ```

## 🔧 Production Configuration

### Environment Variables

#### Backend (.env)
```bash
# Server
NODE_ENV=production
PORT=5000

# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/medgrid

# Security
JWT_SECRET=your_super_secure_jwt_secret_key_minimum_32_characters
JWT_EXPIRE=7d

# CORS
CLIENT_URL=https://yourdomain.com
```

#### Frontend (.env.production)
```bash
VITE_API_URL=https://yourdomain.com/api
VITE_SOCKET_URL=https://yourdomain.com
VITE_APP_NAME=MedGrid
VITE_APP_VERSION=1.0.0
```

### Database Setup

#### MongoDB Atlas (Recommended)
1. Create MongoDB Atlas account
2. Create new cluster
3. Configure network access (0.0.0.0/0 for cloud deployment)
4. Create database user
5. Get connection string
6. Update MONGODB_URI in environment variables

#### Local MongoDB
```bash
# Secure MongoDB
sudo nano /etc/mongod.conf

# Add authentication
security:
  authorization: enabled

# Create admin user
mongo
use admin
db.createUser({
  user: "admin",
  pwd: "secure_password",
  roles: ["userAdminAnyDatabase"]
})

# Create application user
use medgrid
db.createUser({
  user: "medgrid_user",
  pwd: "secure_app_password",
  roles: ["readWrite"]
})

# Update connection string
MONGODB_URI=mongodb://medgrid_user:secure_app_password@localhost:27017/medgrid
```

## 🔒 Security Checklist

### Backend Security
- [ ] Use strong JWT secret (minimum 32 characters)
- [ ] Enable CORS with specific origins
- [ ] Implement rate limiting
- [ ] Use HTTPS in production
- [ ] Validate all inputs
- [ ] Hash passwords with bcrypt
- [ ] Keep dependencies updated
- [ ] Use environment variables for secrets
- [ ] Enable MongoDB authentication
- [ ] Configure firewall rules

### Frontend Security
- [ ] Build for production (minified)
- [ ] Use HTTPS
- [ ] Implement CSP headers
- [ ] Validate user inputs
- [ ] Store tokens securely
- [ ] Implement logout functionality
- [ ] Use secure cookie settings

### Server Security
- [ ] Keep OS updated
- [ ] Configure firewall (UFW)
- [ ] Disable root login
- [ ] Use SSH keys
- [ ] Regular security updates
- [ ] Monitor logs
- [ ] Backup database regularly

## 📊 Monitoring & Maintenance

### Application Monitoring
```bash
# PM2 monitoring
pm2 monit

# View logs
pm2 logs medgrid-api

# Restart application
pm2 restart medgrid-api

# Check status
pm2 status
```

### Database Backup
```bash
# Create backup script
cat > /home/ubuntu/backup-db.sh << 'EOF'
#!/bin/bash
DATE=$(date +%Y%m%d_%H%M%S)
mongodump --uri="mongodb://localhost:27017/medgrid" --out="/backups/medgrid_$DATE"
# Keep only last 7 days
find /backups -name "medgrid_*" -mtime +7 -exec rm -rf {} \;
EOF

chmod +x /home/ubuntu/backup-db.sh

# Schedule daily backup
crontab -e
# Add: 0 2 * * * /home/ubuntu/backup-db.sh
```

### Log Rotation
```bash
# Configure logrotate for PM2
sudo nano /etc/logrotate.d/pm2

/home/ubuntu/.pm2/logs/*.log {
    daily
    missingok
    rotate 7
    compress
    notifempty
    create 0644 ubuntu ubuntu
    postrotate
        pm2 reloadLogs
    endscript
}
```

## 🚨 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check logs
pm2 logs medgrid-api

# Check environment variables
pm2 env 0

# Restart
pm2 restart medgrid-api
```

#### Database connection issues
```bash
# Check MongoDB status
sudo systemctl status mongod

# Check connection
mongo --eval "db.adminCommand('ismaster')"

# Check network
netstat -tlnp | grep :27017
```

#### Frontend not loading
```bash
# Check Nginx status
sudo systemctl status nginx

# Check Nginx config
sudo nginx -t

# Check logs
sudo tail -f /var/log/nginx/error.log
```

#### SSL certificate issues
```bash
# Check certificate status
sudo certbot certificates

# Renew certificate
sudo certbot renew

# Check Nginx SSL config
sudo nginx -t
```

### Performance Optimization

#### Backend
- Enable gzip compression
- Implement caching strategies
- Optimize database queries
- Use connection pooling
- Monitor memory usage

#### Frontend
- Enable gzip compression in Nginx
- Implement lazy loading
- Optimize images
- Use CDN for static assets
- Implement service worker

#### Database
- Create appropriate indexes
- Monitor query performance
- Regular maintenance
- Optimize connection pool
- Use read replicas if needed

## 📈 Scaling Considerations

### Horizontal Scaling
- Load balancer (Nginx/HAProxy)
- Multiple backend instances
- Database clustering
- Redis for session storage
- CDN for static assets

### Vertical Scaling
- Increase server resources
- Optimize application code
- Database performance tuning
- Memory optimization
- CPU optimization

---

## 🆘 Support

For deployment issues:
1. Check application logs
2. Verify environment variables
3. Test database connectivity
4. Check network configuration
5. Review security settings

Remember to test thoroughly in a staging environment before deploying to production!

