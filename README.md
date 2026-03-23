# Full-Stack Portfolio System & Admin Dashboard

<div align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js" />
  <img alt="React" src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react" />
  <img alt="Supabase" src="https://img.shields.io/badge/Supabase-Database-3ECF8E?style=for-the-badge&logo=supabase" />
  <img alt="Tailwind CSS" src="https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css" />
  <img alt="Framer Motion" src="https://img.shields.io/badge/Framer_Motion-white?style=for-the-badge&logo=framer" />
</div>

<br />

A production-grade, highly customizable, and SEO-optimized personal portfolio with a secure built-in Admin Dashboard. Built with Next.js 14 App Router, Supabase (PostgreSQL & Storage), Tailwind CSS, and Framer Motion for a premium, glassmorphism-inspired UI.

Whether you are a developer, designer, or freelancer, this portfolio system provides a beautifully animated public interface and a fully functional CMS (Content Management System) to manage your content dynamically—no coding required after initial setup!

## ✨ Key Features

- **Premium UI/UX:** Stunning glassmorphism design, glowing micro-animations, and a cohesive dark-mode aesthetic.
- **Dynamic Admin Dashboard:** Manage Projects, Certificates, Skills, Gallery, and CV directly from the web interface.
- **Supabase Backend:** Extremely fast and secure real-time data fetching, file uploads, and authentication.
- **SEO Optimized:** Next.js Server-Side Rendering (SSR) and dynamic metadata ensure your portfolio ranks well on Google.
- **Contact Form Inbox:** Visitors can message you, and it lands securely in your Admin Inbox.
- **Automated Image Optimization:** Automatically compresses images before uploading to Supabase Storage.
- **100% Customizable:** Easily adapt colors, fonts, and layouts using Tailwind CSS.

---

## 🏗️ System Architecture

```text
Public Portfolio  ─────►  Supabase Postgres DB    ◄─────  Admin Dashboard
 (SEO Optimized)            Supabase Storage              (Secure Login)
                            Supabase Auth
```

---

## 🚀 Step-by-Step Setup Guide

Follow this guide to get your portfolio up and running in minutes. Anyone can do it!

### 1. Clone the Repository

```bash
git clone https://github.com/VishnurajVishwakarama/Full-Stack-Portfolio-System.git
cd Full-Stack-Portfolio-System
npm install
```

### 2. Set Up Supabase (Free Database)

We use Supabase as our free, open-source backend.

1. Go to [Supabase](https://supabase.com/) and create a new project.
2. Under **Authentication**, enable the "Email" provider. Create a new user with your email and a strong password (this will be your Admin login).
3. Under **SQL Editor**, run queries to create your tables (`projects`, `certificates`, `skills`, `gallery`, `cv`, `messages`, `settings`). Ensure you configure appropriate Policies to only allow authenticated users to mutate records.
4. Under **Storage**, create public buckets named `projects`, `certificates`, `gallery`, and `cv`. 

### 3. Environment Variables

Create a `.env.local` file in the root of the project:

```bash
cp .env.local.example .env.local
```

Add your Supabase keys from **Project Settings > API**:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Run the App Locally

```bash
npm run dev
```

- **Public Portfolio:** [http://localhost:3000](http://localhost:3000)
- **Admin Dashboard:** [http://localhost:3000/admin](http://localhost:3000/admin) (Log in with the Supabase email and password you created in Step 2).

### 5. Deploy to Vercel (Free Hosting)

The easiest way to deploy is using Vercel.

1. Push your code to your GitHub repository.
2. Go to [Vercel](https://vercel.com/) and import the project.
3. In the Vercel setup, add your `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY` to the Environment Variables section.
4. Click **Deploy**. Your professional portfolio is now live on the internet and indexed by search engines!

---

## 🛠️ Tech Stack

- **Framework:** Next.js 14 App Router
- **Styling:** Tailwind CSS + `clsx` + `tailwind-merge`
- **Animations:** Framer Motion
- **Database & Auth:** Supabase (PostgreSQL)
- **Icons:** Lucide React
- **Image Processing:** browser-image-compression
- **Hosting:** Vercel

---

## 🎨 Customizing the Portfolio

### Changing Site Settings
Once logged into the Admin panel, you can instantly change your name, title, bio, and social links in real time from the Settings card. Changes take effect on the public portfolio instantly!

### Customizing Colors
Modify `tailwind.config.ts` and `src/styles/globals.css` to update the global theme, gradients, glowing effects, and font families.

---

## 🤝 Contributing

Contributions are always welcome! If you have any ideas, suggestions, or bug fixes to make this portfolio even more SEO-friendly or better designed, feel free to open an issue or create a pull request.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📝 License

Distributed under the MIT License. See `LICENSE` for more information.

---
*Built by [Vishnuraj Vishwakarma](https://github.com/VishnurajVishwakarama)*
