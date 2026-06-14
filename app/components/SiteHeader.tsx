import { Menu } from "lucide-react";

const navItems = [
  { label: "홈", href: "/" },
  { label: "Token Extensions", href: "/token-extensions" },
  { label: "Private Channels", href: "/private-channels" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="/" aria-label="솔라나 재단 X 한국은행 홈">
        <img className="brand-logo" src="/solana.svg" alt="" aria-hidden="true" />
        <span>솔라나 재단 X 한국은행</span>
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
