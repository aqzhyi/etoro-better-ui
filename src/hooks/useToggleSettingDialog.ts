import { toggleSettingsDialog } from '~/actions/toggleSettingsDialog'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const useToggleSettingDialog = () => {
  const dispatch = useAppDispatch()
  const open = useAppSelector(
    state => state.display.betterEtoroUISettingsDialog,
  )

  const toggle = () => dispatch(toggleSettingsDialog(!open))

  return toggle
}
