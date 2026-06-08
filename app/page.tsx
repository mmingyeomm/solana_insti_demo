import { ArrowRight, Layers3, LockKeyhole } from "lucide-react";
import { SiteHeader } from "./components/SiteHeader";

const productPages = [
  {
    icon: Layers3,
    title: "토큰 익스텐션",
    href: "/token-extensions",
    description: "토큰에 발행자 정책을 붙여 전송 조건과 공개 범위를 기관 기준으로 통제합니다.",
    items: ["시각자료", "정책 시뮬레이션", "적용 사례"],
  },
  {
    icon: LockKeyhole,
    title: "Private Channels",
    href: "/private-channels",
    description: "기관 참여자 간 이전을 비공개 채널에서 실행하고 정산합니다.",
    items: ["채널 구조", "실행 시뮬레이션", "금융권 사례"],
  },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="home-hero" id="overview">
        <p className="eyebrow">Solana for Institution</p>
        <h1>토큰 정책과 비공개 정산 흐름을 한눈에 봅니다.</h1>
        <p className="hero-copy">
          토큰 익스텐션과 Private Channels가 자산 운영, 전송 통제, 비공개 실행에 어떻게 쓰이는지
          시각자료와 데모로 확인할 수 있습니다.
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
          <p>금융권에서 검토할 만한 구성요소를 페이지별로 정리한 쇼케이스입니다.</p>
        </div>
        <div className="footer-columns">
          {productPages.map((page) => (
            <div key={page.title}>
              <strong>{page.title}</strong>
              <a href={page.href}>시각자료</a>
              <a href={page.href}>시뮬레이션</a>
              <a href={page.href}>사례</a>
            </div>
          ))}
        </div>
      </footer>
    </main>
  );
}
