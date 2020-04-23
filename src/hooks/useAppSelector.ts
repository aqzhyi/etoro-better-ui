import {
  TypedUseSelectorHook,
  useSelector as originalUseSelector,
} from 'react-redux'
import { RootState } from '@/store/_store'

export const useAppSelector: TypedUseSelectorHook<RootState> = originalUseSelector
