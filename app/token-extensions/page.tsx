import {
  ArrowRight,
  Ban,
  Building2,
  FileCheck2,
  Layers3,
  ReceiptText,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { SiteHeader } from "../components/SiteHeader";
import { TokenFeatureAccordion } from "../components/TokenFeatureAccordion";

const cases = [
  {
    icon: FileCheck2,
    title: "토큰화 예금",
    body: "발행자 정책과 계정 상태를 토큰 단위로 관리합니다.",
  },
  {
    icon: ShieldCheck,
    title: "규칙 기반 RWA",
    body: "투자자 요건과 이전 제한을 전송 단계에서 확인합니다.",
  },
  {
    icon: ReceiptText,
    title: "정산 메타데이터",
    body: "주문 번호와 회계 식별자를 결제 기록과 연결합니다.",
  },
];

export default function TokenExtensionsPage() {
  return (
    <main>
      <SiteHeader />

      <section className="token-intro">
        <div className="token-intro-copy">
          <p className="eyebrow">토큰 익스텐션</p>
          <h1>토큰이 전송을 직접 검사합니다.</h1>
          <p>
            전송 조건, 계정 상태, 메모, 수수료 같은 정책을 토큰 레벨에서 확인하고
            조건을 통과한 전송만 처리합니다.
          </p>
        </div>

        <div className="token-intro-art" aria-hidden="true">
          <img src="/token-extensions-shape.png" alt="" />
        </div>
      </section>

      <section className="detail-section" id="visual">
        <div className="token-network-animation" aria-label="토큰 익스텐션 검증 흐름">
          <span className="network-name">솔라나 네트워크</span>

          <div className="token-actor normal">
            <UserRound size={22} aria-hidden="true" />
            <span>정상 사용자</span>
          </div>

          <div className="network-plane" aria-hidden="true">
            <span className="network-grid" />
            <span className="network-wrap network-wrap-outer" />
            <span className="path-line normal-path" />
            <span className="path-line blocked-path" />
            <span className="packet normal-packet" />
            <span className="packet malicious-packet" />
            <span className="pass-badge">통과</span>
            <span className="fail-badge">실패</span>
            <span className="fail-ring" />
          </div>

          <div className="token-checkpoint">
            <Layers3 size={30} aria-hidden="true" />
            <span>토큰 익스텐션</span>
          </div>

          <div className="token-actor malicious">
            <Ban size={22} aria-hidden="true" />
            <span>악성 사용자</span>
          </div>

          <div className="token-destination">
            <Building2 size={22} aria-hidden="true" />
            <span>수신 계정</span>
          </div>
        </div>
      </section>

      <section className="detail-section" id="simulation">
        <div className="section-heading wide">
          <div>
            <p className="eyebrow">정책 시뮬레이터</p>
            <h2>기능별 데모를 접어서 확인합니다.</h2>
          </div>
        </div>
        <TokenFeatureAccordion />
      </section>

      <section className="detail-section" id="cases">
        <div className="section-heading">
          <p className="eyebrow">사례</p>
          <h2>토큰 정책이 필요한 적용 영역.</h2>
        </div>
        <div className="case-grid">
          {cases.map((item) => {
            const Icon = item.icon;
            return (
              <article className="case-card" key={item.title}>
                <Icon size={22} aria-hidden="true" />
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="final-cta">
        <div>
          <p className="eyebrow">다음 페이지</p>
          <h2>채널 내부 실행 구조도 함께 확인합니다.</h2>
        </div>
        <a className="button button-dark" href="/private-channels">
          Private Channels
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
