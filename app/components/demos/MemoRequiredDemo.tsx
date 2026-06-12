"use client";

import { useRef, useState } from "react";
import {
  ArrowRight,
  Ban,
  Check,
  CheckCircle2,
  Loader2,
  ReceiptText,
  RotateCcw,
  Wallet,
} from "lucide-react";
import { SuccessBurst } from "../SuccessBurst";

type Phase = "idle" | "send" | "done";
type Result = "pass" | "fail" | null;

const AMOUNT = 180;
const START_SENDER = 1200;
const START_RECIPIENT = 320;
const DEFAULT_REFERENCE = "BOK-PAY-2026-0142";
const SETTLE_MS = 720;

export function MemoRequiredDemo() {
  const [reference, setReference] = useState(DEFAULT_REFERENCE);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result>(null);
  const [settled, setSettled] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const hasReference = reference.trim().length > 0;
  const senderBalance = settled ? START_SENDER - AMOUNT : START_SENDER;
  const recipientBalance = settled ? START_RECIPIENT + AMOUNT : START_RECIPIENT;
  const running = phase === "send";
  const gateState = phase === "send" ? "checking" : phase === "done" ? result ?? "ready" : "ready";

  const clearTimers = () => {
    timers.current.forEach(clearTimeout);
    timers.current = [];
  };

  const reset = () => {
    clearTimers();
    setPhase("idle");
    setResult(null);
    setSettled(false);
    setReference(DEFAULT_REFERENCE);
  };

  const run = () => {
    clearTimers();
    setResult(null);
    setSettled(false);
    setPhase("send");
    const pass = hasReference;
    timers.current.push(
      setTimeout(() => {
        setResult(pass ? "pass" : "fail");
        setPhase("done");
        if (pass) {
          timers.current.push(setTimeout(() => setSettled(true), SETTLE_MS));
        }
      }, 920),
    );
  };

  return (
    <div className={`mrd ${gateState} ${result ?? ""}`}>
      <section className="mrd-stage mrd-audit-stage" aria-label="Memo Required 감사 흐름">
        <div className="mrd-network" aria-hidden="true" />

        <div className="mrd-wallet sender">
          <div className="mrd-wallet-head">
            <span>
              <Wallet size={15} aria-hidden="true" />
              보내는 지갑
            </span>
            <code>Send...8xQ</code>
          </div>

          <div className="mrd-balance">
            <strong>{senderBalance.toLocaleString()}</strong>
            <span>USDC</span>
          </div>

          <label className="mrd-reference-field">
            <span>거래 참조값</span>
            <input
              disabled={running}
              onChange={(event) => setReference(event.target.value)}
              placeholder="송장 번호 또는 내부 거래 ID"
              value={reference}
            />
          </label>

          <div className="mrd-memo-actions">
            <button className="button button-muted" disabled={running} onClick={() => setReference(DEFAULT_REFERENCE)} type="button">
              참조값 포함
            </button>
            <button className="button button-muted" disabled={running} onClick={() => setReference("")} type="button">
              참조값 제거
            </button>
          </div>
        </div>

        <div className={`mrd-rail ${phase === "send" ? "flowing" : ""}`} aria-hidden="true">
          <span />
        </div>

        <div className={`mrd-gate ${gateState}`}>
          <div className="mrd-gate-head">
            <span className="mrd-gate-icon">
              {gateState === "checking" ? (
                <Loader2 className="mrd-spin" size={18} aria-hidden="true" />
              ) : gateState === "fail" ? (
                <Ban size={18} aria-hidden="true" />
              ) : gateState === "pass" ? (
                <CheckCircle2 size={18} aria-hidden="true" />
              ) : (
                <ReceiptText size={18} aria-hidden="true" />
              )}
            </span>
            <div>
              <span>토큰 익스텐션</span>
              <strong>Memo Required</strong>
            </div>
          </div>

          <div className="mrd-rule-row">
            <span>검증 기준</span>
            <strong>거래 참조값 포함</strong>
          </div>

          <div className={`mrd-memo-chip ${hasReference ? "filled" : "missing"}`}>
            {hasReference ? <Check size={13} aria-hidden="true" /> : <Ban size={13} aria-hidden="true" />}
            {hasReference ? reference : "참조값 미포함"}
          </div>
        </div>

        <div
          className={`mrd-rail ${result === "pass" ? "flowing" : ""} ${result === "fail" ? "blocked" : ""}`}
          aria-hidden="true"
        >
          <span />
        </div>

        <div className={`mrd-wallet recipient ${settled ? "credited" : ""}`}>
          <SuccessBurst show={settled} />
          <SuccessBurst show={phase === "done" && result === "fail"} tone="reject" />
          <div>
            <Wallet size={15} aria-hidden="true" />
            수신 지갑
          </div>
          <strong>{recipientBalance.toLocaleString()}</strong>
          <span>USDC</span>
        </div>
      </section>

      <div className="mrd-actions">
        <button className="button button-muted" onClick={reset} type="button">
          <RotateCcw size={14} aria-hidden="true" />
          초기화
        </button>
        <button className="button button-dark" disabled={running} onClick={run} type="button">
          {running ? <Loader2 className="mrd-spin" size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
          {running ? "확인 중" : "전송 실행"}
        </button>
      </div>
    </div>
  );
}
