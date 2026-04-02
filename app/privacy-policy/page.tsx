import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
export const metadata: Metadata = { title: 'Privacy Policy — Interview with us' };
export default function PrivacyPage() {
  return (
    <div className="container max-w-2xl mx-auto px-4 py-14 relative z-10">
      <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
        <ArrowLeft size={14} />Back to home
      </Link>
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-xl">🛡️</div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Privacy Policy</h1>
          <p className="text-xs text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
        </div>
      </div>
      <div className="space-y-7 text-sm">
        {[
          { h: 'About this service', body: <p className="text-muted-foreground leading-relaxed"><strong className="text-foreground">Interview with us</strong> is an expert interview preparation service. We join live technical interviews as a silent helper and show candidates concise answers in real time via a Jitsi Meet mobile link.</p> },
          { h: 'Information we collect', body: <ul className="list-disc pl-5 space-y-1 text-muted-foreground"><li>Full name, Gmail, Telegram username</li><li>Interview platform, date/time, duration</li><li>Company name and job role</li><li>Job description (if provided)</li><li>Razorpay payment ID (no card numbers stored — handled by Razorpay)</li></ul> },
          { h: 'How we use your information', body: <ul className="list-disc pl-5 space-y-1 text-muted-foreground"><li>Generate Jitsi meeting links for your session</li><li>Send confirmation email with session details</li><li>Coordinate with you on Telegram before interview</li><li>Process payment via Razorpay</li></ul> },
          { h: 'Payment data', body: <p className="text-muted-foreground leading-relaxed">All payments are processed by Razorpay. We never see or store your card details. We only receive a payment confirmation and payment ID from Razorpay after successful payment.</p> },
          { h: 'Data storage', body: <p className="text-muted-foreground leading-relaxed">Booking data is stored in Supabase (PostgreSQL). Meeting links are generated using Jitsi Meet — no account required. Data is retained for 90 days then deleted.</p> },
          { h: 'Data sharing', body: <p className="text-muted-foreground leading-relaxed">We do not sell or share your data. Your Gmail is used only to send booking confirmation. Your Telegram username is used only for session coordination.</p> },
          { h: 'Your rights', body: <p className="text-muted-foreground leading-relaxed">Request deletion of your data by contacting us on Telegram. We process requests within 7 days.</p> },
          { h: 'Contact', body: <p className="text-muted-foreground">Telegram: <a href="https://t.me/interviewwithus_bot" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">@interviewwithus_bot</a></p> },
        ].map(s => (
          <section key={s.h}>
            <h2 className="font-bold text-base mb-2 text-foreground">{s.h}</h2>
            {s.body}
          </section>
        ))}
        <div className="border-t border-border pt-5">
          <p className="text-xs text-muted-foreground">Using this service constitutes acceptance of this privacy policy.</p>
        </div>
      </div>
    </div>
  );
}
