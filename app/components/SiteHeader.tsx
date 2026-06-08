import { Menu } from "lucide-react";

const navItems = [
  { label: "홈", href: "/" },
  { label: "토큰 익스텐션", href: "/token-extensions" },
  { label: "Private Channels", href: "/private-channels" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="Solana for Institution 홈">
        <img className="brand-logo" src="/solana.svg" alt="" aria-hidden="true" />
        <span>Solana for Institution</span>
      </a>
      <nav className="desktop-nav" aria-label="주요 탐색">
        {navItems.map((item) => (
          <a key={item.label} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button className="icon-button" aria-label="메뉴 열기">
          <Menu size={20} aria-hidden="true" />
        </button>
      </div>
    </header>
  );
}
