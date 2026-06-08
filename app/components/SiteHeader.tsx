import { ArrowRight, Menu } from "lucide-react";

const navItems = [
  { label: "토큰 익스텐션", href: "/token-extensions" },
  { label: "Private Channels", href: "/private-channels" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="솔라나 결제 쇼케이스 홈">
        <img className="brand-logo" src="/solana.svg" alt="" aria-hidden="true" />
        <span>솔라나 결제</span>
      </a>
      <nav className="desktop-nav" aria-label="주요 탐색">
        {navItems.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <a className="login-link" href="/token-extensions">
          자료 보기
        </a>
        <a className="button button-dark" href="/private-channels">
          시뮬레이션
          <ArrowRight size={16} aria-hidden="true" />
        </a>
        <button className="icon-button" aria-label="메뉴 열기">
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
