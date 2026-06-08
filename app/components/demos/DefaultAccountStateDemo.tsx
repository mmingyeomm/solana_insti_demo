"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Landmark, Lock, RotateCcw, Snowflake, Unlock, Wallet } from "lucide-react";

type AccountStatus = "frozen" | "active";
type TransferState = "idle" | "blocked" | "passed";

const accounts = [
  { id: "alpha", name: "고객 A", addr: "Rcpt...9mQ" },
  { id: "beta", name: "고객 B", addr: "Rcpt...2xL" },
  { id: "gamma", name: "고객 C", addr: "Rcpt...7pA" },
];

const START_TREASURY = 5000;
const START_RECIPIENT = 0;
const AMOUNT = 250;

export function DefaultAccountStateDemo() {
  const [accountStates, setAccountStates] = useState<Record<string, AccountStatus>>(
    () => Object.fromEntries(accounts.map((account) => [account.id, "frozen"])) as Record<string, AccountStatus>,
  );
  const [selectedId, setSelectedId] = useState(accounts[0].id);
  const [transferState, setTransferState] = useState<TransferState>("idle");

  const selectedAccount = accounts.find((account) => account.id === selectedId) ?? accounts[0];
  const selectedStatus = accountStates[selectedId];
  const activeCount = Object.values(accountStates).filter((state) => state === "active").length;

  const recipientBalance = transferState === "passed" ? START_RECIPIENT + AMOUNT : START_RECIPIENT;
  const treasuryBalance = transferState === "passed" ? START_TREASURY - AMOUNT : START_TREASURY;

  const statusLabel = useMemo(() => (selectedStatus === "active" ? "동결 해제" : "기본 동결"), [selectedStatus]);

  const unfreezeSelected = () => {
    setAccountStates((current) => ({ ...current, [selectedId]: "active" }));
    setTransferState("idle");
  };

  const freezeSelected = () => {
    setAccountStates((current) => ({ ...current, [selectedId]: "frozen" }));
    setTransferState("idle");
  };

  const testTransfer = () => {
    setTransferState(selectedStatus === "active" ? "passed" : "blocked");
  };

  const reset = () => {
    setAccountStates(Object.fromEntries(accounts.map((account) => [account.id, "frozen"])) as Record<string, AccountStatus>);
    setSelectedId(accounts[0].id);
    setTransferState("idle");
  };

  return (
    <div className={`dasd ${selectedStatus} ${transferState}`}>
      <div className="dasd-config">
        <div>
          <span>토큰 설정</span>
          <strong>Default Account State: Frozen</strong>
        </div>
        <div>
          <span>신규 계정</span>
          <strong>{accounts.length}개 기본 동결</strong>
        </div>
        <div>
          <span>동결 해제</span>
          <strong>{activeCount}개 계정</strong>
        </div>
      </div>

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

        <div className={`dasd-rail ${transferState === "passed" ? "flowing" : ""}`} aria-hidden="true">
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
                  key={account.id}
                  onClick={() => {
                    setSelectedId(account.id);
                    setTransferState("idle");
                  }}
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
        </div>

        <div
          className={`dasd-rail ${transferState === "blocked" ? "blocked" : transferState === "passed" ? "flowing" : ""}`}
          aria-hidden="true"
        >
          <span />
        </div>

        <div className={`dasd-wallet recipient ${transferState === "passed" ? "credited" : ""}`}>
          <div className="dasd-node-title">
            <Wallet size={15} aria-hidden="true" />
            고객 지갑
          </div>
          <strong>{recipientBalance.toLocaleString()}</strong>
          <span>USDC</span>
        </div>
      </section>

      <div className="dasd-actions" aria-label="데모 조작">
        <button className="button button-muted" onClick={reset} type="button">
          <RotateCcw size={14} aria-hidden="true" />
          초기화
        </button>
        {selectedStatus === "active" ? (
          <button className="button button-muted" onClick={freezeSelected} type="button">
            <Lock size={14} aria-hidden="true" />
            다시 동결
          </button>
        ) : (
          <button className="button button-muted" onClick={unfreezeSelected} type="button">
            <Check size={14} aria-hidden="true" />
            선택 계정 동결 해제
          </button>
        )}
        <button className="button button-dark" onClick={testTransfer} type="button">
          <ArrowRight size={14} aria-hidden="true" />
          선택 계정으로 전송
        </button>
      </div>
    </div>
  );
}
