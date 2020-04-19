import { Events, emitter } from './emitter'

/**
 * 取得使用者當前瀏覽器與 www.etoro.com 頁面之間的延遲數值
 */
interface Ping {
  /**
   * 開始監視 Ping 數值
   *
   * 於內部透過 emitter.emit(EmitterEvents.onPing, data) 散播 Ping 事件
   */
  start(options: {
    /** 監測網域 */
    url: 'www.etoro.com'
    /** 監測間隔 */
    interval: number
  }): void
  /**
   * 停止監視 Ping 數值
   */
  end(): void
  /**
   * 當延遲數值回傳時
   *
   * 包裝 emitter.on(EmitterEvents.onPing, () => {})
   *
   * @example
   *  ping.onPing((data) => {
   *    renderPingChart({
   *      value: data.ping
   *      date: date.datetime
   *    })
   *  })
   */
  onPing(
    callback: (
      /** 總共延遲，豪秒數值 */
      ping: number,
      /** 監測時間 */
      datetime: Date,
    ) => void,
  ): void
}

export default null
