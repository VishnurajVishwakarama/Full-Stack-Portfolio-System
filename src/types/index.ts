export interface Project {
  id: string;
  title: string;
  description: string;
  stack: string[];
  imageUrl?: string;
  githubUrl?: string;
  liveUrl?: string;
  proofUrl?: string;
  order?: number;
}

export interface Certificate {
  id: string;
  title: string;
  issuer: string;
  date: string;
  description?: string;
  credentialId?: string;
  verifyUrl: string;
  imageUrl?: string;
  order?: number;
}

export interface Skill {
  id: string;
  name: string;
  level: number;
  category: string;
  order?: number;
}

export interface GalleryImage {
  id: string;
  url: string;
  caption?: string;
  tag?: string;
}

export interface CVFile {
  id?: string;
  url: string;
  version: string;
  active?: boolean;
}

export interface SiteSettings {
  name: string;
  role: string;
  tagline: string;
  bio: string;
  email: string;
  phone: string;
  location: string;
  githubUrl: string;
  linkedinUrl: string;
  availability: boolean;
  profileImage?: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read?: boolean;
  createdAt?: any;
}

export interface DashboardStats {
  totalProjects: number;
  publishedProjects: number;
  totalCertificates: number;
  totalSkills: number;
  totalImages: number;
  unreadMessages: number;
}
