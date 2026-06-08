"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Building2,
  Check,
  Landmark,
  Layers3,
  LockKeyhole,
  RefreshCw,
  ShieldCheck,
  WalletCards,
} from "lucide-react";

type Simulation = {
  id: string;
  title: string;
  summary: string;
  metric: string;
  nodes: string[];
  steps: string[];
};

type Category = {
  id: string;
  label: string;
  title: string;
  description: string;
  simulations: Simulation[];
};

const categories: Category[] = [
  {
    id: "payments",
    label: "결제",
    title: "결제 흐름",
    description: "송금, 지급, 정산 흐름을 단계별로 확인합니다.",
    simulations: [
      {
        id: "global-payout",
        title: "글로벌 지급",
        summary: "USDC 지급 요청부터 수취 확인까지의 흐름",
        metric: "3단계",
        nodes: ["기업", "솔라나", "수취인"],
        steps: ["지급 파일 생성", "USDC 전송", "수취 확인"],
      },
      {
        id: "batch-settlement",
        title: "배치 정산",
        summary: "여러 지급 건을 하나의 정산 흐름으로 묶습니다.",
        metric: "배치",
        nodes: ["정산사", "배치", "파트너"],
        steps: ["수취인 목록 확인", "배치 트랜잭션 구성", "결과 검증"],
      },
      {
        id: "memo-reconcile",
        title: "메모 정산",
        summary: "결제 식별자를 온체인 기록과 연결합니다.",
        metric: "memo",
        nodes: ["주문", "결제", "ERP"],
        steps: ["주문 ID 생성", "메모 포함 전송", "ERP 대사"],
      },
    ],
  },
  {
    id: "extensions",
    label: "Token Extensions",
    title: "토큰 정책",
    description: "토큰에 붙는 정책과 검증 조건을 분리해서 봅니다.",
    simulations: [
      {
        id: "transfer-hook",
        title: "Transfer Hook",
        summary: "전송 전에 허용 조건을 확인합니다.",
        metric: "정책",
        nodes: ["송신자", "Hook", "수신자"],
        steps: ["전송 요청", "정책 확인", "전송 승인"],
      },
      {
        id: "confidential-transfer",
        title: "Confidential Transfer",
        summary: "금액 공개 범위를 제한합니다.",
        metric: "비공개",
        nodes: ["발신", "증명", "수신"],
        steps: ["금액 암호화", "증명 생성", "잔액 업데이트"],
      },
      {
        id: "transfer-fee",
        title: "Transfer Fee",
        summary: "토큰 레벨의 수수료 정책을 적용합니다.",
        metric: "수수료",
        nodes: ["금액", "수수료", "정산"],
        steps: ["수수료 계산", "전송 실행", "수수료 수취"],
      },
    ],
  },
  {
    id: "channels",
    label: "Private Channels",
    title: "비공개 실행",
    description: "채널 내부 실행과 최종 정산을 나눠서 확인합니다.",
    simulations: [
      {
        id: "interbank-channel",
        title: "은행 간 채널",
        summary: "두 참여자 사이의 비공개 이전 흐름",
        metric: "채널",
        nodes: ["은행 A", "채널", "은행 B"],
        steps: ["채널 개설", "내부 이전", "상태 정산"],
      },
      {
        id: "liquidity-move",
        title: "유동성 이동",
        summary: "정산 전 자금 위치를 빠르게 조정합니다.",
        metric: "즉시",
        nodes: ["트레저리", "채널", "운영 계좌"],
        steps: ["한도 확인", "채널 이전", "잔액 반영"],
      },
      {
        id: "settlement-exit",
        title: "메인넷 정산",
        summary: "채널 상태를 공개 정산 레이어에 반영합니다.",
        metric: "정산",
        nodes: ["채널 상태", "솔라나", "기록"],
        steps: ["상태 확정", "정산 제출", "기록 보관"],
      },
    ],
  },
];

function categoryIcon(id: string) {
  if (id === "extensions") return <Layers3 size={16} aria-hidden="true" />;
  if (id === "channels") return <LockKeyhole size={16} aria-hidden="true" />;
  return <WalletCards size={16} aria-hidden="true" />;
}

function nodeIcon(index: number) {
  if (index === 1) return <ShieldCheck size={16} aria-hidden="true" />;
  if (index === 2) return <Building2 size={16} aria-hidden="true" />;
  return <Landmark size={16} aria-hidden="true" />;
}

export function SimulationShowcase({
  categoryIds,
  initialCategoryId,
  compactTabs = false,
}: {
  categoryIds?: string[];
  initialCategoryId?: string;
  compactTabs?: boolean;
}) {
  const availableCategories = useMemo(() => {
    if (!categoryIds?.length) return categories;
    return categories.filter((category) => categoryIds.includes(category.id));
  }, [categoryIds]);

  const firstCategory = availableCategories[0] ?? categories[0];
  const startingCategory =
    availableCategories.find((category) => category.id === initialCategoryId) ?? firstCategory;

  const [categoryId, setCategoryId] = useState(startingCategory.id);
  const [simulationId, setSimulationId] = useState(startingCategory.simulations[0].id);
  const [stepIndex, setStepIndex] = useState(0);

  const activeCategory = useMemo(
    () => availableCategories.find((category) => category.id === categoryId) ?? firstCategory,
    [availableCategories, categoryId, firstCategory],
  );

  const activeSimulation = useMemo(
    () =>
      activeCategory.simulations.find((simulation) => simulation.id === simulationId) ??
      activeCategory.simulations[0],
    [activeCategory, simulationId],
  );

  const selectCategory = (id: string) => {
    const nextCategory =
      availableCategories.find((category) => category.id === id) ?? firstCategory;
    setCategoryId(nextCategory.id);
    setSimulationId(nextCategory.simulations[0].id);
    setStepIndex(0);
  };

  const selectSimulation = (id: string) => {
    setSimulationId(id);
    setStepIndex(0);
  };

  const nextStep = () => {
    setStepIndex((current) => (current + 1) % activeSimulation.steps.length);
  };

  const reset = () => {
    setStepIndex(0);
  };

  return (
    <div className="simulation-shell">
      {!compactTabs && (
        <div className="simulation-tabs" aria-label="시뮬레이션 카테고리">
          {availableCategories.map((category) => (
            <button
              className={category.id === categoryId ? "active" : ""}
              key={category.id}
              onClick={() => selectCategory(category.id)}
              type="button"
            >
              {categoryIcon(category.id)}
              {category.label}
            </button>
          ))}
        </div>
      )}

      <div className="simulation-layout">
        <aside className="simulation-list" aria-label="시뮬레이션 목록">
          <p>{activeCategory.title}</p>
          <span>{activeCategory.description}</span>
          <div>
            {activeCategory.simulations.map((simulation) => (
              <button
                className={simulation.id === activeSimulation.id ? "active" : ""}
                key={simulation.id}
                onClick={() => selectSimulation(simulation.id)}
                type="button"
              >
                <strong>{simulation.title}</strong>
                <small>{simulation.summary}</small>
              </button>
            ))}
          </div>
        </aside>

        <section className="simulation-panel" aria-live="polite">
          <div className="simulation-panel-header">
            <div>
              <p className="card-label">{activeCategory.label}</p>
              <h3>{activeSimulation.title}</h3>
              <span>{activeSimulation.summary}</span>
            </div>
            <strong>{activeSimulation.metric}</strong>
          </div>

          <div className="simulation-actions">
            <button className="button button-dark" onClick={nextStep} type="button">
              다음 단계
              <ArrowRight size={15} aria-hidden="true" />
            </button>
            <button className="button button-muted" onClick={reset} type="button">
              <RefreshCw size={14} aria-hidden="true" />
              초기화
            </button>
          </div>

          <div className="simulation-visual" aria-label="시뮬레이션 흐름">
            {activeSimulation.nodes.map((node, index) => (
              <div className="simulation-node-group" key={node}>
                <div className={index <= stepIndex ? "simulation-node active" : "simulation-node"}>
                  {nodeIcon(index)}
                  <span>{node}</span>
                </div>
                {index < activeSimulation.nodes.length - 1 && (
                  <ArrowRight
                    className={index < stepIndex ? "simulation-arrow active" : "simulation-arrow"}
                    size={18}
                    aria-hidden="true"
                  />
                )}
              </div>
            ))}
          </div>

          <ol className="simulation-steps">
            {activeSimulation.steps.map((step, index) => (
              <li className={index <= stepIndex ? "active" : ""} key={step}>
                <span>{index < stepIndex ? <Check size={13} aria-hidden="true" /> : index + 1}</span>
                {step}
              </li>
            ))}
          </ol>
        </section>
      </div>
    </div>
  );
}
