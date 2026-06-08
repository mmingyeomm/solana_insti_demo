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
  UserRound,
} from "lucide-react";
import { DefaultAccountStateDemo } from "./demos/DefaultAccountStateDemo";
import { TransferHookDemo } from "./demos/TransferHookDemo";

const features = [
  {
    id: "transfer-hook",
    icon: ShieldCheck,
    title: "Transfer Hook",
    label: "외부 검증",
    summary: "전송 직전에 기관이 정의한 검증 로직을 호출합니다.",
    setup: "검증 프로그램, 허용 목록, 제한 조건",
    pass: "승인 계정은 토큰 익스텐션을 통과합니다.",
    fail: "제한 계정은 전송 전에 실패합니다.",
    steps: ["요청", "검증 호출", "판단"],
    detail:
      "Transfer Hook는 정해진 검사 하나를 제공하는 기능이 아니라, 전송 직전에 실행할 검증 로직을 발행자가 직접 연결할 수 있는 구조입니다. 기관은 허용 계정, KYC 상태, 제재 대상 여부, 투자자 자격, 보유 한도, 내부 승인 같은 조건을 토큰 전송 정책에 포함할 수 있습니다. 조건을 통과한 전송만 계속되고, 실패한 전송은 잔액이 이동하기 전에 중단됩니다.",
  },
  {
    id: "default-account-state",
    icon: Snowflake,
    title: "Default Account State",
    label: "기본 동결",
    summary: "새 토큰 계정을 기본 동결 상태로 두고 승인 후 전송을 허용합니다.",
    setup: "신규 계정 상태, 승인 권한, 활성화 조건",
    pass: "활성화된 계정은 토큰을 받을 수 있습니다.",
    fail: "동결 계정은 수신 단계에서 실패합니다.",
    steps: ["계정 생성", "상태 확인", "활성화"],
    detail:
      "Default Account State는 새 토큰 계정이 만들어질 때 기본 상태를 동결로 둘 수 있게 합니다. 계정은 생성 직후 토큰을 받을 수 없고, 발행자나 운영 권한자가 승인한 뒤에 활성화됩니다. 이 구조를 쓰면 미확인 계정으로 자산이 이동하는 상황을 줄이고, 계정 온보딩과 토큰 수신 권한을 분리해서 운영할 수 있습니다.",
  },
  {
    id: "memo-required",
    icon: ReceiptText,
    title: "Memo Required",
    label: "식별자 필수",
    summary: "송장 번호나 내부 거래 ID가 있는 전송만 처리합니다.",
    setup: "필수 메모 형식, 거래 식별자, 대사 기준",
    pass: "식별자가 있으면 기록과 연결됩니다.",
    fail: "식별자가 없으면 전송이 멈춥니다.",
    steps: ["메모 입력", "형식 확인", "기록 연결"],
    detail:
      "Memo Required는 전송마다 필요한 메모를 요구합니다. 송장 번호, 내부 거래 ID, 고객 주문 번호처럼 사후 대사에 필요한 식별자를 전송 단계에서 함께 남기도록 만들 수 있습니다.",
  },
  {
    id: "confidential-transfer",
    icon: EyeOff,
    title: "Confidential Transfer",
    label: "금액 비공개",
    summary: "금액 공개 범위를 제한하고 필요한 주체만 확인할 수 있게 합니다.",
    setup: "공개 범위, 참여자 권한, 감사 주체",
    pass: "권한 있는 주체만 필요한 금액 정보를 확인합니다.",
    fail: "외부 관찰자는 금액을 볼 수 없습니다.",
    steps: ["금액 보호", "증명 확인", "잔액 반영"],
    detail:
      "Confidential Transfer는 전송 금액과 잔액의 공개 범위를 제한합니다. 외부에는 민감한 금액 정보를 노출하지 않으면서도, 필요한 참여자나 감사 주체가 확인할 수 있는 구조를 설계할 수 있습니다.",
  },
  {
    id: "transfer-fee",
    icon: Percent,
    title: "Transfer Fee",
    label: "수수료 정책",
    summary: "전송마다 수수료를 계산하고 지정 계정으로 분리합니다.",
    setup: "수수료율, 수취 계정, 한도 조건",
    pass: "수수료와 순수령액이 자동으로 나뉩니다.",
    fail: "잔액이나 한도 조건을 넘으면 실패합니다.",
    steps: ["금액 입력", "수수료 계산", "정산 분리"],
    detail:
      "Transfer Fee는 전송 시점에 수수료를 자동으로 계산하고 지정된 계정으로 분리합니다. 발행 수수료, 플랫폼 수수료, 운영 비용처럼 반복적으로 적용되는 정책을 토큰 단위에서 처리할 수 있습니다.",
  },
  {
    id: "permanent-delegate",
    icon: KeyRound,
    title: "Permanent Delegate",
    label: "운영 권한",
    summary: "지정 권한자가 제한 상황에서 필요한 조치를 실행합니다.",
    setup: "권한 계정, 조치 범위, 승인 절차",
    pass: "권한자의 조치만 실행됩니다.",
    fail: "권한 없는 요청은 거부됩니다.",
    steps: ["상황 발생", "권한 확인", "조치 실행"],
    detail:
      "Permanent Delegate는 지정된 권한자가 필요한 상황에서 이전이나 소각 같은 조치를 수행할 수 있게 합니다. 오류 복구, 제한 대상 대응, 규제 자산 운영처럼 발행자의 개입 권한이 필요한 경우에 쓰입니다.",
  },
];

export function TokenFeatureAccordion() {
  const [openId, setOpenId] = useState(features[0].id);

  return (
    <div className="token-feature-accordion">
      {features.map((feature, index) => {
        const Icon = feature.icon;
        const isOpen = feature.id === openId;

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

            {isOpen && (
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
            )}
          </article>
        );
      })}
    </div>
  );
}
