import { ArrowRightLeft, Coins, EyeOff, Landmark, LockKeyhole, Wallet } from "lucide-react";

export function PrivateChannelsShowcase() {
  return (
    <div className="pc-asset-showcase" aria-label="온체인 자산과 Private Channels 연결 구조">
      <section className="pc-asset-panel pc-onchain-panel">
        <div className="pc-panel-title">
          <Landmark size={20} aria-hidden="true" />
          <span>솔라나 메인넷</span>
        </div>

        <div className="pc-asset-stack">
          <div className="pc-asset-card">
            <Coins size={24} aria-hidden="true" />
            <div>
              <strong>온체인 자산</strong>
              <span>실제 토큰이 메인넷에 존재합니다.</span>
            </div>
          </div>

          <div className="pc-asset-card pc-escrow-card">
            <LockKeyhole size={24} aria-hidden="true" />
            <div>
              <strong>에스크로에 잠금</strong>
              <span>잠긴 수량만큼 채널에서 사용할 수 있습니다.</span>
            </div>
          </div>
        </div>
      </section>

      <div className="pc-asset-bridge" aria-hidden="true">
        <span className="pc-asset-bridge-line" />
        <span className="pc-asset-bridge-chip">
          <ArrowRightLeft size={16} aria-hidden="true" />
          1:1 연결
        </span>
      </div>

      <section className="pc-asset-panel pc-private-panel">
        <div className="pc-panel-title">
          <LockKeyhole size={20} aria-hidden="true" />
          <span>Solana Private Channels</span>
        </div>

        <div className="pc-channel-balance">
          <span>채널 잔액</span>
          <strong>잠긴 자산을 기반으로 사용</strong>
        </div>

        <div className="pc-private-transfer">
          <div className="pc-private-wallet">
            <Wallet size={20} aria-hidden="true" />
            <span>기관 고객 A</span>
          </div>
          <div className="pc-private-rail">
            <span>비공개 거래</span>
          </div>
          <div className="pc-private-wallet">
            <Wallet size={20} aria-hidden="true" />
            <span>기관 고객 B</span>
          </div>
        </div>

        <div className="pc-privacy-note">
          <EyeOff size={17} aria-hidden="true" />
          <span>채널 내부 거래는 공개 장부에 바로 드러나지 않습니다.</span>
        </div>
      </section>
    </div>
  );
}
