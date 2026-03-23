# Vishnuraj Vishwakarma — Full-Stack Portfolio System

A production-grade personal portfolio with a secure admin dashboard, built with Next.js 14, Firebase, Tailwind CSS, and Framer Motion.

---

## System Architecture

```
Public Portfolio  ─────►  Firebase Firestore (real-time)  ◄─────  Admin Panel
 (anyone visits)            Firebase Storage (files)          (only you login)
                            Firebase Auth (admin gate)
```

---

## Project Structure

```
vv-portfolio/
├── src/
│   ├── app/
│   │   ├── page.tsx                  # Public portfolio (all sections)
│   │   ├── layout.tsx                # Root layout + providers
│   │   └── admin/
│   │       ├── layout.tsx            # Admin sidebar + auth guard
│   │       ├── page.tsx              # Login page
│   │       ├── dashboard/page.tsx    # Stats overview
│   │       ├── projects/page.tsx     # CRUD projects
│   │       ├── certificates/page.tsx # CRUD certificates + verify links
│   │       ├── gallery/page.tsx      # Upload / manage photos
│   │       ├── cv/page.tsx           # Upload / version CV PDFs
│   │       ├── skills/page.tsx       # Manage skill bars
│   │       └── messages/page.tsx     # Contact form inbox
│   ├── components/
│   │   └── ui/
│   │       ├── index.tsx             # Button, Badge, Card, Modal, Input, etc.
│   │       └── Cursor.tsx            # Animated cursor
│   ├── hooks/
│   │   └── useAuth.tsx               # Firebase auth context
│   ├── lib/
│   │   ├── firebase.ts               # Firebase app init
│   │   └── services.ts               # All Firestore + Storage CRUD
│   ├── types/
│   │   └── index.ts                  # TypeScript interfaces
│   └── styles/
│       └── globals.css               # Design tokens + utilities
├── firestore.rules                   # Security rules (deploy separately)
├── storage.rules                     # Storage rules (deploy separately)
├── vercel.json                       # Vercel config
├── tailwind.config.js
├── next.config.js
└── package.json
```

---

## Setup Guide (Step by Step)

### Step 1 — Create Firebase Project

1. Go to [console.firebase.google.com](https://console.firebase.google.com)
2. Click **Add Project** → Name it `vv-portfolio`
3. Enable **Google Analytics** (optional)
4. In Project Settings → **Your Apps** → Add a **Web App**
5. Copy the config object (you'll need it for Step 3)

### Step 2 — Enable Firebase Services

In the Firebase Console:

**Authentication:**
- Build → Authentication → Get Started
- Sign-in methods → Enable **Email/Password**
- Users → Add user → enter `vishnurajvishwakarma@gmail.com` + a strong password

**Firestore Database:**
- Build → Firestore Database → Create database
- Start in **production mode**
- Choose region: **asia-south1** (Mumbai)

**Storage:**
- Build → Storage → Get Started
- Start in production mode

### Step 3 — Configure Environment Variables

Copy `.env.local.example` to `.env.local` and fill in your Firebase values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:
```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=vv-portfolio-xxx.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=vv-portfolio-xxx
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=vv-portfolio-xxx.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
NEXT_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
```

### Step 4 — Deploy Security Rules

Install Firebase CLI if needed:
```bash
npm install -g firebase-tools
firebase login
firebase init  # Select Firestore + Storage, use existing project
```

Deploy rules:
```bash
firebase deploy --only firestore:rules,storage
```

### Step 5 — Install and Run Locally

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — portfolio  
Open [http://localhost:3000/admin](http://localhost:3000/admin) — admin panel

### Step 6 — Deploy to Vercel

**Option A — Drag & Drop:**
1. Run `npm run build` to verify no errors
2. Go to [vercel.com/new](https://vercel.com/new)
3. Import your GitHub repo (push this folder first)

**Option B — Vercel CLI:**
```bash
npm i -g vercel
vercel
```

**Add Environment Variables in Vercel:**  
Project Settings → Environment Variables → add all 6 `NEXT_PUBLIC_FIREBASE_*` values

---

## Admin Panel Usage

| URL | Feature |
|-----|---------|
| `/admin` | Login with Firebase email/password |
| `/admin/dashboard` | Stats overview, quick actions |
| `/admin/projects` | Add/edit/delete projects with images and proof links |
| `/admin/certificates` | Add certificates with verification URLs |
| `/admin/gallery` | Drag & drop photo uploads with tags |
| `/admin/cv` | Upload PDF CVs, manage versions, set active |
| `/admin/skills` | Add/edit skill bars with proficiency levels |
| `/admin/messages` | Read contact form submissions |

**All changes reflect on the public portfolio instantly** — no redeployment needed.

---

## Customization

### Update Your Personal Info
Add site settings to Firestore manually:
1. Go to Firestore → `settings` collection → Add document `site`
2. Fields:
```json
{
  "name": "Vishnuraj Vishwakarma",
  "role": "Founder & COO — Austrange Solutions Pvt Ltd",
  "tagline": "Turning raw data into decisions that shape the future.",
  "bio": "Your full bio here...",
  "email": "vishnurajvishwakarma@gmail.com",
  "phone": "+91 93228 71984",
  "location": "Mumbai, India",
  "githubUrl": "https://github.com/VishnurajVishwakarama",
  "linkedinUrl": "https://linkedin.com/in/vishnuraj-vishwakarma",
  "availability": true
}
```

### Seed Initial Skills
Add via Admin panel → Skills, or manually in Firestore `skills` collection.

### Add Your Photo
Replace the `VV` initials in `src/app/page.tsx` hero section with an `<Image>` component pointing to your uploaded photo URL.

### Update Firebase Rules Email
In both `firestore.rules` and `storage.rules`, update the admin email check:
```
&& request.auth.token.email == 'your-actual-email@gmail.com'
```

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animation | Framer Motion |
| Database | Firebase Firestore (real-time) |
| Storage | Firebase Storage |
| Auth | Firebase Authentication |
| Forms | React Hook Form |
| File Upload | React Dropzone |
| Icons | Lucide React |
| Hosting | Vercel |

---

## Features Summary

- Dark mode only (with light mode toggle ready)
- Real-time sync — admin changes show on portfolio instantly
- Firebase Auth — only your email can access admin
- Firestore security rules — public reads, admin-only writes
- Storage rules — file size limits, PDF-only for CV
- Draft/Publish mode for projects and certificates
- Skill bars with animated progress on scroll
- Certificate modal with live verification links
- Gallery with drag-and-drop upload and tag filtering
- CV version management — set any version as active
- Contact form with admin inbox + reply via email
- Custom animated cursor
- Scroll progress indicator
- SEO meta tags pre-configured
- Responsive — mobile + desktop

---

Built for Vercel + Firebase · Mumbai, India
# Full-Stack-Portfolio-System
# Full-Stack-Portfolio-System
