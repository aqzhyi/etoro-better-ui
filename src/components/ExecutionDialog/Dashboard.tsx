import * as React from 'react'
import toast from 'cogo-toast'
import { ButtonGroup, Button } from '@blueprintjs/core'
import HelperContent from '../HelperContent'
import { localStorage } from '../../localStorage'

const toAmount = (value: number) => {
  $('[data-etoro-automation-id="execution-button-switch-to-amount"]').click()
  $('[data-etoro-automation-id="input"]').val(`${value}`)
  $('[data-etoro-automation-id="input"]').change()
  $('[data-etoro-automation-id="input"]').blur()
}

const toLever = (value: number) => {
  const targetTabEl = $(
    '[ng-click="$ctrl.tabsCtrl.selectTab($ctrl, $event)"]',
  ).eq(1)

  const isTarget =
    // 英文
    targetTabEl.text().toLowerCase().includes('leverage') ||
    // 馬來文
    targetTabEl.text().includes('leveraj') ||
    // 中文
    targetTabEl.text().includes('槓桿') ||
    targetTabEl.text().includes('槓杆')

  if (isTarget) {
    targetTabEl.click()

    // tag 先按後，等到 ng-if 使元素出現，在 select 按下
    $('.risk-itemlevel')
      .eq(value - 1)
      .click()
  } else {
    toast.info(<div>動作沒有執行，因為發現可能的出錯</div>)
  }
}

export const Dashboard = () => {
  React.useEffect(() => {
    toast.warn(
      <span>
        在使用 better-etoro-ui 所提供的下單巨集之前，請您確保您已閱讀{' '}
        <HelperContent.RiskSpecification />
        ，並你也表示同意。
      </span>,
    )
  }, [])

  if (!localStorage.getExecutionMacroEnabled()) {
    return null
  }

  return (
    <React.Fragment>
      <HelperContent.WhoDeveloper />

      <React.Fragment>
        <div style={{ marginBottom: 16 }}>
          <h2 style={{ textAlign: 'center' }}>金額</h2>
          <ButtonGroup fill={true} large={true} vertical={true}>
            <Button onClick={toAmount.bind(toAmount, 50)} intent='primary'>
              $50
            </Button>
            <Button onClick={toAmount.bind(toAmount, 100)} intent='primary'>
              $100
            </Button>
            <Button onClick={toAmount.bind(toAmount, 200)} intent='primary'>
              $200
            </Button>
            <Button onClick={toAmount.bind(toAmount, 300)} intent='primary'>
              $300
            </Button>
            <Button onClick={toAmount.bind(toAmount, 500)} intent='primary'>
              $500
            </Button>
            <Button onClick={toAmount.bind(toAmount, 1000)} intent='primary'>
              $1000
            </Button>
          </ButtonGroup>
        </div>

        <div style={{ marginBottom: 16 }}>
          <h2 style={{ textAlign: 'center' }}>槓桿</h2>
          <ButtonGroup fill={true} large={true} vertical={true}>
            <Button onClick={toLever.bind(toLever, 1)} intent='primary'>
              x1
            </Button>
            <Button onClick={toLever.bind(toLever, 2)} intent='primary'>
              x2
            </Button>
          </ButtonGroup>
        </div>
      </React.Fragment>

      <HelperContent.RiskSpecification />
    </React.Fragment>
  )
}
