"use client";

import { type ReactNode, useState } from "react";
import {
  Building2,
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
import { PrivateChannelAssetDemo } from "./PrivateChannelAssetDemo";

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
    title: "증권거래",
    note: "토큰 증권은 메인넷 에스크로에 잠근 뒤 채널 안에서 거래 잔액으로 사용합니다. 주문과 체결은 채널 내부 흐름으로 다룹니다.",
    flows: [
      {
        kind: "deposit",
        name: "채널 이동",
        title: "토큰 증권을 메인넷에서 Private Channels로 이동합니다.",
        desc: "메인넷 자산을 에스크로에 잠가 거래 가능 수량을 확정하고, 채널은 그 수량 안에서 주문과 체결을 처리합니다.",
        points: [
          "원본 자산 보관과 거래 실행을 분리합니다.",
          "잠긴 수량만큼 채널 안에 거래 가능 잔액이 생깁니다.",
          "이후 주문과 체결은 공개 거래 없이 채널 안에서 진행됩니다.",
        ],
        asset: "토큰 증권",
      },
      {
        kind: "trade",
        name: "거래",
        title: "매수와 매도 주문을 채널 안에서 체결합니다.",
        desc: "주문자 정보와 체결 상세는 공개 장부로 바로 나가지 않고 채널 안에서 다룹니다.",
        points: [
          "주문은 메인넷 공개 전송 없이 채널로 들어옵니다.",
          "가격과 수량 조건이 맞으면 채널 안에서 체결됩니다.",
          "체결 후 참여자별 보유 수량과 기록이 즉시 갱신됩니다.",
        ],
        asset: "토큰 증권",
        actorA: "매수자",
        actorB: "매도자",
        amount: "10,000주",
      },
      {
        kind: "monitor",
        name: "모니터링",
        title: "감독과 시장 감시는 권한 범위 안에서 유지합니다.",
        desc: "체결 원장은 채널 안에 두고, 한국거래소와 금융당국, 참여 증권사가 필요한 범위만 확인합니다.",
        points: [
          "한국거래소는 전체 체결 흐름을 감시할 수 있습니다.",
          "금융당국은 승인된 감사 범위 안에서 기록을 확인합니다.",
          "참여 증권사는 자기 거래와 보유 기록만 확인합니다.",
        ],
        asset: "체결 기록",
        monitorViews: [
          { label: "한국거래소", sub: "전체 체결 흐름" },
          { label: "금융당국", sub: "승인된 감사 범위" },
          { label: "참여 증권사", sub: "자기 거래와 보유 기록" },
        ],
      },
      {
        kind: "withdraw",
        name: "메인넷 정산",
        title: "채널 거래 결과를 메인넷 자산으로 정산합니다.",
        desc: "채널 잔액을 소각하고 SMT 검증을 거쳐 에스크로에 잠긴 토큰 증권을 해제합니다.",
        points: [
          "채널에서 먼저 잔액을 소각해 정산 요청을 만듭니다.",
          "SMT 검증으로 같은 정산이 두 번 처리되지 않게 합니다.",
          "검증이 끝나면 에스크로의 자산 잠금이 해제됩니다.",
        ],
        asset: "토큰 증권",
      },
    ] satisfies Flow[],
  },
  {
    id: "stablecoin",
    title: "스테이블코인 발행 및 송금",
    note: "은행은 메인넷에서 스테이블코인을 발행하고, 결제에 사용할 수량만 에스크로에 잠급니다. 채널 안에서는 그 수량을 기준으로 은행 간 결제를 처리합니다.",
    flows: [
      {
        kind: "issue",
        name: "발행",
        title: "은행이 메인넷에서 결제 자산을 발행합니다.",
        desc: "발행 은행이 스테이블코인을 만들고, 이후 채널 결제에 투입할 수량을 정합니다.",
        points: [
          "발행 은행이 발행 기준과 공급량을 정합니다.",
          "메인넷 발행 잔액이 이후 채널 이동의 원천이 됩니다.",
          "결제에 투입할 수량만 에스크로로 보낼 수 있습니다.",
        ],
        asset: "스테이블코인",
        amount: "$10M",
      },
      {
        kind: "deposit",
        name: "채널 이동",
        title: "발행한 스테이블코인을 메인넷에서 Private Channels로 이동합니다.",
        desc: "발행한 자산 중 결제에 사용할 수량을 에스크로에 잠그고, 채널은 그 수량 안에서 은행 간 결제를 처리합니다.",
        points: [
          "발행된 자산 중 결제에 사용할 수량만 채널로 이동합니다.",
          "잠긴 수량만큼 채널 안에 결제 가능 잔액이 생깁니다.",
          "은행 간 송금은 이 채널 잔액을 기준으로 실행합니다.",
        ],
        asset: "스테이블코인",
      },
      {
        kind: "transfer",
        name: "송금",
        title: "은행 간 결제를 채널 안에서 즉시 처리합니다.",
        desc: "메인넷을 거치지 않고 잔액과 한도를 확인한 뒤, 참여 은행의 채널 잔액을 비공개로 갱신합니다.",
        points: [
          "송금 요청은 채널 입구에서 잔액과 한도 조건을 확인합니다.",
          "조건을 통과하면 채널 안에서 즉시 실행됩니다.",
          "참여 은행의 잔액은 한 번의 처리로 함께 갱신됩니다.",
        ],
        asset: "스테이블코인",
        actorA: "은행 A",
        actorB: "은행 B",
        amount: "$100,000",
      },
      {
        kind: "monitor",
        name: "감사 조회",
        title: "참여자별로 볼 수 있는 기록을 나눕니다.",
        desc: "Gateway와 Auth는 참여 은행, 발행 은행, 감사 주체가 접근할 수 있는 기록의 범위를 분리합니다.",
        points: [
          "참여 은행은 자기 잔액과 거래 기록을 확인합니다.",
          "발행 은행은 한도와 승인 규칙을 적용합니다.",
          "감사 주체는 승인된 범위의 기록만 조회합니다.",
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
        title: "채널 잔액을 메인넷 자산으로 정산합니다.",
        desc: "채널 잔액을 소각하고, 배치 정산이나 Confidential Transfer로 메인넷 수령 방식을 정합니다.",
        points: [
          "채널에서 먼저 잔액을 소각해 정산 요청을 만듭니다.",
          "SMT 검증으로 같은 정산이 두 번 처리되지 않게 합니다.",
          "배치 정산이나 Confidential Transfer로 수령 방식을 선택합니다.",
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
          <span className="pc-lane-label">발행 요청</span>
        </div>
        <FlowNode icon={Coins} label="메인넷 발행" sub={`${flow.amount ?? "발행 한도"} 설정`} tone="dark" />
        <div className="pc-flow-lane">
          <span className="pc-lane-label">잔액 확보</span>
        </div>
        <FlowNode icon={Wallet} label="은행 잔액" sub="채널 투입 전 대기" />
      </div>
    );
  }

  if (flow.kind === "deposit") {
    return (
      <div className="pc-flow-visual deposit" aria-label={`${flow.name} 플로우`}>
        <FlowNode icon={Wallet} label="메인넷 지갑" sub="채널로 보낼 수량 선택" />
        <div className="pc-flow-lane">
          <span className="pc-lane-label">잠금</span>
        </div>
        <FlowNode icon={LockKeyhole} label="에스크로" sub="선택 수량 잠금" tone="dark" />
        <div className="pc-flow-lane">
          <span className="pc-lane-label">채널 반영</span>
        </div>
        <ChannelShell>
          <FlowNode icon={Database} label="채널 잔액" sub="채널 안에서 사용할 한도" tone="private" />
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
            <FlowNode icon={Database} label="체결 기록" sub="보유 수량과 기록 동시 갱신" tone="private" />
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
        <FlowNode icon={Building2} label={flow.actorB ?? "수취 기관"} sub="수취 잔액 갱신" />
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
            <FlowNode icon={Database} label="채널 잔액" sub="정산할 수량 선택" tone="private" />
            <div className="pc-flow-lane" aria-hidden="true">
              <span className="pc-lane-label">소각</span>
            </div>
            <FlowNode icon={Flame} label="Withdraw" sub="선택 수량 소각" tone="private" />
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
          <FlowNode icon={Database} label="채널 잔액" sub="정산할 수량 선택" tone="private" />
          <div className="pc-flow-lane" aria-hidden="true">
            <span className="pc-lane-label">소각</span>
          </div>
          <FlowNode icon={Flame} label="Withdraw" sub="선택 수량 소각" tone="private" />
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
  const [activeFlows, setActiveFlows] = useState<Record<string, string>>({
    securities: "채널 이동",
    stablecoin: "발행",
  });

  return (
    <div className="pc-case-accordion">
      {scenarios.map((item, index) => {
        const activeFlowName = activeFlows[item.id] ?? item.flows[0].name;
        const activeFlow = item.flows.find((flow) => flow.name === activeFlowName) ?? item.flows[0];
        const usesAssetDemo =
          activeFlow.kind === "deposit" || activeFlow.kind === "withdraw" || activeFlow.kind === "privacyWithdraw";
        const assetDemoAmount =
          item.id === "securities" ? (activeFlow.kind === "deposit" ? "10,000주" : "8,000주") : "1,000 USDC";

        return (
          <article className="pc-case-item" key={item.id}>
            <header className="pc-case-copy">
              <div className="pc-case-copy-head">
                <span className="pc-case-index">{String(index + 1).padStart(2, "0")}</span>
                <div className="pc-case-title">
                  <strong>{item.title}</strong>
                </div>
              </div>
              <p>{item.note}</p>
            </header>

            <div className="pc-case-demo-slot">
              <div className="pc-case-workspace">
                <div className="pc-flow-menu" aria-label={`${item.title} 플로우 선택`}>
                  {item.flows.map((flow, flowIndex) => (
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
                      <span>{String(flowIndex + 1).padStart(2, "0")}</span>
                      <strong>{flow.name}</strong>
                    </button>
                  ))}
                </div>

                <div className="pc-flow-stage">
                  <section
                    className={`pc-case-focus ${usesAssetDemo ? "asset-demo" : ""}`}
                    key={`${item.id}-${activeFlow.name}`}
                  >
                    <div className="pc-case-focus-copy">
                      <span className="pc-flow-step">{activeFlow.name}</span>
                      <h4>{activeFlow.title}</h4>
                      <p>{activeFlow.desc}</p>
                    </div>

                    <div className="pc-case-visual-wrap">
                      {usesAssetDemo ? (
                        <PrivateChannelAssetDemo
                          amount={assetDemoAmount}
                          context={item.id === "securities" ? "securities" : "stablecoin"}
                          initialFlow={activeFlow.kind === "deposit" ? "toChannel" : "toMainnet"}
                          showTabs={false}
                        />
                      ) : (
                        <FlowVisual flow={activeFlow} />
                      )}
                    </div>
                  </section>
                </div>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
