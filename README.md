# NEXA Official Website (NEXA.COM.IN 21)

> **Official public-facing product & company website for NEXA.**  
> Built with modern full-stack architecture: React 18, TypeScript, Tailwind CSS, Lucide icons, Motion animations, and an Express Node.js backend.

---

## 1. Architectural Separation Rule

**Important Operating Rule:**  
This website is **NOT** the NEXA Android mobile application.

The **NEXA Android App** remains solely responsible for:
- Native conversational AI assistant
- "Hey NEXA" hands-free wake-word engine
- Android default assistant integration
- Direct phone call dialing via Android Telecom API
- Background app launching and AlarmManager triggers
- FocusLock distraction lockdown system & screen blocking
- Offline Finance Calculators (SIP, EMI, GST, Compound Interest)
- Android runtime permissions & biometric vault

The **NEXA Website (nexa.com.in)** serves as the authoritative public presence:
- Official application download hub (APK, Google Play, Store links)
- Real-time version announcements, release notes, and changelog
- Interactive screenshot gallery across all 8 mobile application modules
- General Help Center & dedicated NEXA AI Help Center
- Official communications portal and contact system
- Professional bespoke commissioning services (Web, Android, AI, Video, Graphics)
- Server-authenticated Admin Console for remote runtime configuration

---

## 2. Technical Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS, Lucide React, Motion (Framer Motion)
- **Backend**: Express 4, TypeScript, Node.js (`server.ts`)
- **Data Persistence**: Robust JSON file database (`data/config.json`, `data/enquiries.json`, `data/screenshots.json`, `data/help.json`) with in-memory caching and atomic file writes
- **Security**: Server-side Bearer token authentication for admin endpoints with configurable `ADMIN_SECRET`
- **SEO & Compliance**: OpenGraph tags, Twitter cards, Schema.org JSON-LD structured data, `robots.txt`, and `sitemap.xml`

---

## 3. Environment Variables Configuration

Create a `.env` file based on `.env.example`:

```env
# Port configured by platform (default: 3000)
PORT=3000

# Official contact destination email
SUPPORT_EMAIL=nexa.com.in21@gmail.com

# Server-side administrator secret key for /admin authentication
ADMIN_SECRET=nexa-admin-2026
```

### Configuration Parameters Explained
1. **`SUPPORT_EMAIL`**: Automatically synchronizes with the website's public display, mailto links, copy buttons, and contact notification channels.
2. **`ADMIN_SECRET`**: Required to log in to `/admin`. All admin mutating API routes verify the resulting token on every request.

---

## 4. Getting Started & Local Development

### Prerequisites
- Node.js 18+ (or Node 20+)
- npm 9+

### Install Dependencies
```bash
npm install
```

### Run Full-Stack Dev Server
```bash
npm run dev
```
The server will boot at `http://localhost:3000`.

### Production Build
```bash
npm run build
```
This builds both the client frontend (`dist/`) and bundles the server into CommonJS (`dist/server.cjs`).

### Run Production Server
```bash
npm start
```

---

## 5. Website Navigation Routes

| Route | Page Name | Purpose |
|---|---|---|
| `/` | **Home** | Hero introduction, download CTA, feature breakdown, device preview |
| `/download` | **Download** | Official APK download, Google Play links, install guide, safety notice |
| `/features` | **Features** | Deep dive into the NEXA ecosystem & Web vs Android matrix |
| `/screenshots`| **Screenshots** | Interactive 8-category screenshot gallery with modal zoom |
| `/updates` | **Updates** | Production release changelog, What's New, historical version timeline |
| `/help` | **Help Center** | Searchable knowledge base for accounts, permissions, and APK issues |
| `/ai-help` | **AI Help** | Educational guides on NEXA AI, privacy, and responsible usage |
| `/services` | **Services** | Bespoke client service offerings with pre-filled enquiry routing |
| `/contact` | **Contact** | Official communications form, direct mailto client, and copy actions |
| `/about` | **About** | NEXA story, mission, philosophy, and brand ownership |
| `/privacy` | **Privacy** | Legal transparency for website enquiries and Android app permissions |
| `/terms` | **Terms** | Terms of service, intellectual property, and app licensing |
| `/admin` | **Admin Console** | Server-authenticated dashboard for live configuration & enquiries |

---

## 6. How to Manage Releases & Download Links

1. Open `/admin` in your browser.
2. Enter your configured `ADMIN_SECRET` (default: `nexa-admin-2026`).
3. Under the **Version & Release Config** tab:
   - Update **Latest Version String** (e.g., `v2.3`)
   - Update **Release Date**, **Package Size**, and **Release Notes**
   - Add, edit, or reorder **What's New** bullet points
   - Configure **Direct APK URL** (e.g., `https://nexa.com.in/downloads/nexa-v2.3.apk`)
   - Configure **Google Play URL** and **Other Store URL**
   - Check/uncheck **Allow Public Direct Downloads** to toggle maintenance mode
   - Toggle the **Top Update Banner** on or off and customize its banner message
4. Click **[Save All Changes]**. The changes immediately apply across the website without redeploying.

---

## 7. How Enquiries Are Handled

1. Visitors submit enquiries via `/contact` or by clicking **[Enquire About This Service]** on `/services`.
2. Input is validated on both the client and server side.
3. The server generates a unique tracking ID (e.g. `enq-1789825635805-4ep02`) and writes the record to `data/enquiries.json`.
4. The administrator can view, review, filter, and change enquiry status (`new`, `in_review`, `resolved`) inside `/admin` under **Enquiries & Submissions**.
5. The administrator can click **[Reply Directly via Email]** to launch a pre-addressed email reply.

---

## 8. Deployment Guidelines

### Container / Cloud Run Deployment
The repository includes a ready-to-deploy Node setup:
- Port `3000` is bound to `0.0.0.0`.
- The build script `npm run build` generates `dist/` and `dist/server.cjs`.
- The start command `npm start` runs `node dist/server.cjs`.
- Mount persistent volume to `/data` if file-based persistence across container restarts is required.

---

## 9. Security & Hardening Notes

- **No Hardcoded Secrets**: Secrets are read from environment variables (`ADMIN_SECRET`, `SUPPORT_EMAIL`).
- **Cryptographic Token Verification**: The backend issues randomized 32-byte hexadecimal session tokens stored in an in-memory set with server-side bearer verification.
- **Strict Android Permissions Safeguard**: The website explicitly clarifies Android permission behaviors to prevent phishing and unauthorized APK mirrors.

---

© 2026 NEXA. All rights reserved. **NEXA.COM.IN 21**
