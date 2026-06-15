"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  Ban,
  Flame,
  Landmark,
  Loader2,
  Lock,
  RotateCcw,
  ShieldCheck,
  Snowflake,
  Siren,
  Undo2,
  UserRound,
} from "lucide-react";
import { SuccessBurst } from "../SuccessBurst";

type Requester = "issuer" | "user";
type ActionId = "clawback" | "burn" | "freeze";
type Phase = "idle" | "sending" | "done";
type Result = "executed" | "rejected" | null;

const requesters = {
  issuer: { name: "한국은행", icon: Landmark },
  user: { name: "일반 사용자", icon: UserRound },
} as const;

const actions: {
  id: ActionId;
  label: string;
  icon: typeof Undo2;
  incident: string;
  target: string;
  resultText: string;
  removes: boolean;
  locks: boolean;
}[] = [
  {
    id: "clawback",
    label: "회수",
    icon: Undo2,
    incident: "탈취 자금이 악의적 주소로 유출됐습니다.",
    target: "악의적 주소",
    resultText: "자금 회수 완료",
    removes: true,
    locks: false,
  },
  {
    id: "burn",
    label: "소각",
    icon: Flame,
    incident: "토큰이 잘못 발행되어 유통되고 있습니다.",
    target: "오발행 계정",
    resultText: "오발행분 소각 완료",
    removes: true,
    locks: false,
  },
  {
    id: "freeze",
    label: "동결",
    icon: Snowflake,
    incident: "이상 거래가 반복적으로 탐지됐습니다.",
    target: "의심 계정",
    resultText: "계정 동결 완료",
    removes: false,
    locks: true,
  },
];

const START = 800;
const steps = ["사고 접수", "관리자 조치", "계좌 반영"];
const SEND_MS = 900;
const SETTLE_MS = 720;

export function PermanentDelegateDemo() {
  const [requester, setRequester] = useState<Requester>("issuer");
  const [actionId, setActionId] = useState<ActionId>("freeze");
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result>(null);
  const [settled, setSettled] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const action = actions.find((item) => item.id === actionId) ?? actions[0];
  const authorized = requester === "issuer";
  const running = phase === "sending";

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
    setPhase("sending");
    timers.current.push(
      setTimeout(() => {
        setResult(authorized ? "executed" : "rejected");
        setPhase("done");
        if (authorized) {
          timers.current.push(setTimeout(() => setSettled(true), SETTLE_MS));
        }
      }, SEND_MS),
    );
  };

  const stepIndex = phase === "idle" ? 0 : phase === "sending" ? 1 : 2;

  const removed = settled && action.removes;
  const locked = settled && action.locks;
  const accountBalance = removed ? 0 : START;

  const consoleStatus =
    running ? "조치 전송 중" : phase === "done" ? (result === "executed" ? "조치 실행 완료" : "권한 거부") : "조치 준비";
  const accountStatus =
    phase === "done"
      ? result === "executed"
        ? locked
          ? "계정 동결됨"
          : "조치 완료"
        : "권한 거부"
      : running
        ? "조치 반영 중"
        : "정상";

  return (
    <div className="pdg">
      <div className="thd-steps">
        {steps.map((label, i) => (
          <div className="thd-step" key={label}>
            <span
              className={`thd-step-num ${
                i <= stepIndex ? (result === "rejected" && i >= 2 ? "fail" : "active") : ""
              }`}
            >
              {i + 1}
            </span>
            <span className="thd-step-label">{label}</span>
            {i < steps.length - 1 && <span className="thd-step-bar" />}
          </div>
        ))}
      </div>

      <section className="pdg-stage" aria-label="Permanent Delegate 사고 대응 흐름">
        <div className="mrd-network" aria-hidden="true" />

        {/* 1. external incident intake */}
        <div className="pdg-incident">
          <div className="pdg-incident-head">
            <span className="pdg-incident-icon">
              <Siren size={18} aria-hidden="true" />
            </span>
            <strong>외부 사고 접수</strong>
          </div>
          <p>{action.incident}</p>
          <div className="pdg-incident-row">
            <span>대상</span>
            <code>{action.target}</code>
          </div>
          <div className="pdg-incident-tag">
            <Siren size={12} aria-hidden="true" />
            접수 완료
          </div>
        </div>

        <div className={`mrd-rail ${phase !== "idle" ? "done" : ""}`}>
          <span />
          <strong>접수</strong>
        </div>

        {/* 2. admin laptop console */}
        <div className="pdg-laptop">
          <div className="pdg-laptop-screen">
            <div className="pdg-laptop-inner">
              <div className="pdg-laptop-bar">
                <span className="pdg-laptop-dots" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </span>
                <span className="pdg-laptop-title">한국은행 운영 콘솔</span>
                <span className="pdg-laptop-status">{consoleStatus}</span>
              </div>

              <div className="pdg-laptop-content">
                <div className="pdg-field">
                  <span>요청 주체</span>
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

                <div className="pdg-field">
                  <span>실행할 조치</span>
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

                <div className={`pdg-auth ${authorized ? "has" : "no"}`}>
                  {authorized ? <ShieldCheck size={13} aria-hidden="true" /> : <Ban size={13} aria-hidden="true" />}
                  {authorized ? "한국은행 = Permanent Delegate 지정" : "위임 권한 없음 · 조치 거부"}
                </div>

                {phase === "done" ? (
                  <button className="button button-muted pdg-exec" onClick={resetRun} type="button">
                    <RotateCcw size={14} aria-hidden="true" />
                    다시 시도
                  </button>
                ) : (
                  <button className="button button-dark pdg-exec" disabled={running} onClick={run} type="button">
                    {running ? <Loader2 className="mrd-spin" size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
                    {running ? "조치 실행 중" : "조치 실행"}
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="pdg-laptop-deck" aria-hidden="true" />
        </div>

        <div
          className={`mrd-rail ${result === "executed" && phase !== "idle" && !settled ? "flowing" : ""} ${
            settled ? "done" : ""
          } ${result === "rejected" && phase === "done" ? "blocked" : ""}`}
        >
          <span />
          <strong>{result === "rejected" ? "거부" : "조치 실행"}</strong>
        </div>

        {/* 3. target account (locks) */}
        <div
          className={`mrd-transaction-panel pdg-account ${locked ? "locked" : ""} ${
            settled && !locked ? "pass" : ""
          }`}
        >
          <SuccessBurst show={settled && !locked} />
          <SuccessBurst show={phase === "done" && result === "rejected"} tone="reject" />
          {locked ? (
            <div className="pdg-lock-overlay">
              <span className="pdg-lock-icon">
                <Lock size={24} aria-hidden="true" />
              </span>
              <strong>계정 동결됨</strong>
            </div>
          ) : null}

          <div className="mrd-desktop-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="mrd-ledger-head">
            <span>대상 계좌 · {action.target}</span>
            <strong>{accountStatus}</strong>
          </div>

          <div className="mrd-receipt">
            <div className="mrd-receipt-total">
              <span>계정 잔액</span>
              <strong>{accountBalance.toLocaleString()} USDC</strong>
            </div>
            <div className="mrd-receipt-row">
              <span>계정</span>
              <code>Hld...9x</code>
            </div>
            <div className="mrd-receipt-row">
              <span>조치 결과</span>
              <code>{phase === "done" ? (result === "executed" ? action.resultText : "거부됨") : "조치 전"}</code>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
