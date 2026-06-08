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

const features = [
  {
    id: "transfer-hook",
    icon: ShieldCheck,
    title: "Transfer Hook",
    label: "외부 검증",
    summary: "전송 직전에 허용 계정, 제한 대상, 투자자 요건을 확인합니다.",
    setup: "검증 프로그램, 허용 목록, 제한 조건",
    pass: "승인 계정은 토큰 익스텐션을 통과합니다.",
    fail: "제한 계정은 전송 전에 실패합니다.",
    steps: ["요청", "검증 호출", "판단"],
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
                    <span>데모 무대</span>
                    <strong>{feature.title}</strong>
                  </div>

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
                </div>

                <div className="token-feature-plan">
                  <div>
                    <span>정책 조건</span>
                    <p>{feature.setup}</p>
                  </div>
                  <div>
                    <span>통과</span>
                    <p>{feature.pass}</p>
                  </div>
                  <div>
                    <span>실패</span>
                    <p>{feature.fail}</p>
                  </div>
                  <div className="token-feature-steps">
                    {feature.steps.map((step) => (
                      <span key={step}>{step}</span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </article>
        );
      })}
    </div>
  );
}
