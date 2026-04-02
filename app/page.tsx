import Link from 'next/link';
import { BookingForm } from '@/components/BookingForm';
import { CheckCircle2, Star, Shield, Clock, Zap, ArrowRight } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="hero-bg">

      {/* Hero */}
      <section className="container max-w-5xl mx-auto px-4 pt-16 pb-12 text-center relative z-10">
        <div className="animate-fade-up">
          <div className="badge-green mb-6">
            <Zap size={10} fill="currentColor" />Live expert assistance — every session
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-5 leading-[1.06]">
            Nail your next interview.<br />
            <span className="text-primary">With real-time expert support.</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
            A live human expert assists you throughout your interview — giving you the right answers
            at the right moment. No more blanking out on questions you knew the answer to.
          </p>
          <div className="flex flex-wrap justify-center gap-6 text-sm text-muted-foreground mb-14">
            {[
              { icon: <Shield size={13} />, t: 'Secure payment via Razorpay' },
              { icon: <Clock size={13} />, t: 'We confirm within 10 minutes' },
              { icon: <Star size={13} />, t: 'Real human expert, every session' },
            ].map(s => (
              <div key={s.t} className="flex items-center gap-1.5">
                <span className="text-primary">{s.icon}</span>{s.t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="container max-w-5xl mx-auto px-4 pb-16 relative z-10">
        <h2 className="text-center text-2xl font-extrabold tracking-tight mb-8">How it works</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { step: '1', icon: '📋', title: 'Book & pay', desc: 'Fill in your interview details. Pay securely via Razorpay — cards, UPI, netbanking all accepted.' },
            { step: '2', icon: '📧', title: 'Receive your links', desc: 'Meeting links emailed to you instantly along with a setup guide PDF. We confirm on Telegram or WhatsApp.' },
            { step: '3', icon: '🎯', title: 'Expert joins live', desc: 'During your interview, our expert is connected and helping you in real time. You focus on presenting.' },
          ].map(s => (
            <div key={s.step} className="card-base card-hover p-6 text-center">
              <div className="text-3xl mb-3">{s.icon}</div>
              <div className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center mx-auto mb-3 font-mono">{s.step}</div>
              <h3 className="font-bold mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Main: Form + sidebar */}
      <section id="book" className="container max-w-5xl mx-auto px-4 pb-20 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-start">
          <div className="lg:col-span-3 animate-fade-up-1">
            <div className="card-base p-6 sm:p-8">
              <h2 className="text-xl font-bold mb-1">Book your session</h2>
              <p className="text-sm text-muted-foreground mb-6">
                Fill the form and pay. Meeting links arrive in your email within seconds.
              </p>
              <BookingForm />
            </div>
          </div>

          <div className="lg:col-span-2 space-y-4 animate-fade-up-2">
            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />What's included
              </h3>
              <ul className="space-y-2.5">
                {[
                  'Live expert support during your entire interview',
                  'Real-time, concise answers delivered to you',
                  'Two Jitsi meeting links auto-generated',
                  'Confirmation email with links + PDF guide',
                  'Telegram / WhatsApp coordination before interview',
                  'Works with Teams, Zoom, Meet, and all platforms',
                  'Post-session feedback (1 hour+ plan)',
                ].map(item => (
                  <li key={item} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <CheckCircle2 size={13} className="text-primary mt-0.5 flex-shrink-0" />{item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="card-base p-5">
              <h3 className="text-sm font-bold mb-4 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary" />Pricing
              </h3>
              <div className="space-y-3">
                {[
                  { label: '30 minutes', price: '₹299', fresher: '₹149', tag: '' },
                  { label: '1 hour+', price: '₹499', fresher: '₹349', tag: 'Most popular' },
                ].map(p => (
                  <div key={p.label} className="flex items-center justify-between p-3 rounded-xl border border-border bg-secondary/30">
                    <div>
                      <p className="text-sm font-semibold">{p.label}</p>
                      {p.tag && <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">{p.tag}</span>}
                    </div>
                    <div className="text-right">
                      <p className="font-bold">{p.price}</p>
                      <p className="text-[11px] text-primary font-semibold">Freshers: {p.fresher}</p>
                    </div>
                  </div>
                ))}
                <p className="text-[11px] text-muted-foreground">Promo codes available for referrals</p>
              </div>
            </div>

            <div className="card-base p-5 space-y-3">
              {[
                { icon: <Shield size={13} />, t: 'Payment secured by Razorpay' },
                { icon: <Clock size={13} />, t: 'We confirm within 10 minutes of payment' },
                { icon: <CheckCircle2 size={13} />, t: 'We reach out to you — no bot interaction needed' },
              ].map(t => (
                <div key={t.t} className="flex items-center gap-2.5 text-sm text-muted-foreground">
                  <span className="text-primary flex-shrink-0">{t.icon}</span>{t.t}
                </div>
              ))}
            </div>

            <Link href="/guide"
              className="flex items-center justify-between p-4 rounded-xl border border-border bg-card/60 hover:border-primary/30 transition-colors group">
              <div>
                <p className="text-sm font-semibold">📖 How it works in detail</p>
                <p className="text-xs text-muted-foreground mt-0.5">Read the full guide before your session</p>
              </div>
              <ArrowRight size={14} className="text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="container max-w-3xl mx-auto px-4 pb-24 relative z-10">
        <h2 className="text-2xl font-extrabold tracking-tight text-center mb-8">Common questions</h2>
        <div className="space-y-3">
          {[
            { q: 'Is this service discreet?', a: 'Yes. The interviewer only sees what you choose to show them on your screen. Our expert connects through a separate channel that is completely invisible to the interviewer. Everything is handled discreetly.' },
            { q: 'How does the expert know what questions are being asked?', a: 'Your expert connects to a live support session where they can follow along with your interview in real time. They hear and see exactly what is happening and provide answers accordingly.' },
            { q: 'What happens on my phone during the interview?', a: 'Your phone shows the answers from our expert. You place it below your laptop screen so you can read the answers with a natural downward glance — the same movement as looking at your keyboard.' },
            { q: 'What if the company reschedules my interview?', a: 'No need to rebook. Just message us on Telegram or WhatsApp with the new time. We will join on the same links at the rescheduled time. Your booking stays valid.' },
            { q: 'What if I am a fresher?', a: 'We offer special fresher pricing — ₹149 for 30 minutes and ₹349 for 1 hour+. Just tick the "I am a fresher" checkbox on the booking form and the price updates automatically.' },
            { q: 'How do I share this with a friend and get a discount?', a: 'Ask us for a referral promo code on Telegram or WhatsApp. When your friend books using your code, they get a discount — and we will give you one too on your next session.' },
            { q: 'What is the refund policy?', a: 'If our expert is unable to join your session due to reasons on our end, we provide a full refund. For cancellations by the candidate, please contact us at least 2 hours before the session.' },
          ].map(faq => (
            <details key={faq.q} className="card-base group cursor-pointer">
              <summary className="p-5 text-sm font-semibold flex items-center justify-between gap-4 list-none">
                {faq.q}
                <span className="text-muted-foreground flex-shrink-0 group-open:rotate-45 transition-transform">+</span>
              </summary>
              <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                {faq.a}
              </div>
            </details>
          ))}
        </div>
      </section>
    </div>
  );
}
