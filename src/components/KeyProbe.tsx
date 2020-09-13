import { makeStyles } from '@material-ui/core/styles'
import React, { useRef, useState } from 'react'
import { useKey, useUpdateEffect } from 'react-use'
import { UseKeyOptions } from 'react-use/lib/useKey'
import { Kbd } from '~/components/Kbd'
import { gaAPI, GaEventId } from '~/gaAPI'

export const KeyProbeBindingTarget = 'data-etoro-better-ui-Keyprobe-target'

export const useCSSKeyProbe = makeStyles({})

export const KeyProbe: React.FC<{
  filter: string
  event?: UseKeyOptions['event']
  command(props: {
    /** If `null` means handling as global hotkey */
    keyTarget: JQuery<Element> | null
  }): void
  className?: string
}> = props => {
  /** If not handling as a global hotkey, this ref help for looking the native etoro element */
  const selfRef = useRef<HTMLSpanElement>(null)

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
      event: props.event || 'keydown',
    },
    [props.filter, selfRef],
  )

  return (
    <span
      className={props.className}
      ref={selfRef}
      onClick={() => {
        setPressing(true)
      }}
    >
      <Kbd pressing={pressing}>{props.filter.toUpperCase()}</Kbd>
    </span>
  )
}
