const channelRows = [
  {
    index: "01",
    institution: "은행",
    channel: "예금 및 결제",
    rules: "승인 고객, 이체 한도, 내부 결제 규칙",
  },
  {
    index: "02",
    institution: "증권사",
    channel: "증권 거래",
    rules: "주문, 체결, 결제 기록, 권한별 조회",
  },
  {
    index: "03",
    institution: "결제사",
    channel: "가맹점 정산",
    rules: "지급 승인, 가맹점 정산, 운영 리포트",
  },
] as const;

export function PrivateChannelsShowcase() {
  return (
    <section className="pc-config-showcase" aria-label="기관별 Private Channel 구성 구조">
      <div className="pc-config-copy">
        <span>기관별 채널 구성</span>
        <h3>각 기관은 자기 업무 범위에 맞는 Private Channel을 둘 수 있습니다.</h3>
        <p>
          은행, 증권사, 결제사는 참여자와 거래 규칙을 다르게 설계합니다. 채널 내부의 실행 범위는 기관별로 나뉘고,
          자산 이동과 정산은 솔라나 메인넷과 연결해 관리합니다.
        </p>
      </div>

      <div className="pc-config-board">
        <div className="pc-config-table">
          <div className="pc-config-head">
            <span />
            <span>기관</span>
            <span>채널 목적</span>
            <span>운영 규칙</span>
          </div>

          {channelRows.map((row) => (
            <div className="pc-config-row" key={row.institution}>
              <span className="pc-config-index">{row.index}</span>
              <strong>{row.institution}</strong>
              <span>{row.channel}</span>
              <p>{row.rules}</p>
            </div>
          ))}
        </div>

        <div className="pc-config-connector" aria-hidden="true">
          {channelRows.map((row) => (
            <span key={row.institution} />
          ))}
        </div>

        <div className="pc-config-mainnet">
          <strong>솔라나 메인넷</strong>
          <p>기관별 채널은 독립적으로 구성되지만, 자산 이동과 정산 검증은 솔라나 메인넷을 통해 관리합니다.</p>
        </div>
      </div>
    </section>
  );
}
