import React from 'react'
import { render, screen } from '@testing-library/react'
import { ProfitText } from '~/components/ProfitText'

describe('props.profit', () => {
  it(`777.771257325 tobe $777.77`, () => {
    render(<ProfitText profit={777.771257325}></ProfitText>)
    expect(screen.getByTestId('root').textContent).toBe('$777.77')
  })

  it(`-777.771257325 tobe -$777.77`, () => {
    render(<ProfitText profit={-777.771257325}></ProfitText>)
    expect(screen.getByTestId('root').textContent).toBe('-$777.77')
  })

  it(`777.00 tobe $777.00`, () => {
    render(<ProfitText profit={777}></ProfitText>)
    expect(screen.getByTestId('root').textContent).toBe('$777.00')
  })

  it(`-777.00 tobe -$777.00`, () => {
    render(<ProfitText profit={-777}></ProfitText>)
    expect(screen.getByTestId('root').textContent).toBe('-$777.00')
  })

  it(`777.00 tobe green`, () => {
    render(<ProfitText profit={777}></ProfitText>)
    expect(screen.getByTestId('root').className.toLowerCase()).toMatch(/green/)
  })

  it(`-777.00 tobe red`, () => {
    render(<ProfitText profit={-777}></ProfitText>)
    expect(screen.getByTestId('root').className.toLowerCase()).toMatch(/red/)
  })
})

describe(`props.noDollarSign`, () => {
  test('tobe 777.77', () => {
    render(<ProfitText profit={777.771257325} noDollarSign></ProfitText>)
    expect(screen.getByTestId('root').textContent).toBe('777.77')
  })

  test('tobe -777.77', () => {
    render(<ProfitText profit={-777.771257325} noDollarSign></ProfitText>)
    expect(screen.getByTestId('root').textContent).toBe('-777.77')
  })
})

describe(`props.pureDollar`, () => {
  test('tobe yellow', () => {
    render(<ProfitText profit={777.771257325} pureDollar></ProfitText>)
    expect(screen.getByTestId('root').className.toLowerCase()).toMatch(/yellow/)
  })
})
