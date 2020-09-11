import { toggleSetupDialog } from '~/actions/toggleSettingsDialog'
import { useAppDispatch, useAppSelector } from '~/store/_store'

export const useToggleSettingDialog = () => {
  const dispatch = useAppDispatch()
  const open = useAppSelector(state => state.display.setupDialog)

  const toggle = () => dispatch(toggleSetupDialog(!open))

  return toggle
}
