"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Ban,
  Flame,
  Landmark,
  Loader2,
  RotateCcw,
  ShieldCheck,
  Snowflake,
  Undo2,
  UserRound,
  Wallet,
} from "lucide-react";
import { SuccessBurst } from "../SuccessBurst";

type Requester = "issuer" | "user";
type ActionId = "clawback" | "burn" | "freeze";
type Phase = "idle" | "request" | "verify" | "done";
type Result = "executed" | "rejected" | null;

const requesters = {
  issuer: { name: "발행자 (기관)", addr: "Iss...K7", icon: Landmark, note: "Permanent Delegate 보유" },
  user: { name: "일반 사용자", addr: "Usr...3p", icon: UserRound, note: "위임 권한 없음" },
} as const;

const actions: { id: ActionId; label: string; badge: string; icon: typeof Undo2 }[] = [
  { id: "clawback", label: "회수", badge: "발행자로 회수", icon: Undo2 },
  { id: "burn", label: "소각", badge: "소각 완료", icon: Flame },
  { id: "freeze", label: "동결", badge: "동결됨", icon: Snowflake },
];

const TARGET_START = 800;
const steps = ["조치 요청", "권한 확인", "조치 실행"];

const REQUEST_MS = 680;
const VERIFY_MS = 1280;
const SETTLE_MS = 720;

export function PermanentDelegateDemo() {
  const [requester, setRequester] = useState<Requester>("issuer");
  const [actionId, setActionId] = useState<ActionId>("clawback");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result>(null);
  const [settled, setSettled] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const action = actions.find((item) => item.id === actionId) ?? actions[0];
  const party = requesters[requester];
  const authorized = requester === "issuer";
  const running = phase === "request" || phase === "verify";

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  useEffect(() => clearTimers, []);

  const resetRun = () => {
    clearTimers();
    setPhase("idle");
    setResult(null);
    setSettled(false);
  };

  const pickRequester = (next: Requester) => {
    resetRun();
    setRequester(next);
  };

  const pickAction = (next: ActionId) => {
    resetRun();
    setActionId(next);
  };

  const run = () => {
    clearTimers();
    setResult(null);
    setSettled(false);
    setPhase("request");
    timers.current.push(setTimeout(() => setPhase("verify"), REQUEST_MS));
    timers.current.push(
      setTimeout(() => {
        setResult(authorized ? "executed" : "rejected");
        setPhase("done");
        if (authorized) {
          timers.current.push(setTimeout(() => setSettled(true), SETTLE_MS));
        }
      }, VERIFY_MS),
    );
  };

  const stepIndex = phase === "idle" ? -1 : phase === "request" ? 0 : phase === "verify" ? 1 : 2;

  const nodeState =
    phase === "request" || phase === "verify"
      ? "checking"
      : phase === "done"
        ? result ?? "ready"
        : "ready";

  const removed = settled && (actionId === "clawback" || actionId === "burn");
  const frozen = settled && actionId === "freeze";
  const targetBalance = removed ? 0 : TARGET_START;

  const PartyIcon = party.icon;
  const ActionIcon = action.icon;

  return (
    <div className={`pdd ${nodeState}`}>
      <div className="thd-steps">
        {steps.map((label, i) => (
          <div className="thd-step" key={label}>
            <span
              className={`thd-step-num ${
                i <= stepIndex ? (result === "rejected" && i >= 1 ? "fail" : "active") : ""
              }`}
            >
              {i + 1}
            </span>
            <span className="thd-step-label">{label}</span>
            {i < steps.length - 1 && <span className="thd-step-bar" />}
          </div>
        ))}
      </div>

      <section className="pdd-stage" aria-label="Permanent Delegate 조치 흐름">
        <div className="dasd-network" aria-hidden="true" />

        <div className="pdd-party">
          <div className="pdd-party-top">
            <PartyIcon size={15} aria-hidden="true" />
            요청 주체
          </div>
          <strong>{party.name}</strong>
          <code>{party.addr}</code>
          <span className={`pdd-party-note ${authorized ? "has" : "no"}`}>{party.note}</span>
        </div>

        <div className={`dasd-rail ${phase === "request" ? "flowing" : ""}`} aria-hidden="true">
          <span />
        </div>

        <div className={`pdd-node ${nodeState}`}>
          <div className="pdd-node-icon">
            {nodeState === "checking" ? (
              <Loader2 className="mrd-spin" size={22} aria-hidden="true" />
            ) : nodeState === "rejected" ? (
              <Ban size={22} aria-hidden="true" />
            ) : (
              <ShieldCheck size={22} aria-hidden="true" />
            )}
          </div>
          <span>토큰 익스텐션</span>
          <strong>Permanent Delegate</strong>
          <small>
            {nodeState === "checking"
              ? "지정 위임자 대조 중…"
              : nodeState === "executed"
                ? "발행자 = 지정 위임자 확인"
                : nodeState === "rejected"
                  ? "지정 위임자 아님"
                  : "지정 위임자: 발행자(기관)"}
          </small>
        </div>

        <div
          className={`dasd-rail ${result === "executed" && phase === "done" ? "flowing" : ""} ${
            result === "rejected" && phase === "done" ? "blocked" : ""
          }`}
          aria-hidden="true"
        >
          <span />
        </div>

        <div className={`pdd-target ${settled ? "acted" : ""} ${frozen ? "frozen" : ""}`}>
          <SuccessBurst show={settled} />
          <SuccessBurst show={phase === "done" && result === "rejected"} tone="reject" />
          <div className="pdd-party-top">
            <Wallet size={15} aria-hidden="true" />
            대상 계정
          </div>
          <code>Hld...9x</code>
          <strong>{targetBalance.toLocaleString()} USDC</strong>
          {settled ? (
            <span className="pdd-target-badge">
              <ActionIcon size={12} aria-hidden="true" />
              {action.badge}
            </span>
          ) : (
            <span className="pdd-target-state">{frozen ? "동결됨" : "정상"}</span>
          )}
        </div>
      </section>

      <div className="pdd-panel">
        <div className="pdd-seg-group">
          <span className="pdd-seg-label">요청 주체</span>
          <div className="pdd-seg" role="group" aria-label="요청 주체 선택">
            {(Object.keys(requesters) as Requester[]).map((key) => {
              const Icon = requesters[key].icon;
              return (
                <button
                  className={requester === key ? "active" : ""}
                  disabled={running}
                  key={key}
                  onClick={() => pickRequester(key)}
                  type="button"
                >
                  <Icon size={15} aria-hidden="true" />
                  {requesters[key].name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pdd-seg-group">
          <span className="pdd-seg-label">실행할 조치</span>
          <div className="pdd-seg" role="group" aria-label="실행할 조치 선택">
            {actions.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  className={actionId === item.id ? "active" : ""}
                  disabled={running}
                  key={item.id}
                  onClick={() => pickAction(item.id)}
                  type="button"
                >
                  <Icon size={15} aria-hidden="true" />
                  {item.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="pdd-run">
          {phase === "done" ? (
            <button className="button button-muted" onClick={resetRun} type="button">
              <RotateCcw size={14} aria-hidden="true" />
              다시 시도
            </button>
          ) : (
            <button className="button button-dark" disabled={running} onClick={run} type="button">
              {running ? (
                <Loader2 className="mrd-spin" size={15} aria-hidden="true" />
              ) : (
                <ArrowRight size={15} aria-hidden="true" />
              )}
              {running ? "조치 실행 중" : "조치 실행 요청"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
