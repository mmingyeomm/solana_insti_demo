"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Lock, RotateCcw, ShieldCheck, Snowflake, Unlock } from "lucide-react";
import { SuccessBurst } from "../SuccessBurst";

type Phase = "idle" | "send" | "done";
type Result = "passed" | "blocked" | null;

const START_SENDER = 5000;
const START_RECIPIENT = 0;
const AMOUNT = 250;
const ACCOUNT_ADDR = "Rcpt...2xL";
const TRAVEL_MS = 760;
const SETTLE_MS = 720;

export function DefaultAccountStateDemo() {
  const [activated, setActivated] = useState(false);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result>(null);
  const [settled, setSettled] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const verifying = phase === "send";
  const senderBalance = settled ? START_SENDER - AMOUNT : START_SENDER;
  const recipientBalance = settled ? START_RECIPIENT + AMOUNT : START_RECIPIENT;

  const gateState =
    phase === "send" ? "checking" : phase === "done" ? (result === "passed" ? "pass" : "fail") : "ready";

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

  const toggleState = () => {
    resetRun();
    setActivated((value) => !value);
  };

  const run = () => {
    clearTimers();
    setResult(null);
    setSettled(false);
    setPhase("send");
    const pass = activated;
    timers.current.push(
      setTimeout(() => {
        setResult(pass ? "passed" : "blocked");
        setPhase("done");
        if (pass) {
          timers.current.push(setTimeout(() => setSettled(true), SETTLE_MS));
        }
      }, TRAVEL_MS),
    );
  };

  const reset = () => {
    clearTimers();
    setActivated(false);
    setPhase("idle");
    setResult(null);
    setSettled(false);
  };

  return (
    <div className="dasd-flow">
      <section className="mrd-stage" aria-label="Default Account State 수신 계정 상태 흐름">
        <div className="mrd-network" aria-hidden="true" />

        {/* issuer phone */}
        <div className="mrd-phone-shell">
          <span className="mrd-phone-notch" aria-hidden="true" />
          <div className="mrd-phone-screen">
            <div className="mrd-app-bar">
              <span>발행자 지갑</span>
              <code>Iss...K7</code>
            </div>

            <div className="mrd-phone-content">
              <div className="mrd-phone-top">
                <strong>토큰 지급</strong>
                <span>×</span>
              </div>

              <div className="mrd-token-mark" aria-hidden="true">
                <img alt="" src="/usdc.svg" />
              </div>

              <div className="mrd-send-amount">
                <strong>{AMOUNT.toLocaleString()}</strong>
                <span>USDC</span>
                <small>보유 잔액 {senderBalance.toLocaleString()} USDC</small>
              </div>

              <div className="mrd-confirm-stack">
                <div className="mrd-phone-row">
                  <span>받는 계정</span>
                  <code>{ACCOUNT_ADDR}</code>
                </div>
                <div className="mrd-phone-row">
                  <span>네트워크</span>
                  <code>솔라나</code>
                </div>
                <div className="mrd-phone-row">
                  <span>계정 정책</span>
                  <code>기본 동결</code>
                </div>
                <div className="mrd-phone-row muted">
                  <span>네트워크 수수료</span>
                  <code>0.000005 SOL</code>
                </div>
              </div>

              <div className="mrd-phone-actions">
                <button className="mrd-reset-button" onClick={reset} type="button" aria-label="초기화">
                  <RotateCcw size={15} aria-hidden="true" />
                </button>
                <button className="mrd-send-button" disabled={verifying} onClick={run} type="button">
                  {verifying ? <Loader2 className="mrd-spin" size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
                  {verifying ? "확인 중" : phase === "done" ? "다시 지급" : "지급 실행"}
                </button>
              </div>
            </div>

            <span className="mrd-home-bar" aria-hidden="true" />
          </div>
        </div>

        <div className={`mrd-rail ${phase === "send" ? "flowing" : ""}`}>
          <span />
          <em className="mrd-rail-amount">{AMOUNT} USDC</em>
          <strong>전송 요청</strong>
        </div>

        {/* default account state gate */}
        <div className={`mrd-gate ${gateState}`}>
          <div className="mrd-gate-head">
            <span className="mrd-gate-icon">
              {gateState === "checking" ? (
                <Loader2 className="mrd-spin" size={18} aria-hidden="true" />
              ) : gateState === "fail" ? (
                <Lock size={18} aria-hidden="true" />
              ) : gateState === "pass" ? (
                <Unlock size={18} aria-hidden="true" />
              ) : (
                <ShieldCheck size={18} aria-hidden="true" />
              )}
            </span>
            <div>
              <strong>Default Account State</strong>
            </div>
          </div>

          <div className="mrd-rule-row dasd-check-row">
            <span>{gateState === "checking" ? "계정 상태 확인 중" : "계정 상태 확인"}</span>
            <strong>{activated ? "수신 가능한 계정입니다." : "기본 동결 상태입니다."}</strong>
          </div>
        </div>

        <div
          className={`mrd-rail ${result === "passed" && phase === "done" && !settled ? "flowing" : ""} ${
            settled ? "done" : ""
          } ${result === "blocked" && phase === "done" ? "blocked" : ""}`}
        >
          <span />
          <strong>{result === "blocked" ? "차단" : "기록"}</strong>
        </div>

        {/* customer account — frozen state shown by color */}
        <div className={`mrd-transaction-panel dasd-account-panel ${activated ? "active" : "frozen"} ${settled ? "pass" : ""}`}>
          <SuccessBurst show={settled} />
          <SuccessBurst show={phase === "done" && result === "blocked"} tone="reject" />
          <div className="mrd-desktop-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="mrd-ledger-head">
            <span>고객 토큰 계정</span>
            <strong>{activated ? "활성화" : "기본 동결"}</strong>
          </div>

          <div className="dasd-state-pill">
            {activated ? <Unlock size={14} aria-hidden="true" /> : <Snowflake size={14} aria-hidden="true" />}
            {activated ? "수신 가능" : "동결 상태 · 수신 불가"}
          </div>

          <div className="mrd-receipt">
            <div className="mrd-receipt-total">
              <span>계정 잔액</span>
              <strong>{recipientBalance.toLocaleString()} USDC</strong>
            </div>
            <div className="mrd-receipt-row">
              <span>계정</span>
              <code>{ACCOUNT_ADDR}</code>
            </div>
            <div className="mrd-receipt-row">
              <span>상태</span>
              <code>
                {phase === "done"
                  ? result === "passed"
                    ? "입금 완료"
                    : "수신 거절"
                  : activated
                    ? "수신 대기"
                    : "기본 동결"}
              </code>
            </div>
          </div>

          <button className={`dasd-toggle-button ${!activated ? "needs-action" : ""}`} disabled={verifying} onClick={toggleState} type="button">
            {activated ? <Lock size={14} aria-hidden="true" /> : <Unlock size={14} aria-hidden="true" />}
            {activated ? "다시 동결" : "동결 해제"}
          </button>
        </div>
      </section>
    </div>
  );
}
