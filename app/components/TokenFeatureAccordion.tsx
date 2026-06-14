"use client";

import {
  Ban,
  Check,
  EyeOff,
  KeyRound,
  Layers3,
  Percent,
  ReceiptText,
  ShieldCheck,
  Snowflake,
  TrendingUp,
  UserRound,
} from "lucide-react";
import { DefaultAccountStateDemo } from "./demos/DefaultAccountStateDemo";
import { ConfidentialTransferDemo } from "./demos/ConfidentialTransferDemo";
import { InterestBearingTokenDemo } from "./demos/InterestBearingTokenDemo";
import { MemoRequiredDemo } from "./demos/MemoRequiredDemo";
import { PermanentDelegateDemo } from "./demos/PermanentDelegateDemo";
import { TransferFeeDemo } from "./demos/TransferFeeDemo";
import { TransferHookDemo } from "./demos/TransferHookDemo";

const features = [
  {
    id: "transfer-hook",
    icon: ShieldCheck,
    title: "Transfer Hook",
    label: "전송 전 검증",
    setup: "검증 프로그램, 허용 목록, 제한 조건",
    pass: "승인 계정은 Token Extensions를 통과합니다.",
    fail: "제한 계정은 전송 전에 실패합니다.",
    steps: ["요청", "검증 호출", "판단"],
    detail:
      "예금 토큰, 토큰 증권, RWA처럼 참여 자격과 거래 한도가 중요한 자산은 발행자가 정한 검증 절차를 전송 흐름에 반영해야 합니다. Transfer Hook은 기관이 이미 운영 중인 KYC, 제재 대상 확인, 투자자 자격, 보유 한도 같은 로직을 연결해 조건을 통과한 거래만 실행되도록 합니다.",
  },
  {
    id: "default-account-state",
    icon: Snowflake,
    title: "Default Account State",
    label: "기본 동결",
    setup: "신규 계정 상태, 승인 권한, 활성화 조건",
    pass: "활성화된 계정은 토큰을 받을 수 있습니다.",
    fail: "동결 계정은 수신 단계에서 실패합니다.",
    steps: ["계정 생성", "상태 확인", "활성화"],
    detail:
      "기관은 신규 계정이 승인 절차를 거치기 전까지 토큰을 받을 수 없도록 관리해야 합니다. Default Account State는 새 계정을 기본 동결 상태로 시작하게 하고, 승인된 계정만 활성화하거나 이상거래가 감지된 계정을 다시 동결하는 운영 흐름을 만들 수 있습니다.",
  },
  {
    id: "memo-required",
    icon: ReceiptText,
    title: "Memo Required",
    label: "거래 식별자",
    setup: "필수 메모 형식, 거래 식별자, 대사 기준",
    pass: "식별자가 있으면 기록과 연결됩니다.",
    fail: "식별자가 없으면 전송이 멈춥니다.",
    steps: ["메모 입력", "형식 확인", "기록 연결"],
    detail:
      "기관 결제와 정산에서는 전송 기록이 내부 장부의 결제 ID, 송장 번호, 주문 번호와 연결되어야 합니다. Memo Required는 참조값 없는 전송을 막아 회계 대사와 외부 감사에서 어떤 전송이 어떤 업무 거래에 대응되는지 확인할 수 있게 합니다.",
  },
  {
    id: "confidential-transfer",
    icon: EyeOff,
    title: "Confidential Transfer",
    label: "금액 비공개",
    setup: "공개 범위, 참여자 권한, 감사 주체",
    pass: "권한 있는 참여자만 필요한 금액 정보를 확인합니다.",
    fail: "외부 관찰자는 금액을 볼 수 없습니다.",
    steps: ["금액 보호", "증명 확인", "잔액 반영"],
    detail:
      "기관 거래에서는 금액과 잔액이 모두 공개되는 구조가 부담이 될 수 있습니다. Confidential Transfer는 공개 원장에는 암호화된 값만 남기고, 송신자와 수신자, 필요한 감사 주체가 권한을 통해 금액 정보를 확인하는 방식으로 공개 범위를 조정합니다.",
  },
  {
    id: "transfer-fee",
    icon: Percent,
    title: "Transfer Fee",
    label: "수수료 정책",
    setup: "수수료율, 수취 계정, 한도 조건",
    pass: "수수료와 순수령액이 자동으로 나뉩니다.",
    fail: "잔액이나 한도 조건을 넘으면 실패합니다.",
    steps: ["금액 입력", "수수료 계산", "정산 분리"],
    detail:
      "결제 자산을 운영할 때는 가맹점 유형, 상품군, 정산 구조에 따라 다른 수수료율과 상한을 적용해야 합니다. Transfer Fee는 전송 시점에 정책을 계산해 수신 금액과 수수료를 분리하고, 발행자나 플랫폼 같은 지정 수취처로 자동 배분되도록 합니다.",
  },
  {
    id: "interest-bearing-token",
    icon: TrendingUp,
    title: "Interest Bearing Token",
    label: "이자 정책",
    setup: "이자율, 적용 기준, 표시 방식",
    pass: "정책에 따라 잔액 기준 수익률을 반영합니다.",
    fail: "정책 밖 계산은 표시 값에 반영되지 않습니다.",
    steps: ["이자율 설정", "잔액 기준 계산", "표시 반영"],
    detail:
      "예금형 자산이나 운용 잔액처럼 시간에 따라 표시 금액이 달라지는 상품은 이자율 조건을 명확하게 반영해야 합니다. Interest Bearing Token은 기준 잔액에 적용할 이자율과 기간 조건을 토큰 정책으로 다루어 사용자 화면과 운영 장부에서 일관된 표시값을 사용할 수 있게 합니다.",
  },
  {
    id: "permanent-delegate",
    icon: KeyRound,
    title: "Permanent Delegate",
    label: "예외 조치 권한",
    setup: "권한 계정, 조치 범위, 승인 절차",
    pass: "권한자의 조치만 실행됩니다.",
    fail: "권한 없는 요청은 거부됩니다.",
    steps: ["상황 발생", "권한 확인", "조치 실행"],
    detail:
      "오송금, 탈취, 제한 대상 발견처럼 예외 상황이 발생하면 기관은 정해진 권한 절차에 따라 자산을 회수하거나 소각하고 계정을 멈출 수 있어야 합니다. Permanent Delegate는 이런 조치를 실행할 수 있는 권한 주체를 지정해, 일반 사용자가 임의로 개입하지 못하면서도 운영상 필요한 대응을 가능하게 합니다.",
  },
];

const featuresById = Object.fromEntries(features.map((feature) => [feature.id, feature]));

const featureGroups = [
  {
    id: "control",
    icon: ShieldCheck,
    eyebrow: "전송 조건 통제",
    description: "수신 계정과 참여 자격, 제한 대상 여부를 전송 실행 시점에 검증합니다. 체결 이전에 조건을 확인하므로 수작업 심사를 줄이고 위반 거래를 사전에 차단할 수 있습니다.",
    featureIds: ["transfer-hook", "default-account-state", "permanent-delegate"],
  },
  {
    id: "disclosure",
    icon: EyeOff,
    eyebrow: "정보 공개 범위 관리",
    description: "거래 기록은 남기되 금액과 참조값의 공개 범위를 자산 성격에 맞게 조정합니다. 감사에 필요한 추적성은 유지하면서 거래 정보 노출은 제한할 수 있습니다.",
    featureIds: ["memo-required", "confidential-transfer"],
  },
  {
    id: "operations",
    icon: Percent,
    eyebrow: "운영 정책 내장",
    description: "수수료, 이자율, 표시 금액처럼 반복 적용되는 운영 조건을 토큰 정책으로 다룹니다. 정산 로직을 외부 시스템에 따로 두지 않으므로 적용 기준이 일관되고 정책 변경을 바로 반영할 수 있습니다.",
    featureIds: ["interest-bearing-token", "transfer-fee"],
  },
];

export function TokenFeatureAccordion() {
  let runningIndex = 0;

  return (
    <div className="token-feature-groups">
      <section className="token-category-overview" aria-label="Token Extensions 카테고리 개요">
        <div className="token-category-overview-copy">
          <h2>Token Extensions 주요 기능</h2>
        </div>
        <div className="token-category-cards">
          {featureGroups.map((group, index) => {
            return (
              <article className="token-category-card" key={group.id}>
                <div className="token-category-card-head">
                  <span>{String(index + 1).padStart(2, "0")}</span>
                </div>
                <strong>{group.eyebrow}</strong>
                <p>{group.description}</p>
              </article>
            );
          })}
        </div>
      </section>

      {featureGroups.map((group) => {
        const groupFeatures = group.featureIds.map((featureId) => featuresById[featureId]);

        return (
          <section className="token-feature-group" key={group.id}>
            <header className="token-feature-group-head">
              <div>
                <h2 className="token-feature-group-title">{group.eyebrow}</h2>
              </div>
            </header>

            <div className="token-feature-stack">
              {groupFeatures.map((feature) => {
                runningIndex += 1;
                const index = runningIndex - 1;

                return (
                  <article className="token-feature-item" key={feature.id}>
                    <aside className="token-feature-copy">
                      <div className="token-feature-copy-head">
                        <span className="token-feature-index">{String(index + 1).padStart(2, "0")}</span>
                        <span className="token-feature-title">
                          <strong>{feature.title}</strong>
                          <span>{feature.label}</span>
                        </span>
                      </div>
                      <div className="token-feature-brief">
                        <p>{feature.detail}</p>
                      </div>
                    </aside>

                    <div className="token-feature-demo-slot" aria-label={`${feature.title} 데모 영역`}>
                      <div className="demo-slot-label">
                        <span>인터랙티브 데모</span>
                        <strong>{feature.title}</strong>
                      </div>

                      {feature.id === "transfer-hook" ? (
                        <TransferHookDemo />
                      ) : feature.id === "default-account-state" ? (
                        <DefaultAccountStateDemo />
                      ) : feature.id === "memo-required" ? (
                        <MemoRequiredDemo />
                      ) : feature.id === "confidential-transfer" ? (
                        <ConfidentialTransferDemo />
                      ) : feature.id === "transfer-fee" ? (
                        <TransferFeeDemo />
                      ) : feature.id === "interest-bearing-token" ? (
                        <InterestBearingTokenDemo />
                      ) : feature.id === "permanent-delegate" ? (
                        <PermanentDelegateDemo />
                      ) : (
                        <div className="demo-flow-preview" aria-hidden="true">
                          <div className="demo-node">
                            <UserRound size={18} />
                            <span>사용자</span>
                          </div>
                          <div className="demo-token-node">
                            <Layers3 size={22} />
                            <span>Token Extensions</span>
                          </div>
                          <div className="demo-result-stack">
                            <span className="demo-result pass">
                              <Check size={14} />
                              통과
                            </span>
                            <span className="demo-result fail">
                              <Ban size={14} />
                              실패
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
