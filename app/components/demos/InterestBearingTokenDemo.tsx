"use client";

import { useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CalendarDays, SlidersHorizontal, TrendingUp, Wallet } from "lucide-react";

type Term = 30 | 90 | 180;
type Stage = "setup" | "display";

const PRINCIPAL = 10000;
const RATE = 0.038;
const terms: Term[] = [30, 90, 180];

export function InterestBearingTokenDemo() {
  const [stage, setStage] = useState<Stage>("setup");
  const [term, setTerm] = useState<Term>(90);

  const { interest, displayBalance } = useMemo(() => {
    const accrued = PRINCIPAL * RATE * (term / 365);
    return {
      interest: accrued,
      displayBalance: PRINCIPAL + accrued,
    };
  }, [term]);

  const termTabs = (
    <div className="ibd-term-tabs" aria-label="기간 선택">
      {terms.map((days) => (
        <button className={term === days ? "active" : ""} key={days} onClick={() => setTerm(days)} type="button">
          {days}일
        </button>
      ))}
    </div>
  );

  if (stage === "setup") {
    return (
      <div className="ibd ibd-setup">
        <section className="ibd-setup-board" aria-label="Interest Bearing Token 정책 설정">
          <div className="ibd-network" aria-hidden="true" />

          <div className="ibd-setup-card">
            <div className="ibd-policy-head">
              <span className="ibd-policy-icon">
                <SlidersHorizontal size={20} aria-hidden="true" />
              </span>
              <div>
                <span>토큰 정책 설정</span>
                <strong>표시 잔액에 반영할 이자 조건을 정합니다.</strong>
              </div>
            </div>

            <div className="ibd-rate-card">
              <span>이자율</span>
              <strong>연 {(RATE * 100).toFixed(1)}%</strong>
            </div>

            {termTabs}

            <div className="ibd-display preview">
              <span>예상 표시 잔액</span>
              <strong>{displayBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC</strong>
              <code>증가분 {interest.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC</code>
            </div>

            <button className="button button-dark" onClick={() => setStage("display")} type="button">
              정책 적용
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="ibd">
      <div className="ibd-runtime-bar">
        <button className="button button-muted" onClick={() => setStage("setup")} type="button">
          <ArrowLeft size={14} aria-hidden="true" />
          정책 수정
        </button>
        <span>연 {(RATE * 100).toFixed(1)}%, {term}일 기준</span>
      </div>

      <section className="ibd-stage" aria-label="Interest Bearing Token 표시 잔액 흐름">
        <div className="ibd-network" aria-hidden="true" />

        <div className="ibd-account">
          <div className="ibd-node-title">
            <Wallet size={15} aria-hidden="true" />
            토큰 계정
          </div>
          <strong>{PRINCIPAL.toLocaleString()} USDC</strong>
          <span>기준 잔액</span>
        </div>

        <div className="ibd-policy">
          <div className="ibd-policy-head">
            <span className="ibd-policy-icon">
              <TrendingUp size={20} aria-hidden="true" />
            </span>
            <div>
              <span>토큰 익스텐션</span>
              <strong>Interest Bearing Token</strong>
            </div>
          </div>

          <div className="ibd-rate-card">
            <span>이자율</span>
            <strong>연 {(RATE * 100).toFixed(1)}%</strong>
          </div>

          <div className="ibd-time-card">
            <CalendarDays size={15} aria-hidden="true" />
            <span>{term}일 기준</span>
          </div>
        </div>

        <div className="ibd-display">
          <span>표시 잔액</span>
          <strong>{displayBalance.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC</strong>
          <code>증가분 {interest.toLocaleString(undefined, { maximumFractionDigits: 2 })} USDC</code>
        </div>
      </section>
    </div>
  );
}
