declare interface Group {
  CID: number
  MirrorID: number
  /** 標的名稱 */
  GroupName: string
  Amount: number
  /** 標的圖示 */
  Avatar: string
  AverageOpenRate: number
  /** 當前淨值 */
  Equity: number
  FirstOpenDate: Date
  InstrumentID: number
  Instrument: Instrument
  /** E.g. `-8.578` 代表全部倉位損益 -0.86% */
  TotalGain: number
  /** E.g. `-10.458636130000016` 代表全部倉位損益 -10.45$USD */
  TotalProfit: number
  /** 當前倉位 */
  Positions: InstrumentPosition[]
}
