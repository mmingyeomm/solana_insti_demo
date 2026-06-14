"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Ban,
  Check,
  CheckCircle2,
  Landmark,
  Loader2,
  Plus,
  RotateCcw,
  ShieldCheck,
  SlidersHorizontal,
  Wallet,
} from "lucide-react";
import { SuccessBurst } from "../SuccessBurst";

type Phase = "idle" | "request" | "verify" | "decide" | "done";
type Result = "pass" | "fail" | null;
type Stage = "setup" | "simulate";

const hookOptions = [
  {
    id: "allow",
    label: "허용 계정",
    example: "승인된 고객 지갑에 한해 전송을 허용합니다.",
    failName: "미등록 지갑",
    failCaption: "허용 계정 검증에서 중단",
    failAddr: "Ax29...e4R",
  },
  {
    id: "kyc",
    label: "KYC 상태",
    example: "본인 확인이 완료된 계정만 전송을 통과시킵니다.",
    failName: "KYC 미완료",
    failCaption: "KYC 검증에서 중단",
    failAddr: "4tB2...kP9",
  },
  {
    id: "sanctions",
    label: "제한 대상",
    example: "제재 목록 또는 내부 차단 대상 여부를 확인합니다.",
    failName: "제한 대상",
    failCaption: "제재 대상 검증에서 중단",
    failAddr: "9vP1...xK8",
  },
  {
    id: "limit",
    label: "보유 한도",
    example: "계정별 최대 보유 한도를 초과하지 않는지 확인합니다.",
    failName: "보유 한도 초과",
    failCaption: "한도에서 중단",
    failAddr: "7qL4...mR2",
  },
  {
    id: "investor",
    label: "투자자 자격",
    example: "상품별 투자 가능 계정인지 확인합니다.",
    failName: "자격 미충족",
    failCaption: "투자자 자격에서 중단",
    failAddr: "6cV8...rA3",
  },
  {
    id: "approval",
    label: "기관 승인",
    example: "고액 전송이나 예외 거래에 승인 조건을 둡니다.",
    failName: "승인 대기",
    failCaption: "기관 승인에서 중단",
    failAddr: "3dN6...hT5",
  },
] as const;

type HookId = (typeof hookOptions)[number]["id"];

const AMOUNT = 200;
const START_SENDER = 1000;
const START_RECIPIENT = 500;
const steps = ["요청", "정책", "검증", "결과"];

const REQUEST_MS = 620;
const VERIFY_START_MS = REQUEST_MS + 260;
const CHECK_MS = 380;
const SETTLE_MS = 720;

export function TransferHookDemo() {
  const [stage, setStage] = useState<Stage>("setup");
  const [selectedHooks, setSelectedHooks] = useState<HookId[]>(["allow", "kyc", "limit"]);
  const [scenarioId, setScenarioId] = useState("normal");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result>(null);
  const [settled, setSettled] = useState(false);
  const [activeCheck, setActiveCheck] = useState(-1);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const configuredHooks = useMemo(
    () => hookOptions.filter((hook) => selectedHooks.includes(hook.id)),
    [selectedHooks],
  );

  const scenarios = useMemo(
    () => [
      {
        id: "normal",
        name: "정상 전송",
        caption: "정책 조건 통과",
        addr: "5mB8...trD",
        failedHook: null as HookId | null,
      },
      ...configuredHooks.map((hook) => ({
        id: hook.id,
        name: hook.failName,
        caption: hook.failCaption,
        addr: hook.failAddr,
        failedHook: hook.id,
      })),
    ],
    [configuredHooks],
  );

  const scenario = scenarios.find((item) => item.id === scenarioId) ?? scenarios[0];
  const failedCheckIndex = scenario.failedHook
    ? configuredHooks.findIndex((hook) => hook.id === scenario.failedHook)
    : -1;
  const lastCheckIndex = failedCheckIndex >= 0 ? failedCheckIndex : configuredHooks.length - 1;
  const passed = failedCheckIndex < 0;

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (!scenarios.some((item) => item.id === scenarioId)) {
      setScenarioId("normal");
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scenarios, scenarioId]);

  useEffect(() => {
    if (stage === "simulate") {
      requestAnimationFrame(() => {
        document.querySelector(".thd-simulate")?.scrollIntoView({ block: "center", behavior: "smooth" });
      });
    }
  }, [stage]);

  const toggleHook = (id: HookId) => {
    reset();
    setSelectedHooks((current) => {
      if (current.includes(id)) {
        return current.length === 1 ? current : current.filter((hookId) => hookId !== id);
      }

      return [...current, id];
    });
  };

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setResult(null);
    setSettled(false);
    setActiveCheck(-1);
  };

  const run = () => {
    clearTimers();
    setResult(null);
    setSettled(false);
    setActiveCheck(-1);
    setPhase("request");

    timers.current.push(setTimeout(() => setPhase("verify"), REQUEST_MS));
    for (let i = 0; i <= lastCheckIndex; i += 1) {
      timers.current.push(setTimeout(() => setActiveCheck(i), VERIFY_START_MS + i * CHECK_MS));
    }
    const scanEnd = VERIFY_START_MS + (lastCheckIndex + 1) * CHECK_MS;
    timers.current.push(setTimeout(() => setPhase("decide"), scanEnd + 120));
    const doneAt = scanEnd + 520;
    timers.current.push(
      setTimeout(() => {
        setResult(passed ? "pass" : "fail");
        setPhase("done");
      }, doneAt),
    );
    if (passed) {
      timers.current.push(setTimeout(() => setSettled(true), doneAt + SETTLE_MS));
    }
  };

  const createToken = () => {
    reset();
    setScenarioId("normal");
    setStage("simulate");
  };

  const backToSetup = () => {
    reset();
    setStage("setup");
  };

  const running = phase !== "idle";
  const stepIndex =
    phase === "idle" ? -1 : phase === "request" ? 0 : phase === "verify" ? 1 : phase === "decide" ? 2 : 3;

  const senderBalance = settled ? START_SENDER - AMOUNT : START_SENDER;
  const recipientBalance = settled ? START_RECIPIENT + AMOUNT : START_RECIPIENT;

  const hookState =
    phase === "verify" || phase === "decide"
      ? "checking"
      : phase === "done"
        ? result ?? "ready"
        : "ready";

  const checkState = (index: number) => {
    if (phase === "idle" || phase === "request") return "pending";
    if (failedCheckIndex === index && (phase === "decide" || phase === "done")) return "fail";
    if (result === "pass" && phase === "done") return "pass";
    if (index < activeCheck) return "pass";
    if (index === activeCheck) return "active";
    return "pending";
  };

  if (stage === "setup") {
    return (
      <div className="thd thd-setup demo-screen-enter" key="setup">
        <div className="thd-policy-board">
          <section className="thd-token-form" aria-label="토큰 정책 설정">
            <div className="thd-form-head">
              <span>토큰 정책 설정</span>
              <strong>전송 실행 전에 적용할 검증 로직을 선택합니다.</strong>
            </div>

            <div className="thd-token-card">
              <div className="thd-token-emblem">
                <ShieldCheck size={26} aria-hidden="true" />
              </div>
              <div>
                <span>자산 이름</span>
                <strong>예금 토큰</strong>
              </div>
              <div>
                <span>네트워크</span>
                <strong>솔라나</strong>
              </div>
            </div>

            <div className="thd-policy-preview">
              <span>적용 예정 정책</span>
              <div>
                {configuredHooks.map((hook) => (
                  <code key={hook.id}>{hook.label}</code>
                ))}
              </div>
            </div>

            <button className="button button-dark" onClick={createToken} type="button">
              <Plus size={15} aria-hidden="true" />
              토큰 생성
            </button>
          </section>

          <aside className="thd-hook-catalog" aria-label="Hook 선택">
            <div className="thd-catalog-head">
              <span>검증 로직 선택</span>
              <strong>기관 운영에 필요한 전송 검증 조건을 조합합니다.</strong>
            </div>
            <div className="thd-hook-list">
              {hookOptions.map((hook) => {
                const active = selectedHooks.includes(hook.id);

                return (
                  <button
                    className={`thd-hook-option ${active ? "active" : ""}`}
                    key={hook.id}
                    onClick={() => toggleHook(hook.id)}
                    type="button"
                  >
                    <span>
                      <strong>{hook.label}</strong>
                      <small>{hook.example}</small>
                    </span>
                    <i>{active ? "선택됨" : "추가"}</i>
                  </button>
                );
              })}
            </div>
          </aside>
        </div>
      </div>
    );
  }

  return (
    <div className={`thd thd-simulate demo-screen-enter ${hookState}`} key="simulate">
      <div className="thd-sim-head">
        <button className="thd-back" onClick={backToSetup} type="button">
          <ArrowLeft size={14} aria-hidden="true" />
          정책 수정
        </button>
        <div className="thd-scenario-pick" aria-label="검증 시나리오 선택">
          {scenarios.map((item) => (
            <button
              className={`thd-chip ${item.id === scenarioId ? "active" : ""} ${
                item.failedHook ? "deny" : "allow"
              }`}
              disabled={running}
              key={item.id}
              onClick={() => setScenarioId(item.id)}
              type="button"
            >
              <strong>{item.name}</strong>
            </button>
          ))}
        </div>
      </div>

      <div className="thd-steps">
        {steps.map((label, i) => (
          <div className="thd-step" key={label}>
            <span
              className={`thd-step-num ${
                i <= stepIndex ? (result === "fail" && i >= 2 ? "fail" : "active") : ""
              }`}
            >
              {i < stepIndex || (i === stepIndex && phase === "done") ? <Check size={12} /> : i + 1}
            </span>
            <span className="thd-step-label">{label}</span>
            {i < steps.length - 1 && <span className="thd-step-bar" />}
          </div>
        ))}
      </div>

      <div className={`thd-stage ${phase} ${result ?? ""}`}>
        <div className="thd-network-grid" aria-hidden="true" />
        <div className="thd-wallet thd-sender-wallet">
          <div className="thd-wallet-top">
            <Wallet size={15} aria-hidden="true" />
            {scenario.name}
          </div>
          <div className="thd-wallet-balance">
            <span>USDC 잔액</span>
            <strong>{senderBalance.toLocaleString()}</strong>
          </div>
          <code>{scenario.addr}</code>
        </div>

        <div className={`thd-wire left ${phase === "request" ? "flowing" : ""}`} aria-hidden="true">
          <span className="thd-packet" />
        </div>

        <div className={`thd-policy-runtime ${hookState}`}>
          <SuccessBurst show={phase === "done" && result === "fail"} tone="reject" />
          <div className="thd-runtime-core">
            <span>솔라나 네트워크</span>
            <strong>Token Extensions</strong>
            <small>Transfer Hook 호출</small>
          </div>
          <div className="thd-runtime-list" aria-label="선택된 Hook 실행 순서">
            {configuredHooks.map((hook, index) => {
              const state = checkState(index);

              return (
                <div className={`thd-runtime-hook ${state}`} key={hook.id}>
                  <span>
                    {state === "fail" ? (
                      <Ban size={13} aria-hidden="true" />
                    ) : state === "pass" ? (
                      <Check size={13} aria-hidden="true" />
                    ) : state === "active" ? (
                      <Loader2 className="thd-spin" size={13} aria-hidden="true" />
                    ) : (
                      <SlidersHorizontal size={13} aria-hidden="true" />
                    )}
                  </span>
                  <div>
                    <strong>{hook.label}</strong>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div
          className={`thd-wire right ${result === "pass" && phase === "done" ? "flowing" : ""} ${
            result === "fail" && phase === "done" ? "blocked" : ""
          }`}
          aria-hidden="true"
        >
          <span className="thd-packet" />
        </div>

        <div className={`thd-wallet ${settled ? "credited" : ""}`}>
          <SuccessBurst show={settled} />
          <div className="thd-wallet-top">
            <Landmark size={15} aria-hidden="true" />
            수신 지갑
          </div>
          <div className="thd-wallet-balance">
            <span>USDC 잔액</span>
            <strong>{recipientBalance.toLocaleString()}</strong>
          </div>
          <div className="thd-amount-row">
            <strong>{AMOUNT} USDC</strong>
          </div>
        </div>
      </div>

      <div className="thd-controls">
        {phase === "done" ? (
          <button className="button button-muted" onClick={reset} type="button">
            <RotateCcw size={14} aria-hidden="true" />
            다시 시도
          </button>
        ) : (
          <button className="button button-dark" disabled={running} onClick={run} type="button">
            {running ? (
              <Loader2 className="thd-spin" size={15} aria-hidden="true" />
            ) : (
              <ArrowRight size={15} aria-hidden="true" />
            )}
            {running ? "검증 진행 중" : "전송 시작"}
          </button>
        )}
      </div>
    </div>
  );
}
