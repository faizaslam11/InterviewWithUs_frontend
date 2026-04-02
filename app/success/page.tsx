'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  CheckCircle2, Copy, ExternalLink, Check,
  ArrowLeft, MessageCircle, Mail,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import type { VerifyPaymentResponse } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function SuccessPage() {
  const router = useRouter();
  const [result, setResult] = useState<VerifyPaymentResponse | null>(null);
  const [copied, setCopied] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const raw = sessionStorage.getItem('booking_result');
    if (!raw) { router.replace('/'); return; }
    try { setResult(JSON.parse(raw)); } catch { router.replace('/'); }
  }, [router]);

  if (!result) return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
    </div>
  );

  const copy = async (text: string, key: string) => {
    await navigator.clipboard.writeText(text);
    setCopied(p => ({ ...p, [key]: true }));
    setTimeout(() => setCopied(p => ({ ...p, [key]: false })), 2000);
  };

  const autoMessage = `📅 Interview session: ${result.interview_time}

💻 PC Link (open on your laptop — Desktop 1):
${result.pc_link}

📱 Mobile Link (open on your phone):
${result.mobile_link}

Setup:
1. Open PC Link on Desktop 1, share screen + audio, mic ON
2. Open your real interview on Desktop 2
3. Open Mobile Link on phone, place phone below laptop screen
4. Look straight down to read answers

Sent by Interview with us`;

  const encodedMsg = encodeURIComponent(autoMessage);
  const waShare = `https://wa.me/?text=${encodedMsg}`;
  const tgShare = `https://t.me/share/url?url=${encodeURIComponent(result.pc_link)}&text=${encodedMsg}`;

  return (
    <div className="hero-bg min-h-screen">
      <div className="container max-w-2xl mx-auto px-4 py-14 space-y-5">

        {/* Header */}
        <div className="text-center animate-fade-up">
          <div className="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 size={32} className="text-primary" />
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Payment confirmed!</h1>
          <p className="text-muted-foreground text-sm">
            Your session is booked for{' '}
            <strong className="text-foreground">{result.interview_time}</strong>
          </p>
          <div className="flex items-center justify-center gap-2 mt-3 text-xs text-primary">
            <Mail size={12} />
            <span>Confirmation email + PDF guide sent to your Gmail</span>
          </div>
        </div>

        {/* Meeting links */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fade-up-1">

          {/* PC Link */}
          <div className="card-base p-4 border-primary/25 bg-primary/3">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xl">💻</span>
              <div>
                <p className="text-sm font-bold">PC Link</p>
                <p className="text-xs text-muted-foreground">Open on Desktop 1 · Share screen · Mic ON</p>
              </div>
            </div>
            <div className="font-mono text-xs bg-secondary/60 border border-border rounded-lg px-3 py-2 truncate text-muted-foreground mb-3">
              {result.pc_link}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copy(result.pc_link, 'pc')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg border transition-all',
                  copied['pc']
                    ? 'border-primary/25 bg-primary/8 text-primary'
                    : 'border-border bg-secondary hover:border-primary/30',
                )}
              >
                {copied['pc'] ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
              </button>
              <a
                href={result.pc_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90"
              >
                <ExternalLink size={12} />Open
              </a>
            </div>
          </div>

          {/* Mobile Link */}
          <div className="card-base p-4 border-amber-500/25 bg-amber-500/3">
            <div className="flex items-center gap-2.5 mb-3">
              <span className="text-xl">📱</span>
              <div>
                <p className="text-sm font-bold">Mobile Link</p>
                <p className="text-xs text-muted-foreground">Our expert joins here · Shows answers</p>
              </div>
            </div>
            <div className="font-mono text-xs bg-secondary/60 border border-border rounded-lg px-3 py-2 truncate text-muted-foreground mb-3">
              {result.mobile_link}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => copy(result.mobile_link, 'mob')}
                className={cn(
                  'flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg border transition-all',
                  copied['mob']
                    ? 'border-primary/25 bg-primary/8 text-primary'
                    : 'border-border bg-secondary hover:border-primary/30',
                )}
              >
                {copied['mob'] ? <><Check size={12} />Copied!</> : <><Copy size={12} />Copy</>}
              </button>
              <a
                href={result.mobile_link}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold py-2 rounded-lg bg-amber-500 text-white hover:opacity-90"
              >
                <ExternalLink size={12} />Open
              </a>
            </div>
          </div>
        </div>

        {/* Share panel */}
        <div className="card-base p-5 animate-fade-up-2">
          <p className="text-sm font-bold mb-1">📲 Send both links to your devices</p>
          <p className="text-xs text-muted-foreground mb-4 leading-relaxed">
            Share via WhatsApp or Telegram to open the mobile link on your phone.
            The message includes <strong className="text-foreground">both links</strong> + setup instructions.
          </p>
          <div className="grid grid-cols-2 gap-3 mb-4">
            <a
              href={waShare}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#25D366] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.554 4.118 1.523 5.845L.057 23.571a.5.5 0 00.602.602l5.733-1.464A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.882 0-3.65-.502-5.17-1.379l-.37-.214-3.835.98.995-3.838-.228-.374A9.96 9.96 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              WhatsApp
            </a>
            <a
              href={tgShare}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 py-2.5 rounded-xl bg-[#0088cc] text-white text-sm font-semibold hover:opacity-90 transition-opacity"
            >
              <MessageCircle size={15} />
              Telegram
            </a>
          </div>

          {/* Auto-generated message */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-semibold text-muted-foreground">Auto-generated message</p>
              <button
                onClick={() => copy(autoMessage, 'msg')}
                className={cn(
                  'flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all',
                  copied['msg']
                    ? 'border-primary/25 bg-primary/8 text-primary'
                    : 'border-border bg-secondary hover:border-primary/30',
                )}
              >
                {copied['msg'] ? <><Check size={11} />Copied!</> : <><Copy size={11} />Copy text</>}
              </button>
            </div>
            <div className="bg-secondary/40 border border-border rounded-xl p-3 max-h-44 overflow-y-auto">
              <pre className="text-xs text-muted-foreground whitespace-pre-wrap font-mono leading-relaxed">
                {autoMessage}
              </pre>
            </div>
          </div>
        </div>

        {/* Before your interview checklist */}
        <div className="card-base p-5 animate-fade-up-2">
          <h2 className="text-sm font-bold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Before your interview
          </h2>
          <ol className="space-y-3">
            {[
              {
                icon: '📧',
                t: 'Check your email',
                d: 'Confirmation + PDF guide sent to your Gmail. Read the PDF before your interview.',
              },
              {
                icon: '📖',
                t: 'Read the guide',
                d: 'Visit /guide for step-by-step setup — virtual desktops, screen share, phone placement.',
              },
              {
                icon: '🖥️',
                t: 'Practice virtual desktops',
                d: 'Win+Tab → New Desktop. Practice switching Desktop 1 and Desktop 2 before the actual day.',
              },
              {
                icon: '📱',
                t: 'Get mobile link on your phone',
                d: 'Use the WhatsApp/Telegram buttons above to send both links to yourself now.',
              },
              {
                icon: '💬',
                t: 'Wait for our confirmation',
                d: 'We will message you on Telegram or WhatsApp to confirm session details.',
              },
            ].map((s, i) => (
              <li key={i} className="flex gap-3">
                <span className="text-lg flex-shrink-0">{s.icon}</span>
                <div>
                  <p className="text-sm font-semibold">{s.t}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed mt-0.5">{s.d}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap justify-center gap-3 pt-2 animate-fade-up-3">
          <Button variant="outline" asChild>
            <Link href="/guide">📖 Read the guide</Link>
          </Button>
          <Button asChild>
            <Link href="/">
              <ArrowLeft size={14} />Book another session
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}
