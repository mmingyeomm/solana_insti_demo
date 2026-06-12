"use client";

import { useState } from "react";
import { KeyRound, LockKeyhole, ShieldCheck, Wallet } from "lucide-react";

const AMOUNT = "180 USDC";
const SENDER_BALANCE = "1,020 USDC";
const RECIPIENT_BALANCE = "500 USDC";

export function ConfidentialTransferDemo() {
  const [keyApplied, setKeyApplied] = useState(false);

  return (
    <div className={`ctd ${keyApplied ? "key-applied" : ""}`}>
      <div className="ctd-view-switch" aria-label="Confidential Transfer 조회 방식">
        <button className={!keyApplied ? "active" : ""} onClick={() => setKeyApplied(false)} type="button">
          공개 원장 보기
        </button>
        <button className={keyApplied ? "active" : ""} onClick={() => setKeyApplied(true)} type="button">
          권한 조회
        </button>
      </div>

      <section className="ctd-stage" aria-label="Confidential Transfer 공개 범위">
        <div className="ctd-network" aria-hidden="true" />

        <div className={`ctd-floating-key ${keyApplied ? "used" : ""}`}>
          <div className="ctd-key-face" aria-hidden="true">
            {keyApplied ? <ShieldCheck size={20} aria-hidden="true" /> : <KeyRound size={20} aria-hidden="true" />}
            <span>
              <strong>{keyApplied ? "키 적용됨" : "조회 권한"}</strong>
              <code>송신자 / 수신자 / 감사자</code>
            </span>
          </div>
        </div>

        <div className="ctd-wallet">
          <div className="ctd-wallet-head">
            <Wallet size={15} aria-hidden="true" />
            보내는 사람
          </div>
          <code>Send...8xQ</code>
          <strong>{keyApplied ? SENDER_BALANCE : "계정 잔액 비공개"}</strong>
        </div>

        <div className="ctd-wire" aria-hidden="true">
          <span />
        </div>

        <div className="ctd-shield">
          <div className="ctd-shield-head">
            <span className="ctd-shield-icon">
              <LockKeyhole size={22} aria-hidden="true" />
            </span>
            <div>
              <span>토큰 익스텐션</span>
              <strong>Confidential Transfer</strong>
            </div>
          </div>

          <div className={`ctd-cipher ${keyApplied ? "unlocked" : ""}`}>
            <span>{keyApplied ? "권한 있는 주체가 확인한 전송 금액" : "공개 기록의 암호화된 금액"}</span>
            <strong>{keyApplied ? AMOUNT : "8F A2 19 C7"}</strong>
          </div>
        </div>

        <div className="ctd-wire" aria-hidden="true">
          <span />
        </div>

        <div className="ctd-wallet recipient">
          <div className="ctd-wallet-head">
            <Wallet size={15} aria-hidden="true" />
            받는 사람
          </div>
          <code>Rcpt...4qN</code>
          <strong>{keyApplied ? RECIPIENT_BALANCE : "계정 잔액 비공개"}</strong>
        </div>
      </section>
    </div>
  );
}
