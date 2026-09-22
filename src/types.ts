export interface NexaConfig {
  appName?: string;
  appNameShort?: string;
  companyName?: string;
  websiteVersion: string;
  appLatestVersion: string;
  currentClientVersion: string;
  versionName: string;
  releaseDate: string;
  releaseNotes: string;
  whatIsNew: string[];
  apkUrl: string;
  playStoreUrl: string;
  otherStoreUrl: string;
  minimumAndroidVersion: string;
  fileSize: string;
  downloadEnabled: boolean;
  supportEmail: string;
  maintenanceMode: boolean;
  announcement: string;
  websiteAnnouncement: string;
  updateAvailable: boolean;
  appVersionCode?: number;
  showUpdateBanner?: boolean;
  updateBannerMessage?: string;
  updateBannerButtonText?: string;
  publicDownload?: boolean;
}

export interface AppProduct {
  id: string;
  name: string;
  displayName?: string;
  description: string;
  category?: string;
  icon?: string;
  isMain?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ApkRelease {
  id: string;
  productId: string;
  productName: string;
  displayName: string;
  version: string;
  versionName?: string;
  filename: string;
  originalFilename?: string;
  storagePath: string;
  fileSize: string;
  fileSizeBytes: number;
  published: boolean;
  releaseDate: string;
  releaseNotes: string;
  whatIsNew?: string[];
  minimumAndroidVersion: string;
  isRealApk: boolean;
  downloadCount?: number;
  sha256?: string;
  status?: string;
  packageId?: string;
  versionCode?: string;
  minSdkVersion?: string;
  targetSdkVersion?: string;
  signingScheme?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  createdAt?: string;
}

export type EnquiryCategory =
  | 'Contact NEXA'
  | 'Email NEXA'
  | 'Service Enquiry'
  | 'App Support'
  | 'Bug Report'
  | 'Feature Request'
  | 'Business Enquiry'
  | 'Development Enquiry'
  | 'Video Creation Enquiry'
  | 'Image/Design Enquiry';

export interface ContactEnquiry {
  id: string;
  name: string;
  email: string;
  category: EnquiryCategory;
  serviceType?: string;
  subject: string;
  message: string;
  createdAt: string;
  status: 'unread' | 'reviewed' | 'resolved' | 'new' | 'in_review';
}

export type NexaEnquiry = ContactEnquiry;

export type ScreenshotCategory =
  | 'All'
  | 'Home'
  | 'NEXA AI'
  | 'Hey NEXA'
  | 'Finance'
  | 'Tools'
  | 'NEXA Tools'
  | 'Video Generation'
  | 'Object Finder'
  | 'Focus / Protection'
  | 'FocusLock integration'
  | 'Login'
  | 'Settings';

export interface NexaScreenshot {
  id: string;
  title: string;
  category: Exclude<ScreenshotCategory, 'All'>;
  description: string;
  badge?: string;
  mockupType: 'assistant' | 'finance' | 'tools' | 'video' | 'object_finder' | 'focuslock' | 'settings' | 'voice' | 'security';
  order: number;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
}

export interface HelpArticle {
  id: string;
  section: 'general' | 'ai';
  category: string;
  title: string;
  summary: string;
  content: string[];
  androidSpecific: boolean;
  tags: string[];
}

export interface ServiceOffering {
  id: string;
  title: string;
  tagline: string;
  category: string;
  description: string;
  deliverables: string[];
  technologies: string[];
  icon: string;
}
