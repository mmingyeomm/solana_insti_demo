"use client";

import { useState } from "react";
import {
  BadgeDollarSign,
  Building2,
  ChevronDown,
  Database,
  EyeOff,
  FileSearch,
  Flame,
  Landmark,
  LockKeyhole,
  Scale,
  ShieldCheck,
  Wallet,
} from "lucide-react";

type FlowKind = "deposit" | "trade" | "transfer" | "monitor" | "withdraw";

type Flow = {
  kind: FlowKind;
  name: string;
  title: string;
  desc: string;
  asset: string;
  actorA?: string;
  actorB?: string;
  amount?: string;
};

const scenarios = [
  {
    id: "securities",
    icon: Scale,
    title: "증권거래",
    cta: "증권거래 Private Channels 적용해보기",
    summary: "주문자 정보는 감추고, 체결과 감독은 유지합니다.",
    note: "토큰 증권은 메인넷 에스크로에 잠기고, 주문과 체결은 채널 내부에서 처리됩니다.",
    flows: [
      {
        kind: "deposit",
        name: "입금",
        title: "토큰 증권을 에스크로에 잠그고 채널 잔액을 만듭니다.",
        desc: "투자자나 기관이 메인넷에서 토큰 증권을 예치하면, Private Channels 안에서 거래 가능한 잔액으로 반영됩니다.",
        asset: "토큰 증권",
      },
      {
        kind: "trade",
        name: "거래",
        title: "매수와 매도 주문은 채널 내부에서 매칭됩니다.",
        desc: "주문자 정보와 체결 상세는 공개 장부에 바로 올라가지 않고, 거래소가 관리하는 채널 내부에서 체결 기록으로 남습니다.",
        asset: "토큰 증권",
        actorA: "매수자",
        actorB: "매도자",
        amount: "10,000주",
      },
      {
        kind: "monitor",
        name: "모니터링",
        title: "같은 거래 기록을 권한별로 다르게 조회합니다.",
        desc: "거래소는 전체 체결을 보고, 규제 당국은 감사 범위를 보고, 참여 증권사는 자기 거래만 확인합니다.",
        asset: "체결 기록",
      },
      {
        kind: "withdraw",
        name: "정산",
        title: "정산이 필요할 때만 메인넷으로 결과를 반영합니다.",
        desc: "채널 내부 잔액을 정리하고 출금 요청이 발생하면, burn과 증명 검증을 거쳐 에스크로에서 실제 자산을 풀어줍니다.",
        asset: "토큰 증권",
      },
    ] satisfies Flow[],
  },
  {
    id: "stablecoin",
    icon: BadgeDollarSign,
    title: "스테이블코인 송금",
    cta: "스테이블코인 송금 적용해보기",
    summary: "메인넷 유동성은 유지하고, 송금 상세는 채널 안에 둡니다.",
    note: "스테이블코인은 메인넷 에스크로에 잠기고, 송신자와 수신자 사이의 송금은 채널 내부에서 실행됩니다.",
    flows: [
      {
        kind: "deposit",
        name: "입금",
        title: "스테이블코인을 에스크로에 잠그고 송금 잔액을 만듭니다.",
        desc: "기관이 보유한 스테이블코인을 메인넷 에스크로에 잠그면, 채널 안에서 송금 가능한 잔액이 생깁니다.",
        asset: "스테이블코인",
      },
      {
        kind: "transfer",
        name: "송금",
        title: "송신 기관과 수취 기관 사이의 이전은 채널 안에서 실행됩니다.",
        desc: "송신자, 수신자, 송금액은 공개 장부에 바로 노출되지 않고, 기관이 통제하는 채널 내부에서 처리됩니다.",
        asset: "스테이블코인",
        actorA: "은행 A",
        actorB: "은행 B",
        amount: "$100,000",
      },
      {
        kind: "monitor",
        name: "모니터링",
        title: "송금 기록과 한도는 권한별로 조회합니다.",
        desc: "송금 기관과 수취 기관은 자기 거래를 보고, 규제 담당자는 승인된 범위 안에서 송금 흐름을 확인합니다.",
        asset: "송금 기록",
      },
      {
        kind: "withdraw",
        name: "출금",
        title: "채널 잔액을 소각하고 메인넷 자산을 방출합니다.",
        desc: "수취인이 메인넷 자산을 원하면 채널 잔액을 burn하고, 증명 검증 후 에스크로에서 실제 스테이블코인을 풀어줍니다.",
        asset: "스테이블코인",
      },
    ] satisfies Flow[],
  },
];

function FlowNode({
  icon: Icon,
  label,
  sub,
  tone = "plain",
}: {
  icon: typeof Wallet;
  label: string;
  sub: string;
  tone?: "plain" | "dark" | "private" | "access";
}) {
  return (
    <div className={`pc-visual-node ${tone}`}>
      <Icon size={18} aria-hidden="true" />
      <strong>{label}</strong>
      <span>{sub}</span>
    </div>
  );
}

function FlowVisual({ flow }: { flow: Flow }) {
  if (flow.kind === "deposit") {
    return (
      <div className="pc-flow-visual deposit" aria-label={`${flow.name} 플로우`}>
        <FlowNode icon={Wallet} label="메인넷 지갑" sub={`${flow.asset} 보유`} />
        <div className="pc-flow-lane">
          <span className="pc-flow-chip">예치</span>
        </div>
        <FlowNode icon={LockKeyhole} label="에스크로" sub="실제 자산 1:1 잠금" tone="dark" />
        <div className="pc-flow-lane">
          <span className="pc-flow-chip delayed">반영</span>
        </div>
        <FlowNode icon={Database} label="채널 잔액" sub="거래 가능 잔액 생성" tone="private" />
      </div>
    );
  }

  if (flow.kind === "trade") {
    return (
      <div className="pc-flow-visual trade" aria-label={`${flow.name} 플로우`}>
        <div className="pc-order-stack">
          <FlowNode icon={Wallet} label={flow.actorA ?? "매수자"} sub={`${flow.amount ?? "주문"} 매수`} />
          <FlowNode icon={Building2} label={flow.actorB ?? "매도자"} sub={`${flow.amount ?? "주문"} 매도`} />
        </div>
        <div className="pc-order-lanes" aria-hidden="true">
          <span className="pc-flow-chip buy">매수 주문</span>
          <span className="pc-flow-chip sell">매도 주문</span>
        </div>
        <FlowNode icon={Scale} label="주문 매칭" sub="가격과 수량 체결" tone="private" />
        <div className="pc-flow-lane" aria-hidden="true">
          <span className="pc-flow-chip delayed">체결</span>
        </div>
        <FlowNode icon={Database} label="체결 기록" sub="잔액과 보유 수량 갱신" tone="private" />
        <div className="pc-external-blind">
          <EyeOff size={16} aria-hidden="true" />
          외부 관찰자는 주문자와 체결 상세를 볼 수 없음
        </div>
      </div>
    );
  }

  if (flow.kind === "transfer") {
    return (
      <div className="pc-flow-visual transfer" aria-label={`${flow.name} 플로우`}>
        <FlowNode icon={Landmark} label={flow.actorA ?? "송신 기관"} sub={`${flow.amount ?? "금액"} 송금 요청`} />
        <div className="pc-flow-lane" aria-hidden="true">
          <span className="pc-flow-chip">요청</span>
        </div>
        <FlowNode icon={ShieldCheck} label="Gateway" sub="한도와 승인 규칙 확인" tone="access" />
        <div className="pc-flow-lane" aria-hidden="true">
          <span className="pc-flow-chip delayed">실행</span>
        </div>
        <FlowNode icon={Database} label="채널 송금" sub="금액과 당사자 비공개 처리" tone="private" />
        <div className="pc-flow-lane" aria-hidden="true">
          <span className="pc-flow-chip later">수취</span>
        </div>
        <FlowNode icon={Building2} label={flow.actorB ?? "수취 기관"} sub="채널 잔액 반영" />
      </div>
    );
  }

  if (flow.kind === "monitor") {
    return (
      <div className="pc-flow-visual monitor" aria-label={`${flow.name} 플로우`}>
        <FlowNode icon={Database} label={flow.asset} sub="채널 내부에 원본 기록 저장" tone="private" />
        <div className="pc-monitor-branches">
          <FlowNode icon={ShieldCheck} label="운영자" sub="전체 흐름 관리" tone="access" />
          <FlowNode icon={FileSearch} label="규제 담당자" sub="승인된 범위 감사" tone="access" />
          <FlowNode icon={Building2} label="참여 기관" sub="자기 거래만 조회" tone="access" />
        </div>
        <div className="pc-external-blind">
          <EyeOff size={16} aria-hidden="true" />
          외부에는 에스크로 총액 중심으로만 보임
        </div>
      </div>
    );
  }

  return (
    <div className="pc-flow-visual withdraw" aria-label={`${flow.name} 플로우`}>
      <FlowNode icon={Database} label="채널 잔액" sub="출금 요청 발생" tone="private" />
      <div className="pc-flow-lane" aria-hidden="true">
        <span className="pc-flow-chip">burn</span>
      </div>
      <FlowNode icon={Flame} label="Withdraw" sub="채널 잔액 소각" tone="private" />
      <div className="pc-flow-lane" aria-hidden="true">
        <span className="pc-flow-chip delayed">증명</span>
      </div>
      <FlowNode icon={ShieldCheck} label="SMT 검증" sub="이중 출금 방지" tone="access" />
      <div className="pc-flow-lane" aria-hidden="true">
        <span className="pc-flow-chip later">방출</span>
      </div>
      <FlowNode icon={LockKeyhole} label="에스크로" sub={`${flow.asset} 메인넷 방출`} tone="dark" />
    </div>
  );
}

export function PrivateChannelUseCases() {
  const [openId, setOpenId] = useState(scenarios[0].id);

  return (
    <div className="pc-case-accordion">
      {scenarios.map((item, index) => {
        const Icon = item.icon;
        const isOpen = item.id === openId;
        return (
          <article className={isOpen ? "pc-case-item open" : "pc-case-item"} key={item.id}>
            <button
              aria-expanded={isOpen}
              className="pc-case-trigger"
              onClick={() => setOpenId(isOpen ? "" : item.id)}
              type="button"
            >
              <span className="pc-case-index">{String(index + 1).padStart(2, "0")}</span>
              <Icon size={20} aria-hidden="true" />
              <span className="pc-case-title">
                <strong>{item.title}</strong>
                <span>{item.summary}</span>
              </span>
              <span className="pc-case-action">{item.cta}</span>
              <ChevronDown size={18} aria-hidden="true" />
            </button>

            {isOpen ? (
              <div className="pc-case-panel">
                <div className="pc-case-panel-head">
                  <p>{item.note}</p>
                </div>

                <div className="pc-case-section-list">
                  {item.flows.map((flow) => (
                    <section className="pc-case-section" key={flow.name}>
                      <div className="pc-case-section-copy">
                        <span className="pc-flow-step">{flow.name}</span>
                        <h4>{flow.title}</h4>
                        <p>{flow.desc}</p>
                      </div>

                      <FlowVisual flow={flow} />
                    </section>
                  ))}
                </div>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
