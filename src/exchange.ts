import { GM } from './GM'
import { debugAPI } from './debugAPI'

export const getNTD = async () => {
  const htmlText = await GM.ajax({
    method: 'GET',
    url: 'https://rate.bot.com.tw/xrt?Lang=zh-TW',
  })
    .then(event => event.responseText)
    .catch(() => ``)

  const sell = Number(
    /<td data-table="本行即期賣出" class="text-right display_none_print_show print_width">(?<TWD>[\d.]+)<\/td>/gim.exec(
      htmlText,
    )?.groups?.TWD || 1,
  )

  const buy = Number(
    /<td data-table="本行即期買入" class="text-right display_none_print_show print_width">(?<TWD>[\d.]+)<\/td>/gim.exec(
      htmlText,
    )?.groups?.TWD || 1,
  )

  return { buy, sell }
}

export const getMYR = async () => {
  try {
    const MyrFinder = await GM.ajax({
      method: 'GET',
      url: `https://www.pbebank.com/rates/forex.html?id=${new Date().toString()}`,
    }).then(event => $(`<div>${event.responseText}</div>`))

    return {
      buy: Number(MyrFinder.find('tbody .optional').eq(0).html()),
      sell: Number(MyrFinder.find('tbody .essential').eq(1).html()),
    }
  } catch (error) {
    debugAPI.log.extend('大眾銀行馬幣錯誤')(error)

    return {
      buy: 1,
      sell: 1,
    }
  }
}
