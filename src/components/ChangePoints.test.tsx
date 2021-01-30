import React from 'react'
import { render } from '@testing-library/react'
import { ChangePoints } from '~/components/ChangePoints'

describe('should works as same as etoro', () => {
  test('in FX', () => {
    const target1 = render(<ChangePoints value={0.0001} precision={5} />)
    expect(target1.container).toHaveTextContent('10')

    const target2 = render(<ChangePoints value={0.001} precision={5} />)
    expect(target2.container).toHaveTextContent('100')

    const target3 = render(<ChangePoints value={0.001} />)
    expect(target3.container).toHaveTextContent('1')

    const target4 = render(<ChangePoints value={1.3751} precision={5} />)
    expect(target4.container).toHaveTextContent('137510')
  })

  test('in Cryptocurrency', () => {
    const target1 = render(<ChangePoints value={979.45} precision={2} />)
    expect(target1.container).toHaveTextContent('97945')

    const target2 = render(<ChangePoints value={1.87} precision={2} />)
    expect(target2.container).toHaveTextContent('187')

    const target3 = render(<ChangePoints value={40000.35} precision={2} />)
    expect(target3.container).toHaveTextContent('4000035')

    const target4 = render(<ChangePoints value={0.12} precision={2} />)
    expect(target4.container).toHaveTextContent('12')
  })

  test('in Stock', () => {
    const target1 = render(<ChangePoints value={36} precision={0} />)
    expect(target1.container).toHaveTextContent('36')

    const target2 = render(<ChangePoints value={12852} precision={0} />)
    expect(target2.container).toHaveTextContent('12852')

    const target3 = render(<ChangePoints value={1.65} precision={4} />)
    expect(target3.container).toHaveTextContent('16500')
  })
})
