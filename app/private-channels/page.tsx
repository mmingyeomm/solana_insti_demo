import { ExternalLink, GitFork } from "lucide-react";
import { PrivateChannelsShowcase } from "../components/PrivateChannelsShowcase";
import { PrivateChannelUseCases } from "../components/PrivateChannelUseCases";
import { SiteHeader } from "../components/SiteHeader";

export default function PrivateChannelsPage() {
  return (
    <main className="private-channels-page">
      <SiteHeader />

      <section className="detail-hero">
        <h1>기관 전용 Private Channel</h1>
        <p>
        기관 전용 비공개 채널인 Private Channel은 기관 참여자 간 거래를 별도 채널에서 빠르고 비공개로 처리하는 구조입니다.
        자산의 이동과 정산은 메인넷과 연결해 관리합니다.
        </p>
      </section>

      <section className="detail-section" id="structure">
        <div className="section-heading wide">
          <div>
            <h2>Private Channel 구성 방식</h2>
          </div>
        </div>
        <PrivateChannelsShowcase />
      </section>

      <section className="detail-section" id="use-cases">
        <div className="section-heading wide">
          <div>
            <h2>Private Channels 활용 사례</h2>
          </div>
        </div>
        <PrivateChannelUseCases />
      </section>

      <section className="final-cta">
        <div>
          <h2>관련 자료에서 더 자세히 확인할 수 있습니다.</h2>
        </div>
        <div className="cta-actions">
          <a
            className="button button-dark"
            href="https://launch.solana.com/products/private-channels"
            rel="noreferrer"
            target="_blank"
          >
            <ExternalLink size={16} aria-hidden="true" />
            제품 페이지
          </a>
          <a
            className="button button-muted"
            href="https://github.com/solana-foundation/solana-private-channels"
            rel="noreferrer"
            target="_blank"
          >
            <GitFork size={16} aria-hidden="true" />
            GitHub
          </a>
        </div>
      </section>
    </main>
  );
}
