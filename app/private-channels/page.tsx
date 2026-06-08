import { ArrowRight, Banknote, Building2, Landmark, LockKeyhole, RefreshCw } from "lucide-react";
import { SimulationShowcase } from "../components/SimulationShowcase";
import { SiteHeader } from "../components/SiteHeader";

const channelSteps = [
  {
    title: "채널 개설",
    body: "참여자와 한도, 실행 조건을 먼저 정합니다.",
  },
  {
    title: "내부 실행",
    body: "참여자 사이의 이전을 채널 안에서 처리합니다.",
  },
  {
    title: "최종 정산",
    body: "필요한 시점에 상태를 공개 정산 레이어에 반영합니다.",
  },
];

const cases = [
  {
    icon: Landmark,
    title: "은행 간 채널",
    body: "두 금융기관 사이의 반복 이전을 채널 내부에서 처리합니다.",
  },
  {
    icon: RefreshCw,
    title: "유동성 이동",
    body: "운영 계좌와 트레저리 사이의 자금 위치를 조정합니다.",
  },
  {
    icon: Banknote,
    title: "정산 전 이전",
    body: "외부 공개 전 필요한 이전 결과만 정리해 반영합니다.",
  },
];

export default function PrivateChannelsPage() {
  return (
    <main>
      <SiteHeader />

      <section className="detail-hero">
        <p className="eyebrow">Private Channels</p>
        <h1>비공개 실행과 정산을 분리합니다.</h1>
        <p>
          참여자 간 이전은 채널 내부에서 처리하고, 필요한 상태만 정산 레이어에 반영합니다.
        </p>
      </section>

      <section className="detail-section" id="visual">
        <div className="section-heading">
          <p className="eyebrow">시각자료</p>
          <h2>채널 안에서 실행되는 이전 흐름.</h2>
        </div>
        <div className="channel-visual-card">
          <div className="channel-party">
            <Landmark size={24} aria-hidden="true" />
            <span>은행 A</span>
          </div>
          <div className="channel-center">
            <LockKeyhole size={24} aria-hidden="true" />
            <strong>Private Channel</strong>
            <span>내부 실행</span>
          </div>
          <div className="channel-party">
            <Building2 size={24} aria-hidden="true" />
            <span>은행 B</span>
          </div>
        </div>
        <div className="channel-step-grid">
          {channelSteps.map((step) => (
            <article key={step.title}>
              <strong>{step.title}</strong>
              <p>{step.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="detail-section" id="simulation">
        <div className="section-heading">
          <p className="eyebrow">시뮬레이션</p>
          <h2>채널 실행과 정산 흐름을 확인합니다.</h2>
        </div>
        <SimulationShowcase categoryIds={["channels"]} initialCategoryId="channels" compactTabs />
      </section>

      <section className="detail-section" id="cases">
        <div className="section-heading">
          <p className="eyebrow">사례</p>
          <h2>비공개 실행이 필요한 적용 영역.</h2>
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
          <h2>토큰 정책 구조도 함께 확인합니다.</h2>
        </div>
        <a className="button button-dark" href="/token-extensions">
          토큰 익스텐션
          <ArrowRight size={16} aria-hidden="true" />
        </a>
      </section>
    </main>
  );
}
