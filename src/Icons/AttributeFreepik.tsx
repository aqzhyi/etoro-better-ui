import React, { Fragment } from 'react'
import { MalaysiaIcon } from '~/Icons/MalaysiaIcon'
import { TaiwanIcon } from '~/Icons/TaiwanIcon'

export const AttributeFreepik: React.FC<any> = props => {
  return (
    <span>
      <TaiwanIcon /> <MalaysiaIcon /> made by{' '}
      <a href='http://www.freepik.com/' title='Freepik'>
        Freepik
      </a>{' '}
      from{' '}
      <a href='https://www.flaticon.com/' title='Flaticon'>
        {' '}
        www.flaticon.com
      </a>
    </span>
  )
}
