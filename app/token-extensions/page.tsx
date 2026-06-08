import { Coins, FileText, Globe, Landmark, PlayCircle } from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { TokenFeatureAccordion } from "../components/TokenFeatureAccordion";

const moreExtensions = [
  {
    name: "Mint close authority",
    body: "민트 계정을 닫고 남은 계정 잔액을 회수할 수 있습니다.",
  },
  {
    name: "Non-transferable tokens",
    body: "사용자 간 양도를 막아 특정 계정에 묶인 자산을 만들 수 있습니다.",
  },
  {
    name: "Metadata pointer",
    body: "토큰 메타데이터를 참조할 주소를 지정합니다. 필요하면 민트 계정 자체를 기준으로 둘 수 있습니다.",
  },
  {
    name: "Metadata",
    body: "커스텀 필드를 포함한 메타데이터를 민트 계정에 직접 저장합니다.",
  },
  {
    name: "CPI Guard",
    body: "다른 프로그램이 토큰 계정에 접근할 때 허용하지 않을 동작을 제한합니다.",
  },
  {
    name: "Reallocate",
    body: "계정 생성 후 추가 확장을 넣을 공간을 확보하도록 토큰 계정을 재할당합니다.",
  },
];

const cases = [
  {
    icon: Landmark,
    title: "PYUSD",
    issuer: "PayPal, Paxos",
    body: "솔라나에서 토큰 익스텐션을 본격 활용한 대표 달러 스테이블코인입니다.",
    tags: ["Permanent Delegate", "Memo", "Transfer Fee", "Transfer Hook"],
  },
  {
    icon: Coins,
    title: "USDP",
    issuer: "Paxos",
    body: "규제 달러 스테이블코인으로, 초기부터 토큰 익스텐션을 도입해 발행자 통제를 토큰 단위로 적용합니다.",
    tags: ["Token Extensions"],
  },
  {
    icon: Globe,
    title: "GYEN 및 ZUSD",
    issuer: "GMO Trust",
    body: "엔화와 달러 스테이블코인에 토큰 익스텐션을 적용해 규제 준수에 필요한 정책을 토큰 단위로 운영합니다.",
    tags: ["Token Extensions"],
  },
];

export default function TokenExtensionsPage() {
  return (
    <main className="token-extensions-page">
      <SiteHeader />

      <section className="token-intro">
        <div className="token-intro-copy">
          <h1>기관에 필요한 정책을 토큰에 직접 내장합니다.</h1>
          <p>전송 통제, 정보 공개 범위, 이자와 수수료 같은 운영 정책을 별도 시스템 없이 토큰 레벨에서 처리합니다.</p>
        </div>
      </section>

      <section className="detail-section" id="simulation">
        <TokenFeatureAccordion />
      </section>

      <section className="detail-section" id="more-extensions">
        <div className="section-heading wide">
          <div>
            <h2>위 데모가 전부는 아닙니다.</h2>
          </div>
          <p>이 외에도 다양한 확장을 조합해 적용할 수 있습니다.</p>
        </div>

        <div className="token-more-list">
          {moreExtensions.map((item) => (
            <div className="token-more-row" key={item.name}>
              <code>{item.name}</code>
              <p>{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="detail-section" id="cases">
        <div className="section-heading">
          <h2>토큰 익스텐션을 적용한 실제 발행 사례</h2>
        </div>
        <div className="case-grid">
          {cases.map((item) => {
            const Icon = item.icon;
            return (
              <article className="case-card" key={item.title}>
                <Icon size={22} aria-hidden="true" />
                <div className="case-card-title">
                  <h3>{item.title}</h3>
                  <span>{item.issuer}</span>
                </div>
                <p>{item.body}</p>
                <div className="case-card-tags" aria-label="적용 익스텐션">
                  {item.tags.map((tag) => (
                    <code key={tag}>{tag}</code>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="final-cta">
        <div>
          <h2>자료에서 더 자세히 확인합니다.</h2>
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
