import { createAction } from '@reduxjs/toolkit'

export const toggleSettingsDialog = createAction<boolean>(
  'toggleSettingsDialog',
)
