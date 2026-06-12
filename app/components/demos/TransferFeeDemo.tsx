"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, ArrowRight, Landmark, Loader2, Percent, Plus, SlidersHorizontal, Wallet, X } from "lucide-react";
import { SuccessBurst } from "../SuccessBurst";

type Stage = "setup" | "display";
type TransferPhase = "idle" | "sending" | "done";
type FeeRecipient = { id: number; label: string; ratePercent: number; cap: number };

const AMOUNT = 1000;
const MAX_RECIPIENTS = 2;

const defaultLabels = ["발행자", "플랫폼"];

const createRecipient = (id: number, index: number): FeeRecipient => ({
  id,
  label: defaultLabels[index] ?? `수취처 ${index + 1}`,
  ratePercent: 0.3,
  cap: 5,
});

export function TransferFeeDemo() {
  const [stage, setStage] = useState<Stage>("setup");
  const [feeRecipients, setFeeRecipients] = useState<FeeRecipient[]>([]);
  const [phase, setPhase] = useState<TransferPhase>("idle");
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const nextId = useRef(1);

  const { fee, net, perRecipientFees } = useMemo(() => {
    const fees = feeRecipients.map((recipient) => ({
      id: recipient.id,
      label: recipient.label,
      amount: Math.min(AMOUNT * (recipient.ratePercent / 100), recipient.cap),
    }));
    const totalFee = fees.reduce((sum, item) => sum + item.amount, 0);
    return {
      fee: totalFee,
      net: AMOUNT - totalFee,
      perRecipientFees: fees,
    };
  }, [feeRecipients]);

  const addRecipient = () => {
    setFeeRecipients((current) => {
      if (current.length >= MAX_RECIPIENTS) {
        return current;
      }
      const id = nextId.current;
      nextId.current += 1;
      return [...current, createRecipient(id, current.length)];
    });
  };

  const removeRecipient = (id: number) => {
    setFeeRecipients((current) => current.filter((recipient) => recipient.id !== id));
  };

  const updateRecipient = (id: number, patch: Partial<FeeRecipient>) => {
    setFeeRecipients((current) =>
      current.map((recipient) => (recipient.id === id ? { ...recipient, ...patch } : recipient)),
    );
  };

  const clearTimer = () => {
    if (timer.current) {
      clearTimeout(timer.current);
      timer.current = null;
    }
  };

  const runTransfer = () => {
    clearTimer();
    setPhase("sending");
    timer.current = setTimeout(() => {
      setPhase("done");
      timer.current = null;
    }, 1250);
  };

  const goSetup = () => {
    clearTimer();
    setPhase("idle");
    setStage("setup");
  };

  const goDisplay = () => {
    clearTimer();
    setPhase("idle");
    setStage("display");
  };

  const delivered = phase === "done";
  const running = phase === "sending";
  const activeFlow = running;
  const hasFee = feeRecipients.length > 0;

  if (stage === "setup") {
    return (
      <div className="tfd tfd-setup demo-screen-enter" key="setup">
        <section className="tfd-setup-board" aria-label="Transfer Fee 정책 설정">
          <div className="tfd-network" aria-hidden="true" />

          <div className="tfd-setup-card">
            <div className="tfd-setup-head">
              <span className="tfd-policy-icon">
                <SlidersHorizontal size={20} aria-hidden="true" />
              </span>
              <div>
                <span>토큰 정책 설정</span>
                <strong>전송 수수료 조건과 수취처를 설정합니다.</strong>
              </div>
            </div>

            <div className="tfd-subject-control">
              <span>수수료 수취처</span>
              <button
                className="tfd-add-subject"
                disabled={feeRecipients.length >= MAX_RECIPIENTS}
                onClick={addRecipient}
                type="button"
              >
                <Plus size={14} aria-hidden="true" />
                수취처 추가
              </button>
            </div>

            {hasFee ? (
              <div className="tfd-subject-list">
                {feeRecipients.map((recipient, index) => (
                  <div className="tfd-subject-card" key={recipient.id}>
                    <div className="tfd-subject-head">
                      <span className="tfd-subject-index">수취처 {index + 1}</span>
                      <input
                        className="tfd-name-input"
                        onChange={(event) => updateRecipient(recipient.id, { label: event.target.value })}
                        placeholder="수취처 이름"
                        type="text"
                        value={recipient.label}
                      />
                      <button
                        aria-label="수수료 삭제"
                        className="tfd-subject-remove"
                        onClick={() => removeRecipient(recipient.id)}
                        type="button"
                      >
                        <X size={14} aria-hidden="true" />
                      </button>
                    </div>
                    <div className="tfd-control-grid">
                      <label className="tfd-control-field">
                        <span>수수료율</span>
                        <strong>{recipient.ratePercent.toFixed(2)}%</strong>
                        <input
                          max="1"
                          min="0.05"
                          onChange={(event) => updateRecipient(recipient.id, { ratePercent: Number(event.target.value) })}
                          step="0.05"
                          type="range"
                          value={recipient.ratePercent}
                        />
                      </label>
                      <label className="tfd-control-field">
                        <span>상한</span>
                        <strong>{recipient.cap.toLocaleString()} USDC</strong>
                        <input
                          max="10"
                          min="1"
                          onChange={(event) => updateRecipient(recipient.id, { cap: Number(event.target.value) })}
                          step="1"
                          type="range"
                          value={recipient.cap}
                        />
                      </label>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="tfd-subject-empty">
                수수료 수취처가 없습니다. 전송 금액 전액이 수신 지갑으로 전달됩니다.
              </div>
            )}

            <div className="tfd-split">
              <span>예상 수수료 {fee.toFixed(2)} USDC</span>
              <strong>예상 순수령액 {net.toFixed(2)} USDC</strong>
            </div>

            <button className="button button-dark" onClick={goDisplay} type="button">
              정책 적용
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="tfd demo-screen-enter" key="display">
      <div className="tfd-runtime-bar">
        <button className="button button-muted" onClick={goSetup} type="button">
          <ArrowLeft size={14} aria-hidden="true" />
          정책 수정
        </button>
        <span>
          수수료 수취처 {feeRecipients.length}곳, 총 수수료 {fee.toFixed(2)} USDC
        </span>
        <button className="button button-dark" disabled={running} onClick={runTransfer} type="button">
          {running ? <Loader2 className="mrd-spin" size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
          {running ? "전송 중" : delivered ? "다시 전송" : "전송 실행"}
        </button>
      </div>

      <section className={`tfd-stage ${phase}`} aria-label="Transfer Fee 수수료 분리 흐름">
        <div className="tfd-network" aria-hidden="true" />

        <div className="tfd-wallet">
          <div className="tfd-node-title">
            <Wallet size={15} aria-hidden="true" />
            보내는 지갑
          </div>
          <strong>{AMOUNT.toLocaleString()} USDC</strong>
          <span>전송 금액</span>
        </div>

        <div className={`tfd-wire ${activeFlow ? "flowing" : ""}`} aria-hidden="true">
          <span />
        </div>

        <div className="tfd-policy">
          <div className="tfd-policy-head">
            <span className="tfd-policy-icon">
              <Percent size={20} aria-hidden="true" />
            </span>
            <div>
              <span>토큰 익스텐션</span>
              <strong>Transfer Fee</strong>
            </div>
          </div>

          <div className="tfd-rule-grid">
            <div>
              <span>수수료 수취처</span>
              <strong>{feeRecipients.length}곳</strong>
            </div>
            <div>
              <span>총 수수료</span>
              <strong>{fee.toFixed(2)} USDC</strong>
            </div>
          </div>

          <div className="tfd-split">
            <span>수수료 {fee.toFixed(2)} USDC</span>
            <strong>순수령액 {net.toFixed(2)} USDC</strong>
          </div>
        </div>

        <div className="tfd-output-stack">
          <div className={`tfd-output-line primary ${activeFlow ? "flowing" : ""}`} aria-hidden="true">
            <span />
          </div>
          {hasFee ? (
            <div className={`tfd-output-line fee ${activeFlow ? "flowing" : ""}`} aria-hidden="true">
              <span />
            </div>
          ) : null}
        </div>

        <div className="tfd-result-stack">
          <div className="tfd-wallet recipient">
            <SuccessBurst show={delivered} />
            <div className="tfd-node-title">
              <Wallet size={15} aria-hidden="true" />
              수신 지갑
            </div>
            <strong>{delivered ? net.toFixed(2) : "0.00"} USDC</strong>
            <span>순수령액</span>
          </div>

          {hasFee ? (
            <div className="tfd-wallet fee-vault">
              <div className="tfd-node-title">
                <Landmark size={15} aria-hidden="true" />
                수수료 수취처
              </div>
              <strong>{delivered ? fee.toFixed(2) : "0.00"} USDC</strong>
              <div className="tfd-fee-list">
                {perRecipientFees.map((recipient) => (
                  <span key={recipient.id}>
                    {recipient.label}
                    <code>{delivered ? recipient.amount.toFixed(2) : "0.00"}</code>
                  </span>
                ))}
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}
