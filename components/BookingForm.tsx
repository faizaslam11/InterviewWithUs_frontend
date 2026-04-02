'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import {
  Loader2, User, Building2, MessageCircle, Mail, FileText,
  AlertCircle, ChevronRight, Briefcase, Video, Clock, Tag,
  CheckCircle2, Smartphone, Upload, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, Checkbox } from '@/components/ui/form-elements';
import { DateTimePicker } from '@/components/DateTimePicker';
import {
  createBooking, verifyPayment, validatePromo,
  ApiError, INTERVIEW_PLATFORMS, DURATIONS, computeDisplayPrice,
} from '@/lib/api';
import { cn } from '@/lib/utils';

declare global {
  interface Window { Razorpay: new (o: RzpOpts) => RzpInst; }
}
interface RzpOpts {
  key: string; amount: number; currency: string; name: string; description: string;
  order_id: string; prefill: { name: string; email: string }; theme: { color: string };
  handler: (r: RzpResp) => void; modal: { ondismiss: () => void };
}
interface RzpInst { open(): void }
interface RzpResp {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  interview_platform: z.string().min(1, 'Select platform'),
  interview_time: z.string().min(1, 'Select date and time'),
  duration: z.string().min(1, 'Select duration'),
  company: z.string().min(1, 'Company required'),
  job_role: z.string().min(1, 'Job role required'),
  job_description: z.string().max(2000).optional(),
  telegram_username: z.string().optional(),
  whatsapp_number: z.string().optional(),
  gmail: z.string().email('Enter a valid Gmail'),
  is_fresher: z.boolean().default(false),
  promo_input: z.string().optional(),
});
type FV = z.infer<typeof schema>;

function loadRzp(): Promise<boolean> {
  return new Promise(r => {
    if (window.Razorpay) { r(true); return; }
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => r(true);
    s.onerror = () => r(false);
    document.body.appendChild(s);
  });
}

export function BookingForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [payLoading, setPayLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [promo, setPromo] = useState<{ valid: boolean; pct: number; msg: string } | null>(null);
  const [promoChecking, setPromoChecking] = useState(false);
  const [showPromo, setShowPromo] = useState(false);

  // Resume state
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeB64, setResumeB64] = useState<string | null>(null);
  const [resumeError, setResumeError] = useState<string | null>(null);

  // Screenshot state
  const [screenshotFile, setScreenshotFile] = useState<File | null>(null);
  const [screenshotB64, setScreenshotB64] = useState<string | null>(null);
  const [screenshotError, setScreenshotError] = useState<string | null>(null);

  const {
    register, handleSubmit, watch, setValue, formState: { errors },
  } = useForm<FV>({
    resolver: zodResolver(schema),
    defaultValues: { duration: '1 hour', is_fresher: false },
  });

  const duration = watch('duration') || '1 hour';
  const isFresher = watch('is_fresher');
  const promoInput = watch('promo_input');
  const promoValid = promo?.valid ?? false;
  const price = computeDisplayPrice(duration, isFresher, promoValid);

  const checkPromo = async () => {
    if (!promoInput?.trim()) return;
    setPromoChecking(true);
    try {
      const r = await validatePromo(promoInput.trim());
      setPromo({ valid: r.valid, pct: r.discount_rupees, msg: r.message });
    } catch {
      setPromo({ valid: false, pct: 0, msg: 'Could not validate code' });
    } finally {
      setPromoChecking(false);
    }
  };

  const handleResume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setResumeError(null);
    if (!file) return;
    const allowed = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];
    if (!allowed.includes(file.type)) {
      setResumeError('Only PDF or Word (.doc/.docx) files accepted');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setResumeError('File too large — maximum 5MB');
      return;
    }
    setResumeFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setResumeB64((reader.result as string).split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const clearResume = () => {
    setResumeFile(null);
    setResumeB64(null);
    setResumeError(null);
  };

  const handleScreenshot = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setScreenshotError(null);
    if (!file) return;
    if (!['image/jpeg', 'image/png', 'image/webp', 'image/jpg'].includes(file.type)) {
      setScreenshotError('Only JPG, PNG or WebP images accepted');
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setScreenshotError('File too large — maximum 10MB');
      return;
    }
    setScreenshotFile(file);
    const reader = new FileReader();
    reader.onload = () => {
      setScreenshotB64((reader.result as string).split(',')[1]);
    };
    reader.readAsDataURL(file);
  };

  const clearScreenshot = () => {
    setScreenshotFile(null);
    setScreenshotB64(null);
    setScreenshotError(null);
  };

  const onSubmit = async (v: FV) => {
    setLoading(true);
    setError(null);
    try {
      const order = await createBooking({
        name: v.name,
        interview_platform: v.interview_platform,
        interview_time: v.interview_time,
        duration: v.duration,
        company: v.company,
        job_role: v.job_role,
        job_description: v.job_description,
        telegram_username: v.telegram_username?.replace(/^@+/, '') || undefined,
        whatsapp_number: v.whatsapp_number || undefined,
        gmail: v.gmail,
        is_fresher: v.is_fresher,
        promo_code: promoValid ? promoInput?.trim() : undefined,
        resume_b64: resumeB64 || undefined,
        resume_filename: resumeFile?.name || undefined,
        screenshot_b64: screenshotB64 || undefined,
        screenshot_filename: screenshotFile?.name || undefined,
      });

      setLoading(false);
      const ok = await loadRzp();
      if (!ok) {
        setError('Could not load payment gateway. Check your internet connection.');
        return;
      }
      setPayLoading(true);

      new window.Razorpay({
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: 'Interview with us',
        description: order.plan_label,
        order_id: order.razorpay_order_id,
        prefill: { name: order.name, email: order.gmail },
        theme: { color: '#3ddc6a' },
        handler: async (resp: RzpResp) => {
          try {
            const result = await verifyPayment({
              booking_id: order.booking_id,
              razorpay_order_id: resp.razorpay_order_id,
              razorpay_payment_id: resp.razorpay_payment_id,
              razorpay_signature: resp.razorpay_signature,
            });
            if (result.success) {
              sessionStorage.setItem('booking_result', JSON.stringify(result));
              router.push('/success');
            } else {
              setError('Verification failed. Contact us on Telegram.');
              setPayLoading(false);
            }
          } catch (err) {
            setError(
              err instanceof ApiError
                ? err.detail
                : 'Contact us on Telegram with your payment ID.',
            );
            setPayLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            setPayLoading(false);
            setError('Payment cancelled. Try again anytime.');
          },
        },
      }).open();

    } catch (err) {
      setLoading(false);
      setPayLoading(false);
      setError(
        err instanceof ApiError
          ? err.detail
          : 'Something went wrong. Please try again.',
      );
    }
  };

  if (payLoading) return (
    <div className="flex flex-col items-center justify-center py-14 space-y-4">
      <Loader2 size={28} className="animate-spin text-primary" />
      <p className="font-semibold text-sm">Processing payment…</p>
      <p className="text-xs text-muted-foreground">Do not close this window</p>
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

      {/* Live price display */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-primary/6 border border-primary/20">
        <div>
          <p className="text-[11px] text-muted-foreground font-medium uppercase tracking-wider">
            Session price
          </p>
          <p className="text-3xl font-extrabold text-primary tracking-tight">₹{price}</p>
        </div>
        <div className="text-right text-xs text-muted-foreground space-y-0.5">
          <p className="font-medium">{duration}</p>
          {isFresher && <p className="text-primary font-semibold">Fresher pricing</p>}
          {promoValid && <p className="text-primary font-semibold">₹50 off applied</p>}
        </div>
      </div>

      {/* Name */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          <User size={11} className="text-primary" />
          Full Name <span className="text-destructive">*</span>
        </Label>
        <Input placeholder="Your full name" {...register('name')} />
        {errors.name && <Err msg={errors.name.message!} />}
      </div>

      {/* Platform + Duration */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <Video size={11} className="text-primary" />
            Interview Platform <span className="text-destructive">*</span>
          </Label>
          <Select placeholder="Select platform" {...register('interview_platform')}>
            {INTERVIEW_PLATFORMS.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </Select>
          {errors.interview_platform && <Err msg={errors.interview_platform.message!} />}
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <Clock size={11} className="text-primary" />
            Duration <span className="text-destructive">*</span>
          </Label>
          <Select {...register('duration')}>
            {DURATIONS.map(d => (
              <option key={d} value={d}>
                {d} — ₹{computeDisplayPrice(d, isFresher, promoValid)}
              </option>
            ))}
          </Select>
        </div>
      </div>

      {/* Date/Time */}
      <div className="space-y-1.5">
        <Label className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          Interview Date & Time <span className="text-destructive">*</span>
        </Label>
        <DateTimePicker
          value={watch('interview_time') || ''}
          onChange={iso => setValue('interview_time', iso)}
          error={errors.interview_time?.message}
        />
        <p className="text-xs text-muted-foreground">
          Book at least 2 hours before your interview
        </p>
        {errors.interview_time && <Err msg={errors.interview_time.message!} />}
      </div>

      {/* Company + Role */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <Building2 size={11} className="text-primary" />
            Company <span className="text-destructive">*</span>
          </Label>
          <Input placeholder="e.g. Google, TCS, Startup" {...register('company')} />
          {errors.company && <Err msg={errors.company.message!} />}
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <Briefcase size={11} className="text-primary" />
            Job Role <span className="text-destructive">*</span>
          </Label>
          <Input placeholder="e.g. Software Engineer" {...register('job_role')} />
          {errors.job_role && <Err msg={errors.job_role.message!} />}
        </div>
      </div>

      {/* Job Description */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          <FileText size={11} />
          Job Description
          <span className="text-xs normal-case font-normal tracking-normal text-muted-foreground">
            (optional but recommended)
          </span>
        </Label>
        <Textarea
          placeholder="Paste the job description — helps our expert prepare accurate answers for your specific role…"
          rows={3}
          {...register('job_description')}
        />
      </div>

      {/* Resume upload */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          <Upload size={11} />
          Resume / CV
          <span className="text-xs normal-case font-normal tracking-normal text-muted-foreground">
            (optional — PDF or Word, max 5MB)
          </span>
        </Label>
        {!resumeFile ? (
          <label className={cn(
            'flex flex-col items-center justify-center gap-2 w-full h-24 rounded-xl border-2 border-dashed',
            'cursor-pointer transition-all',
            'border-border hover:border-primary/50 hover:bg-primary/3',
            resumeError ? 'border-destructive/50' : '',
          )}>
            <Upload size={18} className="text-muted-foreground" />
            <span className="text-xs text-muted-foreground font-medium">
              Click to upload or drag and drop
            </span>
            <span className="text-[11px] text-muted-foreground/60">PDF, DOC, DOCX · Max 5MB</span>
            <input type="file" className="hidden"
              accept=".pdf,.doc,.docx,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              onChange={handleResume}
            />
          </label>
        ) : (
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-primary/25 bg-primary/5">
            <FileText size={18} className="text-primary flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{resumeFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(resumeFile.size / 1024).toFixed(0)} KB · Ready to upload
              </p>
            </div>
            <button type="button" onClick={clearResume}
              className="text-muted-foreground hover:text-destructive transition-colors p-1">
              <X size={15} />
            </button>
          </div>
        )}
        {resumeError && <Err msg={resumeError} />}
        <p className="text-xs text-muted-foreground">
          Our expert uses your resume to give personalised answers about your background
        </p>
      </div>

      {/* Meeting screenshot */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          <FileText size={11} className="text-amber-500" />
          Interview Invite Screenshot
          <span className="text-xs normal-case font-normal tracking-normal text-muted-foreground">
            (JPG or PNG, max 10MB)
          </span>
        </Label>
        {!screenshotFile ? (
          <label className={cn(
            'flex flex-col items-center justify-center gap-2 w-full h-28 rounded-xl border-2 border-dashed',
            'cursor-pointer transition-all',
            'border-amber-500/30 hover:border-amber-500/60 hover:bg-amber-500/3',
            screenshotError ? 'border-destructive/50' : '',
          )}>
            <Upload size={18} className="text-amber-500/70" />
            <span className="text-xs text-muted-foreground font-medium">
              Upload your calendar invite or meeting screenshot
            </span>
            <span className="text-[11px] text-muted-foreground/60">JPG, PNG, WebP · Max 10MB</span>
            <input type="file" className="hidden"
              accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
              onChange={handleScreenshot}
            />
          </label>
        ) : (
          <div className="flex items-center gap-3 p-3.5 rounded-xl border border-amber-500/30 bg-amber-500/5">
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 flex items-center justify-center flex-shrink-0">
              <FileText size={18} className="text-amber-600 dark:text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{screenshotFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {(screenshotFile.size / 1024).toFixed(0)} KB · Screenshot attached
              </p>
            </div>
            <button type="button" onClick={clearScreenshot}
              className="text-muted-foreground hover:text-destructive transition-colors p-1">
              <X size={15} />
            </button>
          </div>
        )}
        {screenshotError && <Err msg={screenshotError} />}
        <div className="flex gap-2 items-start p-3 rounded-xl bg-amber-500/5 border border-amber-500/15">
          <AlertCircle size={13} className="text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground leading-relaxed">
            <span className="font-semibold text-amber-700 dark:text-amber-400">Why we need this: </span>
            We verify your interview duration matches the plan selected. Screenshot your
            calendar invite or email showing the scheduled time and duration.
          </p>
        </div>
      </div>

      {/* Telegram + WhatsApp */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <MessageCircle size={11} className="text-primary" />
            Telegram Username
          </Label>
          <div className="relative">
            <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted-foreground text-sm pointer-events-none">
              @
            </span>
            <Input placeholder="yourusername" className="pl-7" {...register('telegram_username')} />
          </div>
          <p className="text-xs text-muted-foreground">We contact you here to confirm</p>
        </div>
        <div className="space-y-1.5">
          <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
            <Smartphone size={11} />WhatsApp Number
          </Label>
          <Input placeholder="+91 98765 43210" {...register('whatsapp_number')} />
          <p className="text-xs text-muted-foreground">Backup contact if no Telegram</p>
        </div>
      </div>

      {/* Gmail */}
      <div className="space-y-1.5">
        <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
          <Mail size={11} className="text-primary" />
          Gmail <span className="text-destructive">*</span>
        </Label>
        <Input type="email" placeholder="yourname@gmail.com" {...register('gmail')} />
        <p className="text-xs text-muted-foreground">
          Meeting links + PDF guide sent here after payment
        </p>
        {errors.gmail && <Err msg={errors.gmail.message!} />}
      </div>

      {/* ── FRESHER CHECKBOX — fixed: no onClick on wrapper div ── */}
      <div className={cn(
        'rounded-xl border p-4 transition-colors',
        isFresher ? 'border-primary/40 bg-primary/5' : 'border-border bg-muted/20',
      )}>
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <Checkbox
            checked={isFresher}
            onCheckedChange={(checked) => {
              setValue('is_fresher', checked === true, { shouldValidate: false });
            }}
            className="mt-0.5 flex-shrink-0"
          />
          <div>
            <p className="text-sm font-semibold">I am a fresher (0–1 year experience)</p>
            <p className="text-xs text-muted-foreground mt-0.5">
              Fresher pricing:{' '}
              <span className="font-bold text-primary">₹149 / 30 min</span>
              {' '}·{' '}
              <span className="font-bold text-primary">₹349 / 1 hour+</span>
            </p>
          </div>
        </label>
      </div>

      {/* Promo code */}
      <div>
        {!showPromo ? (
          <button
            type="button"
            onClick={() => setShowPromo(true)}
            className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
          >
            <Tag size={11} />Have a promo code?
          </button>
        ) : (
          <div className="space-y-1.5">
            <Label className="flex items-center gap-1.5 text-xs uppercase tracking-wider text-muted-foreground font-semibold">
              <Tag size={11} />Promo Code
            </Label>
            <div className="flex gap-2">
              <Input
                placeholder="ENTER CODE"
                className="uppercase font-mono"
                {...register('promo_input')}
                onChange={e => {
                  setValue('promo_input', e.target.value.toUpperCase());
                  setPromo(null);
                }}
              />
              <Button
                type="button"
                variant="outline"
                onClick={checkPromo}
                disabled={promoChecking}
                className="shrink-0 px-4"
              >
                {promoChecking ? <Loader2 size={13} className="animate-spin" /> : 'Apply'}
              </Button>
            </div>
            {promo && (
              <p className={cn(
                'text-xs flex items-center gap-1',
                promo.valid ? 'text-primary' : 'text-destructive',
              )}>
                {promo.valid ? <CheckCircle2 size={11} /> : <AlertCircle size={11} />}
                {promo.msg}
              </p>
            )}
          </div>
        )}
      </div>

      {/* What you get */}
      <div className="green-box text-xs space-y-1.5">
        <p className="font-semibold text-foreground mb-1">What you receive after payment:</p>
        {[
          'Both meeting links sent to your Gmail instantly',
          'Complete setup guide PDF attached to your email',
          'We message you on Telegram or WhatsApp to confirm',
          'Our live expert joins and assists during your interview',
        ].map(t => (
          <div key={t} className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 size={11} className="text-primary flex-shrink-0" />{t}
          </div>
        ))}
      </div>

      {error && (
        <div className="flex items-start gap-2 p-3 rounded-xl bg-destructive/8 border border-destructive/25 text-destructive text-sm">
          <AlertCircle size={14} className="mt-0.5 flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      <Button
        type="submit"
        size="lg"
        className="w-full text-base"
        disabled={loading || payLoading}
      >
        {loading
          ? <><Loader2 size={15} className="animate-spin" />Preparing payment…</>
          : <>Pay ₹{price} &amp; Book Session<ChevronRight size={15} /></>
        }
      </Button>

      <p className="text-xs text-center text-muted-foreground">
        Secured by Razorpay · Cards, UPI, Netbanking, Wallets
      </p>
    </form>
  );
}

function Err({ msg }: { msg: string }) {
  return (
    <p className="text-xs text-destructive flex items-center gap-1 mt-1">
      <AlertCircle size={11} />{msg}
    </p>
  );
}
