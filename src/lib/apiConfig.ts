/**
 * Base URL ของ Backend API
 * - Local: ตั้งใน .env.local เช่น NEXT_PUBLIC_API_BASE=http://localhost:3001
 * - Production: ตั้งใน Environment Variables ของ Vercel/Railway เป็น URL ของ backend จริง
 */
const RAW = process.env.NEXT_PUBLIC_API_BASE ?? "";

/** ถ้าไม่ได้ตั้ง env (เช่นบน production ที่ลืมตั้ง) ใช้ backend ชุดนี้ */
const FALLBACK = "https://betta-backend-production.up.railway.app";

const API_BASE = RAW || FALLBACK;

/** URL สำหรับเรียก API (ลงท้ายด้วย /api เสมอ) */
export const API = API_BASE.endsWith("/api")
  ? API_BASE
  : `${API_BASE.replace(/\/$/, "")}/api`;

/** URL สำหรับโหลดรูป (origin ไม่มี /api) */
export const ASSET = API_BASE.endsWith("/api")
  ? API_BASE.replace(/\/api\/?$/, "")
  : API_BASE;

/** true ถ้าตั้ง NEXT_PUBLIC_API_BASE ไว้ (ใช้แจ้ง user ว่าต้องตั้ง env ใน local) */
export const hasApiBase = Boolean(RAW);
