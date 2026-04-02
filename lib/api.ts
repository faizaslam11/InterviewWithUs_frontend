const BASE = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';

export class ApiError extends Error {
  constructor(public status: number, public detail: string) {
    super(detail); this.name = 'ApiError';
  }
}

async function handle<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try { const b = await res.json(); detail = b.detail || detail; } catch {}
    throw new ApiError(res.status, detail);
  }
  return res.json() as Promise<T>;
}

export const INTERVIEW_PLATFORMS = [
  'Google Meet', 'Microsoft Teams', 'Zoom', 'WebEx',
  'Discord', 'Skype', 'Whereby', 'Cisco Webex', 'Other', 'Not sure yet',
] as const;

export const DURATIONS = ['30 minutes', '1 hour', '1.5 hours', '2 hours'] as const;

// ── Pricing (mirrors backend exactly) ──
const STANDARD: Record<string, number> = {
  '30 minutes': 299, '1 hour': 499, '1.5 hours': 499, '2 hours': 499,
};
const FRESHER: Record<string, number> = {
  '30 minutes': 149, '1 hour': 349, '1.5 hours': 349, '2 hours': 349,
};
const PROMO_OFF = 50;

export function computeDisplayPrice(
  duration: string,
  isFresher: boolean,
  promoValid: boolean,
): number {
  const base = isFresher ? (FRESHER[duration] ?? 349) : (STANDARD[duration] ?? 499);
  return promoValid ? Math.max(base - PROMO_OFF, 49) : base;
}

export interface BookingFormData {
  name: string;
  interview_platform: string;
  interview_time: string;
  duration: string;
  company: string;
  job_role: string;
  job_description?: string;
  telegram_username?: string;
  whatsapp_number?: string;
  gmail: string;
  is_fresher: boolean;
  promo_code?: string;
  resume_b64?: string;        // base64-encoded resume file (no data: prefix)
  resume_filename?: string;   // original filename e.g. "john_cv.pdf"
  screenshot_b64?: string;        // base64-encoded meeting invite screenshot
  screenshot_filename?: string;   // original filename e.g. "invite.png"
}

export interface CreateOrderResponse {
  booking_id: string;
  razorpay_order_id: string;
  amount: number;
  currency: string;
  key_id: string;
  name: string;
  gmail: string;
  plan_label: string;
  final_price_display: string;
}

export interface VerifyPaymentRequest {
  booking_id: string;
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

export interface VerifyPaymentResponse {
  success: boolean;
  booking_id: string;
  pc_link: string;
  mobile_link: string;
  interview_time: string;
  message: string;
}

export interface PromoResponse {
  valid: boolean;
  discount_rupees: number;
  message: string;
}

export async function createBooking(data: BookingFormData): Promise<CreateOrderResponse> {
  const res = await fetch(`${BASE}/api/bookings`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handle<CreateOrderResponse>(res);
}

export async function verifyPayment(data: VerifyPaymentRequest): Promise<VerifyPaymentResponse> {
  const res = await fetch(`${BASE}/api/bookings/verify`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return handle<VerifyPaymentResponse>(res);
}

export async function validatePromo(code: string): Promise<PromoResponse> {
  const res = await fetch(`${BASE}/api/bookings/validate-promo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ code }),
  });
  return handle<PromoResponse>(res);
}
