"use client";

import { type ReactNode, useState } from "react";
import {
  BadgeDollarSign,
  Building2,
  ChevronDown,
  Coins,
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

type FlowKind = "issue" | "deposit" | "trade" | "transfer" | "monitor" | "withdraw" | "privacyWithdraw";

type Flow = {
  kind: FlowKind;
  name: string;
  title: string;
  desc: string;
  points: string[];
  asset: string;
  actorA?: string;
  actorB?: string;
  amount?: string;
  monitorViews?: {
    label: string;
    sub: string;
  }[];
};

const scenarios = [
  {
    id: "securities",
    icon: Scale,
    title: "증권거래",
    cta: "증권거래 Private Channels 적용해보기",
    summary: "주문자 정보는 감추고, 체결과 감독은 유지합니다.",
    note: "토큰 증권은 메인넷 에스크로를 거쳐 Private Channels로 이동하고, 주문과 체결은 채널 내부에서 처리됩니다.",
    flows: [
      {
        kind: "deposit",
        name: "채널 이동",
        title: "토큰 증권을 메인넷에서 Private Channels로 이동합니다.",
        desc: "메인넷 자산은 에스크로에 잠기고, 같은 수량이 채널 안의 거래 잔액으로 반영됩니다.",
        points: [
          "메인넷: 자산 보유",
          "에스크로: 1:1 잠금",
          "채널: 거래 잔액 반영",
          "거래 기준: 채널 잔액",
        ],
        asset: "토큰 증권",
      },
      {
        kind: "trade",
        name: "거래",
        title: "매수와 매도 주문은 채널 내부에서 매칭됩니다.",
        desc: "주문자 정보와 체결 상세는 채널 안에서만 처리됩니다.",
        points: [
          "매수와 매도 주문 유입",
          "채널 안에서 주문 매칭",
          "체결 기록과 보유 수량 갱신",
        ],
        asset: "토큰 증권",
        actorA: "매수자",
        actorB: "매도자",
        amount: "10,000주",
      },
      {
        kind: "monitor",
        name: "모니터링",
        title: "한국거래소와 규제 당국이 권한 범위 안에서 모니터링합니다.",
        desc: "체결 원장은 채널 안에 두고, 각 기관은 필요한 범위만 조회합니다.",
        points: [
          "한국거래소: 전체 시장 감시",
          "금융당국: 감사 범위 조회",
          "참여 증권사: 자기 거래 확인",
        ],
        asset: "체결 기록",
        monitorViews: [
          { label: "한국거래소", sub: "전체 체결 모니터링" },
          { label: "금융당국", sub: "감사 범위 조회" },
          { label: "참여 증권사", sub: "자기 거래 확인" },
        ],
      },
      {
        kind: "withdraw",
        name: "메인넷 정산",
        title: "채널에서 정리한 결과를 메인넷 자산으로 되돌립니다.",
        desc: "채널 잔액을 소각하고 SMT 검증을 거쳐 에스크로의 토큰 증권 잠금을 해제합니다.",
        points: [
          "채널: 잔액 burn",
          "SMT: 중복 이동 방지",
          "메인넷: 자산 수령",
        ],
        asset: "토큰 증권",
      },
    ] satisfies Flow[],
  },
  {
    id: "stablecoin",
    icon: BadgeDollarSign,
    title: "스테이블코인 발행 및 송금",
    cta: "스테이블코인 발행 및 송금 적용해보기",
    summary: "메인넷에서 발행한 자산을 채널로 이동해 비공개 결제로 씁니다.",
    note: "은행은 메인넷에서 스테이블코인을 발행하고, 에스크로를 거쳐 Private Channels로 이동한 수량만큼 은행 간 결제를 처리합니다.",
    flows: [
      {
        kind: "issue",
        name: "발행",
        title: "은행이 메인넷에서 스테이블코인을 발행합니다.",
        desc: "발행 은행이 메인넷에서 mint를 만들고, 결제에 사용할 스테이블코인 잔액을 발행합니다.",
        points: [
          "은행: 발행 권한 보유",
          "메인넷: mint 생성",
          "발행 잔액: 은행 보유",
        ],
        asset: "스테이블코인",
        amount: "$10M",
      },
      {
        kind: "deposit",
        name: "채널 이동",
        title: "발행한 스테이블코인을 메인넷에서 Private Channels로 이동합니다.",
        desc: "메인넷 자산은 에스크로에 잠기고, 같은 수량이 채널 안의 결제 잔액으로 반영됩니다.",
        points: [
          "메인넷: 스테이블코인 보유",
          "에스크로: 1:1 잠금",
          "채널: 결제 잔액 반영",
        ],
        asset: "스테이블코인",
      },
      {
        kind: "transfer",
        name: "송금",
        title: "은행 간 결제는 채널 내부에서 즉시 처리됩니다.",
        desc: "메인넷을 거치지 않고 잔액과 한도를 확인한 뒤, 참여 은행의 채널 잔액을 비공개로 갱신합니다.",
        points: [
          "Gateway 규칙 확인",
          "채널 파이프라인: 즉시 실행",
          "참여 은행 잔액: 원자적 갱신",
        ],
        asset: "스테이블코인",
        actorA: "은행 A",
        actorB: "은행 B",
        amount: "$100,000",
      },
      {
        kind: "monitor",
        name: "감사 조회",
        title: "은행과 감사 주체는 필요한 범위만 조회합니다.",
        desc: "Gateway와 Auth는 참여 은행, 발행 은행, 감사 주체가 볼 수 있는 기록의 범위를 나눕니다.",
        points: [
          "참여 은행: 자기 잔액 확인",
          "발행 은행: 거래 규칙 적용",
          "감사 주체: 승인 범위 조회",
        ],
        asset: "송금 기록",
        monitorViews: [
          { label: "참여 은행", sub: "자기 잔액과 거래" },
          { label: "발행 은행", sub: "한도와 승인 규칙" },
          { label: "감사 주체", sub: "승인 범위 조회" },
        ],
      },
      {
        kind: "privacyWithdraw",
        name: "메인넷 정산",
        title: "채널 잔액을 메인넷 자산으로 되돌릴 때 정산 방식을 선택합니다.",
        desc: "채널 잔액을 소각하고, 배치 정산이나 Confidential Transfer로 메인넷 수령 방식을 정합니다.",
        points: [
          "채널: 잔액 burn",
          "SMT: 중복 이동 방지",
          "배치 정산 또는 Confidential Transfer",
        ],
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

function ChannelShell({
  children,
  mode = "default",
}: {
  children: ReactNode;
  mode?: "default" | "wide";
}) {
  return (
    <div className={`pc-channel-shell ${mode}`}>
      <div className="pc-channel-shell-head">
        <div>
          <span>Private Channel</span>
        </div>
      </div>
      <div className="pc-channel-shell-body">{children}</div>
    </div>
  );
}

function FlowVisual({ flow }: { flow: Flow }) {
  if (flow.kind === "issue") {
    return (
      <div className="pc-flow-visual issue" aria-label={`${flow.name} 플로우`}>
        <FlowNode icon={Building2} label="발행 은행" sub="스테이블코인 발행" />
        <div className="pc-flow-lane">
          <span className="pc-lane-label">mint 준비</span>
        </div>
        <FlowNode icon={Coins} label="메인넷 mint" sub={`${flow.amount ?? "발행 한도"} 발행`} tone="dark" />
        <div className="pc-flow-lane">
          <span className="pc-lane-label">1:1 발행</span>
        </div>
        <FlowNode icon={Wallet} label="은행 보유 잔액" sub={`${flow.asset} 생성`} />
      </div>
    );
  }

  if (flow.kind === "deposit") {
    return (
      <div className="pc-flow-visual deposit" aria-label={`${flow.name} 플로우`}>
        <FlowNode icon={Wallet} label="메인넷 지갑" sub={`${flow.asset} 보유`} />
        <div className="pc-flow-lane">
          <span className="pc-lane-label">잠금</span>
        </div>
        <FlowNode icon={LockKeyhole} label="에스크로" sub="실제 자산 1:1 잠금" tone="dark" />
        <div className="pc-flow-lane">
          <span className="pc-lane-label">채널 반영</span>
        </div>
        <ChannelShell>
          <FlowNode icon={Database} label="채널 잔액" sub="거래 가능 잔액 생성" tone="private" />
        </ChannelShell>
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
          <span className="pc-lane-label">매수 주문</span>
          <span className="pc-lane-label">매도 주문</span>
        </div>
        <ChannelShell mode="wide">
          <div className="pc-shell-split">
            <FlowNode icon={Scale} label="주문 매칭" sub="가격과 수량 체결" tone="private" />
            <div className="pc-flow-lane" aria-hidden="true">
              <span className="pc-lane-label">체결 결과</span>
            </div>
            <FlowNode icon={Database} label="체결 기록" sub="잔액과 보유 수량 갱신" tone="private" />
          </div>
        </ChannelShell>
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
          <span className="pc-lane-label">요청</span>
        </div>
        <ChannelShell mode="wide">
          <div className="pc-shell-split">
            <FlowNode icon={ShieldCheck} label="Gateway" sub="한도와 승인 규칙 확인" tone="access" />
            <div className="pc-flow-lane" aria-hidden="true">
              <span className="pc-lane-label">검증 완료</span>
            </div>
            <FlowNode icon={Database} label="채널 송금" sub="금액과 당사자 비공개 처리" tone="private" />
          </div>
        </ChannelShell>
        <div className="pc-flow-lane" aria-hidden="true">
          <span className="pc-lane-label">수취</span>
        </div>
        <FlowNode icon={Building2} label={flow.actorB ?? "수취 기관"} sub="채널 잔액 반영" />
      </div>
    );
  }

  if (flow.kind === "monitor") {
    return (
      <div className="pc-flow-visual monitor" aria-label={`${flow.name} 플로우`}>
        <ChannelShell mode="wide">
          <div className="pc-monitor-layout">
            <FlowNode icon={Database} label={flow.asset} sub="채널 내부에 원본 기록 저장" tone="private" />
            <div className="pc-monitor-branches">
              {(flow.monitorViews ?? [
                { label: "운영자", sub: "전체 흐름 관리" },
                { label: "규제 담당자", sub: "승인된 범위 감사" },
                { label: "참여 기관", sub: "자기 거래만 조회" },
              ]).map((view, index) => (
                <FlowNode
                  icon={index === 0 ? ShieldCheck : index === 1 ? FileSearch : Building2}
                  key={view.label}
                  label={view.label}
                  sub={view.sub}
                  tone="access"
                />
              ))}
            </div>
          </div>
        </ChannelShell>
        <div className="pc-external-blind">
          <EyeOff size={16} aria-hidden="true" />
          외부에는 에스크로 총액 중심으로만 보임
        </div>
      </div>
    );
  }

  if (flow.kind === "privacyWithdraw") {
    return (
      <div className="pc-flow-visual privacy-withdraw" aria-label={`${flow.name} 플로우`}>
        <ChannelShell mode="wide">
          <div className="pc-shell-split">
            <FlowNode icon={Database} label="채널 잔액" sub="메인넷 정산 요청" tone="private" />
            <div className="pc-flow-lane" aria-hidden="true">
              <span className="pc-lane-label">burn</span>
            </div>
            <FlowNode icon={Flame} label="Withdraw" sub="채널 잔액 소각" tone="private" />
          </div>
        </ChannelShell>
        <div className="pc-flow-lane" aria-hidden="true">
          <span className="pc-lane-label">정산 선택</span>
        </div>
        <div className="pc-withdraw-options">
          <FlowNode icon={ShieldCheck} label="배치 정산" sub="여러 정산 요청을 묶어 처리" tone="access" />
          <FlowNode icon={LockKeyhole} label="Confidential Transfer" sub="금액을 암호화해 수령" tone="access" />
        </div>
        <div className="pc-flow-lane" aria-hidden="true">
          <span className="pc-lane-label">수령</span>
        </div>
        <FlowNode icon={Wallet} label="수취 은행 지갑" sub="메인넷 자산 수령" />
      </div>
    );
  }

  return (
    <div className="pc-flow-visual withdraw" aria-label={`${flow.name} 플로우`}>
      <ChannelShell mode="wide">
        <div className="pc-shell-split">
          <FlowNode icon={Database} label="채널 잔액" sub="메인넷 정산 요청" tone="private" />
          <div className="pc-flow-lane" aria-hidden="true">
            <span className="pc-lane-label">burn</span>
          </div>
          <FlowNode icon={Flame} label="Withdraw" sub="채널 잔액 소각" tone="private" />
        </div>
      </ChannelShell>
      <div className="pc-flow-lane" aria-hidden="true">
        <span className="pc-lane-label">SMT 증명</span>
      </div>
      <FlowNode icon={ShieldCheck} label="SMT 검증" sub="중복 이동 방지" tone="access" />
      <div className="pc-flow-lane" aria-hidden="true">
        <span className="pc-lane-label">잠금 해제</span>
      </div>
      <FlowNode icon={LockKeyhole} label="에스크로" sub={`${flow.asset} 잠금 해제`} tone="dark" />
    </div>
  );
}

export function PrivateChannelUseCases() {
  const [openId, setOpenId] = useState(scenarios[0].id);
  const [activeFlows, setActiveFlows] = useState<Record<string, string>>({
    securities: "채널 이동",
    stablecoin: "발행",
  });

  return (
    <div className="pc-case-accordion">
      {scenarios.map((item, index) => {
        const Icon = item.icon;
        const isOpen = item.id === openId;
        const activeFlowName = activeFlows[item.id] ?? item.flows[0].name;
        const activeFlow = item.flows.find((flow) => flow.name === activeFlowName) ?? item.flows[0];
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

                <div className="pc-flow-tabs" aria-label={`${item.title} 플로우 선택`}>
                  {item.flows.map((flow) => (
                    <button
                      className={flow.name === activeFlow.name ? "active" : ""}
                      key={flow.name}
                      onClick={() =>
                        setActiveFlows((current) => ({
                          ...current,
                          [item.id]: flow.name,
                        }))
                      }
                      type="button"
                    >
                      {flow.name}
                    </button>
                  ))}
                </div>

                <section className="pc-case-focus" key={`${item.id}-${activeFlow.name}`}>
                  <div className="pc-case-focus-copy">
                    <span className="pc-flow-step">{activeFlow.name}</span>
                    <h4>{activeFlow.title}</h4>
                    <p>{activeFlow.desc}</p>
                    <div className="pc-flow-points">
                      {activeFlow.points.map((point) => (
                        <span key={point}>{point}</span>
                      ))}
                    </div>
                  </div>

                  <FlowVisual flow={activeFlow} />
                </section>
              </div>
            ) : null}
          </article>
        );
      })}
    </div>
  );
}
