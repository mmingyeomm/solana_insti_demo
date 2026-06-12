"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ArrowRight, KeyRound, Landmark, Loader2, Lock, RotateCcw, Snowflake, Unlock, Wallet } from "lucide-react";
import { SuccessBurst } from "../SuccessBurst";

type AccountStatus = "frozen" | "active";
type Phase = "idle" | "send" | "done";
type Result = "passed" | "blocked" | null;

const accounts = [
  { id: "alpha", name: "고객 A", addr: "Rcpt...9mQ" },
  { id: "beta", name: "고객 B", addr: "Rcpt...2xL" },
  { id: "gamma", name: "고객 C", addr: "Rcpt...7pA" },
];

const START_TREASURY = 5000;
const START_RECIPIENT = 0;
const AMOUNT = 250;
const TRAVEL_MS = 760;
const SETTLE_MS = 720;

export function DefaultAccountStateDemo() {
  const [accountStates, setAccountStates] = useState<Record<string, AccountStatus>>(
    () => Object.fromEntries(accounts.map((account) => [account.id, "frozen"])) as Record<string, AccountStatus>,
  );
  const [selectedId, setSelectedId] = useState(accounts[0].id);
  const [phase, setPhase] = useState<Phase>("idle");
  const [result, setResult] = useState<Result>(null);
  const [settled, setSettled] = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

  const selectedAccount = accounts.find((account) => account.id === selectedId) ?? accounts[0];
  const selectedStatus = accountStates[selectedId];

  const running = phase === "send";
  const recipientBalance = settled ? START_RECIPIENT + AMOUNT : START_RECIPIENT;
  const treasuryBalance = settled ? START_TREASURY - AMOUNT : START_TREASURY;

  const statusLabel = useMemo(() => (selectedStatus === "active" ? "동결 해제" : "기본 동결"), [selectedStatus]);

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

  const unfreezeSelected = () => {
    resetRun();
    setAccountStates((current) => ({ ...current, [selectedId]: "active" }));
  };

  const freezeSelected = () => {
    resetRun();
    setAccountStates((current) => ({ ...current, [selectedId]: "frozen" }));
  };

  const selectAccount = (id: string) => {
    resetRun();
    setSelectedId(id);
  };

  const testTransfer = () => {
    clearTimers();
    setResult(null);
    setSettled(false);
    setPhase("send");
    const pass = selectedStatus === "active";
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
    setAccountStates(Object.fromEntries(accounts.map((account) => [account.id, "frozen"])) as Record<string, AccountStatus>);
    setSelectedId(accounts[0].id);
    setPhase("idle");
    setResult(null);
    setSettled(false);
  };

  return (
    <div className={`dasd ${selectedStatus} ${phase} ${result ?? ""}`}>
      <section className="dasd-stage" aria-label="Default Account State 데모">
        <div className="dasd-network" aria-hidden="true" />

        <div className="dasd-wallet">
          <div className="dasd-node-title">
            <Landmark size={15} aria-hidden="true" />
            발행자 지갑
          </div>
          <strong>{treasuryBalance.toLocaleString()}</strong>
          <span>USDC</span>
        </div>

        <div className={`dasd-rail ${phase === "send" || result === "passed" ? "flowing" : ""}`} aria-hidden="true">
          <span />
        </div>

        <div className="dasd-account-console">
          <div className="dasd-console-head">
            <span>새로 생성된 토큰 계정</span>
            <strong>계정별로 동결 해제합니다.</strong>
          </div>

          <div className="dasd-account-list">
            {accounts.map((account) => {
              const state = accountStates[account.id];
              const selected = account.id === selectedId;

              return (
                <button
                  className={`dasd-account-row ${state} ${selected ? "selected" : ""}`}
                  disabled={running}
                  key={account.id}
                  onClick={() => selectAccount(account.id)}
                  type="button"
                >
                  <span className="dasd-account-icon">
                    {state === "active" ? <Unlock size={15} aria-hidden="true" /> : <Lock size={15} aria-hidden="true" />}
                  </span>
                  <span>
                    <strong>{account.name}</strong>
                    <code>{account.addr}</code>
                  </span>
                  <i>{state === "active" ? "동결 해제" : "기본 동결"}</i>
                </button>
              );
            })}
          </div>

          <div className={`dasd-selected ${selectedStatus}`}>
            <div className="dasd-selected-ring">
              {selectedStatus === "active" ? (
                <Unlock size={24} aria-hidden="true" />
              ) : (
                <Snowflake size={24} aria-hidden="true" />
              )}
            </div>
            <div>
              <span>선택 계정</span>
              <strong>{selectedAccount.name}</strong>
              <code>{selectedAccount.addr}</code>
            </div>
            <em>{statusLabel}</em>
          </div>

          <div className="dasd-admin-panel">
            <div className="dasd-admin-head">
              <KeyRound size={15} aria-hidden="true" />
              <span>계정 상태 변경</span>
            </div>
            <div className="dasd-admin-actions">
              <button
                className="button button-muted"
                disabled={running || selectedStatus === "active"}
                onClick={unfreezeSelected}
                type="button"
              >
                <Unlock size={14} aria-hidden="true" />
                동결 해제
              </button>
              <button
                className="button button-muted"
                disabled={running || selectedStatus === "frozen"}
                onClick={freezeSelected}
                type="button"
              >
                <Lock size={14} aria-hidden="true" />
                다시 동결
              </button>
            </div>
          </div>
        </div>

        <div
          className={`dasd-rail ${result === "blocked" ? "blocked" : result === "passed" ? "flowing" : ""}`}
          aria-hidden="true"
        >
          <span />
        </div>

        <div className={`dasd-wallet recipient ${settled ? "credited" : ""}`}>
          <SuccessBurst show={settled} />
          <SuccessBurst show={phase === "done" && result === "blocked"} tone="reject" />
          <div className="dasd-node-title">
            <Wallet size={15} aria-hidden="true" />
            고객 지갑
          </div>
          <strong>{recipientBalance.toLocaleString()}</strong>
          <span>USDC</span>
        </div>
      </section>

      <div className="dasd-actions" aria-label="데모 조작">
        <button className="button button-muted" disabled={running} onClick={reset} type="button">
          <RotateCcw size={14} aria-hidden="true" />
          초기화
        </button>
        <button className="button button-dark" disabled={running} onClick={testTransfer} type="button">
          {running ? <Loader2 className="mrd-spin" size={14} aria-hidden="true" /> : <ArrowRight size={14} aria-hidden="true" />}
          {running ? "전송 중" : "선택 계정으로 전송"}
        </button>
      </div>
    </div>
  );
}
