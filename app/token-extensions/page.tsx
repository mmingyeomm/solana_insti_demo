import { ExternalLink, FileText, PlayCircle } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { TokenFeatureAccordion } from "../components/TokenFeatureAccordion";

const moreExtensions = [
  {
    name: "Mint Close Authority",
    label: "민트 종료 권한",
    body: "더 이상 사용하지 않는 민트 계정을 닫고 남은 잔액을 회수할 수 있습니다.",
  },
  {
    name: "Non-transferable Tokens",
    label: "양도 제한",
    body: "사용자 간 전송을 제한해 특정 계정에 귀속되는 자산을 구성할 수 있습니다.",
  },
  {
    name: "Metadata Pointer",
    label: "메타데이터 참조",
    body: "토큰 메타데이터가 저장된 위치를 지정하고, 필요 시 민트 계정 자체를 참조 기준으로 설정할 수 있습니다.",
  },
  {
    name: "Metadata",
    label: "메타데이터 내장",
    body: "자산명, 심볼, 커스텀 필드 등 토큰 정보를 민트 계정에 직접 저장할 수 있습니다.",
  },
  {
    name: "CPI Guard",
    label: "외부 호출 제한",
    body: "다른 프로그램이 토큰 계정에 접근할 때 허용되지 않은 동작을 제한합니다.",
  },
  {
    name: "Reallocate",
    label: "계정 확장",
    body: "계정 생성 후 필요한 확장 기능을 추가할 수 있도록 토큰 계정의 저장 공간을 재할당합니다.",
  },
];

const cases = [
  {
    title: "PYUSD",
    issuer: "PayPal",
    image: "/cases/pyusd.png",
    imageAlt: "PYUSD logo",
    source: "공식 자료 보기",
    href: "https://developer.paypal.com/community/blog/pyusd-solana-token-extensions/",
    body: "PayPal 결제 생태계와 연결되는 달러 스테이블코인입니다.",
  },
  {
    title: "USDP",
    issuer: "Paxos",
    image: "/cases/usdp.png",
    imageAlt: "USDP logo",
    source: "공식 자료 보기",
    href: "https://www.paxos.com/usdp",
    body: "규제형 달러 자산 발행 인프라를 대표하는 Paxos의 스테이블코인입니다.",
  },
  {
    title: "USDG",
    issuer: "Global Dollar Network",
    image: "/cases/usdg.png",
    imageAlt: "USDG logo",
    source: "공식 자료 보기",
    href: "https://www.globaldollar.com/",
    body: "글로벌 달러 네트워크가 발행하는 솔라나 기반 달러 스테이블코인입니다.",
  },
];

export default function TokenExtensionsPage() {
  return (
    <main className="token-extensions-page">
      <SiteHeader />

      <section className="token-intro">
        <div className="token-intro-copy">
          <h1>Token Extensions 기반 기관 정책 내장</h1>
          <p>전송 통제, 정보 공개 범위, 이자와 수수료 등 기관 운영에 필요한 정책을 별도 시스템에 의존하지 않고 토큰 레벨에서 직접 설정하고 관리합니다.</p>
        </div>
      </section>

      <section className="detail-section" id="simulation">
        <TokenFeatureAccordion />
      </section>

      <section className="detail-section" id="more-extensions">
        <div className="section-heading wide">
          <div>
            <h2>앞서 소개한 기능 외에도 다양한 Token Extensions를 활용할 수 있습니다.</h2>
          </div>
        </div>

        <div className="token-more-list">
          {moreExtensions.map((item) => (
            <div className="token-more-row" key={item.name}>
              <div className="token-more-name">
                <code>{item.name}</code>
                <span>{item.label}</span>
              </div>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section" id="cases">
        <div className="section-heading wide">
          <div>
            <h2>공식 사례 기반으로 확인하는 Token Extensions 활용</h2>
          </div>
        </div>
        <div className="case-grid official-case-grid">
          {cases.map((item) => (
            <article className="case-card official-case-card" key={item.title}>
              <div className="official-case-media">
                <img alt={item.imageAlt} src={item.image} />
              </div>
              <div className="official-case-copy">
                <div className="case-card-title">
                  <h3>{item.title}</h3>
                  <span>{item.issuer}</span>
                </div>
                <p>{item.body}</p>
                <a className="official-case-link" href={item.href} rel="noreferrer" target="_blank">
                  <ExternalLink size={14} aria-hidden="true" />
                  {item.source}
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="final-cta">
        <div>
          <h2>관련 자료에서 더 자세히 확인할 수 있습니다.</h2>
        </div>
        <div className="cta-actions">
          <a
            className="button button-dark"
            href="https://drive.google.com/file/d/13u20-ItOcNXQpqlO3JHrC1eYhtz1PilE/view"
            rel="noreferrer"
            target="_blank"
          >
            <FileText size={16} aria-hidden="true" />
            문서 읽기
          </a>
          <a
            className="button button-muted"
            href="https://www.youtube.com/watch?v=CEuKahqOYbs"
            rel="noreferrer"
            target="_blank"
          >
            <PlayCircle size={16} aria-hidden="true" />
            영상 보기
          </a>
        </div>
      </section>
    </main>
  );
}
