import React, { useRef, useState } from 'react'
import { useKey, useUpdateEffect } from 'react-use'
import { Kbd } from '~/components/Kbd'
import styled from 'styled-components'
import { debugAPI } from '~/debugAPI'
import { gaAPI, GaEventId } from '~/gaAPI'

export const KeyProbeBindingTarget = 'data-etoro-better-ui-Keyprobe-target'

const Block = styled.span`
  display: inline-block;
  position: absolute;
  transform: translate(0%, 0%);
`

export const KeyProbe: React.FC<{
  filter: string
  command(props: {
    /** If `null` means handling as global hotkey */
    keyTarget: JQuery<Element> | null
  }): void
}> = props => {
  const log = debugAPI.keyboard.extend(props.filter)

  /** If not handling as a global hotkey, this ref help for looking the native etoro element */
  const selfRef = useRef<Element>()

  /** The animation to make Kbd element fancy */
  const [pressing, setPressing] = useState(false)

  useUpdateEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setPressing(false)
    }, 1000)

    return () => globalThis.clearTimeout(timeoutId)
  }, [pressing])

  /** Key handler */
  useKey(
    event => event.key.toUpperCase() === props.filter.toUpperCase(),
    () => {
      const isAnyInputFocus =
        globalThis.document.activeElement?.nodeName.toUpperCase() === 'INPUT'

      if (isAnyInputFocus) return

      if (!selfRef.current) return

      const keyTarget = $(selfRef.current).closest(`[${KeyProbeBindingTarget}]`)

      props.command({
        keyTarget: keyTarget.length ? keyTarget : null,
      })

      gaAPI.sendEvent(GaEventId.keyboard_hotkeyPress, `hotkey=${props.filter}`)

      setPressing(true)
    },
    {
      event: 'keydown',
    },
    [props.filter, selfRef],
  )

  return (
    <Block
      ref={selfRef}
      onClick={() => {
        setPressing(true)
      }}
    >
      <Kbd pressing={pressing}>{props.filter.toUpperCase()}</Kbd>
    </Block>
  )
}
