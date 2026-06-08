import { ArrowRight, Layers3, LockKeyhole } from "lucide-react";
import { SiteHeader } from "./components/SiteHeader";

const productPages = [
  {
    icon: Layers3,
    title: "토큰 익스텐션",
    href: "/token-extensions",
    description: "토큰에 정책을 붙이고, 전송 조건과 공개 범위를 설계합니다.",
    items: ["시각자료", "정책 시뮬레이션", "적용 사례"],
  },
  {
    icon: LockKeyhole,
    title: "Private Channels",
    href: "/private-channels",
    description: "참여자 간 이전을 비공개 채널에서 실행하고 정산합니다.",
    items: ["채널 구조", "실행 시뮬레이션", "금융권 사례"],
  },
];

export default function Home() {
  return (
    <main>
      <SiteHeader />

      <section className="home-hero" id="overview">
        <p className="eyebrow">솔라나 결제</p>
        <h1>결제와 자산 흐름을 두 가지 구성요소로 나눠 봅니다.</h1>
        <p className="hero-copy">
          토큰 익스텐션과 Private Channels를 각각의 페이지에서 시각자료,
          시뮬레이션, 사례로 확인합니다.
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
          <a className="brand" href="/" aria-label="솔라나 결제 쇼케이스 홈">
            <img className="brand-logo" src="/solana.svg" alt="" aria-hidden="true" />
            <span>솔라나 결제</span>
          </a>
          <p>각 구성요소를 별도 페이지에서 검토할 수 있도록 정리한 쇼케이스입니다.</p>
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
