import { ArrowRight, Layers3, LockKeyhole } from "lucide-react";
import { SiteHeader } from "./components/SiteHeader";

const productPages = [
  {
    icon: Layers3,
    title: "토큰 익스텐션",
    href: "/token-extensions",
    description: "토큰에 발행자 정책을 내장해 기관 기준에 맞는 전송 조건, 권한 관리, 정보 공개 범위를 통제합니다.",
    items: [""],
    links: [
      { label: "시뮬레이션", href: "/token-extensions#simulation" },
      { label: "사례", href: "/token-extensions#cases" },
    ],
  },
  {
    icon: LockKeyhole,
    title: "Private Channels",
    href: "/private-channels",
    description: "메인넷과 연결된 비공개 채널을 통해, 기관 참여자 간 거래를 빠르고 비공개적으로 실행합니다.",
    items: [""],
    links: [
      { label: "시뮬레이션", href: "/private-channels#asset-flow" },
      { label: "사례", href: "/private-channels#use-cases" },
    ],
  },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="home-hero" id="overview">
        <p className="eyebrow">Solana for Institution</p>
        <h1>솔라나 기관형 인프라</h1>
        <p className="hero-copy">
        토큰 정책 관리와 비공개 실행 환경을 제공하는 두 가지 솔라나 솔루션을 확인합니다.
        Token Extensions와 Private Channels가 기관의 자산 발행, 전송 통제, 정보 공개 범위 설정, 비공개 결제 실행에 어떻게 활용되는지 데모와 사례로 확인할 수 있습니다.
        </p>
      </section>

      <section className="intro-band">
        <div className="product-page-grid">
          {productPages.map((page) => {
            const Icon = page.icon;
            return (
              <a className="product-page-card" href={page.href} key={page.title}>
                <div className="product-page-icon">
                  <Icon size={24} aria-hidden="true" />
                </div>
                <div>
                  <h2>{page.title}</h2>
                  <p>{page.description}</p>
                </div>
                <ul>
                  {page.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
                <span>
                  페이지 보기
                  <ArrowRight size={15} aria-hidden="true" />
                </span>
              </a>
            );
          })}
        </div>
      </section>

      <footer className="site-footer">
        <div>
          <a className="brand" href="/" aria-label="Solana for Institution 홈">
            <img className="brand-logo" src="/solana.svg" alt="" aria-hidden="true" />
            <span>Solana for Institution</span>
          </a>
        </div>
        <div className="footer-columns">
          {productPages.map((page) => (
            <div key={page.title}>
              <strong>{page.title}</strong>
              {page.links.map((link) => (
                <a href={link.href} key={link.label}>
                  {link.label}
                </a>
              ))}
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}
