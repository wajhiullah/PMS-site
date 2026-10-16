# PIEAS Materials Society (PMS) — Official Web Platform

[![Rust](https://img.shields.io/badge/Rust-Axum%200.8-DEA584?logo=rust&logoColor=white)](https://www.rust-lang.org/)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![SQLite](https://img.shields.io/badge/Database-SQLite%20WAL-003B57?logo=sqlite&logoColor=white)](https://www.sqlite.org/)
[![License](https://img.shields.io/badge/License-Academic%20Open-orange)](#license)

The official web platform and digital headquarters of the **PIEAS Materials Society (PMS)**, representing the **Department of Metallurgy & Materials Engineering (DMME)** at the **Pakistan Institute of Engineering and Applied Sciences (PIEAS)**, Nilore, Islamabad.

---

## 📖 Table of Contents

- [Purpose of the Website](#-purpose-of-the-website)
- [System Architecture](#-system-architecture)
- [Project Structure](#-project-structure)
- [Environment & Security Configuration](#-environment--security-configuration)
- [How to Make the Website Live (Production Deployment)](#-how-to-make-the-website-live-production-deployment)
  - [Prerequisites](#1-server-prerequisites)
  - [Step 1: Clone Repository](#2-clone-repository)
  - [Step 2: Configure Environment (.env)](#3-configure-environment-env)
  - [Step 3: Compile the Frontend Bundle](#4-compile-the-frontend-bundle)
  - [Step 4: Build the Optimized Rust Release Binary](#5-build-the-optimized-rust-release-binary)
  - [Step 5: Setup systemd Background Service](#6-setup-systemd-background-service)
  - [Step 6: Configure Reverse Proxy & SSL (Nginx / Caddy)](#7-configure-reverse-proxy--ssl-nginx--caddy)
  - [Step 7: Configure Firewall](#8-configure-firewall)
- [Local Development Guide](#-local-development-guide)
- [Admin CMS & Dynamic Content Editing](#-admin-cms--dynamic-content-editing)
- [Database Backups & Maintenance](#-database-backups--maintenance)
- [REST API Reference](#-rest-api-reference)

---

## 🎯 Purpose of the Website

The PMS web platform serves as an all-in-one academic, logistical, and community portal for undergraduate and graduate materials engineering students, faculty, and industry partners:

1. **Academic & Research Portfolios**:
   - **Interactive Microstructure & Lattice Visualizer**: Real-time 3D simulation of crystal unit cells (**BCC, FCC, HCP**) and dual-phase SEM microstructure inspection (Tempered Martensite & Austenite).
   - **Material of the Month Series**: Curated technical explainers on critical engineering alloys (e.g., *Zircaloy-4 nuclear cladding*, *Inconel 718 aerospace superalloys*).
   - **Undergraduate Materials Toolkit**: Direct access to ASTM testing standards (*ASTM E8 tensile testing*, *ASTM E112 grain sizing*, *ASTM E23 impact testing*), metallographic etching safety procedures, and computational software guides (*Thermo-Calc*, *JMatPro*, *ImageJ*, *Python pymatgen*).
   - **Final Year Project (FYP) Showcase**: Archive of departmental student research in additive manufacturing, high-entropy alloys, and corrosion engineering.

2. **Society Operations & Logistics**:
   - **Event Registrations & Ticker Announcements**: Online registration for technical seminars, hands-on workshops, and industrial visits (e.g., Heavy Mechanical Complex Taxila, PINSTECH).
   - **Verifiable Digital Participation Certificates**: Real-time cryptographic passcode verification system for event participants and employers.
   - **Council Portfolios & Executive Leadership**: Comprehensive directory of current and past student councils, portfolio scopes, and faculty advisors.
   - **Alumni Network & Career Board**: Professional directory of DMME alumni across MIT, Rolls-Royce, Max Planck Institute, PAEC, and active internship/scholarship listings.

3. **Dynamic Content Management (CMS)**:
   - Built-in administrative dashboard allowing executive council members to update homepage headlines, mission statements, event listings, and cheatsheets directly without modifying source code.

---

## 🏗 System Architecture

The application is engineered as a **self-contained monolithic binary**:

```
┌─────────────────────────────────────────────────────────────┐
│                      Client Browser                         │
│       React 19 + Tailwind CSS SPA (Obsidian Dark Theme)     │
└──────────────────────────────▲──────────────────────────────┘
                               │ HTTP / REST / JSON
┌──────────────────────────────▼──────────────────────────────┐
│                  Rust Axum Web Server (Port 3000)           │
│                                                             │
│   ├── /api/auth/*         (JWT Bearer Authentication)       │
│   ├── /api/admin/*        (Secured CRUD Database Ops)       │
│   ├── /api/*              (Public Endpoints & Search)       │
│   ├── /uploads/*          (Static Media & PDF Assets)       │
│   ├── /swagger-ui         (Interactive OpenAPI Docs)        │
│   └── /*                  (SPA Fallback -> frontend/dist)   │
└──────────────────────────────▲──────────────────────────────┘
                               │ SQLite Connection Pool (sqlx)
┌──────────────────────────────▼──────────────────────────────┐
│                    SQLite 3 Embedded Engine                 │
│                 (pms.db with WAL mode enabled)              │
└─────────────────────────────────────────────────────────────┘
```

- **Backend**: Rust using [Axum 0.8](https://github.com/tokio-rs/axum), [SQLx 0.8](https://github.com/launchbadge/sqlx) (SQLite), [Argon2](https://github.com/RustCrypto/password-hashes) password hashing, [jsonwebtoken](https://github.com/Keats/jsonwebtoken) for session tokens, and [utoipa](https://github.com/juhaku/utoipa) for OpenAPI generation.
- **Frontend**: React 19, React Router v7, Vite 6, Tailwind CSS v4, Lucide React icons.
- **Embedded SPA Serving**: When compiled, Axum serves both the REST API and the production React bundle directly from `frontend/dist/` with automated client-side routing fallback. No separate Node.js server is required in production!

---

## 📁 Project Structure

```
PMS-site/
├── .env                       # Active environment & security variables (git-ignored)
├── .env.example               # Template environment configuration
├── .gitignore                 # Unified repository git ignore
├── Cargo.toml                 # Rust dependencies & package metadata
├── Cargo.lock                 # Deterministic Rust dependency lockfile
├── pms.db                     # SQLite database (auto-created on first run)
├── SITE_OVERVIEW.md           # Internal system and database reference
├── README.md                  # Complete deployment & platform documentation
│
├── src/                       # Rust Backend
│   ├── main.rs                # App entrypoint, port binding, and route assembly
│   ├── models.rs              # SQLx structs, DTOs, and serialization schemas
│   ├── db.rs                  # Migrations, seed data, and SQLite connection pool
│   ├── auth.rs                # JWT token signing, verification, and claims extractor
│   ├── error.rs               # Uniform JSON error handling (AppError)
│   └── routes/
│       ├── mod.rs             # Module declarations
│       ├── public.rs          # Public endpoints (events, team, resources, forms)
│       └── admin.rs           # Secured admin CRUD handlers and file uploaders
│
├── frontend/                  # React Frontend SPA
│   ├── index.html             # HTML template with Space Grotesk / Inter typography
│   ├── vite.config.js         # Vite configuration with API proxy
│   ├── package.json           # Frontend dependencies & scripts
│   ├── public/                # Static public assets
│   │   ├── favicon.svg        # Official browser icon
│   │   └── pms-logo.jpeg      # Official DMME / PIEAS society emblem
│   └── src/
│       ├── main.jsx           # React DOM root mounting
│       ├── App.jsx            # Router configuration (Home, About, Team, Admin, etc.)
│       ├── index.css          # Design system, glassmorphic tokens, and layout utilities
│       ├── api.js             # Central fetch API client
│       ├── hooks/             # Custom React hooks (useSections, useTheme)
│       ├── components/        # Reusable UI components
│       │   ├── Navbar.jsx               # Navigation bar with responsive mobile drawer
│       │   ├── Footer.jsx               # Site footer with quick links & newsletter
│       │   ├── AnnouncementsBanner.jsx  # Dismissible top announcements banner
│       │   ├── CrystalVisualizer.jsx    # 3D Unit Cell & SEM microstructure simulator
│       │   ├── RegistrationModal.jsx    # Event registration & certificate issuance
│       │   └── Icons.jsx                # Custom branding SVG vectors
│       └── pages/             # Route views
│           ├── Home.jsx                 # Hero, stats, portfolios, events, material card
│           ├── About.jsx                # Mission, vision, department history, FAQs
│           ├── Team.jsx                 # Executive council & faculty advisors
│           ├── Events.jsx               # Upcoming/past events & certificate validation
│           ├── Resources.jsx            # ASTM testing guides, cheatsheets, software tools
│           ├── Blog.jsx                 # Technical articles & Material of the Month
│           ├── Opportunities.jsx        # Scholarships, internships, graduate positions
│           ├── Alumni.jsx               # Alumni career directory & testimonials
│           ├── Projects.jsx             # Final Year Projects (FYPs) & research highlights
│           ├── Gallery.jsx              # Metallography lab photos & symposia archives
│           ├── Sponsors.jsx             # Industrial partners & collaboration inquiry
│           ├── Join.jsx                 # Student membership application & contact form
│           └── Admin.jsx                # Full administrative dashboard & content editor
│
└── uploads/                   # Uploaded media and PDFs (created automatically)
    ├── .gitkeep
    └── pms-constitution.pdf   # Official society constitution & bylaws
```

---

## 🔐 Environment & Security Configuration

The platform reads all security and networking configurations from `.env` at launch.

### Environment Variables

| Variable | Description | Default Value | Recommended Production Value |
| :--- | :--- | :--- | :--- |
| `HOST` | IP interface to bind server | `0.0.0.0` | `127.0.0.1` (behind reverse proxy) |
| `PORT` | Listening HTTP port | `3000` | `3000` |
| `APP_ENV` | Application environment | `production` | `production` |
| `DATABASE_URL` | SQLite connection string | `sqlite://pms.db?mode=rwc` | `sqlite://pms.db?mode=rwc` |
| `JWT_SECRET` | Cryptographic secret for signing tokens | Auto-fallback | **Generate strong random 64-char key** |
| `ADMIN_INITIAL_EMAIL` | Default administrator account | `admin@pms.pieas.edu.pk` | Your official society email |
| `ADMIN_INITIAL_PASSWORD`| Initial administrator password | `PMS@Admin2026` | **Set strong unique password** |
| `UPLOAD_DIR` | User upload destination directory | `uploads` | `uploads` |

### Generating a Secure JWT Secret

Run the following command on Linux/macOS to generate a cryptographically strong 256-bit hexadecimal key:

```bash
openssl rand -hex 32
```

Copy the output and paste it into `.env`:

```env
JWT_SECRET=4257886ba9ce71d7ce0f4842b33d5aebdfb4d88df77113f751f927b459ee2278
```

---

## 🚀 How to Make the Website Live (Production Deployment)

Follow this step-by-step guide to deploy the PMS platform on a production Linux server (Ubuntu 22.04 / 24.04 LTS, Debian 12, or Rocky Linux).

### 1. Server Prerequisites

Update the server packages and install the necessary build tools, SQLite libraries, Node.js, and Rust:

```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential build tools, OpenSSL, SQLite, and Git
sudo apt install -y build-essential pkg-config libssl-dev sqlite3 git curl

# Install Node.js 20+ (via NodeSource)
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install the Rust Toolchain (stable)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
source "$HOME/.cargo/env"
```

Verify your toolchain installations:
```bash
rustc --version
cargo --version
node --version
npm --version
```

---

### 2. Clone Repository

Clone the project to your deployment location (e.g., `/var/www/pms-platform` or `/opt/pms-platform`):

```bash
sudo mkdir -p /var/www/pms-platform
sudo chown -R $USER:$USER /var/www/pms-platform
git clone https://github.com/your-org/PMS-site.git /var/www/pms-platform
cd /var/www/pms-platform
```

---

### 3. Configure Environment (.env)

Create your production `.env` file from the provided template:

```bash
cp .env.example .env
nano .env
```

Adjust the following settings:
- Set `HOST=127.0.0.1` (since Nginx/Caddy will handle public traffic).
- Set `PORT=3000`.
- Generate and insert a new `JWT_SECRET` (`openssl rand -hex 32`).
- Set your desired `ADMIN_INITIAL_EMAIL` and `ADMIN_INITIAL_PASSWORD`.

Lock file permissions so only your server user can read secrets:
```bash
chmod 600 .env
```

---

### 4. Compile the Frontend Bundle

Compile the React frontend into static optimized assets:

```bash
cd /var/www/pms-platform/frontend
npm ci
npm run build
cd /var/www/pms-platform
```

This compiles all React components, icons, and Tailwind CSS styles into `/var/www/pms-platform/frontend/dist/`.

---

### 5. Build the Optimized Rust Release Binary

Compile the Rust backend with maximum optimizations:

```bash
cd /var/www/pms-platform
cargo build --release
```

The compiled standalone executable will be located at:
`/var/www/pms-platform/target/release/pms-platform`

---

### 6. Setup systemd Background Service

Create a systemd unit to ensure the PMS platform runs continuously as a background daemon, starts automatically on server reboots, and restarts immediately if an error occurs.

Create the service unit file:
```bash
sudo nano /etc/systemd/system/pms.service
```

Paste the following configuration (replace `ubuntu` with your server username if different):

```ini
[Unit]
Description=PIEAS Materials Society (PMS) Web Application
After=network.target

[Service]
Type=simple
User=ubuntu
Group=ubuntu
WorkingDirectory=/var/www/pms-platform
ExecStart=/var/www/pms-platform/target/release/pms-platform
Restart=always
RestartSec=5
EnvironmentFile=/var/www/pms-platform/.env

# Security Sandbox
ProtectSystem=full
NoNewPrivileges=true

[Install]
WantedBy=multi-user.target
```

Reload systemd, enable the service, and start the platform:

```bash
sudo systemctl daemon-reload
sudo systemctl enable pms
sudo systemctl start pms
```

Check service status and logs:
```bash
sudo systemctl status pms
# View live logs:
journalctl -u pms -f
```

---

### 7. Configure Reverse Proxy & SSL (Nginx / Caddy)

To expose the site securely on `https://your-domain.edu.pk` with automated SSL certificates, use **Nginx** or **Caddy**.

#### Option A: Nginx + Let's Encrypt (Recommended Standard)

1. Install Nginx and Certbot:
```bash
sudo apt install -y nginx certbot python3-certbot-nginx
```

2. Create an Nginx site configuration:
```bash
sudo nano /etc/nginx/sites-available/pms
```

Paste the following configuration:

```nginx
server {
    server_name pms.pieas.edu.pk www.pms.pieas.edu.pk;

    client_max_body_size 25M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    location /uploads/ {
        alias /var/www/pms-platform/uploads/;
        expires 30d;
        add_header Cache-Control "public, no-transform";
    }
}
```

3. Enable the site and obtain a free SSL certificate:
```bash
sudo ln -s /etc/nginx/sites-available/pms /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl reload nginx

# Obtain free automatic SSL certificate:
sudo certbot --nginx -d pms.pieas.edu.pk -d www.pms.pieas.edu.pk
```

#### Option B: Caddy (Simplest with Automatic HTTPS)

If you prefer Caddy, install Caddy (`sudo apt install -y caddy`) and configure `/etc/caddy/Caddyfile`:

```caddy
pms.pieas.edu.pk {
    reverse_proxy 127.0.0.1:3000
    file_server /uploads/* {
        root /var/www/pms-platform
    }
}
```
Reload Caddy (`sudo systemctl reload caddy`), and HTTPS certificates will be issued automatically.

---

### 8. Configure Firewall

Enable UFW to allow SSH, HTTP, and HTTPS traffic:

```bash
sudo ufw allow OpenSSH
sudo ufw allow 'Nginx Full'   # or 'sudo ufw allow 80 && sudo ufw allow 443'
sudo ufw enable
```

**Your PIEAS Materials Society platform is now live and secured at `https://pms.pieas.edu.pk`!** 🎉

---

## 💻 Local Development Guide

To run the application locally on your machine for development:

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   cd ..
   ```

2. **Run in Dev Mode**:
   - **Backend**:
     ```bash
     cargo run
     ```
     The server will start at `http://localhost:3000`.
   - **Frontend Hot-Reloading** (optional if actively developing React):
     ```bash
     cd frontend
     npm run dev
     ```
     Vite dev server will start at `http://localhost:5173` with proxying to `http://localhost:3000`.

3. **Rebuilding Frontend for Backend Serving**:
   Whenever you make changes to frontend code and want Axum to serve it directly:
   ```bash
   cd frontend
   npm run build
   ```

---

## 🛠 Admin CMS & Dynamic Content Editing

The platform comes equipped with an administrative control suite at `/admin`.

### Default Admin Login
- **URL**: `http://localhost:3000/admin` (or `https://your-domain.com/admin`)
- **Email**: `admin@pms.pieas.edu.pk` (configured in `.env`)
- **Password**: `PMS@Admin2026` (configured in `.env`)

### Managing Content & Sections
1. **Frontend Text Sections**:
   - Edit homepage badges, hero headlines, society portfolio cards, mission/vision statements, and testing cheatsheets in real-time.
   - All changes update the `site_sections` table in SQLite and take effect instantly across all client browsers without re-deploying or restarting the server.
2. **Events & Registrations**:
   - Create new seminars, workshops, and lab visits.
   - Set dates, venues, speaker profiles, and registration limits.
   - View registered participants and export attendee lists as `.csv` files.
3. **Membership Applications**:
   - Review incoming BS/MS membership requests.
   - Filter by department, batch, and materials interests.
   - Export applicant rosters for council reviews.
4. **Council Checklist**:
   - Internal digital checklist to audit official documentation (constitution, council portraits, lab photography).

---

## 💾 Database Backups & Maintenance

The platform uses SQLite with **Write-Ahead Logging (WAL)** enabled for concurrent reads and writes.

### Creating an Automated Daily Backup

SQLite supports online non-blocking backups. Create a backup script at `/var/www/pms-platform/backup.sh`:

```bash
#!/usr/bin/env bash
BACKUP_DIR="/var/backups/pms"
mkdir -p "$BACKUP_DIR"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")

# Perform safe hot backup
sqlite3 /var/www/pms-platform/pms.db ".backup '$BACKUP_DIR/pms_$TIMESTAMP.db'"

# Remove backups older than 30 days
find "$BACKUP_DIR" -type f -name "pms_*.db" -mtime +30 -delete
```

Make it executable and add to crontab:
```bash
chmod +x /var/www/pms-platform/backup.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/pms-platform/backup.sh") | crontab -
```

---

## 📡 REST API Reference

The platform features an automated interactive OpenAPI Swagger specification. When running, visit:

```
http://localhost:3000/swagger-ui
```

### Key API Endpoints

- `GET /api/sections` — Fetch all customizable frontend text sections
- `GET /api/stats` — Society metrics (active members, events held, years active)
- `GET /api/announcements` — Active ticker announcements
- `GET /api/events` — Upcoming and past symposiums & workshops
- `POST /api/events/:id/register` — Register for an event & receive digital passcode
- `GET /api/certificates/verify?code=...` — Verify digital certificate validity
- `GET /api/team` — Current executive council and faculty advisor profiles
- `GET /api/resources` — ASTM testing guides and computational tools
- `GET /api/posts` — Technical articles and Material of the Month explainers
- `POST /api/membership` — Submit student membership application
- `POST /api/contact` — Send society inquiry message
- `POST /api/auth/login` — Administrator authentication & JWT token generation
- `GET /api/admin/:model` — Protected CRUD read operations
- `POST /api/admin/:model` — Protected CRUD creation operations
- `PUT /api/admin/:model/:id` — Protected CRUD update operations
- `DELETE /api/admin/:model/:id` — Protected CRUD deletion operations
- `POST /api/admin/upload` — Multipart file & image uploader

---

## 📜 License

Developed for the **Department of Metallurgy & Materials Engineering (DMME)**, **Pakistan Institute of Engineering and Applied Sciences (PIEAS)**. All rights reserved. Available for academic and student society operations.
