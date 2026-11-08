import type { ReactNode } from "react";
import { Check } from "lucide-react";
import { Brand } from "./Brand";

// Gives login and registration a shared layout and a single responsive form area.
export function AuthLayout({ title, subtitle, children }: { title: string; subtitle: string; children: ReactNode }) {
  return (
    <main className="auth-layout">
      <aside className="auth-story">
        <Brand />
        <div>
          <p className="eyebrow">THE SHOPPING LIST APP</p>
          <h2>Good trips<br />start with<br /><em>a list.</em></h2>
          <p>Plan what you need, check it off as you go, and share a copy with anyone.</p>
        </div>
        <ul className="story-checklist" aria-hidden="true">
          <li><Check size={17} /> Plan the week</li>
          <li><Check size={17} /> Pick up the essentials</li>
          <li><Check size={17} /> Share the list</li>
        </ul>
      </aside>
      <section className="auth-container" aria-labelledby="auth-title">
        <div className="mobile-brand"><Brand /></div>
        <h1 id="auth-title">{title}</h1>
        <p className="auth-subtitle">{subtitle}</p>
        {children}
      </section>
    </main>
  );
}
