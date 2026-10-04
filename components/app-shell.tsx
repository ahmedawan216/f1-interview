"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
  { label: "Practice", href: "/app/practice", icon: "spark" },
  { label: "Progress", href: "/app/progress", icon: "chart" },
  { label: "Profile", href: "/app/profile", icon: "person" },
];

function NavIcon({ name }: { name: string }) {
  if (name === "spark") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3.5 14.2 9.8 20.5 12l-6.3 2.2L12 20.5l-2.2-6.3L3.5 12l6.3-2.2L12 3.5Z" /><path d="m19 3 .7 2.3L22 6l-2.3.7L19 9l-.7-2.3L16 6l2.3-.7L19 3Z" /></svg>;
  }
  if (name === "chart") {
    return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 19.5h16M6.5 16v-4m5 4V6m5 10v-7" /></svg>;
  }
  return <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="3.5" /><path d="M5 20c.4-3.2 3.2-5 7-5s6.6 1.8 7 5" /></svg>;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const onInterview = pathname === "/app/practice/interview";

  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link className="wordmark app-wordmark" href="/app/practice">
          <span className="brand-mark">f.</span>
          <span>F1 Interview</span>
        </Link>
        <div className="sidebar-label">YOUR WORKSPACE</div>
        <nav className="side-nav" aria-label="Workspace navigation">
          {navigation.map((item) => {
            const active = pathname === item.href ||
              (item.href === "/app/practice" && pathname.startsWith("/app/practice"));
            return (
              <Link className={`side-link${active ? " active" : ""}`} href={item.href} key={item.href} aria-current={active ? "page" : undefined}>
                <NavIcon name={item.icon} />
                <span>{item.label}</span>
                {active && <span className="nav-indicator" />}
              </Link>
            );
          })}
        </nav>
        <div className="sidebar-bottom">
          <span className="sidebar-flower">✳</span>
          <p>Make space to think.<br />You’re doing just fine.</p>
          <span className="sidebar-edition">F-1 INTERVIEW PRACTICE</span>
        </div>
      </aside>
      <div className="workspace-main">
        {!onInterview && (
          <header className="workspace-topbar">
            <div className="breadcrumb"><span>Workspace</span><span>/</span><strong>{navigation.find((item) => pathname.startsWith(item.href))?.label ?? "Practice"}</strong></div>
            <span className="topbar-note"><span className="topbar-dot" /> YOUR OWN PACE</span>
          </header>
        )}
        <main className={onInterview ? "workspace-content interview-content" : "workspace-content"}>{children}</main>
      </div>
    </div>
  );
}
