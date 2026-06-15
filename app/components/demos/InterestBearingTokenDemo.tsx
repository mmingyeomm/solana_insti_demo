"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, TrendingUp, Wallet } from "lucide-react";
import { SuccessBurst } from "../SuccessBurst";

const PRINCIPAL = 10000;
const MAX_RATE = 0.08;
const graphMonths = [0, 3, 6, 9, 12] as const;

const formatAmount = (value: number) =>
  value.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });

const balanceAt = (rate: number, month: number) => PRINCIPAL + PRINCIPAL * rate * (month / 12);

export function InterestBearingTokenDemo() {
  const [ratePercent, setRatePercent] = useState(3.8);
  const [deployedRate, setDeployedRate] = useState<number | null>(null);

  const activeRate = deployedRate ?? ratePercent / 100;
  const previewRate = ratePercent / 100;
  const values = useMemo(() => graphMonths.map((month) => balanceAt(activeRate, month)), [activeRate]);
  const maxValue = balanceAt(MAX_RATE, 12);
  const minValue = PRINCIPAL;
  const pointPairs = values.map((value, index) => {
      const x = 24 + index * 54;
      const ratio = (value - minValue) / (maxValue - minValue);
      const y = 146 - Math.max(0, Math.min(1, ratio)) * 112;

      return { x, y };
    });
  const points = pointPairs.map((point) => `${point.x},${point.y}`).join(" ");
  const areaPoints = `24,146 ${points} 240,146`;
  const finalBalance = balanceAt(activeRate, 12);
  const previewBalance = balanceAt(previewRate, 12);

  const updateRate = (value: number) => {
    setRatePercent(value);
    setDeployedRate(null);
  };

  return (
    <div className="ibd demo-screen-enter">
      <section className="ibd-stage ibd-rate-stage" aria-label="Interest Bearing Token 이자율 선택과 배포">
        <div className="ibd-network" aria-hidden="true" />

        <div className="ibd-account ibd-asset-card">
          <div className="ibd-node-title">
            <Wallet size={15} aria-hidden="true" />
            발행 대상
          </div>
          <strong>{PRINCIPAL.toLocaleString()} USDC</strong>
          <span>기준 잔액</span>
        </div>

        <div className={`ibd-wire ${deployedRate !== null ? "flowing" : ""}`} aria-hidden="true">
          <span className="ibd-line-label">정책 설정</span>
        </div>

        <div className="ibd-policy ibd-rate-console">
          <div className="ibd-policy-head">
            <span className="ibd-policy-icon">
              <TrendingUp size={20} aria-hidden="true" />
            </span>
            <div>
              <span>Interest Bearing Token</span>
              <strong>운영자 콘솔</strong>
            </div>
          </div>

          <label className="ibd-rate-control">
            <span>연 이자율</span>
            <strong>{ratePercent.toFixed(1)}%</strong>
            <input
              max="8"
              min="0.5"
              onChange={(event) => updateRate(Number(event.target.value))}
              step="0.1"
              type="range"
              value={ratePercent}
            />
          </label>

          <button className="button button-dark ibd-deploy-button" onClick={() => setDeployedRate(previewRate)} type="button">
            토큰 배포
            <ArrowRight size={14} aria-hidden="true" />
          </button>

          <div className={`ibd-token-info ${deployedRate !== null ? "visible" : ""}`}>
            <span>{deployedRate !== null ? "배포된 토큰 정보" : "배포 대기"}</span>
            <strong>{deployedRate !== null ? `연 ${(deployedRate * 100).toFixed(1)}%` : "배포 전"}</strong>
            <code>
              {deployedRate !== null
                ? `1년 후 표시 잔액 ${formatAmount(finalBalance)} USDC`
                : `미리보기 ${formatAmount(previewBalance)} USDC`}
            </code>
          </div>
        </div>

        <div className={`ibd-wire ${deployedRate !== null ? "flowing" : ""}`} aria-hidden="true">
          <span className="ibd-line-label">표시 잔액</span>
        </div>

        <div className={`ibd-display ibd-graph-panel ${deployedRate !== null ? "deployed" : ""}`}>
          <SuccessBurst show={deployedRate !== null} />
          {deployedRate !== null ? (
            <>
              <span>표시 잔액 그래프</span>
              <strong>{formatAmount(finalBalance)} USDC</strong>

              <div className="ibd-line-chart" aria-label="표시 잔액 상승 그래프">
                <svg viewBox="0 0 250 170" role="img" aria-label="표시 잔액 상승 그래프">
                  <path className="ibd-chart-grid" d="M24 146H240M24 98H240M24 50H240" />
                  <polygon className="ibd-chart-area" points={areaPoints} />
                  <polyline className="ibd-chart-line" points={points} />
                  {pointPairs.map((point, index) => (
                    <circle className={`ibd-chart-dot ${index === pointPairs.length - 1 ? "final" : ""}`} cx={point.x} cy={point.y} key={`${point.x}-${point.y}`} r={index === pointPairs.length - 1 ? 5 : 3.5} />
                  ))}
                </svg>
                <div className="ibd-chart-axis">
                  <span>현재</span>
                  <span>6개월</span>
                  <span>1년 후</span>
                </div>
              </div>

              <div className="ibd-deploy-state">
                <Check size={14} aria-hidden="true" />
                토큰 배포 완료
              </div>
            </>
          ) : (
            <div className="ibd-graph-empty">
              <TrendingUp size={24} aria-hidden="true" />
              <strong>이자율을 선택하고 토큰을 배포해 보세요.</strong>
              <span>시간에 따라 표시 잔액이 늘어나는 추이를 보여줍니다.</span>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
