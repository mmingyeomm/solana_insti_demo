"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Database,
  Flame,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Wallet,
} from "lucide-react";

type FlowId = "toChannel" | "toMainnet";
type Phase = "idle" | "toEscrow" | "locked" | "read" | "reflect" | "done";

const DEFAULT_AMOUNT = "1,000 USDC";
const STEP_MS = 1050;

const createFlows = (amount: string) =>
  ({
    toChannel: {
      tab: "채널 이동",
      title: "메인넷 에스크로 잠금을 확인한 뒤 Private Channel에 반영합니다.",
      primary: "잠금 확인",
      secondary: "채널 반영",
      leftTitle: "솔라나 메인넷",
      rightTitle: "Private Channel",
      leftNodes: [
        { icon: Wallet, label: "기관 지갑", idle: amount, done: "0" },
        { icon: LockKeyhole, label: "에스크로", idle: "0", done: amount },
      ],
      syncNode: { icon: RefreshCw, label: "잠금 확인", idle: "대기", done: "확인 완료" },
      rightNodes: [{ icon: Database, label: "채널 잔액", idle: "0", done: amount }],
    },
    toMainnet: {
      tab: "메인넷 정산",
      title: "채널 잔액을 소각하고 메인넷 자산 잠금을 해제합니다.",
      primary: "burn 확인",
      secondary: "잠금 해제",
      leftTitle: "Private Channel",
      rightTitle: "솔라나 메인넷",
      leftNodes: [
        { icon: Database, label: "채널 잔액", idle: amount, done: "0" },
        { icon: Flame, label: "Withdraw", idle: "대기", done: "burn 완료" },
      ],
      syncNode: { icon: ShieldCheck, label: "SMT 검증", idle: "증명 대기", done: "검증 완료" },
      rightNodes: [
        { icon: LockKeyhole, label: "에스크로", idle: amount, done: "0" },
        { icon: Wallet, label: "기관 지갑", idle: "0", done: amount },
      ],
    },
  }) as const;

function FlowCard({
  icon: Icon,
  label,
  value,
  active,
  complete,
  badge,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  active?: boolean;
  complete?: boolean;
  badge?: string;
}) {
  return (
    <div className={`pcad-card ${active ? "active" : ""} ${complete ? "complete" : ""} ${badge ? "marked" : ""}`}>
      <Icon size={17} aria-hidden="true" />
      <span>{label}</span>
      <strong>{value}</strong>
      {badge ? <em>{badge}</em> : null}
    </div>
  );
}

export function PrivateChannelAssetDemo({
  amount = DEFAULT_AMOUNT,
  initialFlow = "toChannel",
  showTabs = true,
}: {
  amount?: string;
  initialFlow?: FlowId;
  showTabs?: boolean;
}) {
  const [flowId, setFlowId] = useState<FlowId>(initialFlow);
  const [phase, setPhase] = useState<Phase>("idle");
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const flows = createFlows(amount);
  const flow = flows[flowId];
  const activeIndex =
    phase === "idle" ? -1 : phase === "toEscrow" || phase === "locked" ? 0 : phase === "read" ? 1 : 2;
  const complete = phase === "done";
  const running = phase === "toEscrow" || phase === "locked" || phase === "read" || phase === "reflect";

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const reset = () => {
    clearTimers();
    setPhase("idle");
  };

  const run = () => {
    clearTimers();
    setPhase("toEscrow");
    timers.current.push(setTimeout(() => setPhase("locked"), STEP_MS));
    timers.current.push(setTimeout(() => setPhase("read"), STEP_MS * 2));
    timers.current.push(setTimeout(() => setPhase("reflect"), STEP_MS * 3));
    timers.current.push(setTimeout(() => setPhase("done"), STEP_MS * 4));
  };

  const selectFlow = (id: FlowId) => {
    clearTimers();
    setFlowId(id);
    setPhase("idle");
  };

  const valueFor = (node: { label: string; idle: string; done: string }) => {
    if (flowId === "toChannel" && node.label === "기관 지갑") {
      return phase === "idle" ? node.idle : phase === "toEscrow" ? "전송 중" : node.done;
    }

    if (flowId === "toChannel" && node.label === "에스크로") {
      return phase === "idle" ? node.idle : phase === "toEscrow" ? "수신 중" : `${amount} 잠금`;
    }

    if (flowId === "toChannel" && node.label === "잠금 확인") {
      return phase === "idle" || phase === "toEscrow" || phase === "locked"
        ? node.idle
        : phase === "read"
          ? "잠금 기록 읽는 중"
          : node.done;
    }

    if (flowId === "toChannel" && node.label === "채널 잔액") {
      return phase === "reflect" ? "반영 중" : complete ? node.done : node.idle;
    }

    if (flowId === "toMainnet" && node.label === "채널 잔액") {
      return phase === "idle" ? node.idle : phase === "toEscrow" ? "burn 중" : node.done;
    }

    if (flowId === "toMainnet" && node.label === "Withdraw") {
      return phase === "idle" ? node.idle : phase === "toEscrow" ? "burn 처리 중" : "burn 완료";
    }

    if (flowId === "toMainnet" && node.label === "SMT 검증") {
      return phase === "idle" || phase === "toEscrow" || phase === "locked"
        ? node.idle
        : phase === "read"
          ? "burn 기록 검증 중"
          : node.done;
    }

    if (flowId === "toMainnet" && node.label === "에스크로") {
      return phase === "reflect" ? "잠금 해제 중" : complete ? node.done : node.idle;
    }

    if (flowId === "toMainnet" && node.label === "기관 지갑") {
      return phase === "reflect" ? "수령 중" : complete ? node.done : node.idle;
    }

    return complete ? node.done : node.idle;
  };

  const isCardActive = (label: string, group: "left" | "sync" | "right") => {
    if (flowId === "toChannel" && label === "기관 지갑") return phase === "toEscrow";
    if (flowId === "toChannel" && label === "에스크로") return phase === "toEscrow" || phase === "locked" || phase === "read";
    if (flowId === "toChannel" && label === "잠금 확인") return phase === "read";
    if (flowId === "toChannel" && label === "채널 잔액") return phase === "reflect";

    if (flowId === "toMainnet" && label === "채널 잔액") return phase === "toEscrow";
    if (flowId === "toMainnet" && label === "Withdraw") return phase === "toEscrow" || phase === "locked" || phase === "read";
    if (flowId === "toMainnet" && label === "SMT 검증") return phase === "read";
    if (flowId === "toMainnet" && label === "에스크로") return phase === "reflect";
    if (flowId === "toMainnet" && label === "기관 지갑") return phase === "reflect";
    return false;
  };

  const isCardComplete = (label: string, group: "left" | "sync" | "right") => {
    if (complete) return true;
    if (flowId === "toChannel" && label === "기관 지갑") return phase === "locked" || phase === "read" || phase === "reflect";
    if (flowId === "toChannel" && label === "에스크로") return phase === "locked" || phase === "read" || phase === "reflect";
    if (flowId === "toChannel" && label === "잠금 확인") return phase === "reflect";

    if (flowId === "toMainnet" && label === "채널 잔액") return phase === "locked" || phase === "read" || phase === "reflect";
    if (flowId === "toMainnet" && label === "Withdraw") return phase === "locked" || phase === "read" || phase === "reflect";
    if (flowId === "toMainnet" && label === "SMT 검증") return phase === "reflect";
    return false;
  };

  const badgeFor = (label: string) => {
    if (flowId === "toChannel" && label === "에스크로" && phase === "locked") return "잠금 완료";
    if (flowId === "toMainnet" && label === "Withdraw" && phase === "locked") return "burn 완료";
    return undefined;
  };

  return (
    <div className={`pcad ${flowId} ${phase} ${showTabs ? "" : "single-flow"}`}>
      <div className="pcad-toolbar">
        {showTabs ? (
          <div className="pcad-tabs" aria-label="Private Channel 자산 이동 선택">
            {(Object.keys(flows) as FlowId[]).map((id) => (
              <button className={flowId === id ? "active" : ""} key={id} onClick={() => selectFlow(id)} type="button">
                {flows[id].tab}
              </button>
            ))}
          </div>
        ) : null}
        <div className="pcad-actions">
          <button className="button button-muted" onClick={reset} type="button">
            <RotateCcw size={14} aria-hidden="true" />
            초기화
          </button>
          <button className="button button-dark" disabled={running} onClick={run} type="button">
            <ArrowRight size={14} aria-hidden="true" />
            {running ? "처리 중" : complete ? "다시 실행" : "실행"}
          </button>
        </div>
      </div>

      <section className="pcad-board" aria-label={`${flow.tab} 데모`} key={flowId}>
        <div className="pcad-network" aria-hidden="true" />

        {showTabs ? (
          <header className="pcad-head">
            <span>{flow.tab}</span>
            <h3>{flow.title}</h3>
            <strong>{amount}</strong>
          </header>
        ) : null}

        <div className="pcad-stage">
          <div
            className={`pcad-zone ${flow.leftTitle === "Private Channel" ? "private" : "public"} ${
              phase === "toEscrow" ? "moving" : ""
            }`}
          >
            <div className="pcad-zone-title">{flow.leftTitle}</div>
            <div className="pcad-card-stack">
              {flow.leftNodes.map((node) => (
                <FlowCard
                  active={isCardActive(node.label, "left")}
                  complete={isCardComplete(node.label, "left")}
                  icon={node.icon}
                  key={node.label}
                  label={node.label}
                  value={valueFor(node)}
                  badge={badgeFor(node.label)}
                />
              ))}
              {phase === "toEscrow" ? (
                <span className="pcad-internal-transfer" aria-hidden="true">
                  {amount}
                </span>
              ) : null}
            </div>
          </div>

          <div className={`pcad-rail ${activeIndex >= 0 ? "active" : ""}`}>
            <span>{flow.primary}</span>
            {phase === "read" ? <i aria-hidden="true" /> : null}
          </div>

          <div className="pcad-sync">
            <FlowCard
              active={isCardActive(flow.syncNode.label, "sync")}
              complete={isCardComplete(flow.syncNode.label, "sync")}
              icon={flow.syncNode.icon}
              label={flow.syncNode.label}
              value={valueFor(flow.syncNode)}
            />
          </div>

          <div className={`pcad-rail ${activeIndex >= 1 ? "active" : ""}`}>
            <span>{flow.secondary}</span>
            {phase === "reflect" ? <i aria-hidden="true" /> : null}
          </div>

          <div className={`pcad-zone ${flow.rightTitle === "Private Channel" ? "private" : "public"}`}>
            <div className="pcad-zone-title">{flow.rightTitle}</div>
            <div className="pcad-card-stack">
              {flow.rightNodes.map((node) => (
                <FlowCard
                  active={isCardActive(node.label, "right")}
                  complete={isCardComplete(node.label, "right")}
                  icon={node.icon}
                  key={node.label}
                  label={node.label}
                  value={valueFor(node)}
                />
              ))}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
