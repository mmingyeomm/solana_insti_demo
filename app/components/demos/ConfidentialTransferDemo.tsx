"use client";

import { useState } from "react";
import { EyeOff, KeyRound, LockKeyhole } from "lucide-react";

const AMOUNT = "180 USDC";
const BALANCE = "12,420 USDC";
const HIDDEN = "●●●●●● USDC";

export function ConfidentialTransferDemo() {
  const [decrypted, setDecrypted] = useState(false);

  return (
    <div className={`ctd-compare ${decrypted ? "on" : ""}`}>
      <div className="ctd-compare-stage">
        <div className="mrd-transaction-panel ctd-cmp-panel">
          <div className="mrd-desktop-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="mrd-ledger-head">
            <span>공개 원장</span>
            <strong>금액 비공개</strong>
          </div>
          <div className="ctd-private-stack">
            <div className="ctd-private-value">
              <span>전송 금액</span>
              <strong>{HIDDEN}</strong>
            </div>
            <div className="ctd-private-value muted">
              <span>계정 잔액</span>
              <strong>{HIDDEN}</strong>
            </div>
          </div>
          <div className="ctd-cmp-tag deny">
            <EyeOff size={13} aria-hidden="true" />
            외부 열람 불가
          </div>
        </div>

        <div className={`ctd-cmp-link ${decrypted ? "used" : ""}`} aria-hidden="true">
          <span className="ctd-cmp-link-icon">
            {decrypted ? <KeyRound size={20} aria-hidden="true" /> : <LockKeyhole size={20} aria-hidden="true" />}
          </span>
          <strong>열람 키</strong>
        </div>

        <div className={`mrd-transaction-panel ctd-cmp-panel ${decrypted ? "pass" : ""}`}>
          <div className="mrd-desktop-bar">
            <span />
            <span />
            <span />
          </div>
          <div className="mrd-ledger-head">
            <span>권한 조회</span>
            <strong>{decrypted ? "복호화됨" : "열람 키 필요"}</strong>
          </div>
          <div className="ctd-private-stack">
            <div className={`ctd-private-value ${decrypted ? "open" : ""}`}>
              <span>전송 금액</span>
              <strong>{decrypted ? AMOUNT : HIDDEN}</strong>
            </div>
            <div className={`ctd-private-value muted ${decrypted ? "open" : ""}`}>
              <span>계정 잔액</span>
              <strong>{decrypted ? BALANCE : HIDDEN}</strong>
            </div>
          </div>
          <p className="ctd-viewer-row">송신자, 수신자, 감사자는 열람 키로 실제 금액을 확인합니다.</p>
        </div>
      </div>

      <div className="ctd-compare-controls">
        <button className="button button-dark" onClick={() => setDecrypted((value) => !value)} type="button">
          <KeyRound size={15} aria-hidden="true" />
          {decrypted ? "열람 키 해제" : "열람 키 적용"}
        </button>
      </div>
    </div>
  );
}
