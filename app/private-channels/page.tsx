import { ArrowRight, Gauge, Landmark } from "lucide-react";
import { ChannelFlowDemo } from "../components/ChannelFlowDemo";
import { PrivateChannelsShowcase } from "../components/PrivateChannelsShowcase";
import { PrivateChannelUseCases } from "../components/PrivateChannelUseCases";
import { SiteHeader } from "../components/SiteHeader";

export default function PrivateChannelsPage() {
  return (
    <main className="private-channels-page">
      <SiteHeader />

      <section className="detail-hero">
        <h1>자산은 메인넷에, 결제는 사설 채널에서.</h1>
        <p>
          Private Channels는 메인넷에 1:1로 묶인 자산을 기반으로, 기관이 통제하는 사설
          채널에서 결제를 처리합니다. 채널은 빠르고 무수수료이며 비공개이고, 자산의 보관과
          정산은 언제든 메인넷이 맡습니다.
        </p>
        <div className="pc-analogy" aria-hidden="true">
          <span>
            <Landmark size={16} aria-hidden="true" />
            메인넷 = 금고 (보관과 정산)
          </span>
          <ArrowRight size={15} aria-hidden="true" />
          <span>
            <Gauge size={16} aria-hidden="true" />
            채널 = 창구 (빠른 실행)
          </span>
        </div>
      </section>

      <section className="detail-section" id="structure">
        <div className="section-heading">
          <h2>메인넷은 정산 레이어, 채널은 실행 레이어.</h2>
        </div>
        <PrivateChannelsShowcase />
      </section>

      <section className="detail-section" id="flows">
        <div className="section-heading">
          <h2>채널 이동, 송금, 메인넷 정산이 하나의 구조로 연결됩니다.</h2>
        </div>
        <ChannelFlowDemo />
      </section>

      <section className="detail-section" id="use-cases">
        <div className="section-heading wide">
          <div>
            <h2>증권거래와 스테이블코인 발행 및 송금에서 유틸리티가 바로 드러납니다.</h2>
          </div>
          <p>
            외부에는 에스크로에 잠긴 자산만 보이고, 주문자와 송금 상세 같은 민감한 데이터는
            Private Channels 안에서 권한별로 관리됩니다.
          </p>
        </div>
        <PrivateChannelUseCases />
      </section>

      <section className="final-cta">
        <div>
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
