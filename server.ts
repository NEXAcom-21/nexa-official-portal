import express, { Request, Response, NextFunction } from 'express';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import dotenv from 'dotenv';
import multer from 'multer';
import child_process from 'child_process';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { NexaConfig, ContactEnquiry, NexaScreenshot, HelpArticle, ApkRelease, AuthUser, AppProduct } from './src/types';

dotenv.config();

const PORT = 3000;
const DATA_DIR = path.join(process.cwd(), 'data');
const DOWNLOADS_DIR = path.join(process.cwd(), 'public', 'downloads');
const APKS_STORAGE_DIR = path.join(process.cwd(), 'uploads', 'apks');
const APKS_ARCHIVE_DIR = path.join(APKS_STORAGE_DIR, 'archive');

if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(DOWNLOADS_DIR)) {
  fs.mkdirSync(DOWNLOADS_DIR, { recursive: true });
}
if (!fs.existsSync(APKS_STORAGE_DIR)) {
  fs.mkdirSync(APKS_STORAGE_DIR, { recursive: true });
}
if (!fs.existsSync(APKS_ARCHIVE_DIR)) {
  fs.mkdirSync(APKS_ARCHIVE_DIR, { recursive: true });
}

const CONFIG_FILE = path.join(DATA_DIR, 'config.json');
const ENQUIRIES_FILE = path.join(DATA_DIR, 'enquiries.json');
const SCREENSHOTS_FILE = path.join(DATA_DIR, 'screenshots.json');
const HELP_FILE = path.join(DATA_DIR, 'help.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const APKS_FILE = path.join(DATA_DIR, 'apks.json');
const PRODUCTS_FILE = path.join(DATA_DIR, 'products.json');
const ADMIN_SECURITY_FILE = path.join(DATA_DIR, 'admin-security.json');
const SESSIONS_FILE = path.join(DATA_DIR, 'sessions.json');

// Default remote configuration
const defaultConfig: NexaConfig = {
  appName: "NEXA",
  appNameShort: "NEXA",
  companyName: "NEXA.COM.IN 21",
  websiteVersion: "2.5.0",
  appLatestVersion: "v2.5",
  currentClientVersion: "v2.5",
  versionName: "NEXA 2.5",
  releaseDate: "September 19, 2026",
  releaseNotes: "NEXA v2.5 introduces the upgraded NEXA AI Assistant, enhanced Finance calculators, comprehensive productivity Tools, creative Video Generation, intelligent Object Finder, Focus/Protection security, and streamlined Settings.",
  whatIsNew: [
    "NEXA AI Assistant with responsive conversational intelligence and smart utilities",
    "Comprehensive Finance department with SIP, EMI, GST, and Compound Interest calculators",
    "Expanded NEXA Tools suite for everyday smartphone productivity",
    "AI Video Generation tools for prompt-to-video creative workflows",
    "Object Finder visual detection utility for quick object identification",
    "Focus and Device Protection controls for distraction-free sessions",
    "Clean, battery-efficient Settings interface with dark AMOLED styling"
  ],
  apkUrl: "/downloads/nexa-v2.5-release.apk",
  playStoreUrl: "https://play.google.com/store/apps/details?id=com.nexa.assistant",
  otherStoreUrl: "",
  minimumAndroidVersion: "Android 8.0 (Oreo, API level 26) or higher",
  fileSize: "31.4 MB",
  downloadEnabled: true,
  supportEmail: process.env.SUPPORT_EMAIL || "nexa.com.in21@gmail.com",
  maintenanceMode: false,
  announcement: "Official Release: NEXA v2.5 is now available. Experience intelligent AI assistance, Finance tools, and smart utilities.",
  websiteAnnouncement: "Official NEXA product, download, and support hub (nexa.com.in).",
  updateAvailable: true,
  showUpdateBanner: true,
  updateBannerMessage: "NEXA v2.5 is now available for download. Experience the next era of personal AI assistance.",
  updateBannerButtonText: "Get NEXA v2.5"
};

// Initial Seed Data for the 7 Official Showcase Features
const initialScreenshots: NexaScreenshot[] = [
  {
    id: "screen-1",
    title: "NEXA AI Assistant",
    category: "NEXA AI",
    description: "Clean, intelligent chat interface delivering multi-turn conversational assistance, draft generation, and instant guidance.",
    badge: "AI Core",
    mockupType: "assistant",
    order: 1
  },
  {
    id: "screen-2",
    title: "Finance Department & Calculators",
    category: "Finance",
    description: "Built-in financial calculators for Loan EMI, SIP projections, GST computations, and wealth growth schedules.",
    badge: "Finance Suite",
    mockupType: "finance",
    order: 2
  },
  {
    id: "screen-3",
    title: "NEXA Tools Suite",
    category: "Tools",
    description: "Smart everyday utilities tray for quick device controls, flashlight modes, audio profiles, and productivity helpers.",
    badge: "Smart Tools",
    mockupType: "tools",
    order: 3
  },
  {
    id: "screen-4",
    title: "AI Video Generation",
    category: "Video Generation",
    description: "Creative prompt-to-video workflow interface to craft dynamic video clips directly from simple text descriptions.",
    badge: "Creative AI",
    mockupType: "video",
    order: 4
  },
  {
    id: "screen-5",
    title: "Intelligent Object Finder",
    category: "Object Finder",
    description: "Camera-powered visual detection identifying objects, products, and scene elements in real time.",
    badge: "Vision AI",
    mockupType: "object_finder",
    order: 5
  },
  {
    id: "screen-6",
    title: "Focus & Device Protection",
    category: "Focus / Protection",
    description: "Distraction-free focus sessions with customizable timers, protected lockouts, and biometric security layers.",
    badge: "Protection",
    mockupType: "focuslock",
    order: 6
  },
  {
    id: "screen-7",
    title: "NEXA Settings & Customization",
    category: "Settings",
    description: "Clean customization console for theme appearance, battery optimization, notifications, and profile preferences.",
    badge: "Preferences",
    mockupType: "settings",
    order: 7
  }
];

const initialHelpArticles: HelpArticle[] = [
  {
    id: "help-1",
    section: "general",
    category: "Getting Started",
    title: "Getting Started with NEXA v2.5",
    summary: "Quick guide on downloading, installing, and initializing NEXA on your Android device.",
    content: [
      "1. Download the official NEXA v2.5 APK from nexa.com.in or the official app store link.",
      "2. Tap the downloaded APK file and allow installation from unknown sources if prompted.",
      "3. Launch NEXA and follow the welcome walkthrough to personalize your setup.",
      "4. Explore the 7 core departments: AI Assistant, Finance, Tools, Video Generation, Object Finder, Focus/Protection, and Settings."
    ],
    androidSpecific: true,
    tags: ["getting started", "installation", "setup", "v2.5"]
  },
  {
    id: "help-2",
    section: "ai",
    category: "NEXA AI",
    title: "Using the NEXA AI Assistant",
    summary: "How to ask questions, solve everyday problems, and interact with the conversational assistant.",
    content: [
      "1. Open the NEXA AI tab from the home screen.",
      "2. Type your question or prompt in the message bar and tap Send.",
      "3. NEXA AI can assist with drafting messages, summarizing topics, answering general knowledge, and guiding you through app utilities.",
      "4. You can also use 'Ask NEXA AI' directly here on our official website anytime."
    ],
    androidSpecific: false,
    tags: ["ai", "assistant", "chat", "prompts"]
  },
  {
    id: "help-3",
    section: "general",
    category: "Account",
    title: "Managing Your NEXA Profile and Settings",
    summary: "How to link your profile, back up local preferences, and configure account security.",
    content: [
      "1. Open Settings within the NEXA app.",
      "2. Navigate to Account & Profile to set your display name and sync preferences.",
      "3. Personal data stays stored securely on your device by default.",
      "4. For account recovery assistance, reach our team at nexa.com.in21@gmail.com."
    ],
    androidSpecific: true,
    tags: ["account", "profile", "security", "backup"]
  },
  {
    id: "help-4",
    section: "general",
    category: "Tools",
    title: "Everyday Productivity Tools Overview",
    summary: "How to use the built-in utilities in the NEXA Tools department.",
    content: [
      "1. Tap Tools on the bottom navigation bar.",
      "2. Access fast utilities including Flashlight strobe controls, Audio profile switcher, Unit Converters, and QR Code scanner.",
      "3. Tools operate quickly without requiring third-party bloatware."
    ],
    androidSpecific: true,
    tags: ["tools", "utilities", "productivity", "scanner"]
  },
  {
    id: "help-5",
    section: "general",
    category: "Finance",
    title: "Using the Finance & Wealth Calculators",
    summary: "Perform instant Loan EMI, SIP, GST, and Compound Interest calculations.",
    content: [
      "1. Select Finance from the main menu.",
      "2. Choose your calculator: Loan EMI, SIP Investment Planner, GST Tax, or Compound Interest.",
      "3. Enter loan or investment amounts, interest rates, and tenure.",
      "4. Calculations run locally on your device with visual breakdowns."
    ],
    androidSpecific: true,
    tags: ["finance", "emi", "sip", "gst", "calculator"]
  },
  {
    id: "help-6",
    section: "general",
    category: "Video Generation",
    title: "Creative Video Generation Guide",
    summary: "Creating dynamic short video clips using prompt-to-video creative workflows.",
    content: [
      "1. Tap Video Generation in the app menu.",
      "2. Enter a descriptive text prompt detailing the scene, style, and motion you want to create.",
      "3. Select aspect ratio and visual theme.",
      "4. Tap Generate to start processing your creative video clip."
    ],
    androidSpecific: true,
    tags: ["video generation", "ai video", "creativity", "motion"]
  },
  {
    id: "help-7",
    section: "general",
    category: "Object Finder",
    title: "Using the Intelligent Object Finder",
    summary: "Real-time visual recognition to identify objects, text, and elements through your camera.",
    content: [
      "1. Open Object Finder from the NEXA tool tray.",
      "2. Point your camera towards the object or scene you wish to identify.",
      "3. NEXA detects prominent items in real-time and provides contextual information.",
      "4. Camera permission is only used when the Object Finder screen is actively opened."
    ],
    androidSpecific: true,
    tags: ["object finder", "camera", "visual ai", "detection"]
  },
  {
    id: "help-8",
    section: "general",
    category: "Focus/Protection",
    title: "Focus Mode and Protection Setup",
    summary: "Configuring distraction-free focus sessions and protecting sensitive sections of the app.",
    content: [
      "1. Select Focus / Protection from the main dashboard.",
      "2. Set a focused work timer to minimize distractions during study or deep work.",
      "3. Configure local biometric (fingerprint / PIN) protection for sensitive app tools.",
      "4. Emergency calls and essential contacts remain accessible at all times."
    ],
    androidSpecific: true,
    tags: ["focus", "protection", "security", "biometrics"]
  },
  {
    id: "help-9",
    section: "general",
    category: "App Download",
    title: "Troubleshooting App Download and APK Installation",
    summary: "Resolving common download or Android package installation notices.",
    content: [
      "1. Verify you have at least 100 MB of free storage space before downloading.",
      "2. If Chrome displays 'File might be harmful', this is Android's standard prompt for manual APK downloads. Tap 'Download anyway'.",
      "3. If prompted with 'Install unknown apps', toggle 'Allow from this source' for your browser.",
      "4. Always verify you are downloading from the official domain: nexa.com.in."
    ],
    androidSpecific: true,
    tags: ["download", "apk", "install", "android"]
  },
  {
    id: "help-10",
    section: "general",
    category: "Updates",
    title: "Updating to the Latest Version (NEXA v2.5)",
    summary: "How to verify your current version and apply official updates.",
    content: [
      "1. Open Settings > About NEXA in your mobile app to view your current build number.",
      "2. Visit nexa.com.in/updates or check the in-app update banner.",
      "3. Download and install the new APK over your existing installation to preserve your settings.",
      "4. The current official release is NEXA v2.5."
    ],
    androidSpecific: true,
    tags: ["updates", "version", "v2.5", "changelog"]
  },
  {
    id: "help-11",
    section: "general",
    category: "Troubleshooting",
    title: "Common Issues and Contacting Support",
    summary: "Fast steps to resolve common questions and get in touch with the official NEXA team.",
    content: [
      "1. Restart the NEXA app if a tool feels slow or unresponsive.",
      "2. Clear the app cache under Android Settings > Apps > NEXA > Storage & cache.",
      "3. Use our interactive 'Ask NEXA AI' widget on this website for immediate answers.",
      "4. For personalized assistance, contact our official support email directly at nexa.com.in21@gmail.com."
    ],
    androidSpecific: false,
    tags: ["troubleshooting", "support", "email", "faq"]
  }
];

// Helper functions for persistent data
function readJsonFile<T>(filePath: string, fallback: T): T {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      return JSON.parse(data);
    }
  } catch (err) {
    console.error(`Error reading ${filePath}:`, err);
  }
  fs.writeFileSync(filePath, JSON.stringify(fallback, null, 2), 'utf-8');
  return fallback;
}

function writeJsonFile<T>(filePath: string, data: T): void {
  try {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
  } catch (err) {
    console.error(`Error writing ${filePath}:`, err);
  }
}

// Stored User & Session Types
interface StoredUser {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  salt: string;
  passwordHash: string;
  createdAt: string;
}

interface UserSession {
  userId: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: number;
}

// Password hashing & verification helpers
function hashPassword(password: string, salt: string): string {
  return crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');
}

function verifyPassword(password: string, salt: string, expectedHash: string): boolean {
  try {
    const hash = hashPassword(password, salt);
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(expectedHash, 'hex'));
  } catch {
    return false;
  }
}

// Session stores with persistent file backup to survive server/container restarts
const activeSessions = new Map<string, UserSession>();
const adminSessions = new Set<string>();

const OFFICIAL_ADMIN_EMAIL = 'nexa.com.in21@gmail.com';

// Load persisted sessions on startup
try {
  const storedSessions = readJsonFile<Record<string, UserSession>>(SESSIONS_FILE, {});
  for (const [token, sess] of Object.entries(storedSessions)) {
    activeSessions.set(token, sess);
    if (sess.role === 'admin' || sess.email.toLowerCase() === OFFICIAL_ADMIN_EMAIL.toLowerCase()) {
      adminSessions.add(token);
    }
  }
} catch (err) {
  console.warn('Could not initialize persisted sessions:', err);
}

function persistSession(token: string, session: UserSession) {
  activeSessions.set(token, session);
  if (session.role === 'admin' || session.email.toLowerCase() === OFFICIAL_ADMIN_EMAIL.toLowerCase()) {
    adminSessions.add(token);
  }
  try {
    const all: Record<string, UserSession> = {};
    for (const [t, s] of activeSessions.entries()) {
      all[t] = s;
    }
    writeJsonFile(SESSIONS_FILE, all);
  } catch (err) {
    console.warn('Could not persist session to file:', err);
  }
}

function destroySession(token: string) {
  activeSessions.delete(token);
  adminSessions.delete(token);
  try {
    const all: Record<string, UserSession> = {};
    for (const [t, s] of activeSessions.entries()) {
      all[t] = s;
    }
    writeJsonFile(SESSIONS_FILE, all);
  } catch (err) {
    console.warn('Could not destroy session from file:', err);
  }
}

// Utility to format byte sizes cleanly
function formatBytes(bytes: number, decimals = 2): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Comprehensive APK verification helper with Android Diagnostics
interface ApkVerificationDetails {
  isValid: boolean;
  sizeBytes: number;
  formattedSize: string;
  sha256: string;
  hasManifest: boolean;
  hasClassesDex: boolean;
  hasResourcesArsc: boolean;
  hasSigningCert: boolean;
  signingFiles: string[];
  packageId?: string;
  versionName?: string;
  versionCode?: string;
  minSdkVersion?: string;
  targetSdkVersion?: string;
  signingScheme?: string;
  entriesCount: number;
  entries: string[];
  error?: string;
}

async function verifyApkBinary(filePath: string): Promise<ApkVerificationDetails> {
  if (!fs.existsSync(filePath)) {
    return {
      isValid: false,
      sizeBytes: 0,
      formattedSize: '0 Bytes',
      sha256: '',
      hasManifest: false,
      hasClassesDex: false,
      hasResourcesArsc: false,
      hasSigningCert: false,
      signingFiles: [],
      entriesCount: 0,
      entries: [],
      error: 'Binary file does not exist on disk'
    };
  }

  const stat = fs.statSync(filePath);
  if (stat.size < 1024) {
    return {
      isValid: false,
      sizeBytes: stat.size,
      formattedSize: formatBytes(stat.size),
      sha256: '',
      hasManifest: false,
      hasClassesDex: false,
      hasResourcesArsc: false,
      hasSigningCert: false,
      signingFiles: [],
      entriesCount: 0,
      entries: [],
      error: `File size (${stat.size} bytes) is too small to be a genuine Android APK binary package.`
    };
  }

  // Open file to inspect ZIP header magic bytes (0x50 0x4B)
  const fd = fs.openSync(filePath, 'r');
  const magicBuf = Buffer.alloc(4);
  fs.readSync(fd, magicBuf, 0, 4, 0);

  if (magicBuf[0] !== 0x50 || magicBuf[1] !== 0x4b) {
    fs.closeSync(fd);
    return {
      isValid: false,
      sizeBytes: stat.size,
      formattedSize: formatBytes(stat.size),
      sha256: '',
      hasManifest: false,
      hasClassesDex: false,
      hasResourcesArsc: false,
      hasSigningCert: false,
      signingFiles: [],
      entriesCount: 0,
      entries: [],
      error: 'Validation failed: File is not a valid Android APK archive. Missing PK (ZIP) header magic bytes.'
    };
  }

  // Scan local file headers for entries (AndroidManifest.xml, classes.dex, etc.)
  const entries: string[] = [];
  let offset = 0;
  const headerBuf = Buffer.alloc(30);

  while (offset + 30 <= stat.size && entries.length < 500) {
    fs.readSync(fd, headerBuf, 0, 30, offset);
    if (headerBuf[0] === 0x50 && headerBuf[1] === 0x4b && headerBuf[2] === 0x03 && headerBuf[3] === 0x04) {
      const compSize = headerBuf.readUInt32LE(18);
      const fnLen = headerBuf.readUInt16LE(26);
      const extraLen = headerBuf.readUInt16LE(28);
      if (fnLen > 0 && offset + 30 + fnLen <= stat.size) {
        const fnBuf = Buffer.alloc(fnLen);
        fs.readSync(fd, fnBuf, 0, fnLen, offset + 30);
        const name = fnBuf.toString('utf8');
        entries.push(name);
      }
      offset += 30 + fnLen + extraLen + compSize;
    } else {
      break;
    }
  }
  fs.closeSync(fd);

  // Compute streaming cryptographic SHA-256
  const sha256 = await new Promise<string>((resolve, reject) => {
    const hash = crypto.createHash('sha256');
    const stream = fs.createReadStream(filePath);
    stream.on('data', chunk => hash.update(chunk));
    stream.on('end', () => resolve(hash.digest('hex')));
    stream.on('error', err => reject(err));
  });

  const hasManifest = entries.some(e => e.toLowerCase() === 'androidmanifest.xml');
  const hasClassesDex = entries.some(e => e.toLowerCase().includes('.dex'));
  const hasResourcesArsc = entries.some(e => e.toLowerCase() === 'resources.arsc');
  const signingFiles = entries.filter(e => e.startsWith('META-INF/') && (e.endsWith('.RSA') || e.endsWith('.DSA') || e.endsWith('.EC') || e.endsWith('.SF') || e.endsWith('MANIFEST.MF')));
  const hasSigningCert = signingFiles.some(e => e.endsWith('.RSA') || e.endsWith('.DSA') || e.endsWith('.EC'));

  let packageId = '';
  let versionName = '';
  let versionCode = '';
  let minSdkVersion = '';
  let targetSdkVersion = '';

  // Extract AndroidManifest.xml string tokens if manifest exists
  if (hasManifest) {
    try {
      const rawManifestBuf = child_process.execSync(`unzip -p "${filePath}" AndroidManifest.xml 2>/dev/null`, { timeout: 3000 });
      const manifestStr = rawManifestBuf.toString('latin1');
      const pkgMatch = manifestStr.match(/package=["']([^"']+)["']/i) || manifestStr.match(/package\s*=\s*([a-zA-Z0-9._]+)/);
      if (pkgMatch) packageId = pkgMatch[1];

      const vNameMatch = manifestStr.match(/versionName=["']([^"']+)["']/i);
      if (vNameMatch) versionName = vNameMatch[1];

      const vCodeMatch = manifestStr.match(/versionCode=["']([^"']+)["']/i);
      if (vCodeMatch) versionCode = vCodeMatch[1];

      const minSdkMatch = manifestStr.match(/minSdkVersion=["']?([0-9]+)["']?/i);
      if (minSdkMatch) minSdkVersion = `API ${minSdkMatch[1]}`;

      const targetSdkMatch = manifestStr.match(/targetSdkVersion=["']?([0-9]+)["']?/i);
      if (targetSdkMatch) targetSdkVersion = `API ${targetSdkMatch[1]}`;
    } catch {
      // Non-blocking fallback
    }
  }

  const signingScheme = hasSigningCert
    ? 'v1 (JAR) / v2 Signature'
    : signingFiles.length > 0 ? 'META-INF Manifest Verified' : 'Unsigned';

  return {
    isValid: true,
    sizeBytes: stat.size,
    formattedSize: formatBytes(stat.size),
    sha256,
    hasManifest,
    hasClassesDex,
    hasResourcesArsc,
    hasSigningCert,
    signingFiles,
    packageId: packageId || undefined,
    versionName: versionName || undefined,
    versionCode: versionCode || undefined,
    minSdkVersion: minSdkVersion || undefined,
    targetSdkVersion: targetSdkVersion || undefined,
    signingScheme,
    entriesCount: entries.length,
    entries
  };
}

// Multer storage for persistent binary APK uploads using safe temporary staging
const apkStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, APKS_STORAGE_DIR);
  },
  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const uniqueId = crypto.randomBytes(8).toString('hex');
    cb(null, `upload_${timestamp}_${uniqueId}.tmp`);
  }
});

const upload = multer({
  storage: apkStorage,
  limits: { fileSize: 250 * 1024 * 1024 }, // 250MB max APK size
  fileFilter: (req, file, cb) => {
    const isApkExt = file.originalname.toLowerCase().endsWith('.apk');
    if (!isApkExt) {
      return cb(new Error('Invalid file type. Only Android package (.apk) files are accepted.'));
    }
    cb(null, true);
  }
});

// Middleware for Authenticated User
function requireAuth(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  let token = '';
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.split(' ')[1];
  } else if (req.query.token && typeof req.query.token === 'string') {
    token = req.query.token;
  }

  if (!token) {
    return res.status(401).json({ error: 'Authentication required. Please sign in to access this feature.' });
  }

  const session = activeSessions.get(token);
  if (session) {
    (req as any).user = session;
    return next();
  }

  if (adminSessions.has(token)) {
    (req as any).user = {
      userId: 'user-admin-1',
      email: OFFICIAL_ADMIN_EMAIL,
      name: 'NEXA Official Admin',
      role: 'admin',
      createdAt: Date.now()
    };
    return next();
  }

  return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
}

// Middleware for Admin authentication
function requireAdmin(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    const user = (req as any).user;
    if (user && user.role === 'admin') {
      return next();
    }
    return res.status(403).json({ error: 'Access denied: Admin privileges required.' });
  });
}

// Lazy initialize GoogleGenAI SDK
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient && process.env.GEMINI_API_KEY) {
    aiClient = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  }
  return aiClient;
}

const NEXA_AI_SYSTEM_INSTRUCTION = `You are NEXA AI, the official intelligent assistant for NEXA (nexa.com.in).
Official NEXA Information & Knowledge Base:
- Brand: NEXA
- Official domain: nexa.com.in
- Current release: NEXA v2.5
- Official support email: nexa.com.in21@gmail.com
- Platform description: NEXA is an AI-powered Android platform bringing intelligent assistance, useful tools, productivity features and a growing collection of smart utilities into one seamless experience.
- Core Features & Departments:
  1. NEXA AI Assistant: Clean conversational interface for answers, writing, reasoning, and smart utilities.
  2. Finance: Built-in offline financial tools and calculators including Loan EMI, SIP projections, GST calculations, and compound wealth schedules.
  3. Tools: Clean everyday smartphone utilities including flashlight controls, audio profile switcher, unit converters, and QR code scanner.
  4. Video Generation: Creative prompt-to-video workflow interface to craft dynamic video clips directly from simple text descriptions.
  5. Object Finder: Camera-based visual recognition utility identifying real-world objects, products, and scene elements in real time.
  6. Focus / Protection: Distraction-free focus sessions with customizable timers, app protection, and biometric security layers.
  7. Settings: Customizable appearance themes (futuristic AMOLED dark), battery optimization, and notifications.
- Download information: The latest official version is NEXA v2.5, downloadable from nexa.com.in/download or official app store channels.
- Academic, Technical, & General Knowledge Answering:
  You must provide direct, accurate, and comprehensive answers to academic, scientific, professional, and general queries across all disciplines:
  - Biology (e.g., photosynthesis, cellular respiration, genetics, ecology, anatomy)
  - Physics (e.g., mechanics, thermodynamics, electromagnetism, quantum physics)
  - Chemistry (e.g., atomic structure, periodic trends, stoichiometry, organic reactions)
  - Mathematics (e.g., algebra, calculus, geometry, statistics, discrete math)
  - Commerce, Finance & Business (e.g., market economics, accounting, balance sheets, corporate finance)
  - Programming, Writing, & Software Development (e.g., algorithms, code debugging, TypeScript, Python, Kotlin, best practices)
  - General knowledge, history, geography, and current standards.
- Strict Rules:
  - Provide truthful, fact-based answers. Do not make up fake NEXA features or fake download links.
  - If a specific NEXA feature detail is unknown or unreleased, politely indicate that and direct the user to nexa.com.in21@gmail.com.`;

async function startServer() {
  const app = express();
  app.use(express.json());

  // Initialize data files
  let currentConfig = readJsonFile<NexaConfig>(CONFIG_FILE, defaultConfig);
  let currentScreenshots = readJsonFile<NexaScreenshot[]>(SCREENSHOTS_FILE, initialScreenshots);
  let currentHelpArticles = readJsonFile<HelpArticle[]>(HELP_FILE, initialHelpArticles);
  let currentEnquiries = readJsonFile<ContactEnquiry[]>(ENQUIRIES_FILE, []);
  let currentUsers = readJsonFile<StoredUser[]>(USERS_FILE, []);
  let currentApks = readJsonFile<ApkRelease[]>(APKS_FILE, []);
  let currentProducts = readJsonFile<AppProduct[]>(PRODUCTS_FILE, [
    {
      id: 'nexa',
      name: 'NEXA',
      displayName: 'NEXA AI & Tools Platform',
      description: 'Next-generation personal AI assistant with Hey NEXA voice activation, smart finance calculators, full productivity tools suite, and AMOLED settings.',
      category: 'Flagship Platform',
      icon: 'Bot',
      isMain: true,
      createdAt: '2026-09-19T12:00:00.000Z',
      updatedAt: new Date().toISOString()
    },
    {
      id: 'focuslock',
      name: 'FocusLock',
      displayName: 'FocusLock Companion',
      description: 'Distraction barrier, app protection, biometric locks, and deep focus sessions for smartphone mindfulness.',
      category: 'Security & Focus',
      icon: 'Shield',
      isMain: false,
      createdAt: '2026-09-19T12:00:00.000Z',
      updatedAt: new Date().toISOString()
    }
  ]);
  let adminSecurity = readJsonFile<{ configured: boolean; email: string; updatedAt: string }>(ADMIN_SECURITY_FILE, {
    configured: false,
    email: OFFICIAL_ADMIN_EMAIL,
    updatedAt: new Date().toISOString()
  });

  // Ensure Admin user placeholder exists in USERS_FILE
  let adminUser = currentUsers.find(u => u.email.toLowerCase() === OFFICIAL_ADMIN_EMAIL.toLowerCase());
  if (!adminUser) {
    adminUser = {
      id: 'user-admin-1',
      name: 'NEXA Official Admin',
      email: OFFICIAL_ADMIN_EMAIL,
      role: 'admin',
      salt: '',
      passwordHash: '',
      createdAt: new Date().toISOString()
    };
    currentUsers.push(adminUser);
    writeJsonFile(USERS_FILE, currentUsers);
    adminSecurity.configured = false;
    writeJsonFile(ADMIN_SECURITY_FILE, adminSecurity);
  } else if (!adminUser.passwordHash || !adminUser.salt) {
    adminSecurity.configured = false;
    writeJsonFile(ADMIN_SECURITY_FILE, adminSecurity);
  }

  // Ensure initial seed APK catalog is seeded in APKS_FILE
  if (!currentApks || currentApks.length === 0) {
    const seedNexaPath = path.join(APKS_STORAGE_DIR, 'NEXA-v2.5.apk');
    const seedNexaExists = fs.existsSync(seedNexaPath);
    const seedNexaSize = seedNexaExists ? fs.statSync(seedNexaPath).size : 0;

    currentApks = [
      {
        id: "apk-nexa-v2.5",
        productId: "nexa",
        productName: "NEXA",
        displayName: "NEXA v2.5",
        version: "2.5",
        versionName: "2.5",
        filename: "NEXA-v2.5.apk",
        originalFilename: "NEXA-v2.5-release.apk",
        storagePath: seedNexaExists ? "uploads/apks/NEXA-v2.5.apk" : "",
        fileSize: seedNexaExists ? (seedNexaSize / (1024 * 1024)).toFixed(2) + " MB" : "31.34 MB",
        fileSizeBytes: seedNexaSize,
        published: seedNexaExists,
        status: seedNexaExists ? "Published" : "Draft (Pending Upload)",
        releaseDate: "September 19, 2026",
        releaseNotes: "NEXA v2.5 introduces the upgraded NEXA AI Assistant, enhanced Finance calculators, comprehensive productivity Tools, creative Video Generation, intelligent Object Finder, Focus/Protection security, and streamlined AMOLED Settings.",
        minimumAndroidVersion: "Android 8.0+",
        packageId: "in.com.nexa.app",
        versionCode: "25",
        minSdkVersion: "API 26 (Android 8.0 Oreo)",
        targetSdkVersion: "API 34 (Android 14)",
        signingScheme: "v1 (JAR) / v2 Signature",
        isRealApk: seedNexaExists,
        downloadCount: 0,
        createdAt: "2026-09-19T12:00:00.000Z",
        updatedAt: new Date().toISOString()
      },
      {
        id: "apk-focuslock-v1.0",
        productId: "focuslock",
        productName: "FocusLock",
        displayName: "FocusLock v1.0",
        version: "1.0",
        filename: "FocusLock-v1.0.apk",
        storagePath: "",
        fileSize: "Pending Binary Upload",
        fileSizeBytes: 0,
        published: false,
        status: "Draft (Pending Upload)",
        releaseDate: "September 19, 2026",
        releaseNotes: "Digital distraction barrier with biometric app protection, deep focus sessions, and strict hardware enforcement.",
        minimumAndroidVersion: "Android 8.0+",
        isRealApk: false,
        downloadCount: 0,
        createdAt: "2026-09-19T12:00:00.000Z",
        updatedAt: new Date().toISOString()
      }
    ];
    writeJsonFile(APKS_FILE, currentApks);
  }

  // Physical integrity check: Ensure no release claims to be 'Published' without a physical binary
  let apksModified = false;
  currentApks.forEach(rel => {
    let candidate = rel.storagePath ? (path.isAbsolute(rel.storagePath) ? rel.storagePath : path.join(process.cwd(), rel.storagePath)) : '';
    if (!candidate || !fs.existsSync(candidate)) {
      const fallback = path.join(APKS_STORAGE_DIR, rel.filename);
      if (fs.existsSync(fallback)) {
        candidate = fallback;
        rel.storagePath = path.relative(process.cwd(), fallback);
        apksModified = true;
      }
    }
    const exists = Boolean(candidate && fs.existsSync(candidate) && fs.statSync(candidate).size > 1000);
    if (exists) {
      if (!rel.isRealApk) {
        rel.isRealApk = true;
        rel.fileSizeBytes = fs.statSync(candidate).size;
        apksModified = true;
      }
      if (!rel.status) {
        rel.status = rel.published ? 'Published' : 'Draft (Unpublished)';
        apksModified = true;
      }
    } else {
      if (rel.published || rel.isRealApk || rel.status === 'Published') {
        rel.published = false;
        rel.isRealApk = false;
        rel.status = 'Draft (Pending Upload)';
        apksModified = true;
      }
    }
  });
  if (apksModified) {
    writeJsonFile(APKS_FILE, currentApks);
  }

  // Intercept direct static download requests to prevent leaking placeholder files or bypassing auth
  app.get('/downloads/:filename', (req: Request, res: Response, next: NextFunction) => {
    const filename = req.params.filename;
    const isApk = filename.toLowerCase().endsWith('.apk');
    if (!isApk) {
      return next();
    }

    // Check if public download is disabled
    if (!currentConfig.publicDownload) {
      const authHeader = req.headers.authorization;
      let token = '';
      if (authHeader && authHeader.startsWith('Bearer ')) {
        token = authHeader.split(' ')[1];
      } else if (req.query.token && typeof req.query.token === 'string') {
        token = req.query.token;
      }
      if (!token || (!activeSessions.has(token) && !adminSessions.has(token))) {
        return res.status(401).json({ error: 'Authentication required to download APK. Please sign in to your NEXA account.' });
      }
    }

    // Check if physical file exists and is not a tiny placeholder
    const filePath = path.join(DOWNLOADS_DIR, filename);
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'APK not available yet. Please check back after the Admin publishes a release.', available: false });
    }
    const stat = fs.statSync(filePath);
    if (stat.size < 1000) {
      return res.status(404).json({ error: 'APK not available yet. Please check back after the Admin publishes a release.', available: false });
    }

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.setHeader('Content-Length', stat.size);
    fs.createReadStream(filePath).pipe(res);
  });

  // Sync configured support email from process.env if present
  if (process.env.SUPPORT_EMAIL && currentConfig.supportEmail !== process.env.SUPPORT_EMAIL) {
    currentConfig.supportEmail = process.env.SUPPORT_EMAIL;
    writeJsonFile(CONFIG_FILE, currentConfig);
  }

  // API: Health Check
  app.get('/api/health', (req: Request, res: Response) => {
    res.json({
      status: 'ok',
      service: 'NEXA Official Website Backend',
      version: currentConfig.websiteVersion,
      appVersion: currentConfig.appLatestVersion,
      timestamp: new Date().toISOString()
    });
  });

  // API: Public Remote Configuration
  app.get('/api/config', (req: Request, res: Response) => {
    res.json({
      appName: currentConfig.appName || "NEXA",
      appNameShort: currentConfig.appNameShort || "NEXA",
      companyName: currentConfig.companyName || "NEXA.COM.IN 21",
      ...currentConfig
    });
  });

  // API: Public Screenshots
  app.get('/api/screenshots', (req: Request, res: Response) => {
    res.json(currentScreenshots);
  });

  // API: Public Help Articles
  app.get('/api/help-articles', (req: Request, res: Response) => {
    const section = req.query.section as string | undefined;
    if (section) {
      return res.json(currentHelpArticles.filter(a => a.section === section));
    }
    res.json(currentHelpArticles);
  });

  // API: Public Contact Form Submission
  app.post('/api/contact', (req: Request, res: Response) => {
    const { name, email, category, serviceType, subject, message } = req.body;

    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please provide a valid name (at least 2 characters).' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!category || typeof category !== 'string') {
      return res.status(400).json({ error: 'Please select an enquiry category.' });
    }
    if (!subject || typeof subject !== 'string' || subject.trim().length < 3) {
      return res.status(400).json({ error: 'Please enter a clear subject.' });
    }
    if (!message || typeof message !== 'string' || message.trim().length < 10) {
      return res.status(400).json({ error: 'Please enter your message (at least 10 characters).' });
    }

    const newEnquiry: ContactEnquiry = {
      id: 'enq-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      name: name.trim(),
      email: email.trim().toLowerCase(),
      category: category as any,
      serviceType: serviceType ? String(serviceType).trim() : undefined,
      subject: subject.trim(),
      message: message.trim(),
      createdAt: new Date().toISOString(),
      status: 'unread'
    };

    currentEnquiries.unshift(newEnquiry);
    writeJsonFile(ENQUIRIES_FILE, currentEnquiries);

    res.status(201).json({
      success: true,
      message: 'Thank you. Your enquiry has been received by the official NEXA team.',
      enquiryId: newEnquiry.id
    });
  });

  // ================= AI AGENT ROUTE ================= //
  app.post('/api/ai/chat', async (req: Request, res: Response) => {
    try {
      const { message, history } = req.body;
      if (!message || typeof message !== 'string' || !message.trim()) {
        return res.status(400).json({ error: 'Message cannot be empty.' });
      }

      const userQuery = message.trim();
      const ai = getGenAI();

      if (!ai) {
        return res.status(503).json({
          error: 'AI service is not configured. GEMINI_API_KEY environment variable is required on the backend.',
          configured: false
        });
      }

      const formattedContents: any[] = [];
      if (Array.isArray(history)) {
        for (const item of history.slice(-10)) {
          if (item && (item.role === 'user' || item.role === 'model') && typeof item.text === 'string' && item.text.trim()) {
            formattedContents.push({
              role: item.role,
              parts: [{ text: item.text.trim() }]
            });
          }
        }
      }
      formattedContents.push({
        role: 'user',
        parts: [{ text: userQuery }]
      });

      try {
        let replyText = "";
        let usedModel = "gemini-3.8-flash";
        try {
          const response = await ai.models.generateContent({
            model: 'gemini-3.8-flash',
            contents: formattedContents,
            config: {
              systemInstruction: NEXA_AI_SYSTEM_INSTRUCTION,
              temperature: 0.7,
            }
          });
          replyText = response.text || "";
        } catch (firstErr: any) {
          console.warn('Primary model gemini-3.8-flash busy/failed, trying gemini-3.6-flash:', firstErr.message);
          const fallbackRes = await ai.models.generateContent({
            model: 'gemini-3.6-flash',
            contents: formattedContents,
            config: {
              systemInstruction: NEXA_AI_SYSTEM_INSTRUCTION,
              temperature: 0.7,
            }
          });
          replyText = fallbackRes.text || "";
          usedModel = "gemini-3.6-flash";
        }

        if (!replyText.trim()) {
          return res.status(500).json({
            error: 'AI returned an empty response. Please try rephrasing your question.',
            configured: true
          });
        }

        return res.json({
          reply: replyText,
          model: usedModel,
          configured: true,
          success: true
        });
      } catch (apiErr: any) {
        console.error('Gemini API call failed:', apiErr);
        const errMsg = apiErr.message || 'Unknown neural model error';
        return res.status(502).json({
          error: `AI service error: ${errMsg}`,
          configured: true,
          details: errMsg
        });
      }
    } catch (err: any) {
      console.error('Error in /api/ai/chat handler:', err);
      return res.status(500).json({
        error: 'Internal server error while processing AI request.',
        details: err.message
      });
    }
  });

  // Image Generation Endpoint (Defensive check for real provider / billing)
  app.post('/api/ai/generate-image', async (req: Request, res: Response) => {
    try {
      const { prompt } = req.body;
      if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
        return res.status(400).json({ error: 'Prompt is required for image generation.' });
      }

      const ai = getGenAI();
      if (!ai) {
        return res.status(503).json({
          success: false,
          configured: false,
          error: 'Image generation is not configured yet. An active image-generation provider or billing-enabled Gemini project is required.'
        });
      }

      // Attempt supported Gemini image model using official generateImages API
      try {
        const response = await ai.models.generateImages({
          model: 'imagen-3.0-generate-002',
          prompt: prompt.trim(),
          config: {
            numberOfImages: 1,
            outputMimeType: 'image/jpeg'
          }
        });

        const imageBytes = response.generatedImages?.[0]?.image?.imageBytes;
        if (imageBytes) {
          return res.json({
            success: true,
            configured: true,
            imageUrl: `data:image/jpeg;base64,${imageBytes}`
          });
        }

        return res.status(503).json({
          success: false,
          configured: false,
          error: 'Image generation provider returned empty output. Imagen model configuration required.'
        });
      } catch (genErr: any) {
        console.warn('Image generation provider check:', genErr.message);
        return res.status(503).json({
          success: false,
          configured: false,
          error: 'Image generation requires configuration: ' + (genErr.message?.includes('quota') || genErr.message?.includes('billing') ? 'Active billing tier or image generation quota is required.' : (genErr.message || 'No active image provider configured.'))
        });
      }
    } catch (err: any) {
      return res.status(500).json({
        success: false,
        configured: false,
        error: 'Failed to process image generation request.'
      });
    }
  });

  // Video Generation Endpoint
  app.post('/api/ai/video/generate', (req: Request, res: Response) => {
    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt is required for video generation.' });
    }

    // Honest verification: Veo video generation requires paid asynchronous job queue & video model provider
    return res.status(503).json({
      success: false,
      configured: false,
      error: 'Video generation requires configuration. A video generation provider (such as Veo API with active billing credentials) is required on the backend.'
    });
  });

  app.get('/api/ai/video/status/:jobId', (req: Request, res: Response) => {
    return res.status(503).json({
      success: false,
      configured: false,
      error: 'Video generation is not configured yet. No active job processor.'
    });
  });

  // ================= ADMIN ROUTES ================= //

  // Admin Setup Status Check
  app.get('/api/admin/setup-status', (req: Request, res: Response) => {
    const adminAccount = currentUsers.find(u => u.email.toLowerCase() === OFFICIAL_ADMIN_EMAIL.toLowerCase());
    const isConfigured = Boolean(adminSecurity.configured && adminAccount && adminAccount.passwordHash && adminAccount.salt);
    res.json({
      configured: isConfigured,
      adminEmail: OFFICIAL_ADMIN_EMAIL,
      canReset: true
    });
  });

  // Admin Setup New Password (Secure First-Time or Requested Setup)
  app.post('/api/admin/setup-password', (req: Request, res: Response) => {
    const { email, newPassword, confirmPassword } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Admin email is required.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    if (normalizedEmail !== OFFICIAL_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        error: `Administrator password setup is strictly reserved for ${OFFICIAL_ADMIN_EMAIL}.`
      });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({
        error: 'Password must be at least 8 characters long for administrative security.'
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        error: 'Passwords do not match. Please re-enter identical passwords.'
      });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(newPassword, salt);

    let adminAccount = currentUsers.find(u => u.email.toLowerCase() === OFFICIAL_ADMIN_EMAIL.toLowerCase());
    if (adminAccount) {
      adminAccount.salt = salt;
      adminAccount.passwordHash = passwordHash;
      adminAccount.role = 'admin';
    } else {
      adminAccount = {
        id: 'user-admin-1',
        name: 'NEXA Official Admin',
        email: OFFICIAL_ADMIN_EMAIL,
        role: 'admin',
        salt,
        passwordHash,
        createdAt: new Date().toISOString()
      };
      currentUsers.push(adminAccount);
    }
    writeJsonFile(USERS_FILE, currentUsers);

    adminSecurity.configured = true;
    adminSecurity.updatedAt = new Date().toISOString();
    writeJsonFile(ADMIN_SECURITY_FILE, adminSecurity);

    // Automatically authenticate the administrator into an active session
    const token = crypto.randomBytes(32).toString('hex');
    const session: UserSession = {
      userId: adminAccount.id,
      email: adminAccount.email,
      name: adminAccount.name,
      role: 'admin',
      createdAt: Date.now()
    };
    persistSession(token, session);

    return res.json({
      success: true,
      token,
      user: {
        id: adminAccount.id,
        name: adminAccount.name,
        email: adminAccount.email,
        role: 'admin'
      },
      message: 'New Administrator password configured successfully. Session authenticated.'
    });
  });

  // Admin Request Password Reset (Allows switching back to setup mode)
  app.post('/api/admin/reset-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || String(email).trim().toLowerCase() !== OFFICIAL_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({ error: `Only ${OFFICIAL_ADMIN_EMAIL} can request an administrator password reset.` });
    }

    adminSecurity.configured = false;
    adminSecurity.updatedAt = new Date().toISOString();
    writeJsonFile(ADMIN_SECURITY_FILE, adminSecurity);

    return res.json({
      success: true,
      message: 'Admin password reset mode enabled. You can now configure your new password securely.'
    });
  });

  // Authenticated Admin Change Password
  app.post('/api/admin/change-password', requireAdmin, (req: Request, res: Response) => {
    const { currentPassword, newPassword, confirmPassword } = req.body;
    const adminAccount = currentUsers.find(u => u.email.toLowerCase() === OFFICIAL_ADMIN_EMAIL.toLowerCase());
    if (!adminAccount || !adminAccount.passwordHash || !adminAccount.salt) {
      return res.status(400).json({ error: 'Administrator credentials not found.' });
    }

    if (!currentPassword || !verifyPassword(currentPassword, adminAccount.salt, adminAccount.passwordHash)) {
      return res.status(401).json({ error: 'Current password is incorrect.' });
    }

    if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 8) {
      return res.status(400).json({ error: 'New password must be at least 8 characters long.' });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({ error: 'New passwords do not match.' });
    }

    const newSalt = crypto.randomBytes(16).toString('hex');
    const newHash = hashPassword(newPassword, newSalt);
    adminAccount.salt = newSalt;
    adminAccount.passwordHash = newHash;
    writeJsonFile(USERS_FILE, currentUsers);

    adminSecurity.configured = true;
    adminSecurity.updatedAt = new Date().toISOString();
    writeJsonFile(ADMIN_SECURITY_FILE, adminSecurity);

    return res.json({ success: true, message: 'Administrator password updated successfully.' });
  });

  // Admin Login (Strict Email & Password, No Secret Key)
  app.post('/api/admin/login', (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Both Administrator email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    if (normalizedEmail !== OFFICIAL_ADMIN_EMAIL.toLowerCase()) {
      return res.status(403).json({
        error: 'Access denied: Provided email address is not an authorized NEXA administrator.'
      });
    }

    const adminAccount = currentUsers.find(u => u.email.toLowerCase() === OFFICIAL_ADMIN_EMAIL.toLowerCase());
    if (!adminAccount || !adminAccount.passwordHash || !adminAccount.salt || !adminSecurity.configured) {
      return res.status(400).json({
        error: 'Administrator password has not been configured yet. Please use the Setup flow to set a new password.',
        needsSetup: true
      });
    }

    const isPasswordValid = verifyPassword(password, adminAccount.salt, adminAccount.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        error: 'Incorrect administrator password. If you forgot your password, please click "Reset / Set New Password".'
      });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const session: UserSession = {
      userId: adminAccount.id,
      email: adminAccount.email,
      name: adminAccount.name,
      role: 'admin',
      createdAt: Date.now()
    };
    persistSession(token, session);

    return res.json({
      success: true,
      token,
      role: 'admin',
      user: {
        id: adminAccount.id,
        name: adminAccount.name,
        email: adminAccount.email,
        role: 'admin'
      },
      message: 'Admin authorization granted successfully.'
    });
  });

  // Admin Logout
  app.post('/api/admin/logout', requireAdmin, (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    if (authHeader) {
      const token = authHeader.split(' ')[1];
      destroySession(token);
    }
    res.json({ success: true, message: 'Logged out successfully' });
  });

  // Admin Upload APK
  app.post('/api/admin/upload-apk', requireAdmin, upload.single('apk'), (req: Request, res: Response) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: 'No APK file uploaded. Please select a valid .apk file.' });
      }

      const filename = req.file.filename;
      const downloadPath = `/downloads/${filename}`;
      const sizeMB = `${(req.file.size / (1024 * 1024)).toFixed(1)} MB`;

      currentConfig.apkUrl = downloadPath;
      currentConfig.fileSize = sizeMB;
      if (req.body.version) {
        currentConfig.appLatestVersion = String(req.body.version).trim();
      }
      if (req.body.releaseDate) {
        currentConfig.releaseDate = String(req.body.releaseDate).trim();
      }
      if (req.body.releaseNotes) {
        currentConfig.releaseNotes = String(req.body.releaseNotes).trim();
      }
      if (req.body.publish === 'true' || req.body.publish === true) {
        currentConfig.downloadEnabled = true;
      }

      writeJsonFile(CONFIG_FILE, currentConfig);

      res.json({
        success: true,
        message: `APK uploaded successfully: ${filename}`,
        apkUrl: downloadPath,
        fileSize: sizeMB,
        config: currentConfig
      });
    } catch (err: any) {
      console.error('Error uploading APK:', err);
      res.status(500).json({ error: 'Failed to save uploaded APK file.', details: err.message });
    }
  });

  // Admin Get Config
  app.get('/api/admin/config', requireAdmin, (req: Request, res: Response) => {
    res.json(currentConfig);
  });

  // Admin Update Config (supports PUT and POST)
  const handleUpdateConfig = (req: Request, res: Response) => {
    const updates = req.body;
    if (!updates || typeof updates !== 'object') {
      return res.status(400).json({ error: 'Invalid configuration payload' });
    }

    currentConfig = {
      ...currentConfig,
      ...updates,
      whatIsNew: Array.isArray(updates.whatIsNew) ? updates.whatIsNew : currentConfig.whatIsNew
    };

    writeJsonFile(CONFIG_FILE, currentConfig);
    res.json({
      success: true,
      message: 'Configuration successfully updated and published.',
      config: currentConfig
    });
  };
  app.put('/api/admin/config', requireAdmin, handleUpdateConfig);
  app.post('/api/admin/config', requireAdmin, handleUpdateConfig);

  // Admin Get Enquiries
  app.get('/api/admin/enquiries', requireAdmin, (req: Request, res: Response) => {
    res.json(currentEnquiries);
  });

  // Admin Update Enquiry Status
  app.patch('/api/admin/enquiries/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const { status } = req.body;

    const enquiry = currentEnquiries.find(e => e.id === id);
    if (!enquiry) {
      return res.status(404).json({ error: 'Enquiry not found' });
    }

    if (status && ['unread', 'reviewed', 'resolved', 'new', 'in_review'].includes(status)) {
      enquiry.status = status;
      writeJsonFile(ENQUIRIES_FILE, currentEnquiries);
      return res.json({ success: true, enquiry });
    }

    res.status(400).json({ error: 'Invalid status' });
  });

  // Admin Manage Screenshots
  app.post('/api/admin/screenshots', requireAdmin, (req: Request, res: Response) => {
    const { title, category, description, badge, mockupType } = req.body;
    if (!title || !category || !description) {
      return res.status(400).json({ error: 'Title, category, and description are required.' });
    }
    const newScreenshot: NexaScreenshot = {
      id: 'screen-' + Date.now(),
      title: title.trim(),
      category: category.trim() as any,
      description: description.trim(),
      badge: badge ? badge.trim() : undefined,
      mockupType: mockupType || 'assistant',
      order: currentScreenshots.length + 1
    };
    currentScreenshots.push(newScreenshot);
    writeJsonFile(SCREENSHOTS_FILE, currentScreenshots);
    res.status(201).json({ success: true, screenshot: newScreenshot });
  });

  app.delete('/api/admin/screenshots/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = currentScreenshots.length;
    currentScreenshots = currentScreenshots.filter(s => s.id !== id);
    if (currentScreenshots.length === initialLen) {
      return res.status(404).json({ error: 'Screenshot not found' });
    }
    writeJsonFile(SCREENSHOTS_FILE, currentScreenshots);
    res.json({ success: true, message: 'Screenshot deleted' });
  });

  // Admin Manage Help Articles
  app.post('/api/admin/help-articles', requireAdmin, (req: Request, res: Response) => {
    const { title, category, summary, content, section, androidSpecific, tags } = req.body;
    if (!title || !category || !summary || !content) {
      return res.status(400).json({ error: 'Missing required article fields' });
    }
    const newArticle: HelpArticle = {
      id: 'help-' + Date.now(),
      section: section || 'general',
      category: category.trim(),
      title: title.trim(),
      summary: summary.trim(),
      content: Array.isArray(content) ? content : [String(content)],
      androidSpecific: Boolean(androidSpecific),
      tags: Array.isArray(tags) ? tags : []
    };
    currentHelpArticles.push(newArticle);
    writeJsonFile(HELP_FILE, currentHelpArticles);
    res.status(201).json({ success: true, article: newArticle });
  });

  app.delete('/api/admin/help-articles/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = currentHelpArticles.length;
    currentHelpArticles = currentHelpArticles.filter(a => a.id !== id);
    if (currentHelpArticles.length === initialLen) {
      return res.status(404).json({ error: 'Article not found' });
    }
    writeJsonFile(HELP_FILE, currentHelpArticles);
    res.json({ success: true, message: 'Article deleted' });
  });

  // ================= SECURE AUTHENTICATION SYSTEM ================= //
  app.post('/api/auth/register', (req: Request, res: Response) => {
    const { name, email, password } = req.body;
    if (!name || typeof name !== 'string' || name.trim().length < 2) {
      return res.status(400).json({ error: 'Please enter a valid full name (at least 2 characters).' });
    }
    if (!email || typeof email !== 'string' || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters.' });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const existingUser = currentUsers.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existingUser) {
      return res.status(400).json({ error: 'An account with this email already exists. Please sign in.' });
    }

    const salt = crypto.randomBytes(16).toString('hex');
    const passwordHash = hashPassword(password, salt);
    const role: 'user' | 'admin' = normalizedEmail === OFFICIAL_ADMIN_EMAIL.toLowerCase() ? 'admin' : 'user';

    const newUser: StoredUser = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      email: normalizedEmail,
      role,
      salt,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    currentUsers.push(newUser);
    writeJsonFile(USERS_FILE, currentUsers);

    const token = crypto.randomBytes(32).toString('hex');
    const session: UserSession = {
      userId: newUser.id,
      email: newUser.email,
      name: newUser.name,
      role: newUser.role,
      createdAt: Date.now()
    };
    persistSession(token, session);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      message: 'Account created and authenticated successfully.'
    });
  });

  app.post('/api/auth/login', (req: Request, res: Response) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const normalizedEmail = String(email).trim().toLowerCase();
    const user = currentUsers.find(u => u.email.toLowerCase() === normalizedEmail);

    if (!user || !user.passwordHash || !user.salt) {
      if (normalizedEmail === OFFICIAL_ADMIN_EMAIL.toLowerCase()) {
        return res.status(400).json({
          error: 'Administrator password has not been configured yet. Please complete the Admin Password Setup.',
          needsSetup: true
        });
      }
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isPasswordOk = verifyPassword(password, user.salt, user.passwordHash);
    if (!isPasswordOk) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const session: UserSession = {
      userId: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      createdAt: Date.now()
    };
    persistSession(token, session);

    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      },
      message: 'Signed in successfully.'
    });
  });

  app.get('/api/auth/me', requireAuth, (req: Request, res: Response) => {
    const session = (req as any).user as UserSession;
    res.json({
      authenticated: true,
      user: {
        id: session.userId,
        name: session.name,
        email: session.email,
        role: session.role
      }
    });
  });

  app.post('/api/auth/logout', requireAuth, (req: Request, res: Response) => {
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query.token && typeof req.query.token === 'string') {
      token = req.query.token;
    }

    if (token) {
      destroySession(token);
    }

    res.json({ success: true, message: 'Logged out successfully.' });
  });

  app.post('/api/auth/forgot-password', (req: Request, res: Response) => {
    const { email } = req.body;
    if (!email || typeof email !== 'string') {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    res.json({
      success: true,
      message: 'Password reset request recorded. For security verification, please contact NEXA Official Support at nexa.com.in21@gmail.com.'
    });
  });

  // ================= PRODUCTS & MULTIPLE APPS CATALOG ================= //
  // Public list of apps/products with their latest published release
  app.get('/api/products', (req: Request, res: Response) => {
    const productsWithStats = currentProducts.map(prod => {
      const prodReleases = currentApks.filter(a => a.productId.toLowerCase() === prod.id.toLowerCase());
      const publishedReleases = prodReleases.filter(a => a.published && a.isRealApk);
      const latestPublished = publishedReleases[publishedReleases.length - 1] || null;
      const totalDownloads = prodReleases.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
      return {
        ...prod,
        latestRelease: latestPublished,
        publishedCount: publishedReleases.length,
        totalReleases: prodReleases.length,
        totalDownloads
      };
    });
    res.json(productsWithStats);
  });

  // Admin: Get all products with full release catalog and stats
  app.get('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
    const productsWithStats = currentProducts.map(prod => {
      const prodReleases = currentApks.filter(a => a.productId.toLowerCase() === prod.id.toLowerCase());
      const publishedReleases = prodReleases.filter(a => a.published && a.isRealApk);
      const latestPublished = publishedReleases[publishedReleases.length - 1] || null;
      const totalDownloads = prodReleases.reduce((sum, r) => sum + (r.downloadCount || 0), 0);
      return {
        ...prod,
        releases: prodReleases,
        latestRelease: latestPublished,
        publishedCount: publishedReleases.length,
        totalReleases: prodReleases.length,
        totalDownloads
      };
    });
    res.json(productsWithStats);
  });

  // Admin: Create new product / app
  app.post('/api/admin/products', requireAdmin, (req: Request, res: Response) => {
    const { name, displayName, description, category, icon, id } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      return res.status(400).json({ error: 'App / Product name is required.' });
    }
    const cleanName = name.trim();
    const slug = (id || cleanName).toLowerCase().replace(/[^a-z0-9_-]/g, '-').replace(/^-+|-+$/g, '') || `app-${Date.now()}`;
    
    if (currentProducts.some(p => p.id === slug)) {
      return res.status(400).json({ error: `An app with identifier "${slug}" already exists.` });
    }

    const newProduct: AppProduct = {
      id: slug,
      name: cleanName,
      displayName: (displayName && displayName.trim()) || `${cleanName}`,
      description: (description && description.trim()) || `${cleanName} mobile application.`,
      category: (category && category.trim()) || 'Application',
      icon: (icon && icon.trim()) || 'Layers',
      isMain: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    currentProducts.push(newProduct);
    writeJsonFile(PRODUCTS_FILE, currentProducts);
    res.status(201).json({ success: true, product: newProduct });
  });

  // Admin: Update product / app metadata
  app.put('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const targetId = req.params.id.toLowerCase();
    const product = currentProducts.find(p => p.id.toLowerCase() === targetId);
    if (!product) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    const { name, displayName, description, category, icon } = req.body;
    if (name && typeof name === 'string' && name.trim()) {
      product.name = name.trim();
    }
    if (displayName !== undefined) product.displayName = String(displayName).trim();
    if (description !== undefined) product.description = String(description).trim();
    if (category !== undefined) product.category = String(category).trim();
    if (icon !== undefined) product.icon = String(icon).trim();
    product.updatedAt = new Date().toISOString();

    writeJsonFile(PRODUCTS_FILE, currentProducts);
    res.json({ success: true, product });
  });

  // Admin: Delete product / app
  app.delete('/api/admin/products/:id', requireAdmin, (req: Request, res: Response) => {
    const targetId = req.params.id.toLowerCase();
    if (targetId === 'nexa') {
      return res.status(400).json({ error: 'Cannot delete the flagship NEXA core product.' });
    }
    const initialLen = currentProducts.length;
    currentProducts = currentProducts.filter(p => p.id.toLowerCase() !== targetId);
    if (currentProducts.length === initialLen) {
      return res.status(404).json({ error: 'Product not found.' });
    }
    writeJsonFile(PRODUCTS_FILE, currentProducts);
    res.json({ success: true, message: `Product "${targetId}" removed.` });
  });

  // ================= APK CATALOG & MANAGEMENT ================= //
  // Public list of published APK releases
  app.get('/api/apks', (req: Request, res: Response) => {
    const published = currentApks.filter(a => a.published && a.isRealApk);
    res.json(published);
  });

  // Admin: Get all APK releases
  app.get('/api/admin/apks', requireAdmin, (req: Request, res: Response) => {
    res.json(currentApks);
  });

  // Admin: Add new APK release metadata
  app.post('/api/admin/apks', requireAdmin, (req: Request, res: Response) => {
    const { productId, productName, version, displayName, releaseNotes, minimumAndroidVersion, published, releaseDate } = req.body;
    if (!productName || !version) {
      return res.status(400).json({ error: 'Product name and version are required.' });
    }

    const prodId = (productId || productName).toLowerCase().replace(/[^a-z0-9_-]/g, '-');
    const newRelease: ApkRelease = {
      id: 'apk-' + prodId + '-v' + String(version).replace(/[^a-zA-Z0-9.-]/g, '') + '-' + Date.now(),
      productId: prodId,
      productName: productName.trim(),
      displayName: displayName ? displayName.trim() : `${productName} v${version}`,
      version: String(version).trim(),
      filename: `${productName}-v${version}.apk`,
      storagePath: '',
      fileSize: 'Pending Binary Upload',
      fileSizeBytes: 0,
      published: false,
      status: 'Pending Binary Upload',
      releaseDate: releaseDate ? String(releaseDate).trim() : new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
      releaseNotes: releaseNotes ? String(releaseNotes).trim() : 'Initial release.',
      minimumAndroidVersion: minimumAndroidVersion ? String(minimumAndroidVersion).trim() : 'Android 8.0+',
      isRealApk: false,
      downloadCount: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    currentApks.push(newRelease);
    writeJsonFile(APKS_FILE, currentApks);
    res.status(201).json({ success: true, release: newRelease });
  });

  // Admin: Update APK release
  app.put('/api/admin/apks/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const release = currentApks.find(a => a.id === id);
    if (!release) {
      return res.status(404).json({ error: 'APK release not found.' });
    }

    const updates = req.body;
    if (updates.displayName !== undefined) release.displayName = String(updates.displayName).trim();
    if (updates.version !== undefined) release.version = String(updates.version).trim();
    if (updates.versionName !== undefined) release.versionName = String(updates.versionName).trim();
    if (updates.releaseNotes !== undefined) release.releaseNotes = String(updates.releaseNotes).trim();
    if (updates.releaseDate !== undefined) release.releaseDate = String(updates.releaseDate).trim();
    if (updates.minimumAndroidVersion !== undefined) release.minimumAndroidVersion = String(updates.minimumAndroidVersion).trim();
    
    if (updates.published !== undefined) {
      const targetPublished = Boolean(updates.published);
      if (targetPublished) {
        const physicalExists = release.storagePath && fs.existsSync(release.storagePath);
        if (!physicalExists || !release.isRealApk) {
          return res.status(400).json({
            error: 'Cannot publish release: Real APK binary file does not exist in persistent storage. Upload the authentic .apk binary first.',
            cannotPublish: true
          });
        }
      }
      release.published = targetPublished;
      release.status = targetPublished ? 'Published' : 'Draft (Unpublished)';
    }

    release.updatedAt = new Date().toISOString();

    // If updating a published NEXA release, sync with currentConfig
    if (release.productId.toLowerCase() === 'nexa' && release.published) {
      currentConfig.appLatestVersion = 'v' + release.version.replace(/^v/, '');
      currentConfig.releaseDate = release.releaseDate;
      currentConfig.releaseNotes = release.releaseNotes;
      if (release.minimumAndroidVersion) {
        currentConfig.minimumAndroidVersion = release.minimumAndroidVersion;
      }
      writeJsonFile(CONFIG_FILE, currentConfig);
    }

    writeJsonFile(APKS_FILE, currentApks);
    res.json({ success: true, release });
  });

  // Admin: Quick toggle publish status for APK release
  app.patch('/api/admin/apks/:id/publish', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const release = currentApks.find(a => a.id === id);
    if (!release) {
      return res.status(404).json({ error: 'APK release not found.' });
    }

    const { published } = req.body;
    const targetPublished = published !== undefined ? Boolean(published) : !release.published;

    if (targetPublished) {
      const physicalExists = release.storagePath && fs.existsSync(release.storagePath);
      if (!physicalExists || !release.isRealApk) {
        return res.status(400).json({
          error: 'Cannot publish release: Real APK binary file does not exist in persistent storage. Upload the authentic .apk binary first.',
          cannotPublish: true
        });
      }
    }

    release.published = targetPublished;
    release.status = targetPublished ? 'Published' : 'Draft (Unpublished)';
    release.updatedAt = new Date().toISOString();

    // If publishing NEXA, keep currentConfig in sync with latest published version
    if (release.productId.toLowerCase() === 'nexa' && release.published) {
      currentConfig.appLatestVersion = 'v' + release.version.replace(/^v/, '');
      if (release.releaseDate) currentConfig.releaseDate = release.releaseDate;
      if (release.releaseNotes) currentConfig.releaseNotes = release.releaseNotes;
      if (release.fileSize) currentConfig.fileSize = release.fileSize;
      writeJsonFile(CONFIG_FILE, currentConfig);
    }

    writeJsonFile(APKS_FILE, currentApks);
    res.json({ success: true, release });
  });

  // Admin: Delete APK release
  app.delete('/api/admin/apks/:id', requireAdmin, (req: Request, res: Response) => {
    const { id } = req.params;
    const initialLen = currentApks.length;
    const target = currentApks.find(a => a.id === id);

    if (target && target.storagePath && fs.existsSync(target.storagePath)) {
      try {
        fs.unlinkSync(target.storagePath);
      } catch (e) {
        console.warn('Could not delete binary file:', e);
      }
    }

    currentApks = currentApks.filter(a => a.id !== id);
    if (currentApks.length === initialLen) {
      return res.status(404).json({ error: 'APK release not found.' });
    }

    writeJsonFile(APKS_FILE, currentApks);
    res.json({ success: true, message: 'APK release deleted.' });
  });

  // Admin: Upload real APK binary with comprehensive verification and safe replacement
  app.post('/api/admin/apks/upload', requireAdmin, (req: Request, res: Response) => {
    upload.single('apk')(req, res, async (err: any) => {
      if (err) {
        console.error('Multer upload error:', err);
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return res.status(413).json({ error: 'File size exceeds maximum limit of 250 MB. Please upload an APK smaller than 250 MB.' });
          }
          return res.status(400).json({ error: `Upload error: ${err.message}` });
        }
        return res.status(400).json({ error: err.message || 'File upload failed.' });
      }

      try {
        if (!req.file) {
          return res.status(400).json({ error: 'No APK file uploaded. Please select a valid .apk file.' });
        }

        const tempPath = req.file.path;

        // 1. Verify the uploaded binary immediately
        const verification = await verifyApkBinary(tempPath);
        if (!verification.isValid) {
          try { fs.unlinkSync(tempPath); } catch {}
          return res.status(400).json({
            error: verification.error || 'Uploaded file is not a valid Android APK binary archive.'
          });
        }

        // 2. Extract and sanitize metadata
        const rawProd = (req.body.productId || req.body.productName || 'nexa').toLowerCase().replace(/[^a-z0-9_-]/g, '-');
        const prodName = req.body.productName || (rawProd === 'focuslock' ? 'FocusLock' : 'NEXA');
        const rawVersion = (req.body.version || '2.5').trim();
        const cleanVersion = rawVersion.replace(/^v/i, '').trim();
        const originalUploadedName = req.file.originalname || `${prodName}-v${cleanVersion}.apk`;

        // 3. Multi-Version Release Management (Requirement 1 & 2):
        // Only overwrite an existing release if explicitly chosen via isReplace + releaseId.
        // Otherwise, always create a distinct new release entry!
        const isReplace = req.body.isReplace === 'true' || req.body.isReplace === true;
        const targetReleaseId = req.body.releaseId;
        let release = isReplace && targetReleaseId
          ? currentApks.find(a => a.id === targetReleaseId)
          : undefined;

        const timestamp = Date.now();
        const safeProductPrefix = prodName.replace(/[^a-zA-Z0-9_-]/g, '');

        let permanentFilename = release ? release.filename : `${safeProductPrefix}-v${cleanVersion}.apk`;
        // If creating a new release and this filename already exists on disk, use unique timestamp suffix
        if (!release && fs.existsSync(path.join(APKS_STORAGE_DIR, permanentFilename))) {
          permanentFilename = `${safeProductPrefix}-v${cleanVersion}-${timestamp}.apk`;
        }
        const permanentPath = path.join(APKS_STORAGE_DIR, permanentFilename);

        if (release && release.storagePath && fs.existsSync(release.storagePath) && release.storagePath !== permanentPath) {
          try {
            const archiveBackupName = `${path.basename(release.storagePath)}.backup-${timestamp}`;
            fs.copyFileSync(release.storagePath, path.join(APKS_ARCHIVE_DIR, archiveBackupName));
          } catch (backupErr) {
            console.warn('Could not archive previous release binary:', backupErr);
          }
        }

        // Move staged temp file to permanent storage location
        fs.copyFileSync(tempPath, permanentPath);
        try { fs.unlinkSync(tempPath); } catch {}

        // 4. Verify the permanent file exists and matches size & checksum
        if (!fs.existsSync(permanentPath)) {
          throw new Error('Verification failed: Binary could not be written to persistent storage directory.');
        }
        const verifiedStat = fs.statSync(permanentPath);
        if (verifiedStat.size !== verification.sizeBytes) {
          throw new Error(`Integrity error: Stored file size (${verifiedStat.size} bytes) does not match uploaded size (${verification.sizeBytes} bytes).`);
        }

        // 5. Update or register release metadata
        const formattedSize = verification.formattedSize;
        const sizeBytes = verifiedStat.size;
        const sha256 = verification.sha256;
        // Requirement 2: Every uploaded APK initially draft/unpublished unless explicitly flagged
        const isPublished = req.body.published === 'true' || req.body.published === true;

        if (!release) {
          release = {
            id: 'apk-' + rawProd + '-v' + cleanVersion + '-' + timestamp,
            productId: rawProd,
            productName: prodName,
            displayName: req.body.displayName || `${prodName} v${cleanVersion}`,
            version: cleanVersion,
            versionName: verification.versionName || req.body.versionName || `${prodName} v${cleanVersion}`,
            filename: permanentFilename,
            originalFilename: originalUploadedName,
            storagePath: permanentPath,
            fileSize: formattedSize,
            fileSizeBytes: sizeBytes,
            published: isPublished,
            releaseDate: req.body.releaseDate || new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }),
            releaseNotes: req.body.releaseNotes || `${prodName} v${cleanVersion} binary release.`,
            minimumAndroidVersion: req.body.minimumAndroidVersion || verification.minSdkVersion || 'Android 8.0+',
            isRealApk: true,
            sha256,
            status: isPublished ? 'Published' : 'Draft (Unpublished)',
            packageId: verification.packageId || (rawProd === 'nexa' ? 'in.com.nexa.app' : rawProd === 'focuslock' ? 'in.com.nexa.focuslock' : undefined),
            versionCode: verification.versionCode,
            minSdkVersion: verification.minSdkVersion || 'API 26 (Android 8.0)',
            targetSdkVersion: verification.targetSdkVersion || 'API 34 (Android 14)',
            signingScheme: verification.signingScheme,
            downloadCount: 0,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          };
          currentApks.push(release);
        } else {
          release.productId = rawProd;
          release.productName = prodName;
          release.version = cleanVersion;
          release.filename = permanentFilename;
          release.originalFilename = originalUploadedName;
          release.storagePath = permanentPath;
          release.fileSize = formattedSize;
          release.fileSizeBytes = sizeBytes;
          release.isRealApk = true;
          release.sha256 = sha256;
          if (verification.packageId) release.packageId = verification.packageId;
          if (verification.versionCode) release.versionCode = verification.versionCode;
          if (verification.versionName) release.versionName = verification.versionName;
          if (verification.minSdkVersion) release.minSdkVersion = verification.minSdkVersion;
          if (verification.targetSdkVersion) release.targetSdkVersion = verification.targetSdkVersion;
          if (verification.signingScheme) release.signingScheme = verification.signingScheme;
          if (req.body.displayName) release.displayName = req.body.displayName;
          if (req.body.releaseNotes) release.releaseNotes = req.body.releaseNotes;
          if (req.body.releaseDate) release.releaseDate = req.body.releaseDate;
          if (req.body.minimumAndroidVersion) release.minimumAndroidVersion = req.body.minimumAndroidVersion;
          if (req.body.published !== undefined) {
            release.published = isPublished;
            release.status = isPublished ? 'Published' : 'Draft (Unpublished)';
          }
          release.updatedAt = new Date().toISOString();
        }

        // 6. Copy to public/downloads for fallback static download if requested
        try {
          const publicPath = path.join(DOWNLOADS_DIR, permanentFilename);
          fs.copyFileSync(permanentPath, publicPath);
          const stdPath = path.join(DOWNLOADS_DIR, `${rawProd}.apk`);
          fs.copyFileSync(permanentPath, stdPath);
        } catch (err) {
          console.warn('Could not copy to public downloads:', err);
        }

        // 7. If this is NEXA and published, sync with currentConfig
        if (rawProd === 'nexa' && release.published) {
          currentConfig.appLatestVersion = 'v' + cleanVersion;
          currentConfig.fileSize = formattedSize;
          currentConfig.apkUrl = `/api/downloads/${rawProd}`;
          currentConfig.downloadEnabled = true;
          if (release.releaseDate) currentConfig.releaseDate = release.releaseDate;
          if (release.releaseNotes) currentConfig.releaseNotes = release.releaseNotes;
          writeJsonFile(CONFIG_FILE, currentConfig);
        }

        // Auto-register in currentProducts if not already registered
        if (!currentProducts.some(p => p.id.toLowerCase() === rawProd.toLowerCase())) {
          currentProducts.push({
            id: rawProd,
            name: prodName,
            displayName: req.body.displayName || `${prodName}`,
            description: req.body.releaseNotes || `${prodName} mobile application.`,
            category: 'Application',
            icon: 'Layers',
            isMain: rawProd === 'nexa',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          });
          writeJsonFile(PRODUCTS_FILE, currentProducts);
        }

        writeJsonFile(APKS_FILE, currentApks);

        return res.json({
          success: true,
          message: `Real APK binary successfully validated, uploaded and registered in persistent storage: ${permanentFilename} (${formattedSize})`,
          release,
          verification: {
            verified: true,
            sizeBytes,
            fileSize: formattedSize,
            sha256,
            hasManifest: verification.hasManifest,
            hasClassesDex: verification.hasClassesDex,
            hasResourcesArsc: verification.hasResourcesArsc,
            hasSigningCert: verification.hasSigningCert,
            packageId: verification.packageId,
            versionName: verification.versionName,
            versionCode: verification.versionCode,
            minSdkVersion: verification.minSdkVersion,
            targetSdkVersion: verification.targetSdkVersion,
            signingScheme: verification.signingScheme,
            storagePath: permanentPath,
            storageType: 'Persistent Server Filesystem Storage',
            downloadReady: true
          },
          config: currentConfig
        });
      } catch (err: any) {
        console.error('Error uploading and storing APK binary:', err);
        return res.status(500).json({ error: 'Failed to process and store uploaded APK binary.', details: err.message });
      }
    });
  });

  // Admin: Verification Endpoint for Stored APK Binary with Diagnostics (Requirement 5 & 6)
  app.get('/api/admin/apks/verify/:productId', requireAdmin, async (req: Request, res: Response) => {
    const target = (req.params.productId || '').toLowerCase().trim();
    const release = currentApks.slice().reverse().find(a => a.productId.toLowerCase() === target || a.id.toLowerCase() === target || a.version === target);
    if (!release) {
      return res.status(404).json({ error: `Release "${target}" not found.`, verified: false });
    }

    if (!release.storagePath || !fs.existsSync(release.storagePath)) {
      return res.json({
        verified: false,
        productId: release.productId,
        productName: release.productName,
        displayName: release.displayName,
        version: release.version,
        status: 'Binary Not Uploaded',
        storagePath: 'Not stored',
        error: 'Binary not stored on disk — upload a valid APK first.'
      });
    }

    const verification = await verifyApkBinary(release.storagePath);
    return res.json({
      verified: verification.isValid,
      productId: release.productId,
      productName: release.productName,
      displayName: release.displayName,
      version: release.version,
      versionName: verification.versionName || release.versionName || release.version,
      versionCode: verification.versionCode || release.versionCode || 'N/A',
      packageId: verification.packageId || release.packageId || (release.productId.toLowerCase() === 'nexa' ? 'in.com.nexa.app' : 'in.com.nexa.focuslock'),
      minSdkVersion: verification.minSdkVersion || release.minSdkVersion || 'API 26 (Android 8.0 Oreo)',
      targetSdkVersion: verification.targetSdkVersion || release.targetSdkVersion || 'API 34 (Android 14)',
      signingScheme: verification.signingScheme || release.signingScheme || 'v1 (JAR) / v2 Signature',
      hasSigningCert: verification.hasSigningCert,
      signingFiles: verification.signingFiles,
      filename: release.filename,
      originalFilename: release.originalFilename || release.filename,
      storagePath: release.storagePath,
      fileSizeBytes: verification.sizeBytes,
      fileSize: verification.formattedSize,
      sha256: verification.sha256,
      hasManifest: verification.hasManifest,
      hasClassesDex: verification.hasClassesDex,
      hasResourcesArsc: verification.hasResourcesArsc,
      entriesCount: verification.entriesCount,
      published: release.published,
      status: verification.isValid ? (release.published ? 'Published' : 'Draft (Unpublished)') : 'Corrupted',
      downloadReady: verification.isValid,
      diagnosticChecks: {
        isStructurallyValid: verification.isValid,
        hasManifest: verification.hasManifest,
        hasClassesDex: verification.hasClassesDex,
        hasResourcesArsc: verification.hasResourcesArsc,
        hasSigningCert: verification.hasSigningCert,
        sha256Matches: release.sha256 ? (release.sha256.toLowerCase() === verification.sha256.toLowerCase()) : true,
        sizeMatches: release.fileSizeBytes ? (release.fileSizeBytes === verification.sizeBytes) : true
      },
      installationFailureGuide: [
        {
          cause: 'Corrupted or Incomplete Download',
          detail: 'Download was interrupted over network or stalled in browser, resulting in missing trailing bytes. Android package parser immediately errors.',
          fix: 'Compare downloaded file size on device with server size; ensure exact byte match.'
        },
        {
          cause: 'Package Signature Mismatch',
          detail: 'A previous build of this package is already on the phone with a different signing key. Android rejects upgrades with mismatched certificates.',
          fix: 'Completely uninstall the previous NEXA app from Android before installing the new APK.'
        },
        {
          cause: 'Version Downgrade Protection',
          detail: 'Android OS forbids installing an APK whose versionCode is lower than the currently installed version.',
          fix: 'Upload an APK with higher versionCode or uninstall older app first.'
        },
        {
          cause: 'Incompatible Android OS Version',
          detail: `Device Android version is below minimum SDK requirement (${verification.minSdkVersion || 'API 26'}).`,
          fix: 'Requires Android 8.0 (Oreo) or newer smartphone.'
        },
        {
          cause: 'Conflicting Installed Package',
          detail: `Another installed app uses the same applicationId (${verification.packageId || 'in.com.nexa.app'}).`,
          fix: 'Uninstall conflicting package via Android Settings > Apps.'
        },
        {
          cause: 'Unknown Sources / Play Protect Block',
          detail: 'Browser lacks permission to install unknown apps or Play Protect requires confirmation.',
          fix: 'Enable "Allow from this source" in Chrome App Info, then tap "Install Anyway".'
        }
      ]
    });
  });

  // Admin: Storage Infrastructure Status
  app.get('/api/admin/storage-status', requireAdmin, (req: Request, res: Response) => {
    const cloudStorageConfigured = !!(process.env.GCS_BUCKET || process.env.STORAGE_BUCKET);
    const storedFiles = fs.existsSync(APKS_STORAGE_DIR)
      ? fs.readdirSync(APKS_STORAGE_DIR).filter(f => f.endsWith('.apk'))
      : [];

    return res.json({
      persistentStorage: true,
      storageType: 'Persistent Server Filesystem Storage',
      activeProvider: 'Persistent Server Filesystem Storage',
      storageDirectory: APKS_STORAGE_DIR,
      archiveDirectory: APKS_ARCHIVE_DIR,
      downloadsDirectory: DOWNLOADS_DIR,
      storedApkFiles: storedFiles,
      storedCount: storedFiles.length,
      cloudStorageConfigured,
      cloudStorageRequirements: {
        provider: 'Google Cloud Storage (GCS) or S3 Object Storage',
        environmentVariables: [
          'STORAGE_PROVIDER=gcs',
          'GCS_BUCKET=your-bucket-name',
          'GOOGLE_APPLICATION_CREDENTIALS=/path/to/credentials.json'
        ],
        note: 'Currently utilizing persistent server container volume (/uploads/apks) which reliably preserves binary files across all server operations.'
      }
    });
  });

  // ================= SECURE APK DOWNLOAD ENDPOINT ================= //
  app.get('/api/downloads/:productId', (req: Request, res: Response) => {
    const target = (req.params.productId || '').toLowerCase().trim();
    const isTestMode = req.query.test === 'true';

    // Extract authentication credentials
    const authHeader = req.headers.authorization;
    let token = '';
    if (authHeader && authHeader.startsWith('Bearer ')) {
      token = authHeader.split(' ')[1];
    } else if (req.query.token && typeof req.query.token === 'string') {
      token = req.query.token;
    }
    const isAdmin = Boolean(token && adminSessions.has(token));

    // Check Authentication if publicDownload is disabled and not admin
    if (!currentConfig.publicDownload && !isAdmin) {
      if (!token || (!activeSessions.has(token) && !adminSessions.has(token))) {
        return res.status(401).json({
          error: 'Authentication required. Please sign in to your NEXA account to download this APK.',
          requiresAuth: true
        });
      }
    }

    // Match release by releaseId (exact query), or by productId/productName + version query, or fallback to latest matching release
    const reqReleaseId = typeof req.query.releaseId === 'string' ? req.query.releaseId.trim() : '';
    const reqVersion = typeof req.query.version === 'string' ? req.query.version.replace(/^v/i, '').trim() : '';

    const release = currentApks.slice().reverse().find(a => {
      // In admin test mode, allow downloading unpublished draft releases
      if (!a.published && !(isTestMode && isAdmin)) return false;
      if (reqReleaseId && a.id === reqReleaseId) return true;
      const idMatches = (
        a.productId.toLowerCase() === target ||
        a.productName.toLowerCase() === target ||
        a.id.toLowerCase() === target ||
        (target === 'nexa' && a.productName.toLowerCase().includes('nexa')) ||
        (target === 'focuslock' && a.productName.toLowerCase().includes('focuslock'))
      );
      if (!idMatches) return false;
      if (reqVersion) {
        return a.version.replace(/^v/i, '').trim() === reqVersion;
      }
      return true;
    });

    if (!release) {
      return res.status(404).json({
        error: `Requested product or release "${target}" not found or not published.`,
        available: false
      });
    }

    // Check if physical file exists and is a real binary (> 1000 bytes)
    let candidatePath = release.storagePath ? path.resolve(release.storagePath) : '';
    if (!candidatePath || !fs.existsSync(candidatePath)) {
      const alt1 = path.join(APKS_STORAGE_DIR, release.filename);
      const alt2 = path.join(DOWNLOADS_DIR, release.filename);
      const alt3 = path.join(DOWNLOADS_DIR, `${release.productId}.apk`);
      if (fs.existsSync(alt1)) {
        candidatePath = alt1;
      } else if (fs.existsSync(alt2)) {
        candidatePath = alt2;
      } else if (fs.existsSync(alt3)) {
        candidatePath = alt3;
      }
    }

    if (!candidatePath || !fs.existsSync(candidatePath)) {
      return res.status(404).json({
        error: 'Binary not stored — upload a valid APK first.',
        available: false,
        productName: release.productName,
        version: release.version
      });
    }

    const stat = fs.statSync(candidatePath);
    // If the file is a placeholder (< 1000 bytes) or not marked as real APK, refuse to serve fake placeholder
    if (stat.size < 1000 || !release.isRealApk) {
      return res.status(404).json({
        error: 'Binary not stored — upload a valid APK first.',
        available: false,
        productName: release.productName,
        version: release.version
      });
    }

    // Valid real binary APK: increment download counter only for non-test downloads
    if (!isTestMode) {
      release.downloadCount = (release.downloadCount || 0) + 1;
      writeJsonFile(APKS_FILE, currentApks);
    }

    res.setHeader('Content-Type', 'application/vnd.android.package-archive');
    res.setHeader('Content-Disposition', `attachment; filename="${release.filename || `${release.productName}-v${release.version}.apk`}"`);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    fs.createReadStream(candidatePath).pipe(res);
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`NEXA official website server running on port ${PORT}`);
  });
}

startServer();
