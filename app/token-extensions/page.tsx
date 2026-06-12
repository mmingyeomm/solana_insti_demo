import { Coins, FileText, Globe, Landmark, PlayCircle } from "lucide-react";
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
    icon: Landmark,
    title: "PYUSD",
    issuer: "PayPal, Paxos",
    body: "PayPal의 달러 스테이블코인 PYUSD는 솔라나에서 Token Extensions를 활용한 대표 사례입니다. 전송 제어, 규제 대응, 수수료 정책 등 기관형 스테이블코인 운영에 필요한 기능을 토큰 레벨에서 적용할 수 있도록 설계되었습니다.",
  },
  {
    icon: Coins,
    title: "USDP",
    issuer: "Paxos",
    body: "Paxos의 규제형 달러 스테이블코인 USDP는 솔라나 Token Extensions를 통해 발행자 권한과 전송 정책을 토큰 단위로 관리합니다. 이를 통해 규제 준수에 필요한 운영 통제를 자산 자체에 반영할 수 있습니다.",
  },
  {
    icon: Globe,
    title: "GYEN 및 ZUSD",
    issuer: "GMO Trust",
    body: "GMO Trust의 엔화 및 달러 스테이블코인인 GYEN과 ZUSD는 솔라나 기반 발행 과정에서 Token Extensions를 활용한 사례입니다. 발행자는 자산별 규제 요건에 맞춰 권한, 전송 상태, 메타데이터 등 주요 정책을 토큰 단위로 운영할 수 있습니다.",
  },
];

export default function TokenExtensionsPage() {
  return (
    <main className="token-extensions-page">
      <SiteHeader />

      <section className="token-intro">
        <div className="token-intro-copy">
          <h1>토큰 익스텐션 기반 기관 정책 내장</h1>
          <p>전송 통제, 정보 공개 범위, 이자와 수수료 등 기관 운영에 필요한 정책을 별도 시스템에 의존하지 않고 토큰 레벨에서 직접 설정하고 관리합니다.</p>
        </div>
      </section>

      <section className="detail-section" id="simulation">
        <TokenFeatureAccordion />
      </section>

      <section className="detail-section" id="more-extensions">
        <div className="section-heading wide">
          <div>
            <h2>기관 자산 운영에 필요한 설정을 토큰 자체에 반영합니다.</h2>
          </div>
          <p>발행자는 전송 제한, 메타데이터 관리, 접근 제어, 운영 권한을 자산별 요건에 맞게 설계할 수 있습니다.</p>
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
        <div className="section-heading">
          <h2>토큰 익스텐션을 적용한 주요 스테이블코인 사례</h2>
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
              </article>
            );
          })}
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
