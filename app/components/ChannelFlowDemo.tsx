"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Flame,
  Layers3,
  LockKeyhole,
  RefreshCw,
  RotateCcw,
  ShieldCheck,
  Wallet,
  WalletCards,
} from "lucide-react";
import { SuccessBurst } from "./SuccessBurst";

type Layer = "mainnet" | "glue" | "channel";

type FlowNode = {
  icon: typeof Wallet;
  label: string;
  sub: string;
  layer: Layer;
};

type Flow = {
  id: string;
  tab: string;
  title: string;
  metric: string;
  summary: string;
  nodes: FlowNode[];
  steps: string[];
};

const flows: Flow[] = [
  {
    id: "deposit",
    tab: "채널 이동",
    title: "채널 이동: 메인넷에서 Private Channels로",
    metric: "메인넷에서 채널로",
    summary: "메인넷 토큰을 에스크로에 잠그면 같은 수량이 채널 잔액으로 반영됩니다.",
    nodes: [
      { icon: Wallet, label: "참여 기관 지갑", sub: "메인넷 토큰 보유", layer: "mainnet" },
      { icon: LockKeyhole, label: "에스크로", sub: "1:1로 잠금", layer: "mainnet" },
      { icon: RefreshCw, label: "Indexer와 Operator", sub: "이동 감지와 반영", layer: "glue" },
      { icon: Layers3, label: "채널 노드", sub: "동일량 mint", layer: "channel" },
      { icon: WalletCards, label: "채널 잔액", sub: "즉시 사용 가능", layer: "channel" },
    ],
    steps: [
      "참여 기관이 메인넷 에스크로에 토큰을 잠급니다.",
      "Indexer가 에스크로 잠금 이벤트를 감지합니다.",
      "Operator가 채널 반영 트랜잭션을 보냅니다.",
      "채널이 동일한 양의 토큰을 mint 합니다.",
      "채널 잔액에 즉시 반영됩니다.",
    ],
  },
  {
    id: "transfer",
    tab: "채널 송금",
    title: "송금: 채널 내부 결제",
    metric: "채널 내부 약 100ms",
    summary: "메인넷을 거치지 않아 빠르고, 무수수료이며, 비공개로 처리됩니다.",
    nodes: [
      { icon: Wallet, label: "보내는 기관", sub: "송금 서명", layer: "channel" },
      { icon: ShieldCheck, label: "Gateway", sub: "라우팅과 규칙 적용", layer: "channel" },
      { icon: Layers3, label: "채널 파이프라인", sub: "5단계 무수수료", layer: "channel" },
      { icon: Building2, label: "받는 기관", sub: "잔액 반영", layer: "channel" },
    ],
    steps: [
      "보내는 기관이 송금 요청에 서명합니다.",
      "Gateway가 write 노드로 라우팅하고 AML과 승인 규칙을 적용합니다.",
      "5단계 파이프라인이 무수수료로 거래를 실행합니다.",
      "약 100ms 만에 원자적으로 정산됩니다.",
      "받는 기관 잔액에 비공개로 반영됩니다.",
    ],
  },
  {
    id: "withdraw",
    tab: "메인넷 정산",
    title: "메인넷 정산: Private Channels에서 메인넷으로",
    metric: "채널에서 메인넷으로",
    summary: "채널에서 burn한 수량만큼 메인넷 에스크로에서 실제 자산이 풀립니다.",
    nodes: [
      { icon: Flame, label: "Withdraw", sub: "채널에서 burn", layer: "channel" },
      { icon: RefreshCw, label: "Indexer와 Operator", sub: "SMT 증명 구성", layer: "glue" },
      { icon: LockKeyhole, label: "에스크로", sub: "증명 검증 후 해제", layer: "mainnet" },
      { icon: Wallet, label: "참여 기관 지갑", sub: "메인넷 수령", layer: "mainnet" },
    ],
    steps: [
      "참여 기관이 채널에서 토큰을 burn 합니다.",
      "Indexer가 burn 이벤트를 감지합니다.",
      "Operator가 nonce에 대한 SMT 증명을 구성합니다.",
      "에스크로가 증명을 검증하고 자산 잠금을 해제합니다.",
      "참여 기관이 메인넷 지갑으로 자산을 수령합니다.",
    ],
  },
];

const STEP_MS = 820;

const layerLabel: Record<Layer, string> = {
  mainnet: "메인넷",
  glue: "동기화",
  channel: "채널",
};

export function ChannelFlowDemo() {
  const [flowId, setFlowId] = useState(flows[0].id);
  const [progress, setProgress] = useState(-1);
  const [done, setDone] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const flow = flows.find((item) => item.id === flowId) ?? flows[0];
  const lastNode = flow.nodes.length - 1;
  const lastStep = flow.steps.length - 1;
  const playing = progress >= 0 && !done;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const play = () => {
    clearTimers();
    setDone(false);
    setProgress(0);
    for (let i = 1; i <= lastStep; i += 1) {
      timers.current.push(setTimeout(() => setProgress(i), STEP_MS * i));
    }
    timers.current.push(setTimeout(() => setDone(true), STEP_MS * (lastStep + 1)));
  };

  const selectFlow = (id: string) => {
    clearTimers();
    setFlowId(id);
    setProgress(-1);
    setDone(false);
  };

  const reset = () => {
    clearTimers();
    setProgress(-1);
    setDone(false);
  };

  // Map node index to the step that activates it (nodes ≈ steps).
  const nodeActive = (index: number) => progress >= 0 && index <= progress;

  return (
    <div className="cfd">
      <div className="cfd-tabs" aria-label="자금 흐름 선택">
        {flows.map((item) => (
          <button
            className={item.id === flowId ? "active" : ""}
            key={item.id}
            onClick={() => selectFlow(item.id)}
            type="button"
          >
            {item.tab}
          </button>
        ))}
      </div>

      <div className="cfd-head">
        <div>
          <h3>{flow.title}</h3>
          <p>{flow.summary}</p>
        </div>
        <span className="cfd-metric">{flow.metric}</span>
      </div>

      <div className="cfd-stage" aria-label={`${flow.tab} 흐름`}>
        {flow.nodes.map((node, index) => {
          const Icon = node.icon;
          const isLast = index === lastNode;
          return (
            <div className="cfd-node-group" key={node.label}>
              <div className={`cfd-node ${node.layer} ${nodeActive(index) ? "active" : ""}`}>
                <span className="cfd-node-layer">{layerLabel[node.layer]}</span>
                <span className="cfd-node-icon">
                  <Icon size={18} aria-hidden="true" />
                </span>
                <strong>{node.label}</strong>
                <small>{node.sub}</small>
                {isLast ? <SuccessBurst show={done} /> : null}
              </div>
              {!isLast ? (
                <span className={`cfd-connector ${progress > index ? "flowing" : ""}`} aria-hidden="true">
                  <ArrowRight size={16} aria-hidden="true" />
                </span>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="cfd-actions">
        <button className="button button-dark" disabled={playing} onClick={play} type="button">
          <ArrowRight size={15} aria-hidden="true" />
          {playing ? "흐름 진행 중" : done ? "다시 실행" : "흐름 실행"}
        </button>
        <button className="button button-muted" onClick={reset} type="button">
          <RotateCcw size={14} aria-hidden="true" />
          초기화
        </button>
      </div>

      <ol className="cfd-steps">
        {flow.steps.map((step, index) => (
          <li className={progress >= 0 && index <= progress ? "active" : ""} key={step}>
            <span>{progress > index || done ? <Check size={13} aria-hidden="true" /> : index + 1}</span>
            {step}
          </li>
        ))}
      </ol>
    </div>
  );
}
