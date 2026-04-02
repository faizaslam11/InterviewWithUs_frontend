import Link from 'next/link';
import { MessageCircle, Mail } from 'lucide-react';
export function Footer() {
  return (
    <footer className="border-t border-border/50 bg-card/50 mt-auto relative z-10">
      <div className="container max-w-5xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center text-primary-foreground font-bold text-xs">IW</div>
              <span className="font-bold text-sm">Interview with us</span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">Live expert support during your technical interviews. Real answers, real time.</p>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Links</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="text-muted-foreground hover:text-foreground transition-colors">Home</Link></li>
              <li><Link href="/guide" className="text-muted-foreground hover:text-foreground transition-colors">How it works</Link></li>
              <li><Link href="/privacy-policy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-3">Contact</h3>
            <a href="https://t.me/interviewwithus_bot" target="_blank" rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors mb-2">
              <MessageCircle size={14} />@interviewwithus_bot (Telegram)
            </a>
            <a href="mailto:interviewwithus.free@gmail.com"
              className="flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors">
              <Mail size={14} />interviewwithus.free@gmail.com
            </a>
            <p className="text-xs text-muted-foreground mt-3 leading-relaxed">We confirm within 10 minutes<br/>Payment: Razorpay (cards, UPI, netbanking)</p>
          </div>
        </div>
        <div className="border-t border-border/50 mt-8 pt-5 flex justify-between text-xs text-muted-foreground flex-wrap gap-2">
          <p>© {new Date().getFullYear()} Interview with us.</p>
          <Link href="/privacy-policy" className="hover:text-foreground transition-colors">Privacy Policy</Link>
        </div>
      </div>
    </footer>
  );
}
