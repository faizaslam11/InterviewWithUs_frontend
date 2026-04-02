import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

export const metadata: Metadata = {
  title: 'How it works — Live Expert Interview Assistance',
  description: 'Learn exactly how our live expert interview assistance service works. We connect during your interview and show you concise answers in real time. Works with Teams, Zoom, Google Meet.',
  keywords: ['how interview help works', 'live interview assistance', 'interview support service', 'technical interview help India'],
  openGraph: {
    title: 'How it works — Interview with us',
    description: 'Live expert support during your technical interview. Step-by-step guide.',
    type: 'website',
  },
};

export default function GuidePage() {
  return (
    <div className="relative z-10 min-h-screen">
      <div className="container max-w-3xl mx-auto px-4 py-12">

        <Link href="/" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8">
          <ArrowLeft size={14} />Back to home
        </Link>

        <div className="mb-10">
          <h1 className="text-4xl font-extrabold tracking-tight mb-3">How it works</h1>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Everything you need to know before booking your session.
          </p>
        </div>

        <div className="space-y-10">

          {/* 1. What we do */}
          <Section number="1" title="What Interview with us does">
            <p className="text-muted-foreground leading-relaxed mb-4">
              We join your technical interview as a silent "friend." We hear the interviewer's questions
              through your microphone and show you concise, spoken answers on our phone screen which
              you place below your laptop. You glance down, read the answer, and say it naturally.
            </p>
            <div className="card-base p-5 bg-secondary/30">
              <p className="text-sm font-semibold mb-3">The mechanism in plain terms:</p>
              <div className="space-y-2 text-sm font-mono text-muted-foreground">
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">1</span>
                  <span>Interviewer asks a question</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">2</span>
                  <span>We hear it via your open mic on the Jitsi PC link</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">3</span>
                  <span>We type it fast into ChatGPT → 2-3 sentence answer appears</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">4</span>
                  <span>You glance straight down at our phone screen → read answer</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-primary font-bold">5</span>
                  <span>You say it naturally → interviewer thinks you recalled it</span>
                </div>
              </div>
            </div>
          </Section>

          {/* 2. The two links */}
          <Section number="2" title="Your two Jitsi meeting links">
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              After payment, you receive two auto-generated Jitsi Meet links.
              Jitsi is free, open-source, and runs in any browser — no account needed.
            </p>
            <div className="space-y-3">
              <div className="card-base p-5 border-primary/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">💻</span>
                  <div>
                    <p className="font-bold">PC Link — you open this</p>
                    <p className="text-xs text-muted-foreground">Open on Desktop 1 before your interview starts</p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {[
                    'Open in Chrome on Desktop 1 (Win+Tab → New Desktop)',
                    'Share your ENTIRE screen — we see your interview on Desktop 2',
                    'Keep microphone ON — this is how we hear the questions',
                    'Never close or minimise this during the interview',
                  ].map(s => (
                    <li key={s} className="flex gap-2">
                      <CheckCircle2 size={13} className="text-primary mt-0.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-base p-5 border-amber-500/20">
                <div className="flex items-center gap-3 mb-3">
                  <span className="text-2xl">📱</span>
                  <div>
                    <p className="font-bold">Mobile Link — we join this</p>
                    <p className="text-xs text-muted-foreground">Our expert joins here on their phone</p>
                  </div>
                </div>
                <ul className="space-y-1.5 text-sm text-muted-foreground">
                  {[
                    'Our expert joins on their phone — you don\'t need to do anything',
                    'We share our screen showing the ChatGPT answer',
                    'Our mic is OFF — we are completely silent',
                    'You place your phone (showing our screen) below your laptop',
                  ].map(s => (
                    <li key={s} className="flex gap-2">
                      <CheckCircle2 size={13} className="text-amber-500 mt-0.5 flex-shrink-0" />
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Section>

          {/* 3. Desktop setup */}
          <Section number="3" title="Setting up virtual desktops">
            <p className="text-muted-foreground text-sm mb-4 leading-relaxed">
              Virtual desktops are the key. When you share Desktop 2 in your interview,
              the interviewer cannot see Desktop 1 at all. This is built into Windows and Mac — no software needed.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="card-base p-4">
                <p className="text-sm font-bold mb-2">🪟 Windows</p>
                <ol className="space-y-1.5 text-xs text-muted-foreground">
                  {[
                    'Press Win+Tab to open Task View',
                    'Click "New Desktop" — creates Desktop 2',
                    'Open Jitsi PC link on Desktop 1',
                    'Open Teams/Zoom on Desktop 2',
                    'Switch anytime with Win+Tab or Win+Ctrl+Arrow',
                  ].map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="step-num flex-shrink-0 h-[18px] w-[18px] text-[10px]">{i + 1}</span>{s}
                    </li>
                  ))}
                </ol>
              </div>
              <div className="card-base p-4">
                <p className="text-sm font-bold mb-2">🍎 Mac</p>
                <ol className="space-y-1.5 text-xs text-muted-foreground">
                  {[
                    'Swipe up with 3 fingers (Mission Control)',
                    'Click "+" to create a new Space',
                    'Open Jitsi PC link on Space 1',
                    'Open your interview platform on Space 2',
                    'Switch with Ctrl+Left/Right or 3-finger swipe',
                  ].map((s, i) => (
                    <li key={i} className="flex gap-2">
                      <span className="step-num flex-shrink-0 h-[18px] w-[18px] text-[10px]">{i + 1}</span>{s}
                    </li>
                  ))}
                </ol>
              </div>
            </div>
            <div className="mt-3 amber-box text-xs text-muted-foreground">
              <strong className="text-foreground">Important:</strong> In your interview platform (Teams/Zoom),
              always select <strong className="text-foreground">"Desktop 2"</strong> or{' '}
              <strong className="text-foreground">"Screen 2"</strong> when sharing — never "Entire Screen."
            </div>
          </Section>

          {/* 4. Phone placement */}
          <Section number="4" title="Phone placement">
            <div className="card-base p-5 mb-3">
              {/* Diagram */}
              <div className="bg-secondary/30 border border-dashed border-muted-foreground/25 rounded-xl p-5 mb-4">
                <div className="flex justify-center mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-muted-foreground/30 border border-border" />
                    <span className="text-xs font-mono text-muted-foreground">webcam ← always look here</span>
                  </div>
                </div>
                <div className="border border-dashed border-muted-foreground/20 rounded-lg p-4 text-center mb-2">
                  <p className="text-xs text-muted-foreground">Your screen — interviewer sees this</p>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="text-xs text-amber-500 font-bold">↑ glance straight down here</div>
                  <div className="w-14 h-[60px] border-2 border-amber-500/60 bg-amber-500/8 rounded-xl flex flex-col items-center justify-center gap-1">
                    <span className="text-[9px] font-bold text-amber-600 dark:text-amber-400 leading-tight text-center">our answer<br/>screen</span>
                  </div>
                  <span className="text-[10px] text-amber-500 font-semibold">📱 bottom-centre</span>
                </div>
                <div className="h-2 bg-muted/40 border border-border border-t-0 rounded-b-lg mt-2 mx-4" />
              </div>
              <ul className="space-y-1.5 text-sm text-muted-foreground">
                {[
                  { ok: true, t: 'Place phone bottom-centre, directly below your laptop screen' },
                  { ok: true, t: 'Looking straight down = natural "I\'m thinking" movement' },
                  { ok: true, t: 'Tilt phone toward you at ~30° for easier reading' },
                  { ok: false, t: 'Don\'t look left/right — lateral movement is suspicious' },
                  { ok: false, t: 'Don\'t stare at phone — glance for 2-3 seconds, look back up' },
                ].map(tip => (
                  <li key={tip.t} className="flex items-start gap-2">
                    <span>{tip.ok ? '✅' : '❌'}</span><span>{tip.t}</span>
                  </li>
                ))}
              </ul>
            </div>
          </Section>

          {/* 5. Acting natural */}
          <Section number="5" title="How to act natural">
            <div className="space-y-3">
              {[
                { t: '"Let me think for a second…"', d: 'Say this after every question. Buys 5-10 seconds for us to get the answer. Every interviewer expects candidates to pause.' },
                { t: 'Don\'t read word-for-word', d: 'Glance at our answer, understand the idea, then say it in your own voice. Verbatim reading sounds unnatural.' },
                { t: 'Add your own opener', d: 'Start with "So the way I think about this is…" or "Yeah, I\'d approach it by…" — this gives you 2-3 more seconds while we finish getting the answer.' },
                { t: 'Vary your pace', d: 'Speak slower on your opening sentence if the answer hasn\'t appeared yet. Speed up once you\'ve read it.' },
                { t: 'No headphones', d: 'Headphones block your ambient sound. Without them, your open mic on Desktop 1 picks up the interviewer\'s voice through your laptop speakers — we hear everything clearly.' },
              ].map(tip => (
                <div key={tip.t} className="card-base p-4">
                  <p className="text-sm font-semibold mb-1">{tip.t}</p>
                  <p className="text-xs text-muted-foreground leading-relaxed">{tip.d}</p>
                </div>
              ))}
            </div>
          </Section>

          {/* 6. Pre-interview checklist */}
          <Section number="6" title="Pre-interview checklist">
            <div className="space-y-3">
              {[
                { time: '30 minutes before', items: [
                  'You receive both Jitsi links in your email — open and save them',
                  'Test the PC link in Chrome — confirm screen share and mic work',
                  'Set up Desktop 1 (Win+Tab → New Desktop)',
                  'Charge your phone to 100%',
                ]},
                { time: '15 minutes before', items: [
                  'Open PC link on Desktop 1 — join the room',
                  'Share your entire screen and confirm mic is on',
                  'Open your interview platform on Desktop 2',
                  'Place your phone below your screen — test reading it from there',
                ]},
                { time: 'During the interview', items: [
                  'Switch to Desktop 2 and join your actual interview',
                  'Say "Let me think…" after each question to buy time',
                  'Glance straight down to read answers, look back up at webcam',
                  'We message you on Telegram immediately if anything goes wrong',
                ]},
              ].map(group => (
                <div key={group.time} className="card-base p-4">
                  <p className="text-xs font-bold text-primary uppercase tracking-wider mb-3">{group.time}</p>
                  <ul className="space-y-2">
                    {group.items.map(item => (
                      <li key={item} className="flex items-start gap-2 text-sm text-muted-foreground">
                        <CheckCircle2 size={13} className="text-primary mt-0.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Section>

        </div>

        {/* CTA */}
        <div className="mt-12 text-center card-base p-8">
          <p className="text-xl font-bold mb-2">Ready to book your session?</p>
          <p className="text-muted-foreground text-sm mb-5">
            Payment via Razorpay. Links sent instantly. We confirm on Telegram within 10 minutes.
          </p>
          <Button asChild size="lg">
            <Link href="/#book">
              Book Now — ₹199 / ₹499 <ArrowRight size={15} />
            </Link>
          </Button>
        </div>

      </div>
    </div>
  );
}

function Section({ number, title, children }: { number: string; title: string; children: React.ReactNode }) {
  return (
    <section className="scroll-mt-20">
      <div className="flex items-center gap-3 mb-5">
        <div className="w-8 h-8 rounded-xl bg-primary/10 border border-primary/20 text-primary font-bold text-sm flex items-center justify-center flex-shrink-0 font-mono">
          {number}
        </div>
        <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
      </div>
      {children}
    </section>
  );
}
