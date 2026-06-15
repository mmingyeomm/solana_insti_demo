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
  const transferStatus = running ? "전송 중" : phase === "done" && result === "pass" ? "전송 완료" : phase === "done" ? "전송 실패" : "전송 실행";
  const statusText =
    phase === "send"
      ? "참조값 확인 중"
      : phase === "done" && result === "pass"
        ? "감사 기록 생성"
        : phase === "done"
          ? "전송 중단"
          : "전송 대기";

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

        <div className="mrd-phone-shell">
          <span className="mrd-phone-notch" aria-hidden="true" />
          <div className="mrd-phone-screen">
            <div className="mrd-app-bar">
              <span>Solana Wallet</span>
              <code>Send...8xQ</code>
            </div>

            <div className="mrd-phone-content">
              <div className="mrd-phone-top">
                <strong>전송 확인</strong>
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
                  <span>받는 사람</span>
                  <code>Rcpt...4qN</code>
                </div>

                <div className="mrd-phone-row">
                  <span>네트워크</span>
                  <code>솔라나</code>
                </div>

                <label className="mrd-reference-field">
                  <span>메모</span>
                  <input
                    disabled={running}
                    onChange={(event) => setReference(event.target.value)}
                    placeholder="참조값 입력"
                    value={reference}
                  />
                </label>

                <div className="mrd-phone-row muted">
                  <span>네트워크 수수료</span>
                  <code>0.000005 SOL</code>
                </div>
              </div>

              <div className="mrd-memo-actions">
                <button className="mrd-inline-action" disabled={running} onClick={() => setReference(DEFAULT_REFERENCE)} type="button">
                  참조값 포함
                </button>
                <button className="mrd-inline-action" disabled={running} onClick={() => setReference("")} type="button">
                  제거
                </button>
              </div>

              <div className="mrd-phone-actions">
                <button className="mrd-reset-button" onClick={reset} type="button" aria-label="초기화">
                  <RotateCcw size={15} aria-hidden="true" />
                </button>
                <button className="mrd-send-button" disabled={running} onClick={run} type="button">
                  {running ? <Loader2 className="mrd-spin" size={15} aria-hidden="true" /> : <ArrowRight size={15} aria-hidden="true" />}
                  {transferStatus}
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
              <strong>Memo Required</strong>
            </div>
          </div>

          <div className="mrd-rule-row">
            <span>{statusText}</span>
            <strong>참조값이 있어야 전송 기록이 남습니다.</strong>
          </div>

          <div className={`mrd-scan-lane ${hasReference ? "filled" : "missing"}`}>
            <span>Memo</span>
            <code>{hasReference ? reference : "참조값 미포함"}</code>
            <i aria-hidden="true" />
          </div>

          <div className={`mrd-memo-chip ${hasReference ? "filled" : "missing"}`}>
            {hasReference ? <Check size={13} aria-hidden="true" /> : <Ban size={13} aria-hidden="true" />}
            {gateState === "checking" ? "검증 중" : hasReference ? "확인됨" : "차단 대상"}
          </div>
        </div>

        <div
          className={`mrd-rail ${result === "pass" && !settled ? "flowing" : ""} ${settled ? "done" : ""} ${
            result === "fail" ? "blocked" : ""
          }`}
        >
          <span />
          <strong>{result === "fail" ? "중단" : "기록"}</strong>
        </div>

        <div className={`mrd-transaction-panel ${result ?? ""} ${settled ? "credited" : ""}`}>
          <SuccessBurst show={settled} />
          <SuccessBurst show={phase === "done" && result === "fail"} tone="reject" />
          <div className="mrd-desktop-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="mrd-ledger-head">
            <span>트랜잭션</span>
            <strong>{phase === "idle" ? "대기" : running ? "처리 중" : result === "pass" ? "기록 완료" : "거절"}</strong>
          </div>

          {phase === "idle" ? (
            <div className="mrd-empty-state">
              <ReceiptText size={34} aria-hidden="true" />
              <strong>왼쪽 지갑에서 전송을 실행해 보세요.</strong>
              <span>거래 참조값이 트랜잭션과 함께 기록됩니다.</span>
            </div>
          ) : (
            <div className="mrd-receipt">
              <div className="mrd-receipt-total">
                <span>수신 잔액</span>
                <strong>{recipientBalance.toLocaleString()} USDC</strong>
              </div>
              <div className="mrd-receipt-row">
                <span>금액</span>
                <code>{AMOUNT} USDC</code>
              </div>
              <div className="mrd-receipt-row">
                <span>메모</span>
                <code>{hasReference ? reference : "없음"}</code>
              </div>
              <div className="mrd-receipt-row">
                <span>서명</span>
                <code>{result === "pass" ? "5wM...9pQ" : "생성 안 됨"}</code>
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
