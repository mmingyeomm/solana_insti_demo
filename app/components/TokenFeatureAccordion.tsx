"use client";

import { useState } from "react";
import {
  Ban,
  Check,
  ChevronDown,
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
    summary: "전송이 실행되기 전에 기관이 정한 검증 로직을 적용합니다.",
    setup: "검증 프로그램, 허용 목록, 제한 조건",
    pass: "승인 계정은 토큰 익스텐션을 통과합니다.",
    fail: "제한 계정은 전송 전에 실패합니다.",
    steps: ["요청", "검증 호출", "판단"],
    detail:
      "Transfer Hook는 하나의 고정된 검사만 제공하는 기능이 아니라, 발행자가 전송 직전에 실행할 검증 로직을 직접 연결하는 구조입니다. 기관은 허용 계정, KYC 상태, 제재 대상 여부, 투자자 자격, 보유 한도, 내부 승인 같은 조건을 토큰 전송 정책에 넣을 수 있습니다. 조건을 통과한 전송만 계속되고, 실패한 전송은 잔액이 이동하기 전에 중단됩니다.",
  },
  {
    id: "default-account-state",
    icon: Snowflake,
    title: "Default Account State",
    label: "기본 동결",
    summary: "새로 생성된 토큰 계정을 기본 동결 상태로 두고, 승인된 계정에 한해 전송을 허용합니다.",
    setup: "신규 계정 상태, 승인 권한, 활성화 조건",
    pass: "활성화된 계정은 토큰을 받을 수 있습니다.",
    fail: "동결 계정은 수신 단계에서 실패합니다.",
    steps: ["계정 생성", "상태 확인", "활성화"],
    detail:
      "Default Account State는 새 토큰 계정을 기본 동결 상태로 만들고, 운영 권한자가 계정별로 동결을 해제하거나 다시 동결할 수 있게 합니다. 승인 전 계정은 토큰을 받을 수 없고, 동결 해제된 계정만 수신이 가능합니다. 이 구조를 통해 발행자는 고객 온보딩, 계정 검토, 제한 대상 대응을 토큰 계정 상태로 관리할 수 있습니다.",
  },
  {
    id: "memo-required",
    icon: ReceiptText,
    title: "Memo Required",
    label: "거래 식별자",
    summary: "감사와 대사에 필요한 참조값을 전송 기록에 남깁니다.",
    setup: "필수 메모 형식, 거래 식별자, 대사 기준",
    pass: "식별자가 있으면 기록과 연결됩니다.",
    fail: "식별자가 없으면 전송이 멈춥니다.",
    steps: ["메모 입력", "형식 확인", "기록 연결"],
    detail:
      "Memo Required는 토큰 전송에 결제 참조값을 함께 남기도록 요구합니다. 송장 번호, 내부 거래 ID, 고객 주문 번호처럼 대사에 필요한 값을 전송 기록과 연결하고, 외부 감사자는 이 참조값과 서명을 기준으로 내부 장부의 거래가 실제 전송과 맞는지 확인할 수 있습니다.",
  },
  {
    id: "confidential-transfer",
    icon: EyeOff,
    title: "Confidential Transfer",
    label: "금액 비공개",
    summary: "거래 금액의 공개 범위를 제한하고, 허용된 참여자만 확인할 수 있도록 설정합니다.",
    setup: "공개 범위, 참여자 권한, 감사 주체",
    pass: "권한 있는 참여자만 필요한 금액 정보를 확인합니다.",
    fail: "외부 관찰자는 금액을 볼 수 없습니다.",
    steps: ["금액 보호", "증명 확인", "잔액 반영"],
    detail:
      "Confidential Transfer는 전송 금액과 잔액의 공개 범위를 제한합니다. 외부에는 민감한 금액 정보를 노출하지 않으면서도, 거래 참여자와 감사자가 필요한 정보를 확인할 수 있는 구조를 설계할 수 있습니다.",
  },
  {
    id: "transfer-fee",
    icon: Percent,
    title: "Transfer Fee",
    label: "수수료 정책",
    summary: "전송 시 수수료를 자동 계산하고, 지정된 정책에 따라 징수하고 관리합니다.",
    setup: "수수료율, 수취 계정, 한도 조건",
    pass: "수수료와 순수령액이 자동으로 나뉩니다.",
    fail: "잔액이나 한도 조건을 넘으면 실패합니다.",
    steps: ["금액 입력", "수수료 계산", "정산 분리"],
    detail:
      "Transfer Fee는 전송 시점에 수수료를 자동으로 계산하고 지정한 수취처로 분리합니다. 발행 수수료, 플랫폼 수수료, 운영 비용처럼 반복적으로 적용되는 조건을 토큰 단위에서 처리할 수 있습니다.",
  },
  {
    id: "interest-bearing-token",
    icon: TrendingUp,
    title: "Interest Bearing Token",
    label: "이자 정책",
    summary: "토큰 잔액에 적용할 이자율 조건을 설정합니다.",
    setup: "이자율, 적용 기준, 표시 방식",
    pass: "정책에 따라 잔액 기준 수익률을 반영합니다.",
    fail: "정책 밖 계산은 표시 값에 반영되지 않습니다.",
    steps: ["이자율 설정", "잔액 기준 계산", "표시 반영"],
    detail:
      "Interest Bearing Token은 토큰의 표시 금액에 이자율 조건을 반영할 수 있게 합니다. 예금형 자산, 기관 간 운용 자산, 수익률이 붙는 결제 잔액처럼 시간에 따라 가치 표시가 달라지는 상품을 토큰 정책으로 설명할 때 사용할 수 있습니다.",
  },
  {
    id: "permanent-delegate",
    icon: KeyRound,
    title: "Permanent Delegate",
    label: "예외 조치 권한",
    summary: "지정된 권한자가 동결, 회수 등 운영상 필요한 예외 조치를 실행할 수 있습니다.",
    setup: "권한 계정, 조치 범위, 승인 절차",
    pass: "권한자의 조치만 실행됩니다.",
    fail: "권한 없는 요청은 거부됩니다.",
    steps: ["상황 발생", "권한 확인", "조치 실행"],
    detail:
      "Permanent Delegate는 지정된 권한자가 필요한 상황에서 이전이나 소각 같은 조치를 수행할 수 있게 합니다. 오류 복구, 제한 대상 대응, 규제 자산 운영처럼 발행자의 개입 권한이 필요한 경우에 쓰입니다.",
  },
];

const featuresById = Object.fromEntries(features.map((feature) => [feature.id, feature]));

const featureGroups = [
  {
    id: "control",
    icon: ShieldCheck,
    eyebrow: "전송 조건 통제",
    title: "컴플라이언스 요건을 토큰 전송 정책에 반영합니다.",
    featureIds: ["transfer-hook", "default-account-state", "permanent-delegate"],
  },
  {
    id: "disclosure",
    icon: EyeOff,
    eyebrow: "정보 공개 범위 관리",
    title: "거래 이력은 유지하면서 민감 정보는 허용된 주체에게만 공개합니다.",
    featureIds: ["memo-required", "confidential-transfer"],
  },
  {
    id: "operations",
    icon: Percent,
    eyebrow: "운영 정책 내장",
    title: "이자와 수수료 계산을 별도 시스템이 아닌 토큰 정책으로 처리합니다.",
    featureIds: ["interest-bearing-token", "transfer-fee"],
  },
];

export function TokenFeatureAccordion() {
  const [openId, setOpenId] = useState(featureGroups[0].featureIds[0]);
  let runningIndex = 0;

  return (
    <div className="token-feature-groups">
      {featureGroups.map((group) => {
        return (
          <section className="token-feature-group" key={group.id}>
            <header className="token-feature-group-head">
              <h2 className="token-feature-group-title">{group.eyebrow}</h2>
              <p className="token-feature-group-desc">{group.title}</p>
            </header>

            <div className="token-feature-accordion">
              {group.featureIds.map((featureId) => {
                const feature = featuresById[featureId];
                const Icon = feature.icon;
                const isOpen = feature.id === openId;
                runningIndex += 1;
                const index = runningIndex - 1;

                return (
          <article className={isOpen ? "token-feature-item open" : "token-feature-item"} key={feature.id}>
            <button
              aria-expanded={isOpen}
              className="token-feature-trigger"
              onClick={() => setOpenId(isOpen ? "" : feature.id)}
              type="button"
            >
              <span className="token-feature-index">{String(index + 1).padStart(2, "0")}</span>
              <Icon size={20} aria-hidden="true" />
              <span className="token-feature-title">
                <strong>{feature.title}</strong>
                <span>{feature.label}</span>
              </span>
              <span className="token-feature-summary">{feature.summary}</span>
              <ChevronDown size={18} aria-hidden="true" />
            </button>

            <div className={`demo-collapse ${isOpen ? "open" : ""}`}>
              <div className="demo-collapse-inner">
              <div className="token-feature-panel">
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
                        <span>토큰 익스텐션</span>
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

                <div className="token-feature-copy">
                  <p>{feature.detail}</p>
                </div>
              </div>
              </div>
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
